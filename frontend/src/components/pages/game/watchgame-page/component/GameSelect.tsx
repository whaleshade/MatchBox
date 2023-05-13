import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PingPongIcon from '../../../../../assets/icon/pingpong.svg';
import SelectArrow from '../../../../../assets/icon/SelectArrow.svg';

interface Prop {
  gameName: string;
  selectedGame: string;
  setSelectedGame: React.Dispatch<React.SetStateAction<string>>;
  handleGameChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => Promise<void>;
}

export default function GameSelect({
  gameName,
  selectedGame,
  setSelectedGame,
  handleGameChange,
}: Prop) {
  // 게임 선택 박스 상태
  const [selectedOpen, setSelectedOpen] = useState<boolean>(false);

  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setSelectedGame(gameName);
  }, [gameName]);

  return (
    <SelectGameContainer>
      <SelectGameWrap>
        <PingPongImageWrap>
          <img src={PingPongIcon} alt={PingPongIcon} />
        </PingPongImageWrap>
        <SelectContainer>
          <SelectWrapper>
            <Select
              ref={selectRef}
              name="game"
              value={selectedGame}
              onClick={() => {
                setSelectedOpen(!selectedOpen);
              }}
              onChange={handleGameChange}
            >
              <option value="핑퐁핑퐁">핑퐁핑퐁</option>
              <option value="테트리스">테트리스</option>
              <option value="퍼즐팡팡">퍼즐팡팡</option>
              <option value="좀비좀비">좀비좀비</option>
            </Select>
            <ArrowIcon
              onClick={() => {
                setSelectedOpen(!selectedOpen);
                selectRef.current?.click();
              }}
              isOpen={selectedOpen}
            >
              <img src={SelectArrow} alt={SelectArrow} />
            </ArrowIcon>
          </SelectWrapper>
        </SelectContainer>
      </SelectGameWrap>
    </SelectGameContainer>
  );
}

/*
 ** 게임 선택
 */
const SelectGameContainer = styled.div`
  grid-area: select;
  background-color: #313c7a;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`;

const SelectGameWrap = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 2fr;
`;

const PingPongImageWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    width: 9rem;
    height: 9rem;
  }
`;

const SelectContainer = styled.div`
  margin-left: 0.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;

const Select = styled.select`
  width: 100%;
  font-family: 'NanumGothic';
  font-size: 2.4rem;
  font-weight: bold;
  color: #555555;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 14px 0;
  text-align: center;
  cursor: pointer;

  appearance: none;

  &:focus {
    outline: none;
  }

  option {
    width: 100%;
    font-family: 'NanumGothic';
    font-size: 2rem;
    color: #555555;
  }
`;

const ArrowIcon = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0%)
    ${props => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  pointer-events: none;

  > img {
    width: 3.2rem;
    height: 3.2rem;
  }
`;
