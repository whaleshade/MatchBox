export interface randomMatchDto {
  gameId: string;
}

export interface GameType {
  gameId: string;
  name: string;
  price: number;
  isPlayable: boolean;
  isBuy: boolean;
}

export interface GameId {
  gameId: string;
}

export interface UserId {
  userId: string;
}

export interface GameWatchId {
  gameWatchId: string;
}

export interface GameWatchesType {
  gameId: string;
  gameName: string;
  matches: {
    gameWatchId: string;
    currentViewer: number;
    user1: {
      userId: string;
      nickname: string;
      image: string;
    };
    user2: {
      userId: string;
      nickname: string;
      image: string;
    };
  }[];
}

export interface UserProfile {
  userId: string;
  nickname: string;
  image: string;
}

export class UserInfoForHistoryDto {
  userId: string;
  nickname: string;
  image: string;
  score: number;
}

export class GameHistoryResponseDto {
  id: string;
  winner: UserInfoForHistoryDto;
  loser: UserInfoForHistoryDto;
}
