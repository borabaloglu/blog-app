import * as validator from 'class-validator';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

import { PostsCreateDto } from 'src/modules/posts/dto/posts.create.dto';
import { PostsUpdateDto } from 'src/modules/posts/dto/posts.update.dto';
import { PostsUpdateTagsDto } from 'src/modules/posts/dto/posts.update-tags.dto';

import { Post } from 'src/modules/posts/entities/post.entity';
import { PostTag } from 'src/modules/post-tags/entities/post-tag.entity';

import { PostTagsService } from 'src/modules/post-tags/post-tags.service';
import { TagsService } from 'src/modules/tags/tags.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private readonly model: typeof Post,
    private readonly postTagsService: PostTagsService,
    private readonly tagsService: TagsService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAuthorId(postId: number, transaction?: Transaction): Promise<number> {
    const post = await this.model.findByPk(postId, { transaction });

    if (!validator.isDefined(post)) {
      throw new ServerError(ServerErrorType.RECORD_IS_MISSING);
    }

    return post.authorId;
  }

  async create(dto: PostsCreateDto): Promise<Post> {
    try {
      let entity: Post;

      await this.sequelize.transaction(async transaction => {
        entity = this.model.build();

        entity.authorId = dto.authorId;
        entity.title = dto.title;
        entity.subtitle = dto.subtitle;
        entity.content = dto.content;
        entity.language = dto.language;

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
