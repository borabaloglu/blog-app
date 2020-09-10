import { Controller } from '@nestjs/common';

import { FriendshipsService } from 'src/modules/friendships/friendships.service';

@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}
}
