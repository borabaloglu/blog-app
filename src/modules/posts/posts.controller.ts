import { Controller } from '@nestjs/common';

import { PostsService } from 'src/modules/posts/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
}
