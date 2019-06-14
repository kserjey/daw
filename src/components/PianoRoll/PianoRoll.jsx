import React, { useRef, useCallback } from 'react';
import styled from 'styled-components/macro';

const Divider = styled.line`
  stroke: #666666;
  stroke-width: 2px;
`;

const NoteText = styled.text`
  fill: #ffffff;
  dominant-baseline: middle;
  text-anchor: middle;
`;

function NotesLabels({ x, y, width, notes, noteHeight }) {
  const height = notes.length * noteHeight;

  return (
    <svg
      style={{ marginRight: 1, borderRadius: '4px 0 0 4px' }}
      {...{ width, height, x, y }}
    >
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

function Grid({ x, y, rows, columns, rowHeight, columnWidth, onCellClick }) {
  const width = columns * columnWidth;
  const height = rows * rowHeight;

  const gridRef = useRef();

  const handleClick = useCallback(
    event => {
      const point = gridRef.current.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;

      const cursorPoint = point.matrixTransform(
        gridRef.current.getScreenCTM().inverse()
      );

      onCellClick(
        Math.floor(cursorPoint.x / columnWidth),
        Math.floor(cursorPoint.y / rowHeight)
      );
    },
    [rowHeight, columnWidth, onCellClick]
  );

  return (
    <svg
      ref={gridRef}
      style={{ borderRadius: '0 4px 4px 0' }}
      {...{ width, height, x, y }}
    >
      <rect width="100%" height="100%" fill="#858585" onClick={handleClick} />
      {Array.from({ length: rows + 1 }).map((_, rowIndex) => (
        <Divider
          key={rowIndex}
          x1={0}
          y1={rowIndex * rowHeight}
          x2="100%"
          y2={rowIndex * rowHeight}
        />
      ))}
      {Array.from({ length: columns + 1 }).map((_, columnIndex) => (
        <Divider
          key={columnIndex}
          x1={columnIndex * columnWidth}
          y1={0}
          x2={columnIndex * columnWidth}
          y2="100%"
        />
      ))}
    </svg>
  );
}

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];

const STEP_WIDTH = 72;
const ROW_HEIGHT = 32;

function PianoRoll({ stepsLength = 16 }) {
  return (
    <div>
      <NotesLabels width={64} notes={NOTES} noteHeight={ROW_HEIGHT} />
      <Grid
        rows={NOTES.length}
        rowHeight={ROW_HEIGHT}
        columns={stepsLength}
        columnWidth={STEP_WIDTH}
        onCellClick={console.log}
      />
    </div>
  );
}

export { PianoRoll };
