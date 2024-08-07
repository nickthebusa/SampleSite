import { useCallback, useEffect, useRef, useState } from "react";
import WaveForm from "./WaveForm";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

function AudioVisualizer({ audio_file, id, selected }) {

  const [analyzerData, setAnalyzerData] = useState(null);
  const audioElmRef = useRef(null);
  const [srcSet, setSrcSet] = useState(false);

  const audioAnalyzer = useCallback(() => {

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 2048;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const source = audioCtx.createMediaElementSource(audioElmRef.current);
    const gain = audioCtx.createGain();
    source.connect(gain);
    gain.connect(analyzer);
    gain.connect(audioCtx.destination);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
    setAnalyzerData({ analyzer, bufferLength, dataArray });

    setSrcSet(true);
  }, [audioElmRef, setAnalyzerData, setSrcSet])

  const playAudio = useCallback((e = null) => {
    e && e.target.blur();

    // initialize audio context and source
    if (!srcSet) audioAnalyzer();

    // If already playing, stop and reset
    if (!audioElmRef.current.paused) {
      audioElmRef.current.pause();
      audioElmRef.current.currentTime = 0;
    }

    audioElmRef.current.play();

  }, [srcSet, audioAnalyzer, audioElmRef])


  const pauseAudio = useCallback((e = null) => {
    e && e.target.blur();
    audioElmRef.current.pause();
  }, [audioElmRef])


  useEffect(() => {
    if (selected.id === id) {
      if (selected.playing) {
        playAudio();
      }
      // else {
      //   pauseAudio();
      //   audioElmRef.current.currentTime = 0;
      // }
    }
  }, [selected, id, playAudio, pauseAudio])




  return (
    <div className="audioVisualizer">

      {analyzerData && <WaveForm analyzerData={analyzerData} id={id} />}

      <div className="audioVisualizer-btns">
        <button onClick={(e) => playAudio(e)}><FontAwesomeIcon icon={faPlay} /></button>
        <button onClick={(e) => pauseAudio(e)}><FontAwesomeIcon icon={faPause} /></button>
      </div>
      <audio src={audio_file} crossOrigin="anonymous" ref={audioElmRef} />

    </div>
  );
}

export default AudioVisualizer;
