import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendsRepository } from './repository/friends.repository';
import { FriendsSetBanDto } from './dto/friends.dto';
import { Friend } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor(private friendsRepository: FriendsRepository) {}

  async getBanFriendList(userId: string) {
    const banFriend = await this.friendsRepository.findBanFriendByMyId(userId);
    return { friend: banFriend };
  }

  async setBanFriend(userId: string, buddyId: string, dto: FriendsSetBanDto) {
    const friend = await this.validateMyFriend(userId, buddyId);
    await this.friendsRepository.updateFriendBan(friend.friendId, dto.isBan);
  }

  private async validateMyFriend(
    userId: string,
    buddyId: string,
  ): Promise<Friend> {
    const friend = await this.friendsRepository.findFriendByMyIdAndBuddyId(
      userId,
      buddyId,
    );
    if (friend === null) {
      throw new NotFoundException('Not my buddy');
    }
    return friend;
  }
}
