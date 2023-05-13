export interface IFriendDetail {
  nickname: string;
  intraId: string;
  status: string;
  image: string;
  friendId: string;
  buddyId: string;
  isBan: boolean;
}

export interface IBuddy {
  nickname: string;
  intraId: string;
  status: string;
  image: string;
}

export interface IFriends {
  friendId: string;
  buddyId: string;
  buddy: IBuddy;
  isBan: boolean;
}

export interface IFriend {
  friends: IFriends[];
}
