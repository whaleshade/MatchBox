import styled from 'styled-components';
import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  margin-right: 10px;
  font-size: 16px;
  font-weight: bold;
`;

const CheckboxInput = styled.input`
  margin-right: 5px;
`;

export default function Checkbox({
  id,
  label,
  checked,
  onChange,
  value,
}: CheckboxProps) {
  return (
    <CheckboxContainer>
      <CheckboxInput
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        value={value}
      />
      <Label htmlFor={id}>{label}</Label>
    </CheckboxContainer>
  );
}
