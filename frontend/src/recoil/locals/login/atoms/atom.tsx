import { recoilPersist } from 'recoil-persist';
import { atom } from 'recoil';

const sessionStorage =
  typeof window !== 'undefined' ? window.sessionStorage : undefined;

const { persistAtom } = recoilPersist({
  key: 'userState',
  storage: sessionStorage,
});

const user = {
  token: '',
  userId: '',
  nickname: '',
  imageUrl: '',
};

export const userState = atom({
  key: 'userState',
  default: user,
  effects_UNSTABLE: [persistAtom],
});
