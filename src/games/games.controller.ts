import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { GameHistoryDto, gameIdDto, gameWatchIdDto } from './dto/games.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  // 게임샵 페이지 - 게임 목록 조회
  @Get()
  @UseGuards(AuthGuard)
  async getGames(@Req() req: Request) {
    const userId = req['id']['id'];
    return this.gamesService.getGamesByUserId(userId);
  }

  // 게임샵 페이지 - 게임 구매
  @Post(':gameId/buy')
  @UseGuards(AuthGuard)
  async buyGame(@Req() req: Request, @Param() gameId: gameIdDto) {
    const userId = req['id']['id'];
    return this.gamesService.buyGame(userId, gameId.gameId);
  }

  // 관전 목록 페이지 - 게임 관전 목록 조회
  @Get(':gameId')
  @UseGuards(AuthGuard)
  async getGameWatches(@Param() gameId: gameIdDto) {
    return this.gamesService.getGameWatches(gameId.gameId);
  }

  // 게임 종료
  @Post(':gameWatchId')
  @UseGuards(AuthGuard)
  async createGameHistory(
    @Param() { gameWatchId }: gameWatchIdDto,
    @Body() gameHistoryDto: GameHistoryDto,
  ) {
    return this.gamesService.createGameHistory(gameWatchId, gameHistoryDto);
  }
}
