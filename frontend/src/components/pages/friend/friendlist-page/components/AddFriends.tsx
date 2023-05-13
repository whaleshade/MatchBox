import styled from 'styled-components';
import friendPagEAddbutton from '../../../../../assets/icon/friend-page-add-button.svg';

const Base = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: 2.4rem;
  cursor: pointer;
`;

const FriendAddWrapper = styled.img`
  width: 5rem;
  height: 5rem;
`;

const Title = styled.span`
  font-size: 1.8rem;
  margin-left: 2rem;
  opacity: 0.7;
`;

interface IAddFriend {
  handleClickModal: () => void;
}

export default function AddFriends({ handleClickModal }: IAddFriend) {
  return (
    <Base onClick={handleClickModal}>
      <FriendAddWrapper src={friendPagEAddbutton} alt="친구추가" />
      <Title>Add friend</Title>
    </Base>
  );
}
