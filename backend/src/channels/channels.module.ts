import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { PrismaService } from 'prisma/prisma.service';
import { ChannelsRepository } from './repository/channels.repository';
import { ChannelsEventsGateway } from './events/channels.gateway';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';
import { AccountRepository } from 'src/account/repository/account.repository';
import { GamesService } from 'src/games/games.service';
import { GamesRepository } from 'src/games/repository/games.repository';

@Module({
  controllers: [ChannelsController],
  providers: [
    ChannelsService,
    PrismaService,
    ChannelsEventsGateway,
    ChannelsRepository,
    JwtService,
    AccountService,
    AccountRepository,
    GamesService,
    GamesRepository,
  ],
})
export class ChannelsModule {}
