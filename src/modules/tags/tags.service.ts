import slugify from 'slugify';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { TagsBulkCreateDto } from 'src/modules/tags/dto/tags.bulk-create.dto';

import { Tag } from 'src/modules/tags/entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag) private readonly model: typeof Tag) {}

  async bulkCreate(dto: TagsBulkCreateDto, transaction?: Transaction): Promise<Tag[]> {
    const newTagNames = dto.tags.map(name =>
      slugify(name, {
        lower: true,
        replacement: '-',
      }),
    );

    const existingTags = await this.model.findAll({
      where: {
        name: newTagNames,
      },
      transaction,
    });

    const existingTagNames = existingTags.map(tag => tag.name);

    const nonExistentTagNames = newTagNames.filter(name => !existingTagNames.includes(name));

    const newTags = nonExistentTagNames.map(name => ({
      name,
    }));

    const entities = await this.model.bulkCreate(newTags, { transaction });

    return [...existingTags, ...entities];
  }
}
