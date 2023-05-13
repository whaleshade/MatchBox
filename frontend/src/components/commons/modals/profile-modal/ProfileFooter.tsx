import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import BanIcon from '../../../../assets/icon/ban.svg';
import DmIcon from '../../../../assets/icon/dm.svg';
import GameIcon from '../../../../assets/icon/game.svg';
import KickIcon from '../../../../assets/icon/kick.svg';
import MuteIcon from '../../../../assets/icon/mute.svg';
import UnmuteIcon from '../../../../assets/icon/unmute.svg';
import { userState } from '../../../../recoil/locals/login/atoms/atom';
import { useUserChannel } from '../../../../api/Channel';
import ErrorPopupNav from '../../error/ErrorPopupNav';

interface BanProps {
  friendId: string;
  isBan: boolean;
}

interface ChannelProps {
  channelId?: string;
  isAdmin?: boolean;
}

interface UserProps {
  userId: string;
  isMute?: boolean;
  ban?: BanProps;
}

interface Props {
  handleClickModal: () => void;
  user: UserProps;
  inChat: boolean;
  channelInfo?: ChannelProps;
  handleKickClicked?: (targetId: string) => void | undefined;
}

export default function ProfileFooter({
  handleClickModal,
  user,
  inChat,
  channelInfo,
  handleKickClicked,
}: Props) {
  // 리액트 쿼리
  const queryClient = useQueryClient();
  // 페이지 이동
  const navigate = useNavigate();
  // 리코일 - 유저 정보
  const userInfo = useRecoilValue(userState);
  // 에러
  const [isErrorGet, setIsErrorGet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  // userChannel - isMute 정보
  const { data: userChannel } = useUserChannel(
    user.userId,
    channelInfo?.channelId,
  );
  // 음소거 유무
  const [isMute, setIsMute] = useState<boolean | undefined>(false);
  // 음소거와 킥 공통 url
  const muteKickUrl = `${process.env.REACT_APP_BASE_BACKEND_URL}/channels/${channelInfo?.channelId}/member/${user.userId}`;

  const handleHideErrorModal = () => {
    setIsErrorGet(false);
  };

  useEffect(() => {
    if (inChat === true) {
      setIsMute(userChannel?.isMute);
    }
  }, [userChannel]);

  // 음소거 설정 버튼 클릭
  const handleMuteClicked = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    await axios
      .patch(muteKickUrl.concat(isMute ? `/unmute` : `/mute`), null, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
      .then(function (response) {
        // 음소거 상태 변화
        setIsMute(!isMute);
      })
      .catch(function (error) {
        // 예외 처리
        if (error.response.status === 404) {
          setIsErrorGet(true);
          setErrorMessage('없는 사용자입니다.');
        } else if (error.response.status === 403) {
          if (error.response.data.message === 'not admin user') {
            setIsErrorGet(true);
            setErrorMessage('사용자가 오너이거나 관리자가 아닙니다.');
          } else if (error.response.data.message === 'cannot mute owner') {
            setIsErrorGet(true);
            setErrorMessage('채널 소유자를 음소거할 수 없습니다.');
          }
        } else {
          setIsErrorGet(true);
          setErrorMessage('요청이 실패했습니다.');
        }
      });
  };

  const handleKick = (targetId: string) => {
    if (handleKickClicked) {
      // 프로필 모달 닫기
      handleClickModal();
      handleKickClicked(targetId);
    }
  };

  // 차단 버튼 클릭
  const handleBanClicked = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    await axios
      .patch(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/friends/${user.ban?.friendId}/banned`,
        {
          isBan: true,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      )
      .then(function (response) {
        // 프로필 모달 닫기
        handleClickModal();

        // 친구 목록 쿼리 무효화 및 재요청
        queryClient.invalidateQueries('friends');
      })
      .catch(function (error) {
        // 예외 처리
        if (error.response.status === 404) {
          setIsErrorGet(true);
          setErrorMessage('사용자의 친구가 아닙니다.');
        } else if (error.response.status === 409) {
          setIsErrorGet(true);
          setErrorMessage('이미 차단되거나 차단 해제된 사용자입니다.');
        } else {
          setIsErrorGet(true);
          setErrorMessage('요청이 실패했습니다.');
        }
      });
  };

  // 디엠 버튼 클릭
  const handleDmClicked = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    await axios
      .post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/channels/dm`,
        {
          buddyId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      )
      .then(function (response) {
        const to = `/chat/channel/${response.data.channel.channelId}`;
        navigate(to);
      })
      .catch(function (error) {
        // 예외 처리
        if (error.response.status === 404) {
          setIsErrorGet(true);
          setErrorMessage('없는 사용자입니다.');
        } else {
          setIsErrorGet(true);
          setErrorMessage('요청이 실패했습니다.');
        }
      });
    // 프로필 모달 닫기
    handleClickModal();
  };

  // 상대방 상세 프로필 페이지로 이동
  const handleGameClicked = () => {
    // 프로필 모달 닫기
    handleClickModal();
    if (user.userId !== userInfo.userId) {
      navigate(`/profile/friend/${user.userId}`);
    } else {
      navigate(`/profile/my`);
    }
  };

  const onlyOne =
    (inChat && (user.userId === userInfo.userId || !channelInfo?.isAdmin)) ||
    (!inChat && user.userId === userInfo.userId);
  return (
    <>
      <ErrorPopupNav
        isErrorGet={isErrorGet}
        message={errorMessage}
        handleErrorClose={handleHideErrorModal}
      />
      <FooterWrapper onlyOne={onlyOne}>
        {user.userId !== '' && (
          <>
            <ButtonWrap>
              <Button onClick={handleGameClicked}>
                <ButtonImage src={GameIcon} />
              </Button>
            </ButtonWrap>{' '}
            {inChat &&
              user.userId !== userInfo.userId &&
              channelInfo?.isAdmin && (
                <>
                  <ButtonWrap>
                    <Button onClick={handleMuteClicked}>
                      <ButtonImage src={isMute ? MuteIcon : UnmuteIcon} />
                    </Button>
                  </ButtonWrap>
                  <ButtonWrap>
                    <Button onClick={() => handleKick(user.userId)}>
                      <ButtonImage src={KickIcon} />
                    </Button>
                  </ButtonWrap>
                </>
              )}
            {!inChat && user.userId !== userInfo.userId && (
              <>
                <ButtonWrap>
                  <Button onClick={handleDmClicked}>
                    <ButtonImage src={DmIcon} />
                  </Button>
                </ButtonWrap>
                <ButtonWrap>
                  <Button onClick={handleBanClicked}>
                    <ButtonImage src={BanIcon} />
                  </Button>
                </ButtonWrap>
              </>
            )}
          </>
        )}
      </FooterWrapper>
    </>
  );
}

const ButtonImage = styled.img`
  width: 7rem;
  height: 7rem;
  cursor: pointer;
`;

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

const FooterWrapper = styled.footer<{ onlyOne: boolean }>`
  /* padding: 3rem 2rem 0.8rem; */
  /* bottom: 0rem; */
  /* top: 80rem; */
  border-top: 1px solid #d3d3d3;
  display: grid;
  grid-template-columns: ${({ onlyOne }) => (onlyOne ? '1fr' : '1fr 1fr 1fr')};
  width: 100%;
`;
