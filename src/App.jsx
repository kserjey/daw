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

function App() {
  const [bpm, setBPM] = useBPM();
  return (
    <React.Fragment>
      <input
        type="number"
        value={bpm}
        onChange={({ target }) => setBPM(parseInt(target.value))}
      />
      <BeatSequencer drumKit={['Kick', 'HiHat', 'Snare']} />
    </React.Fragment>
  );
}

export default App;
