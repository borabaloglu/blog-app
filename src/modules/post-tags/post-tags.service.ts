import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { PostTagsBulkCreateDto } from 'src/modules/post-tags/dto/post-tags.bulk-create.dto';

import { PostTag } from 'src/modules/post-tags/entities/post-tag.entity';

@Injectable()
export class PostTagsService {
  constructor(@InjectModel(PostTag) private readonly model: typeof PostTag) {}

  async bulkCreate(dto: PostTagsBulkCreateDto, transaction?: Transaction): Promise<PostTag[]> {
    const postTags = dto.tags.map(tag => ({
      postId: dto.postId,
      tagName: tag.name,
    }));

    return this.model.bulkCreate(postTags, { transaction });
  }

  async destroyByPostId(postId: number, transaction?: Transaction): Promise<void> {
    await this.model.destroy({
      where: {
        postId,
      },
      transaction,
    });
  }
}
