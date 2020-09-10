import { Controller } from '@nestjs/common';

import { TagsService } from 'src/modules/tags/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
}
