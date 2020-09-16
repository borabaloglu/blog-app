import * as validator from 'class-validator';
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { promises as fs } from 'fs';
import { Op, Sequelize, Transaction } from 'sequelize';

import securityConfig from 'src/shared/configs/security.config';
import urlConfig from 'src/shared/configs/url.config';
import fileHelper from 'src/shared/helpers/file.helper';
import lookupHelper from 'src/shared/helpers/lookup.helper';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

import { PostsCreateDto } from 'src/modules/posts/dto/posts.create.dto';
import { PostsLookupDto } from 'src/modules/posts/dto/posts.lookup.dto';
import { PostsUpdateDto } from 'src/modules/posts/dto/posts.update.dto';
import { PostsUpdateTagsDto } from 'src/modules/posts/dto/posts.update-tags.dto';

import { Post } from 'src/modules/posts/entities/post.entity';
import { PostTag } from 'src/modules/post-tags/entities/post-tag.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';

import { FriendshipsService } from 'src/modules/friendships/friendships.service';
import { PostTagsService } from 'src/modules/post-tags/post-tags.service';
import { TagsService } from 'src/modules/tags/tags.service';

@Injectable()
export class PostsService {
  readonly orderableAttributes = [
    'id',
    'authorId',
    'slug',
    'title',
    'subtitle',
    'content',
    'language',
    'type',
    'createdAt',
    'updatedAt',
  ];
  readonly loadableAttributes = [...this.orderableAttributes];

  constructor(
    @InjectModel(Post) private readonly model: typeof Post,
    private readonly friendshipsService: FriendshipsService,
    private readonly postTagsService: PostTagsService,
    private readonly tagsService: TagsService,
    private readonly sequelize: Sequelize,
  ) {}

