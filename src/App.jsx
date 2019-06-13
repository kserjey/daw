import React from 'react';
import { createGlobalStyle } from 'styled-components/macro';
import { Header } from './components/Header';
import { BeatSequencer } from './components/BeatSequencer';
import { PianoRoll } from './components/PianoRoll';

const DRUM_KIT = [
  {
    name: 'Kick',
    source: `${process.env.PUBLIC_URL}/sounds/808-Kicks01.wav`
  },
  {
    name: 'HiHat',
    source: `${process.env.PUBLIC_URL}/sounds/808-HiHats03.wav`
  },
  {
    name: 'Snare',
    source: `${process.env.PUBLIC_URL}/sounds/808-Snare02.wav`
  }
];

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    font-family: 'Heebo', sans-serif;
  }
`;

function App() {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Header style={{ marginBottom: 16 }} />
      <BeatSequencer
        style={{ marginBottom: 16 }}
        drumKit={DRUM_KIT}
        stepsLength={16}
      />
      <PianoRoll />
    </React.Fragment>
  );
}

export default App;
