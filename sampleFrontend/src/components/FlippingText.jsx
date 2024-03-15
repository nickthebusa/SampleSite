import { useState, useEffect } from 'react';
import '../CSS/FlippingText.css';

function FlippingText({ words, count, setCount }) {

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordArray, setWordArray] = useState([]);

  const rotateText = () => {

    let currentWord = wordArray[currentWordIndex];
    let nextWord =
      currentWordIndex === wordArray.length - 1 ?
        wordArray[0] : wordArray[currentWordIndex + 1];

    currentWord.className = "word out";

    nextWord.style.opacity = "1";
    nextWord.className = "word behind";
    setTimeout(() => {
      nextWord.className = "word in";
      currentWord.style.opacity = '0';
    }, 120)

    setCurrentWordIndex(prev => prev === wordArray.length - 1 ? 0 : prev + 1);
  }

  function debounce(func, timeout = 300) {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this);
      }, timeout);
    };
  }

  const changeWord = debounce(() => {
    rotateText();

    // set parents count state back to 0
    setCount(0);
  });


  useEffect(() => {
    if (wordArray?.length <= 0) {
      setWordArray(document.querySelectorAll('.word'));
    }

    // run changeWord when the parent function updates count state
    if (count !== 0) {
      changeWord();
    }

  }, [wordArray, setWordArray, count, changeWord])


  if (wordArray?.length > 0) {
    wordArray[currentWordIndex].style.opacity = "1";
  }


  return (
    <div className="flipping-text-div" data-testid="flipping-text-div">
      {
        words?.length > 0 &&
        words.map((w, i) => (
          <span key={i} className='word'>{w}</span>
        ))
      }
    </div>
  )
}

export default FlippingText;
