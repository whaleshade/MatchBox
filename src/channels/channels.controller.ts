import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelCreateDto, ChannelInviteDto, ChannelPasswordDto, DmDto } from './dto/channels.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getPublicList(@Request() req) {
    return await this.channelsService.getPublicList(req.id['id']);
  }

  @Get('/my')
  @UseGuards(AuthGuard)
  async getMyChannelList(@Request() req) {
    return await this.channelsService.getMyChannelList(req.id['id']);
  }

  @Post('')
  @UseGuards(AuthGuard)
  async createChannel(@Body() dto: ChannelCreateDto, @Request() req) {
    await this.channelsService.createChannel(req.id['id'], dto);
  }

  @Post('/:channelId/join')
  @UseGuards(AuthGuard)
  async joinChannel(@Param('channelId') channelId: string, @Body() dto: ChannelPasswordDto, @Request() req) {
    await this.channelsService.joinChannel(req.id['id'], channelId, dto);
  }

  @Get('/:channelId')
  @UseGuards(AuthGuard)
  async getChatLog(@Param('channelId') channelId: string, @Request() req) {
    return await this.channelsService.getChatLog(req.id['id'], channelId);
  }

  @Get('/:channelId/invite')
  @UseGuards(AuthGuard)
  async searchUserForInvite(@Param('channelId') channelId: string, @Query('nickname') nickname: string, @Request() req) {
    return await this.channelsService.searchUserForInvite(req.id['id'], channelId, nickname);
  }

  @Post('/:channelId/invite')
  @UseGuards(AuthGuard)
  async inviteUser(@Param('channelId') channelId: string, @Body() dto: ChannelInviteDto, @Request() req) {
    await this.channelsService.inviteUser(req.id['id'], channelId, dto);
  }

  @Patch('/:channelId')
  @UseGuards(AuthGuard)
  async changeChannelPassword(@Param('channelId') channelId: string, @Body() dto: ChannelPasswordDto, @Request() req) {
    await this.channelsService.changeChannelPassword(req.id['id'], channelId, dto);
  }

  @Post('/dm')
  @UseGuards(AuthGuard)
  async enterDm(@Body() dto: DmDto, @Request() req) {
    return await this.channelsService.enterDm(req.id['id'], dto);
  }
}