import React, { useState } from 'react';
import styled from 'styled-components/macro';

const LANE_HEIGHT = 32;
const STEP_WIDTH = 32;

const Pattern = styled.svg`
  border: 1px solid black;
`;

const Step = styled.rect(
  ({ noteIndex, stepIndex }) => `
    width: ${STEP_WIDTH}px;
    height: ${LANE_HEIGHT}px;
    x: ${stepIndex * STEP_WIDTH}px;
    y: ${noteIndex * LANE_HEIGHT}px;
    fill: grey;
  `
);

const VerticalLine = styled.rect(
  ({ number }) => `
    width: 2px;
    height: 100%;
    x: ${STEP_WIDTH * number}px;
    y: 0;
  `
);

const HorizontalLine = styled.rect(
  ({ number }) => `
    width: 100%;
    height: 2px;
    x: 0;
    y: ${LANE_HEIGHT * number}px;
  `
);

const NOTES = ['C', 'D', 'F', 'G', 'A', 'B', 'C'];
const STEP_LENGTH = 32;

const NOTES_STATE = [{ note: 'C4', duration: '4n', time: '0' }];

function usePianoRoll() {
  const [notesState, setNotesState] = useState();
}

function PianoRoll() {
  const height = NOTES.length * LANE_HEIGHT;
  const width = STEP_LENGTH * STEP_WIDTH;

  return (
    <Pattern width={width} height={height}>
      {NOTES.map((note, noteIndex) =>
        Array.from({ length: STEP_LENGTH }).map((_, stepIndex) => (
          <Step noteIndex={noteIndex} stepIndex={stepIndex} />
        ))
      )}
    </Pattern>
  );
}

export { PianoRoll };
