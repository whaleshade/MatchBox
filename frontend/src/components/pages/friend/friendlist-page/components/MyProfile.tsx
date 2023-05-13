import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import defaultTheme from '../../../../../styles/theme';

const Base = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  margin-right: 1rem;
  cursor: pointer;
`;

const NickName = styled.span`
  font-size: 1.8rem;
  font-weight: ${defaultTheme.fontWeight.weightBold};
  margin-left: 1rem;
`;

export default function MyProfile() {
  const userInfo = useRecoilValue(userState);

  return (
    <Base>
      <Link to="/profile/my">
        <ProfileImage
          src={userInfo.imageUrl}
          alt={`${userInfo.nickname}의 이미지`}
        />
      </Link>
      <NickName>{userInfo.nickname}</NickName>
    </Base>
  );
}
