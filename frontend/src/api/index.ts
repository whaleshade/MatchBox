import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/locals/login/atoms/atom';

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_BACKEND_URL,
});

const useAxiosWithToken = () => {
  const userInfo = useRecoilValue(userState);
  const AxiosInstanceWithToken = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_BACKEND_URL}`,
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  });

  return AxiosInstanceWithToken;
};

export { AxiosInstance, useAxiosWithToken };
