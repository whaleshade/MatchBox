import { atom } from 'recoil';

export const a = 1;

export const isErrorOnGet = atom({
  key: 'isErrorOnGet',
  default: false,
});
