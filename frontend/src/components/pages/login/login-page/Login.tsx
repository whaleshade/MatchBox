import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../commons/layout/Layout';
import LogoIcon from '../../../../assets/icon/logo.svg';
import LoginIcon from '../../../../assets/icon/login.svg';
import { userState } from '../../../../recoil/locals/login/atoms/atom';
import ErrorPopupNav from '../../../commons/error/ErrorPopupNav';

export default function Login() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const userInfo = useRecoilValue(userState);
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);
  // 에러
  const [isErrorGet, setIsErrorGet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async () => {
    setIsLogin(!isLogin);

    await axios
      .get(`${process.env.REACT_APP_BASE_BACKEND_URL}/login`)
      .then(response => {
        window.location.replace(response.data.url);
      })
      .catch(() => {
        setIsErrorGet(true);
        setErrorMessage('요청을 처리할 수 없습니다.');
      });
  };

  const handleHideErrorModal = () => {
    setIsErrorGet(false);
  };

  useEffect(() => {
    if (userInfo.token !== '' && userInfo.token !== undefined) {
      navigate('/chat/channel');
    }
  }, []);

  // 가짜 유저 로그인
  const fakeLogin = async (n: number) => {
    setIsLogin(!isLogin);
    await axios
      .get(`${process.env.REACT_APP_BASE_BACKEND_URL}/auth/fakeLogin${n}`)
      .then(function (res) {
        const storeUser = {
          token: res.data.token,
          userId: res.data.userId,
          nickname: res.data.nickname,
          imageUrl: res.data.image,
        };
        setUserState(storeUser);
        navigate('/chat/channel');
      })
      .catch(() => {
        setIsErrorGet(true);
        setErrorMessage('요청을 처리할 수 없습니다.');
      });
  };

  return (
    <Layout>
      <Fake1Button onClick={() => fakeLogin(1)}>가짜 유저1 로그인</Fake1Button>
      <Fake2Button onClick={() => fakeLogin(2)}>가짜 유저2 로그인</Fake2Button>
      <Fake3Button onClick={() => fakeLogin(3)}>가짜 유저3 로그인</Fake3Button>
      <Fake4Button onClick={() => fakeLogin(4)}>가짜 유저4 로그인</Fake4Button>
      <ErrorPopupNav
        isErrorGet={isErrorGet}
        message={errorMessage}
        handleErrorClose={handleHideErrorModal}
      />
      <Container>
        <LogoImage src={LogoIcon} alt={LogoIcon} />
        <LoginImage src={LoginIcon} alt={LoginIcon} onClick={handleLogin} />
      </Container>
    </Layout>
  );
}

const LogoImage = styled.img`
  width: 15.653rem;
  height: 19.9rem;
`;

const LoginImage = styled.img`
  cursor: pointer;
  width: 15.653rem;
  height: 19.9rem;
`;

const Container = styled.div`
  display: flex;
  margin-top: 0;
  flex-direction: column;
  align-items: center;
  list-style-type: none;
  padding: 15rem 0rem 0rem;
  margin: 0;
  width: 100%;
  gap: 0;
  height: inherit;
  overflow-y: auto;
`;

const Fake1Button = styled.button`
  position: absolute;
  left: 40%;
  font-size: 20px;
`;

const Fake2Button = styled.button`
  position: absolute;
  left: 60%;
  font-size: 20px;
`;

const Fake3Button = styled.button`
  position: absolute;
  left: 40%;
  top: 10%;
  font-size: 20px;
`;

const Fake4Button = styled.button`
  position: absolute;
  left: 60%;
  top: 10%;
  font-size: 20px;
`;
