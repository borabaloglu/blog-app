import * as validator from 'class-validator';

import slugify from 'slugify';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';

import lookupHelper from 'src/shared/helpers/lookup.helper';

import { TagsBulkCreateDto } from 'src/modules/tags/dto/tags.bulk-create.dto';
import { TagsLookupDto } from 'src/modules/tags/dto/tags.lookup.dto';

import { Tag } from 'src/modules/tags/entities/tag.entity';

@Injectable()
export class TagsService {
  readonly orderableAttributes = ['name'];
  readonly loadableAttributes = [...this.orderableAttributes];

  constructor(@InjectModel(Tag) private readonly model: typeof Tag) {}

  async lookup(dto: TagsLookupDto, transaction?: Transaction): Promise<Tag[]> {
    const query: any = {};

    {
      const where: any = {};

      if (validator.isDefined(dto.names)) {
        where.name = dto.names;
      }

      if (validator.isDefined(dto.search)) {
        where[Op.or] = [
          {
            name: {
              [Op.iLike]: {
                [Op.any]: dto.search.map(item => `%${item}%`),
              },
            },
          },
        ];
      }

      query.where = where;
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
