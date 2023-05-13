import styled from 'styled-components';

interface PublicToggleButtonProps {
  isPublic: boolean;
}

export const PublicToggleButton = styled.button<PublicToggleButtonProps>`
  position: relative;
  margin-top: 0.5rem;
  margin-bottom: 0;
  width: 3.2rem;
  height: 1.8rem;
  border: none;
  padding: 0;
  border-radius: 15px;
  overflow: hidden;

  &:focus {
    outline: none;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0.15rem;
    left: 0.15rem;
    right: 0.15rem;
    bottom: 0.15rem;
    background-color: ${({ isPublic }) => (isPublic ? '#7988cb' : 'grey')};
    border-radius: 50px;
    transition: background-color 0.3s ease;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0.15rem;
    left: ${({ isPublic }) => (isPublic ? 'calc(100% - 1.6rem)' : '0.1rem')};
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background-color: white;
    transition: left 0.3s ease;
  }
`;
