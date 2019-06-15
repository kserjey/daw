import React, { useState, useEffect, useRef, useCallback } from 'react';
import Tone from 'tone';
import produce from 'immer';
import styled from 'styled-components/macro';
import { NotesLabels } from './NotesLabels';
import { Grid } from './Grid';

const ActiveNote = styled.rect`
  fill: #fed034;
`;

const INITIAL_SYNTH = new Tone.PolySynth();

INITIAL_SYNTH.toMaster();

function usePianoRoll({ synth = INITIAL_SYNTH, stepsLength }) {
  const [loopPosition, setLoopPosition] = useState(0);
  const [notesState, setNotesState] = useState({});
  const toggleNote = useCallback(
    (note, step, duration = 1) =>
      setNotesState(
        produce(draft => {
          const stepNotes = draft[step];

          if (typeof stepNotes === 'undefined') {
            draft[step] = [{ note, duration }];
            return draft;
          }

          const index = stepNotes.findIndex(stepNote => stepNote.note === note);

          if (index > -1) {
            stepNotes.splice(index, 1);
            return draft;
          }

          stepNotes.push({ note, duration });
          return draft;
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
        const chord = stepNotes.map(({ note }) => note);
        const durations = stepNotes.map(({ duration }) => ({
          '16n': duration
        }));
        synthRef.current.triggerAttackRelease(chord, durations, time);
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
  const width = 64 + stepsLength * STEP_WIDTH;
  const height = NOTES.length * ROW_HEIGHT;
  const [loopPosition, notesState, toggleNote] = usePianoRoll({ stepsLength });

  const notes = Object.entries(notesState).reduce(
    (acc, [stepIndex, stepNotes]) => [
      ...acc,
      ...stepNotes.map(({ note, duration }) => ({
        noteIndex: NOTES.indexOf(note),
        stepIndex,
        duration
      }))
    ],
    []
  );

  return (
    <svg width={width} height={height}>
      <NotesLabels width={64} notes={NOTES} noteHeight={ROW_HEIGHT} />
      <Grid
        x={65}
        rows={NOTES.length}
        rowHeight={ROW_HEIGHT}
        columns={stepsLength}
        columnWidth={STEP_WIDTH}
        onCellClick={(row, column) => toggleNote(NOTES[row], column, 1)}
      >
        <rect
          width="2px"
          height="100%"
          x={loopPosition * (stepsLength * STEP_WIDTH)}
          y={0}
          fill="#FFFFFF"
        />
        <g>
          {notes.map(({ noteIndex, stepIndex, duration }) => (
            <ActiveNote
              key={`${noteIndex}${stepIndex}`}
              width={duration * STEP_WIDTH - 2}
              height={ROW_HEIGHT - 2}
              x={stepIndex * STEP_WIDTH + 1}
              y={noteIndex * ROW_HEIGHT + 1}
              onClick={() => toggleNote(NOTES[noteIndex], stepIndex)}
            />
          ))}
        </g>
      </Grid>
    </svg>
  );
}

export { PianoRoll };
