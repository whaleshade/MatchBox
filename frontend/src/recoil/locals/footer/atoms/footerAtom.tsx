import { recoilPersist } from 'recoil-persist';
import { atom } from 'recoil';

const sessionStorage =
  typeof window !== 'undefined' ? window.sessionStorage : undefined;

const { persistAtom } = recoilPersist({
  key: 'footerState',
  storage: sessionStorage,
});

const footer = {
  channels: 'all',
  friends: 'frd',
};

export const footerState = atom({
  key: 'footerState',
  default: footer,
  effects_UNSTABLE: [persistAtom],
});
