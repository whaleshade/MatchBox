interface IUser {
  userId: string;
  nickname: string;
  image: string;
}

interface IUserFromGame {
  userId: string;
  nickname: string;
  image: string;
  score: number;
}

export interface IMatch {
  user1: IUser;
  user2: IUser;
  currentViewer: number;
  gameWatchId: string;
}

export interface IGameHistroy {
  id: string;
  winner: IUserFromGame;
  loser: IUserFromGame;
}

export interface IGameHistoryByAPI {
  gameId: string;
  gameName: string;
  gameHistory: IGameHistroy[];
}

export interface IGameWatch {
  gameId: string;
  name: string;
  matches: IMatch[];
}

export interface ICurrentGameHistory {
  user1: string;
  user1Image: string;
  user2: string;
  user2Image: string;
  currentViewer: number;
  matchId: string;
}

export interface IGameInfo {
  gameId: string;
  name: string;
  price: number;
  isPlayable: boolean;
  isBuy: boolean;
}

export interface IOldGameHistory {
  winner: string;
  winnerImage: string;
  winnerScore: number;
  loser: string;
  loserImage: string;
  loserScore: number;
  gameHistoyId: string;
}
