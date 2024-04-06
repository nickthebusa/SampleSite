import { useState, useRef, useEffect, useCallback } from 'react';
import '../CSS/DrumPad.css';
import MiniSampleList from './MiniSampleList';

import Nav from "./Nav"

import { useSamples } from "../hooks/useFetch";

function DrumPad({ userLogged, loggedUserRefetch }) {

  // drum pads state
  const [padSamples, setPadSamples] = useState(Array(8).fill(null));
  const [playing, setPlaying] = useState(Array(8).fill(false));

  // references for the audio element in each drum pad
  const audioRefs = useRef(Array(8).fill(null));
  // references for the div of each pad
  const padsRef = useRef(Array(8).fill(null));

  // assign pads
  const [assignSamples, setAssignSamples] = useState(false);
  const [selectedPad, setSelectedPad] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // useQuery
  const [samples] = useSamples();

  // web audio api
  const [masterGain, setMasterGain] = useState(0.8);

  function handleMasterGainChange(e) {
    setMasterGain(parseFloat(e.target.value))
  }


  // initialize audioContext for drum pads
  //  const initAudio = useCallback(() => {
  //
  //    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  //
  //    const source = audioCtx.createMediaElementSource(audioElmRef.current);
  //    source.connect(audioCtx.destination);
  //    source.onended = () => {
  //      source.disconnect();
  //    };
  //
  //  }, [audioRefs])


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

  function handlePadClick(i) {
    if (assignSamples) {
      setSelectedPad(i);
    }
    playAudio(i);
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


    // Audio Stuff
    const masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGainNode = masterAudioCtx.createGain();
    masterGainNode.connect(masterAudioCtx.destination);



    return () => {
      window.removeEventListener('keydown', playKeys);
      myAudioElements.forEach((ref) => {
        if (ref) {
          ref.removeEventListener('ended', handleAudioEnd);
        }
      })
      masterGainNode.disconnect();
      masterAudioCtx.close();
    };
  }, [masterGain])

  useEffect(() => {
    if (assignSamples) {
      if (selectedPad !== null && selectedItem) {
        const tmp = [...padSamples];
        tmp[selectedPad] = selectedItem;
        setPadSamples(tmp);
        setSelectedItem(null);
      }
    }
  }, [assignSamples, selectedPad, selectedItem])

  console.log(selectedPad, selectedItem)

  return (
    <div className="DrumPad">
      <Nav userLogged={userLogged} loggedUserRefetch={loggedUserRefetch} />

      <h2>DrumPad</h2>


      <div className="list-and-pads">

        <MiniSampleList
          samples={samples}
          userLogged={userLogged}
          assignSamples={assignSamples}
          setAssignSamples={setAssignSamples}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />

        <div className='DrumPad-pads-div'>
          {padSamples?.map((pad, i) => (
            <div
              ref={el => padsRef.current[i] = el}
              key={i}
              id={i}
              className={`pad ${playing[i] ? 'playing' : ''}
                          ${assignSamples ? 'assignmode' : ''}
                          ${selectedPad === i ? 'selected' : ''}`}
              onClick={() => handlePadClick(i)}
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

      <div className='master-volume-div'>
        <label htmlFor="masterVolume">Master Volume: </label>
        <input
          id="masterVolume"
          className="master-volume"
          type="range"
          min="0.0" max="1.0"
          step="0.01"
          list="volumes"
          name="volume"
          value={masterGain}
          onChange={handleMasterGainChange}
        />
      </div>

    </div >
  )
}

export default DrumPad
