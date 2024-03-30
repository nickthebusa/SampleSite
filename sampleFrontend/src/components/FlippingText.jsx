import { useState, useEffect } from 'react';
import '../CSS/FlippingText.css';

function FlippingText({ words, searchMode }) {


  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordArray, setWordArray] = useState([]);

  const rotateText = () => {

    let currentWord = wordArray[currentWordIndex];
    let nextWord =
      currentWordIndex === wordArray.length - 1 ?
        wordArray[0] : wordArray[currentWordIndex + 1];

    for (let i of wordArray) {
      if (i !== nextWord) {
        i.className = "word out";
      }
    }

    nextWord.className = "word behind";
    nextWord.style.opacity = 1;
    setTimeout(() => {
      nextWord.className = "word in";
      currentWord.style.opacity = 0;
    }, 120)

    setCurrentWordIndex(prev => prev === wordArray.length - 1 ? 0 : prev + 1);
  }


  useEffect(() => {

    if (wordArray?.length <= 0) {
      setWordArray(document.querySelectorAll('.word'));
    } else {
      if (wordArray[currentWordIndex].id !== searchMode) {
        rotateText();
      }
    }

  }, [wordArray, setWordArray, searchMode])


  if (wordArray?.length > 0) {
    wordArray[currentWordIndex].style.opacity = "1";
  }


  return (
    <div className="flipping-text-div" data-testid="flipping-text-div">
      {
        words?.length > 0 &&
        words.map((w, i) => (
          <span key={i} id={w} className='word'>{w}</span>
        ))
      }
    </div>
  )
}

export default FlippingText;
