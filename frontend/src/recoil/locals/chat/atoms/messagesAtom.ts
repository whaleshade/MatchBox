import { atom } from 'recoil';
import { IChat } from '../../../../components/pages/chat/chatroom-page';

export const messagesAtom = atom<IChat[]>({
  key: 'messagesAtom',
  default: [],
});
