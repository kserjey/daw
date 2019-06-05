import React from 'react';
import { BeatSequencer } from './components/BeatSequencer';

function App() {
  return (
    <React.Fragment>
      <input type="file" onChange={event => console.log(event.target.files)} />
      <BeatSequencer drumKit={['Kick', 'HiHat', 'Snare']} />
    </React.Fragment>
  );
}

export default App;
