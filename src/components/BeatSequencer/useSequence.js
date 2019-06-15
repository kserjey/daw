import { useState, useEffect, useCallback, useRef } from 'react';
import Tone from 'tone';
import produce from 'immer';

function getTonePlayers(drumKit) {
  return new Tone.Players(
    drumKit.reduce((acc, { name, source }) => ({ ...acc, [name]: source }), {})
  );
}

function getInitialStepState(drumKitLength, stepsLength) {
  return Array(drumKitLength).fill(Array(stepsLength).fill(0));
}

function useSequence({ drumKit, stepsLength }) {
  const initialStepState = getInitialStepState(drumKit.length, stepsLength);
  const [stepsState, setStepsState] = useState(initialStepState);
  const [currentStep, setCurrentStep] = useState(0);

  const toggleStep = useCallback((drumIndex, stepIndex) => {
    setStepsState(
      produce(draft => {
        const prevValue = draft[drumIndex][stepIndex];
        draft[drumIndex][stepIndex] = prevValue ? 0 : 1;
      })
    );
  }, []);

  const drumKitRef = useRef();
  const drumPositionsRef = useRef();

  useEffect(() => {
    drumPositionsRef.current = drumKit.map(({ name }) => name);
    drumKitRef.current = getTonePlayers(drumKit);
    drumKitRef.current.toMaster();
    return () => drumKitRef.current.dispose();
  }, [drumKit]);

  const stepStateRef = useRef();

  useEffect(() => {
    stepStateRef.current = stepsState;
  }, [stepsState]);

  useEffect(() => {
    const loop = new Tone.Sequence(
      (time, column) => {
        const stepStateColumn = stepStateRef.current.map(row => row[column]);

        stepStateColumn.forEach((value, drumIndex) => {
          if (value) {
            const drumName = drumPositionsRef.current[drumIndex];
            drumKitRef.current.get(drumName).start(time);
          }
        });

        Tone.Draw.schedule(() => setCurrentStep(column));
      },
      Array.from({ length: stepsLength }).map((_, index) => index),
      '16n'
    );

    loop.start(0);

    return () => loop.dispose();
  }, [stepsLength]);

  return [currentStep, stepsState, toggleStep];
}

export { useSequence };
