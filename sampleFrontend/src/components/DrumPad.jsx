import { useState, useRef, useEffect, useCallback } from 'react';
import '../CSS/DrumPad.css';
import MiniSampleList from './MiniSampleList';

import Nav from "./Nav"

import { useSamples } from "../hooks/useFetch";


// NOTES: TODO
// - check if pad is playing then pause then play to avoid clipping sound
// - add a gain node to each pad to control each pad's sample volume.

// !!!!!!!
// - when assigning to pad (dragging or using assign mode)
// the audio doesn't correspond to the pad it was assigned to, it just adds to an array from 0 to 8

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

  // --------- Web Audio Api ------------------
  const [masterGain, setMasterGain] = useState(0.8);
  const [audioSources, setAudioSources] = useState(Array(8).fill(null));
  const [masterAudioContext, setMasterAudioContext] = useState(null);
  const [masterGainNode, setMasterGainNode] = useState(null);

  function handleMasterGainChange(e) {
    setMasterGain(parseFloat(e.target.value))
  }

  const loadAudioFiles = useCallback(async () => {
    const audioBuffers = Array(8).fill(null);
    let c = 0;
    for (let i of audioRefs.current) {
      if (i && i.src) {
        const res = await fetch(i.src);
        const arrayBuf = await res.arrayBuffer();
        const audioBuf = await masterAudioContext.decodeAudioData(arrayBuf);
        audioBuffers[c] = audioBuf;
      }
      c++;
    }
    return audioBuffers;
  }, [masterAudioContext])

  function setAudioContext() {
    const masterAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGainN = masterAudioCtx.createGain();
    masterGainN.connect(masterAudioCtx.destination);
    setMasterAudioContext(masterAudioCtx);
    setMasterGainNode(masterGainN);
  }

  const updateAudioCtx = useCallback(async () => {
    const audioBuffers = await loadAudioFiles();
    setAudioSources(audioBuffers);
  }, [loadAudioFiles])

  const playAudio = useCallback((i) => {
    // add play audio functionality
    if (audioSources[i]) {
      const source = masterAudioContext.createBufferSource();
      source.buffer = audioSources[i];
      source.connect(masterGainNode);
      source.start();

      playHitAnimation(i);
    }
  }, [audioSources, masterAudioContext, masterGainNode])

  // --------------------------------------------

  // for dragging and dropping events
  function handleDragOver(e) {
    e.preventDefault();
    e.target.classList.add("selected");
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.target.classList.remove("selected");
  }

  function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove("selected");
    const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
    let padSamplesNew = [...padSamples];
    padSamplesNew[e.target.id] = draggedData;
    setPadSamples(padSamplesNew);
  }

  const handlePadClick = useCallback((i) => {
    if (assignSamples) {
      setSelectedPad(i);
    }
    playAudio(i);
  }, [assignSamples, playAudio])

  function playHitAnimation(i) {
    const curPad = padsRef.current[i];
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

  // Conditionally creates or updates the audioContext
  useEffect(() => {

    if (!masterAudioContext) {
      setAudioContext();
    }
    else {
      updateAudioCtx();
    }

  }, [padSamples, masterAudioContext, updateAudioCtx])


  // updates state for assigning samples to pads
  useEffect(() => {
    if (assignSamples) {
      if (selectedPad !== null && selectedItem) {
        const tmp = [...padSamples];
        tmp[selectedPad] = selectedItem;
        setPadSamples(tmp);
        setSelectedItem(null);
      }
    } else {
      setSelectedPad(null);
      setSelectedItem(null);
    }
  }, [assignSamples, selectedPad, selectedItem, padSamples])


  // event listeners for playing pads with keys
  useEffect(() => {

    // ---------play pads with keys-------------
    function playKeys(e) {
      e.preventDefault();
      const playableKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
      const key = e.key.toLowerCase()
      if (playableKeys.includes(key)) {
        const index = playableKeys.indexOf(key);
        handlePadClick(index);
      }
    }
    window.addEventListener('keydown', playKeys);

    // -------changes playing state for pads that have finished playing
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

    // --------- update master gain -------------
    if (masterGainNode) {
      masterGainNode.gain.value = masterGain;
    }

    return () => {
      window.removeEventListener('keydown', playKeys);

      myAudioElements.forEach((ref) => {
        if (ref) {
          ref.removeEventListener('ended', handleAudioEnd);
        }
      })
    };

  }, [masterGain, audioSources, masterGainNode, handlePadClick])


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
