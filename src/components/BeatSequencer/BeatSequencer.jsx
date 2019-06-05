import React, { useState, useEffect, useCallback, useRef } from 'react';
import Tone from 'tone';
import produce from 'immer';
import styled from 'styled-components/macro';

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

const getArrayOf = length => Array.from({ length }).map((_, index) => index);

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

const kit = new Tone.Players(
  {
    kick: `${process.env.PUBLIC_URL}/sounds/808-Kicks01.wav`,
    hihat: `${process.env.PUBLIC_URL}/sounds/808-HiHats03.wav`,
    snare: `${process.env.PUBLIC_URL}/sounds/808-Snare02.wav`
  },
  {}
).toMaster();

Tone.Transport.bpm.value = 128;

const kitPositions = ['kick', 'hihat', 'snare'];

const initialStepState = [
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0]
];

function useSequence({ drumKit, steps }) {
  const [stepState, setStepState] = useState(initialStepState);
  const [currentStep, setCurrentStep] = useState(0);

  const toggleStep = useCallback((drumIndex, stepIndex) => {
    setStepState(
      produce(draft => {
        const prevValue = draft[drumIndex][stepIndex];
        draft[drumIndex][stepIndex] = prevValue ? 0 : 1;
      })
    );
  }, []);

  const stepStateRef = useRef(stepState);

  useEffect(() => {
    stepStateRef.current = stepState;
  }, [stepState]);

  useEffect(() => {
    const loop = new Tone.Sequence((time, column) => {
      const stepStateColumn = stepStateRef.current.map(row => row[column]);

      stepStateColumn.forEach((value, index) => {
        if (value) {
          kit.get(kitPositions[index]).start(time, 0, '16n', 0, 1);
        }
      });

      Tone.Draw.schedule(() => {
        setCurrentStep(column);
      });
    }, getArrayOf(steps));

    loop.start(0);

    return () => loop.dispose();
  }, [steps]);

  return [currentStep, stepState, toggleStep];
}

function BeatSequencer({ drumKit = [], steps = 8 }) {
  const [isPlaying, togglePlay] = useStartStop();
  const [currentStep, stepState, toggleStep] = useSequence({ drumKit, steps });

  return (
    <Container>
      <DrumKit>
        {drumKit.map(item => (
          <DrumSound key={item}>{item}</DrumSound>
        ))}
      </DrumKit>
      <PatternWrapper>
        <Pattern drumKitLength={drumKit.length} steps={steps}>
          <tbody>
            {getArrayOf(drumKit.length).map(drumIndex => (
              <tr key={drumIndex}>
                {getArrayOf(steps).map(stepIndex => (
                  <Step
                    key={`${drumIndex}.${stepIndex}`}
                    active={Boolean(stepState[drumIndex][stepIndex])}
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
