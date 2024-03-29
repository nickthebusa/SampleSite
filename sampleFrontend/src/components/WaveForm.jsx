import { useRef, useEffect } from "react";
import useSize from "../hooks/useSize";

function animateBars(analyser, canvas, canvasCtx, dataArray, bufferLength) {
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = "#000";

  var barWidth = Math.ceil(canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  for (var i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] / 255) * canvas.height;

    // // generate a shade of blue based on the audio input
    // const blueShade = Math.floor((dataArray[i] / 255) * 5); 
    // // waveform colors
    // const blueHex = ["#61dafb", "#5ac8fa", "#50b6f5", "#419de6", "#20232a"][
    //   blueShade
    // ]; 
    // canvasCtx.fillStyle = blueHex;

    
    // generate a shade of purple
    const purpleShade = Math.floor((dataArray[i] / 255) * 5);
    const purpleHex = ["#5d0be0", "#792cf5", "#8943fa", "#9f64ff", "#20232a"][
      purpleShade
    ]
    canvasCtx.fillStyle = purpleHex;

    canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
 
    x += barWidth + 1;
  }
}

const WaveForm = ({ analyzerData, id }) => {

  const canvasRef = useRef(null);
  const { dataArray, analyzer, bufferLength } = analyzerData;
  const [width, height] = useSize(id);

  const draw = (dataArray, analyzer, bufferLength) => {
    const canvas = canvasRef.current;
    if (!canvas || !analyzer) return;
    const canvasCtx = canvas.getContext("2d");

    const animate = () => {
      requestAnimationFrame(animate);

      // eslint-disable-next-line no-self-assign
      canvas.width = canvas.width;
      // canvasCtx.translate(0, canvas.offsetHeight / 2 - 115);
      animateBars(analyzer, canvas, canvasCtx, dataArray, bufferLength);
    };

    animate();
  };

  useEffect(() => {
    draw(dataArray, analyzer, bufferLength);
  }, [dataArray, analyzer, bufferLength]);


  return (
      <canvas
        className="waveform"
        ref={canvasRef}
        width={width}
        height={height}
        />
  );
};

export default WaveForm;