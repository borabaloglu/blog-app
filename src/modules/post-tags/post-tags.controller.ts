import { Controller } from '@nestjs/common';

import { PostTagsService } from 'src/modules/post-tags/post-tags.service';

@Controller('post-tags')
export class PostTagsController {
  constructor(private readonly postTagsService: PostTagsService) {}
}
