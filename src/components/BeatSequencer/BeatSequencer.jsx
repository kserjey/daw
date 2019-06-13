import React, { useState, useEffect, useCallback } from 'react';
import Tone from 'tone';
import styled from 'styled-components/macro';
import { useSequence } from './useSequence';
import { ReactComponent as PlayIcon } from './play.svg';
import { ReactComponent as PauseIcon } from './pause.svg';

const Container = styled.div`
  display: flex;
`;

const DrumKit = styled.ul`
  width: 128px;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: #858585;
  color: #ffffff;
  border-width: 2px 0 2px 2px;
  border-style: solid;
  border-color: #666666;
  border-radius: 4px 0 0 4px;
`;

const DrumSound = styled.li`
  padding: 8px 16px;
  border-width: 0 0 2px 0;
  border-style: solid;
  border-color: #666666;

  &:last-child {
    border-width: 0;
  }
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
  top: 2px;
  bottom: 2px;
  left: ${currentStep * 42}px;
  width: 40px;
  border: 2px solid #FFFFFF;
  border-radius: 2px;
  pointer-events: none;
`
);

const Step = styled.td(
  ({ active }) => `
  box-sizing: border-box;
  width: 42px;
  height: 42px;
  background-color: ${active ? '#FED034' : '#858585'};
  border: 2px solid #666666;
  cursor: pointer;
`
);

const StartStopButton = styled.button`
  width: 42px;
  background-color: #ffffff;
  cursor: pointer;
`;

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
      <StartStopButton onClick={togglePlay}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </StartStopButton>
    </Container>
  );
}

export { BeatSequencer };
