import { Controller, Get, Query } from '@nestjs/common';

import { TagsLookupDto } from 'src/modules/tags/dto/tags.lookup.dto';

import { Tag } from 'src/modules/tags/entities/tag.entity';

import { TagsService } from 'src/modules/tags/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('/')
  async lookup(@Query() dto: TagsLookupDto): Promise<Tag[]> {
    return this.tagsService.lookup(dto);
  }
}