  async lookup(dto: PostsLookupDto, transaction?: Transaction): Promise<Post[]> {
    const query: any = {};

    {
      const where: any = {};
      const include: any = [
        {
          model: Tag,
          required: true,
          through: {
            attributes: [],
          },
          where: {},
        },
        {
          model: User,
          required: true,
          attributes: ['id', 'username', 'fullname', 'profileImageUrl'],
        },
      ];

      if (validator.isDefined(dto.postIds)) {
        where.id = dto.postIds;
      }

      if (validator.isDefined(dto.authorIds)) {
        where.authorId = dto.authorIds;
      }

      if (validator.isDefined(dto.slugs)) {
        where.slug = {
          [Op.iLike]: {
            [Op.any]: dto.slugs.map(item => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.titles)) {
        where.title = {
          [Op.iLike]: {
            [Op.any]: dto.titles.map(item => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.subtitles)) {
        where.subtitle = {
          [Op.iLike]: {
            [Op.any]: dto.subtitles.map(item => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.contents)) {
        where.content = {
          [Op.iLike]: {
            [Op.any]: dto.contents.map(item => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.languages)) {
        where.language = dto.languages;
      }

      if (validator.isDefined(dto.type)) {
        where.type = dto.type;
      }

      if (validator.isDefined(dto.tags)) {
        include[0].where.name = dto.tags;
      }

      if (validator.isDefined(dto.createdAtRange)) {
        where.createdAt = lookupHelper.generateRangeQuery(dto.createdAtRange);
      }

      if (validator.isDefined(dto.updatedAtRange)) {
        where.updatedAt = lookupHelper.generateRangeQuery(dto.updatedAtRange);
      }

      if (validator.isDefined(dto.search)) {
        where[Op.or] = [
          {
            slug: {
              [Op.iLike]: {
                [Op.any]: dto.search.map(item => `%${item}%`),
              },
            },
          },
          {
            title: {
              [Op.iLike]: {
                [Op.any]: dto.search.map(item => `%${item}%`),
              },
            },
          },
          {
            subtitle: {
              [Op.iLike]: {
                [Op.any]: dto.search.map(item => `%${item}%`),
              },
            },
          },
          {
            content: {
              [Op.iLike]: {
                [Op.any]: dto.search.map(item => `%${item}%`),
              },
            },
          },
        ];
      }

      query.where = where;
      query.include = include;
    }

    if (validator.isDefined(dto.order)) {
      query.order = lookupHelper.transformOrder(dto.order, this.orderableAttributes);
    }

    if (validator.isDefined(dto.load)) {
      query.attributes = lookupHelper.transformLoad(dto.load, this.loadableAttributes);
    }

    if (validator.isDefined(dto.page)) {
      const { offset, limit } = lookupHelper.transformPage(dto.page);
      query.offset = offset;
      query.limit = limit;
    }

    if (validator.isDefined(transaction)) {
      query.transaction = transaction;
    }

    return this.model.findAll(query);
  }

  async getPostsOfFollowings(dto: PostsLookupDto, userId: number): Promise<Post[]> {
    const friendships = await this.friendshipsService.getFollowings(userId);

    dto.authorIds = friendships.map(friendship => friendship.following.id);

    return this.lookup(dto);
  }

  async findAuthorId(postId: number, transaction?: Transaction): Promise<number> {
    const post = await this.model.findByPk(postId, { transaction });

    if (!validator.isDefined(post)) {
      throw new ServerError(ServerErrorType.RECORD_IS_MISSING);
    }

    return post.authorId;
  }

  async create(dto: PostsCreateDto): Promise<Post> {
    try {
      const mediaBuffer = Buffer.from(dto.coverImage, 'base64');

      await fileHelper.validateFileInformation(mediaBuffer, ['image']);

      const filename = `${crypto
        .createHash(securityConfig.crypto.hashAlgorithm)
        .update(`${dto.authorId}.${Date.now()}`)
        .digest('hex')}.png`;

      const coverImageUrl = `${urlConfig.static.coverImage}/${filename}`;

      let entity: Post;

      await this.sequelize.transaction(async transaction => {
        entity = this.model.build();

        entity.coverImageUrl = coverImageUrl;
        entity.authorId = dto.authorId;
        entity.title = dto.title;
        entity.subtitle = dto.subtitle;
        entity.content = dto.content;
        entity.language = dto.language;
        entity.type = dto.type;

        await entity.save({ transaction });

        const tags = await this.tagsService.bulkCreate(
          {
            tags: dto.tags,
          },
          transaction,
        );

        entity.setDataValue('tags', tags);

        await this.postTagsService.bulkCreate(
          {
            postId: entity.id,
            tags,
          },
          transaction,
        );

        await fs.writeFile(`public/cover-images/${filename}`, mediaBuffer, 'base64');
      });

      return entity;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ServerError(ServerErrorType.POST_TRIED_TO_CREATE_WITH_SAME_TITLE);
      }
      throw error;
    }
  }

  async update(dto: PostsUpdateDto): Promise<Post> {
    const updates: any = {};

    {
      if (validator.isDefined(dto.title)) {
        updates.title = dto.title;
      }

      if (validator.isDefined(dto.subtitle)) {
        updates.subtitle = dto.subtitle;
      }

      if (validator.isDefined(dto.content)) {
        updates.content = dto.content;
      }

      if (validator.isDefined(dto.language)) {
        updates.language = dto.language;
      }

      if (validator.isDefined(dto.type)) {
        updates.type = dto.type;
      }
    }

    if (Object.keys(updates).length === 0) {
      return;
    }

    try {
      const result = await this.model.update(updates, {
        where: {
          id: dto.postId,
        },
        returning: true,
      });

      if (result[0] !== 1) {
        throw new ServerError(ServerErrorType.RECORD_IS_MISSING);
      }

      return result[1][0];
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ServerError(ServerErrorType.POST_TRIED_TO_CREATE_WITH_SAME_TITLE);
      }
      throw error;
    }
  }

  async updateTags(dto: PostsUpdateTagsDto): Promise<PostTag[]> {
    return this.sequelize.transaction(async transaction => {
      await this.postTagsService.destroyByPostId(dto.postId, transaction);

      const tags = await this.tagsService.bulkCreate(
        {
          tags: dto.tags,
        },
        transaction,
      );

      return this.postTagsService.bulkCreate(
        {
          postId: dto.postId,
          tags,
        },
        transaction,
      );
    });
  }
}
