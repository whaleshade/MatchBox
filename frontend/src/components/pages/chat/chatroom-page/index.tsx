interface IUser {
  userId: string;
  intraId: string;
  nickname: string;
  image: string;
}

interface IUserWrapper {
  user: IUser;
}

interface IUserChannel {
  isAdmin: boolean;
  isMute: boolean;
  user: IUser;
}

export interface IChat {
  chatId: string;
  message: string;
  time: string;
  userChannel: IUserChannel;
}

interface IChannel {
  channelId: string;
  channelName: string;
  isDm: boolean;
}

export interface IChatLog {
  channel: IChannel;
  chat: IChat[];
}

export interface IReceivedMessage {
  channelId: string;
  user: IUserWrapper;
  message: string;
  time: string;
}

export interface ISendedMessage {
  channelId: string;
  message: string;
  time: Date;
}

export interface IProfile {
  receiver?: string;
  receiverThumbnailImage?: string;
  content: string;
  timestamp: string;
  message: IChat;
  onClickCapture: (chat: IChat) => void;
  onClick: () => void;
}

export interface IError {
  UnauthorizedException: string;
}

export interface IEnterReply {
  message: string;
}

export interface NError {
  NotFoundException: string;
}

export interface OError {
  NotFoundExceptionOut: string;
}

export interface IIsAdminAndIsMute {
  isAdmin: boolean;
  isMute: boolean;
}

export interface IKick {
  channelId: string;
  targetId: string;
}
