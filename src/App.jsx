import React from 'react';
import styled, { createGlobalStyle } from 'styled-components/macro';
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

const Container = styled.div`
  padding: 32px;
`;

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    font-family: 'Heebo', sans-serif;
    background-color: #666666;
  }
`;

function App() {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Header />
      <Container>
        <BeatSequencer
          style={{ marginBottom: 32 }}
          drumKit={DRUM_KIT}
          stepsLength={16}
        />
        <PianoRoll />
      </Container>
    </React.Fragment>
  );
}

export default App;
