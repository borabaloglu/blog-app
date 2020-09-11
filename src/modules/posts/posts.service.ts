import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

import { PostsCreateDto } from 'src/modules/posts/dto/posts.create.dto';

import { Post } from 'src/modules/posts/entities/post.entity';

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
}
