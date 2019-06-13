import React, { useState, useEffect, useCallback } from 'react';
import Tone from 'tone';
import styled from 'styled-components/macro';
import { useSequence } from './useSequence';

const Container = styled.div`
  display: flex;
`;

const DrumKit = styled.ul`
  width: 128px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const DrumSound = styled.li`
  height: 24px;
  line-height: 24px;
  padding: 0 8px;
`;

const PatternWrapper = styled.div`
  position: relative;
`;

const Pattern = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  overflow-y: auto;
`;

const StepIndicator = styled.div(
  ({ currentStep }) => `
  position: absolute;
  top: 0;
  left: ${currentStep * 24}px;
  width: 24px;
  height: 100%;
  border: 1px solid yellow;
  pointer-events: none;
`
);

const Step = styled.td(
  ({ active }) => `
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  background-color: ${active ? 'yellow' : 'grey'};
  border: 1px solid black;
  cursor: pointer;
`
);

function useStartStop() {
  const [on, set] = useState(false);
  const toggle = useCallback(() => set(val => !val), []);

  useEffect(() => {
    if (on) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  }, [on]);

  return [on, toggle];
}

function BeatSequencer({ className, style, drumKit = [], stepsLength = 8 }) {
  const [isPlaying, togglePlay] = useStartStop();
  const [currentStep, stepsState, toggleStep] = useSequence({
    drumKit,
    stepsLength
  });

  return (
    <Container {...{ className, style }}>
      <DrumKit>
        {drumKit.map(({ name }) => (
          <DrumSound key={name}>{name}</DrumSound>
        ))}
      </DrumKit>
      <PatternWrapper>
        <Pattern>
          <tbody>
            {stepsState.map((drumRow, drumIndex) => (
              <tr key={drumIndex}>
                {drumRow.map((value, stepIndex) => (
                  <Step
                    key={`${drumIndex}.${stepIndex}`}
                    active={Boolean(value)}
                    onClick={() => toggleStep(drumIndex, stepIndex)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </Pattern>
        <StepIndicator currentStep={currentStep} />
      </PatternWrapper>
      <button onClick={togglePlay}>{isPlaying ? 'Stop' : 'Play'}</button>
    </Container>
  );
}

export { BeatSequencer };
