import { useState, useEffect, useRef, useCallback } from "react";
import AudioVisualizer from "./AudioVisualizer";
import {Link} from 'react-router-dom';

function SampleList(props) {

  let [selected, setSelected] = useState({});
  const [, setPlaying] = useState(false);
  const selectedRef = useRef(selected);


  const playPause = useCallback(() => {  
    if (selected.id) {
      setSelected({ ...selected, playing: true })
      setPlaying(true);
    }

  }, [selected, setPlaying])

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {

    function handleKeyPress(event) {

      if (event.key === 'ArrowUp') {
        
        if (selectedRef.current && selectedRef.current.index !== 0) {
          const new_id = props.samples[selectedRef.current.index -1].id
          setSelected({
            ...selectedRef.current,
            index: selectedRef.current.index -= 1,
            id: new_id
          });
        }
      } else if (event.key === 'ArrowDown') {

        if (selectedRef.current.index >= 0 &&
          selectedRef.current.index < props.samples.length - 1) {
          const new_id = props.samples[selectedRef.current.index +1].id
          setSelected({
            ...selectedRef.current,
            index: selectedRef.current.index += 1,
            id: new_id
          });
        }
      }

      if (event.key === " ") {
        playPause()
        setPlaying(true)
      }
    }
    window.addEventListener('keydown', handleKeyPress);

    function handleWindowPress(event) {
      const sampleList = document.querySelector('.sampleList');
      if (!(sampleList.contains(event.target)) && !(sampleList === event.target)) {
        setSelected({})
      }
    }

    window.addEventListener('click', handleWindowPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleWindowPress);
    };
  }, [props, playPause]);


  function selectDiv(i, sample_id) {
    if (i === selected.index) {
      setSelected({});
    } else {
      setSelected({ playing: false, id: sample_id, index: i});
    }
  }

  return (
    <div className="sampleList">
      {props.samples.map((sample, i) => (
        <div key={i}
          className={selected.index === i ? "sample selected" : "sample"}
          id={`id${sample.id}`}
        >
          <div className="sample-title-section">
            <div className="sample-img-wrapper">
              <img src={sample.image} alt="sample-image" />
            </div>

            <span className="sample-name" onClick={() => selectDiv(i, sample.id)}>{sample.title}</span>
            {props.users.length > 0 && 
            <Link to={`/account/${sample.user}`}>{props.users.find(n => n.id === sample.user).username}</Link> 
            }
          </div>
          
          <div className="sample-description-div">
            <p><strong>Description: </strong>{sample.description || 'no description'}</p>
          </div>

          <div className="tags-div">
            <h6>tags:</h6>
            {props.tags.length > 0 ? sample.tags.map((tagID, i) => (
              <div key={i} className="tag-div">
                {props.tags.find(tag => tag.id === tagID).name}
              </div>
            )) : 
            <div>No tags...</div>}
          </div>

          <AudioVisualizer
            audio_file={sample.audio_file}
            id={sample.id}
            selected={selected}
            setPlaying={setPlaying}
          />

        </div>
      ))}

    </div>
  )
}

export default SampleList;