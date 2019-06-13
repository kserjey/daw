import React, { useState, useEffect, useCallback } from 'react';
import Tone from 'tone';
import styled from 'styled-components/macro';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background-color: #4d4d4d;
  color: #ffffff;
`;

const Label = styled.label`
  display: block;
  margin-right: 8px;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 72px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #ffffff;
  border-radius: 2px;
  background-color: #666666;
  color: #ffffff;
  font-size: 15px;
  font-family: inherit;
`;

function useBPM(initialValue = 128) {
  const [bpm, setBPM] = useState(initialValue);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  return [bpm, setBPM];
}

function Header({ style, className }) {
  const [bpm, setBPM] = useBPM();
  const handleChange = useCallback(event => setBPM(event.target.value), [
    setBPM
  ]);

  return (
    <Container {...{ style, className }}>
      <Label>Tempo (BPM):</Label>
      <Input type="number" value={bpm} onChange={handleChange} />
    </Container>
  );
}

export { Header };
