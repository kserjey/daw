import React from 'react';
import styled from 'styled-components/macro';
import { Divider } from './Grid';

const NoteText = styled.text`
  fill: #ffffff;
  dominant-baseline: middle;
  text-anchor: middle;
`;

function NotesLabels({ width, notes, noteHeight }) {
  const height = notes.length * noteHeight;

  return (
    <svg style={{ borderRadius: '4px 0 0 4px' }} {...{ width, height }}>
      {notes.map((note, noteIndex) => (
        <svg
          key={noteIndex}
          width="100%"
          height={noteHeight}
          x={0}
          y={noteIndex * noteHeight}
        >
          <rect width="100%" height="100%" fill="#858585" />
          <NoteText x="50%" y="50%">
            {note}
          </NoteText>
        </svg>
      ))}
      <g>
        {Array.from({ length: notes.length + 1 }).map((_, rowIndex) => (
          <Divider
            key={rowIndex}
            x1={0}
            y1={rowIndex * noteHeight}
            x2="100%"
            y2={rowIndex * noteHeight}
          />
        ))}
      </g>
    </svg>
  );
}

export { NotesLabels };
