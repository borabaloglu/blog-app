import { Module } from '@nestjs/common';

import { TagsController } from 'src/modules/tags/tags.controller';

import { TagsService } from 'src/modules/tags/tags.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
