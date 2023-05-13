import { Injectable, NotFoundException } from '@nestjs/common';
import { Game, GameHistory, GameWatch, UserGame } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { GameHistoryDto } from '../dto/games.dto';
import {
  GameHistoryResponseDto,
  GameId,
  UserId,
  UserProfile,
} from './game.type';

interface initGame {
  name: string;
  price: number;
  isPlayable: boolean;
}

@Injectable()
export class GamesRepository {
  constructor(private prisma: PrismaService) {}

  async addGames(games: initGame[]): Promise<void> {
    await this.prisma.game.createMany({
      data: games,
    });
  }

  async getGame(gameId: string): Promise<Game> {
    return await this.prisma.game.findUnique({
      where: {
        gameId: gameId,
      },
    });
  }

  async getGameByName(gameName: string): Promise<Game> {
    return await this.prisma.game.findFirstOrThrow({
      where: {
        name: gameName,
      },
    });
  }

  async getGames(): Promise<Game[]> {
    return await this.prisma.game.findMany();
  }

  // 왜?? -> undefined는 where절에서 무시하는 것 같음
  async getUserGameIdsByUserId(userId: string): Promise<GameId[]> {
    if (userId == undefined) {
      throw new NotFoundException('userId is undefined');
    }
    return await this.prisma.userGame.findMany({
      where: { userId: userId },
      select: { gameId: true },
    });
  }

  async createUserGame(userId: string, gameId: string): Promise<UserGame> {
    return await this.prisma.userGame.create({
      data: {
        userId: userId,
        gameId: gameId,
      },
    });
  }

  async getGameWatchById(gameWatchId: string): Promise<GameWatch> {
    return await this.prisma.gameWatch.findFirst({
      where: { gameWatchId },
    });
  }

  async getGameWatches(): Promise<GameWatch[]> {
    return await this.prisma.gameWatch.findMany();
  }

  async getUserIdByUserGameId(userGameId: string): Promise<UserId> {
    return await this.prisma.userGame.findUnique({
      where: { userGameId: userGameId },
      select: { userId: true },
    });
  }

  async getGameIdByUserGameId(userGameId: string): Promise<GameId> {
    return await this.prisma.userGame.findUnique({
      where: { userGameId: userGameId },
      select: { gameId: true },
    });
  }

  async getGameWatchsWithSameGameId(gameId: string): Promise<GameWatch[]> {
    return await this.prisma.gameWatch.findMany({
      where: {
        OR: [
          { userGame1: { game: { gameId: gameId } } },
          { userGame2: { game: { gameId: gameId } } },
        ],
      },
    });
  }

  async getUserProfile(userGameId: string): Promise<UserProfile> {
    const userId = await this.getUserIdByUserGameId(userGameId);
    return await this.prisma.user.findUnique({
      where: {
        userId: userId.userId,
      },
      select: {
        userId: true,
        nickname: true,
        image: true,
      },
    });
  }

  async createGameHistory({
    winnerId,
    loserId,
    winnerScore,
    loserScore,
  }: GameHistoryDto): Promise<GameHistory> {
    return await this.prisma.gameHistory.create({
      data: {
        winnerUserGameId: winnerId,
        loserUserGameId: loserId,
        winnerScore: winnerScore,
        loserScore: loserScore,
      },
    });
  }

  async getGameHistory({
    winnerId,
    loserId,
    winnerScore,
    loserScore,
  }: GameHistoryDto): Promise<GameHistory> {
    return await this.prisma.gameHistory.create({
      data: {
        winnerUserGameId: winnerId,
        loserUserGameId: loserId,
        winnerScore: winnerScore,
        loserScore: loserScore,
      },
    });
  }

  async getGameHistoryById(userId: string): Promise<GameHistoryResponseDto[]> {
    const gameHistories = await this.prisma.gameHistory.findMany({
      where: {
        OR: [{ winnerUserGameId: userId }, { loserUserGameId: userId }],
      },
      orderBy: {
        createAt: 'desc',
      },
      select: {
        gameHistoryId: true,
        winnerUserGame: {
          select: {
            user: {
              select: {
                userId: true,
                nickname: true,
                image: true,
              },
            },
          },
        },
        winnerScore: true,
        loserUserGame: {
          select: {
            user: {
              select: {
                userId: true,
                nickname: true,
                image: true,
              },
            },
          },
        },
        loserScore: true,
      },
    });

    return gameHistories.map(
      (gameHistory): GameHistoryResponseDto => ({
        id: gameHistory.gameHistoryId,
        winner: {
          userId: gameHistory.winnerUserGame.user.userId,
          nickname: gameHistory.winnerUserGame.user.nickname,
          image: gameHistory.winnerUserGame.user.image,
          score: gameHistory.winnerScore,
        },
        loser: {
          userId: gameHistory.loserUserGame.user.userId,
          nickname: gameHistory.loserUserGame.user.nickname,
          image: gameHistory.loserUserGame.user.image,
          score: gameHistory.loserScore,
        },
      }),
    );
  }

  async getUserGame(userId: string, gameId: string): Promise<UserGame> {
    return await this.prisma.userGame.findFirst({
      where: {
        userId: userId,
        gameId: gameId,
      },
    });
  }

  async getUserGameByUserGameId(userGameId: string): Promise<UserGame> {
    return await this.prisma.userGame.findFirst({
      where: {
        userGameId,
      },
    });
  }

  async createGameWatch(
    userGameId1: string,
    userGameId2: string,
  ): Promise<GameWatch> {
    return await this.prisma.gameWatch.create({
      data: {
        currentViewer: 0,
        userGameId1: userGameId1,
        userGameId2: userGameId2,
      },
    });
  }

  async deleteGameWatch(gameWatchId: string): Promise<GameWatch> {
    return await this.prisma.gameWatch.delete({
      where: {
        gameWatchId,
      },
    });
  }

  async updateGameWatch(
    gameWatchId: string,
    currentViewer: number,
  ): Promise<GameWatch> {
    return await this.prisma.gameWatch.update({
      where: {
        gameWatchId,
      },
      data: {
        currentViewer,
      },
    });
  }

  async getGameWatchByUserIdAndGameWatchId(
    userId: string,
    gameWatchId: string,
  ): Promise<GameWatch> {
    return await this.prisma.gameWatch.findFirst({
      where: {
        gameWatchId: gameWatchId,
        OR: [
          { userGame1: { userId: userId } },
          { userGame2: { userId: userId } },
        ],
      },
    });
  }

  async getGameWatchByUserGameId(userGameId: string): Promise<GameWatch> {
    return await this.prisma.gameWatch.findFirst({
      where: {
        OR: [{ userGameId1: userGameId }, { userGameId2: userGameId }],
      },
    });
  }
}
