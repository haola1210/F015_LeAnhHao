import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import 'reactjs-popup/dist/index.css';
import MainIcon from './components/icons/MainIcon';
import SwapForm from './components/swap-form';
import Popup from 'reactjs-popup';

function App() {

  const [shouldOpen, setShouldOpen] = useState(true);



  useEffect(() => {
    if(shouldOpen) {
      const id = setTimeout(() => {
        setShouldOpen(p => false)
        clearTimeout(id)
      }, 2000)
    }

    if(!shouldOpen) {
      const id = setTimeout(() => {
        setShouldOpen(p => true);
        clearTimeout(id)
      }, 10000)
    }
  }, [shouldOpen])

  const ref = useRef<null | HTMLAudioElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.volume = 0.1;
      ref.current.addEventListener('ended', () => {
        if (ref.current) {
          ref.current.currentTime = 0; 
          ref.current.play();
        }
      });
    }
  }, [])

  const playMusic = () => {
    if(ref.current?.paused) {
      ref.current?.play()
    } else {
      ref.current?.pause()
    }
  }

  return (
    <div className="App">
      <header className='header'>
       
        <span className='header__logo' onClick={playMusic}>
          <MainIcon />
          <Popup 
            open={shouldOpen}
            trigger={<div className='fake-trigger'></div>}
          >
            <div className='logo-tooltip'>You can click this logo to play theme sound</div>
          </Popup>
        </span>
        <span className="header__title">Akatsukoin</span>
      </header>
      <div style={{ marginTop: 100 }}>
      <SwapForm />
      </div>
      <audio autoPlay ref={ref}>
        <source src="naruto-main-theme.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
