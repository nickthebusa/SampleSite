import { useRef, useState } from "react";
import WaveForm from "./WaveForm";

function AudioVisualizer({ audio_file, id }) {

  const [analyzerData, setAnalyzerData] = useState(null);
  const audioElmRef = useRef(null);
  const [srcSet, setSrcSet] = useState(false);

  const audioAnalyzer = () => {

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 2048;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const source = audioCtx.createMediaElementSource(audioElmRef.current);
    source.connect(analyzer);
    source.connect(audioCtx.destination);
    source.onended = () => {
      source.disconnect();
    };
    setAnalyzerData({ analyzer, bufferLength, dataArray });

    setSrcSet(true);
  }


  const playAudio = () => {
    if (!srcSet) audioAnalyzer();
    if (!audioElmRef.current.paused) {
      audioElmRef.current.pause();
      audioElmRef.current.currentTime = 0;
    }
    audioElmRef.current.play();
  }
  const pauseAudio = () => {
    audioElmRef.current.pause();
  }

  return (
    <div className="audioVisualizer">

      {analyzerData && <WaveForm analyzerData={analyzerData} id={id} />}

      <button onClick={playAudio}>▶️</button>
      <button onClick={pauseAudio}>⏸️</button>
      <audio src={audio_file} crossOrigin="anonymous" ref={audioElmRef} />

    </div>
  );
}

export default AudioVisualizer;