import { useState, useRef, useEffect } from 'react';
import '../CSS/DrumPad.css';
import MiniSampleList from './MiniSampleList';

import Nav from "./Nav"

import { useSamples } from "../hooks/useFetch";

function DrumPad({ userLogged }) {

  // drum pads state
  const [padSamples, setPadSamples] = useState(Array(8).fill(null));
  const [playing, setPlaying] = useState(Array(8).fill(false));

  // references for the audio element in each drum pad
  const audioRefs = useRef(Array(8).fill(null));
  // references for the div of each pad
  const padsRef = useRef(Array(8).fill(null));

  // useQuery
  const [samples] = useSamples();


  // for dragging and dropping events
  function handleDragOver(e) {
    e.preventDefault();
    console.log('drag-over', e.target);
  }

  function handleDragLeave(e) {
    console.log('drag-leave', e.target);
  }

  function handleDrop(e) {
    e.preventDefault();

    const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
    let padSamplesNew = [...padSamples];
    padSamplesNew[e.target.id] = draggedData;
    setPadSamples(padSamplesNew);
  }

  function playAudio(i) {
    if (audioRefs.current[i]?.src) {
      if (!audioRefs.current[i].paused) {
        audioRefs.current[i].pause();
        audioRefs.current[i].currentTime = 0;
      }
      audioRefs.current[i].play();
      playHitAnimation(i, padsRef.current[i]);
    }
  }

  function playHitAnimation(i, curPad) {
    curPad.classList.add('press');
    setTimeout(() => {
      // update state for if audio is playing after removing press class
      setPlaying(prev => {
        const newPlaying = [...prev];
        newPlaying[i] = true;
        return newPlaying;
      })
      curPad.classList.remove('press');

    }, 100)
  }

  useEffect(() => {

    function playKeys(e) {
      e.preventDefault();
      const playableKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
      const key = e.key.toLowerCase()
      if (playableKeys.includes(key)) {
        const index = playableKeys.indexOf(key);
        playAudio(index);
      }
    }

    window.addEventListener('keydown', playKeys);

    function handleAudioEnd(i) {
      setPlaying(prev => {
        const newPlaying = [...prev];
        newPlaying[i] = false;
        return newPlaying;
      })
    }

    const myAudioElements = audioRefs.current;

    myAudioElements.forEach((ref, i) => {
      if (ref) {
        ref.addEventListener('ended', () => handleAudioEnd(i));
      }
    })

    return () => {
      window.removeEventListener('keydown', playKeys);
      myAudioElements.forEach((ref) => {
        if (ref) {
          ref.removeEventListener('ended', handleAudioEnd);
        }
      })
    };
  })



  return (
    <div className="DrumPad">
      <Nav userLogged={userLogged} />
      
      <h2>DrumPad</h2>

      <div className="list-and-pads">

        <MiniSampleList samples={samples} />

        <div className='DrumPad-pads-div'>
          {padSamples?.map((pad, i) => (
            <div
              ref={el => padsRef.current[i] = el}
              key={i}
              id={i}
              className={`pad ${playing[i] ? 'playing' : ''}`}
              onClick={() => playAudio(i)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
            {pad ? pad.title : 'none'}
            <audio ref={el => audioRefs.current[i] = el} src={pad?.audio_file} crossOrigin="anonymous" />
            </div>
          ))
          }
        </div>
      </div>

    </div>
  )
}

export default DrumPad