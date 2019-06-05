import React, { useState, useEffect } from 'react';
import Tone from 'tone';
import { BeatSequencer } from './components/BeatSequencer';

function useBPM(initialValue = 128) {
  const [bpm, setBPM] = useState(initialValue);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  return [bpm, setBPM];
}

const DRUM_KIT = [
  { name: 'Kick', source: `${process.env.PUBLIC_URL}/sounds/808-Kicks01.wav` },
  {
    name: 'HiHat',
    source: `${process.env.PUBLIC_URL}/sounds/808-HiHats03.wav`
  },
  { name: 'Snare', source: `${process.env.PUBLIC_URL}/sounds/808-Snare02.wav` }
];

function App() {
  const [bpm, setBPM] = useBPM();
  return (
    <React.Fragment>
      <input
        type="number"
        value={bpm}
        onChange={({ target }) => setBPM(parseInt(target.value))}
      />
      <BeatSequencer drumKit={DRUM_KIT} stepsLength={16} />
    </React.Fragment>
  );
}

export default App;
