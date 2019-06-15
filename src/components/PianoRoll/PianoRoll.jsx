import React, { useState, useEffect, useRef, useCallback } from 'react';
import Tone from 'tone';
import produce from 'immer';
import styled from 'styled-components/macro';

const Divider = styled.line`
  stroke: #666666;
  stroke-width: 2px;
`;

const ActiveNote = styled.rect`
  fill: #fed034;
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

function Grid({
  x,
  y,
  rows,
  columns,
  rowHeight,
  columnWidth,
  tonePosition,
  activeCells,
  onCellClick
}) {
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
      <rect
        width="2px"
        height="100%"
        x={tonePosition * width}
        y={0}
        fill="#FFFFFF"
      />
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
      <g>
        {activeCells.map(({ rowIndex, columnIndex, length }) => (
          <ActiveNote
            width={length * columnWidth - 2}
            height={rowHeight - 2}
            x={columnIndex * columnWidth + 1}
            y={rowIndex * rowHeight + 1}
          />
        ))}
      </g>
    </svg>
  );
}

const INITIAL_SYNTH = new Tone.Synth();

INITIAL_SYNTH.toMaster();

const INITIAL_STEP_STATE = {
  0: [{ note: 'C4', duration: 2 }],
  3: [{ note: 'E4', duration: 2 }],
  6: [{ note: 'D4', duration: 2 }]
};

function usePianoRoll({ synth = INITIAL_SYNTH, stepsLength }) {
  const [loopPosition, setLoopPosition] = useState(0);
  const [notesState, setNotesState] = useState(INITIAL_STEP_STATE);
  const toggleNote = useCallback(
    (note, step, duration) =>
      setNotesState(
        produce(draft => {
          const stepNotes = draft[step];
          const index = stepNotes.findIndex(stepNote => stepNote.note === note);
          if (index) {
            stepNotes.splice(index, 1);
          } else {
            stepNotes.push({ note, duration });
          }
        })
      ),
    []
  );

  const synthRef = useRef();

  useEffect(() => {
    synthRef.current = synth;
  }, [synth]);

  const notesStateRef = useRef();

  useEffect(() => {
    notesStateRef.current = notesState;
  }, [notesState]);

  const loopRef = useRef();

  useEffect(() => {
    loopRef.current = new Tone.Sequence(
      (time, stepIndex) => {
        const stepNotes = notesStateRef.current[stepIndex];
        if (!stepNotes) return;

        stepNotes.forEach(({ note, duration }, drumIndex) => {
          synthRef.current.triggerAttackRelease(
            note,
            { '16n': duration },
            time
          );
        });
      },
      Array.from({ length: stepsLength }).map((_, index) => index),
      '16n'
    );

    loopRef.current.start(0);
    return () => loopRef.current.dispose();
  }, [stepsLength]);

  useEffect(() => {
    let requestId;

    const handleTonePosition = timestamp => {
      if (Tone.Transport.state === 'started') {
        setLoopPosition(loopRef.current.progress);
      }

      requestId = requestAnimationFrame(handleTonePosition);
    };

    requestId = requestAnimationFrame(handleTonePosition);
    return () => cancelAnimationFrame(requestId);
  }, []);

  return [loopPosition, notesState, toggleNote];
}

const NOTES = [
  'C4',
  'D4',
  'E4',
  'F4',
  'G4',
  'A4',
  'B4',
  'C5',
  'D5',
  'E5',
  'F5',
  'G5',
  'A5',
  'B5'
].reverse();

const STEP_WIDTH = 72;
const ROW_HEIGHT = 32;

function PianoRoll({ stepsLength = 16 }) {
  const [loopPosition, notesState, toggleNote] = usePianoRoll({ stepsLength });

  return (
    <div>
      <NotesLabels width={64} notes={NOTES} noteHeight={ROW_HEIGHT} />
      <Grid
        rows={NOTES.length}
        rowHeight={ROW_HEIGHT}
        columns={stepsLength}
        columnWidth={STEP_WIDTH}
        tonePosition={loopPosition}
        activeCells={Object.entries(notesState).reduce(
          (acc, [stepIndex, stepNotes]) => [
            ...acc,
            ...stepNotes.map(({ note, duration }) => ({
              rowIndex: NOTES.indexOf(note),
              columnIndex: stepIndex,
              length: duration
            }))
          ],
          []
        )}
        onCellClick={console.log}
      />
    </div>
  );
}

export { PianoRoll };
