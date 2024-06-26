import { useState, useRef, useEffect } from 'react';
import "../CSS/MiniSampleList.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'


function MiniSampleList({
  samples,
  userLogged,
  assignSamples,
  setAssignSamples,
  selectedItem,
  setSelectedItem }) {

  const [currentSamples, setCurrentSamples] = useState(samples);

  const [playing, setPlaying] = useState(Array(8).fill(false));

  const audioRefs = useRef(Array(8).fill(null));

  const [savedSamples, setSavedSamples] = useState(false);

  function handleDragStart(e, sample) {
    e.dataTransfer.setData('text/plain', JSON.stringify(sample));
  }

  function playAudio(i) {
    if (audioRefs.current[i] !== null) {
      if (!audioRefs.current[i].paused) {
        audioRefs.current[i].pause();
        audioRefs.current[i].currentTime = 0;
      }
      audioRefs.current[i].play();

      // update state for if audio is playing
      setPlaying(prev => {
        const newPlaying = [...prev];
        newPlaying[i] = true;
        return newPlaying;
      })
    }
  }

  function pauseAudio(i) {
    if (audioRefs.current[i] !== null) {
      audioRefs.current[i].pause();
      audioRefs.current[i].currentTime = 0;
      // update state for if audio is playing
      setPlaying(prev => {
        const newPlaying = [...prev];
        newPlaying[i] = false;
        return newPlaying;
      })
    }
  }

  function handleItemClick(sample) {
    if (assignSamples) {
      setSelectedItem(sample);
    }
  }


  useEffect(() => {

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
      myAudioElements.forEach((ref) => {
        if (ref) {
          ref.removeEventListener('ended', handleAudioEnd);
        }
      })
    }
  })

  useEffect(() => {

    if (savedSamples && userLogged) {
      setCurrentSamples(samples.filter(s => userLogged.saved_samples.includes(s.id)))
    } else {
      setCurrentSamples(samples);
    }

  }, [samples, assignSamples, savedSamples])

  return (
    <div className="MiniSampleList">

      <h4>Samples</h4>

      <div className='switches'>
        <div className='switch-div'>
          <label className="switch">
            <input type="checkbox" checked={assignSamples} onChange={() => setAssignSamples(!assignSamples)} />
            <span className="slider round"></span>
          </label>
          <p>assign samples</p>
        </div>
        {userLogged &&
          <div className='switch-div'>
            <label className="switch">
              <input type="checkbox" checked={savedSamples} onChange={() => setSavedSamples(!savedSamples)} />
              <span className="slider round"></span>
            </label>
            <p>use saved</p>
          </div>
        }
      </div>

      <div className="div-list">

        <ul>
          {currentSamples?.map((sample, i) => (
            <li
              className={`${selectedItem === sample ? "selected-item" : ""}`}
              onClick={() => handleItemClick(sample)} key={i}>
              <div className='playPause-icon-div'>
                {playing[i] ?
                  <FontAwesomeIcon icon={faPause} onClick={() => pauseAudio(i)} /> :
                  <FontAwesomeIcon icon={faPlay} onClick={() => playAudio(i)} />
                }
              </div>
              <p draggable onDragStart={(e) => handleDragStart(e, sample)}>{sample.title}</p>
              <audio ref={el => audioRefs.current[i] = el} src={sample?.audio_file} crossOrigin="anonymous" />
            </li>
          ))}
        </ul>

      </div>
    </div >
  )
}

export default MiniSampleList
