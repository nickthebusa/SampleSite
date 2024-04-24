import { useState, useEffect, useRef, useCallback } from "react";
import AudioVisualizer from "./AudioVisualizer";
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faX } from '@fortawesome/free-solid-svg-icons'
import APIService from "../fetching/APIService";

import '../CSS/SampleList.css';


function SampleList({
  samples,
  tags,
  users,
  currentTags,
  setCurrentTags,
  userLogged,
  loggedUserRefetch,
  refetchSamples,
  refetchSaved
}) {

  const [selected, setSelected] = useState({});

  const [actionsMenu, setActionsMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [unsaveConfirm, setUnsaveConfirm] = useState(false);

  const selectedRef = useRef(selected);

  function checkUncheckTag(id) {
    if (!currentTags.includes(id)) {
      setCurrentTags([...currentTags, id])
    } else {
      const newTags = currentTags.filter(t => t !== id)
      setCurrentTags(newTags);
    }
  }

  const playPause = useCallback(() => {
    if (selected.id) {
      setSelected({ ...selected, playing: true })
    }
  }, [selected])

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const selectedDiv = document.querySelector('.sample.selected');
    if (selectedDiv) {
      selectedDiv.scrollIntoView({
        behavior: "instant",
        block: 'center'
      })
    }
    // for selecting and playing samples with space and up and down arrow keys
    function handleKeyPress(event) {
      if (selected.id) {

        if (event.key === 'ArrowUp') {
          event.preventDefault();

          if (selectedRef.current && selectedRef.current.index !== 0) {
            const new_id = samples[selectedRef.current.index - 1].id
            setSelected({
              ...selectedRef.current,
              index: selectedRef.current.index -= 1,
              id: new_id
            });
          } else {
            playPause();
          }
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();

          if (selectedRef.current.index >= 0 &&
            selectedRef.current.index < samples.length - 1) {
            const new_id = samples[selectedRef.current.index + 1].id
            setSelected({
              ...selectedRef.current,
              index: selectedRef.current.index += 1,
              id: new_id
            });
          } else {
            playPause();
          }
        }

        if (event.key === " ") {
          event.preventDefault();
          playPause()
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress);


    function handleWindowPress(event) {

      // for de-selecting sample when clicking off of it
      const sampleList = document.querySelector('.sampleList');
      if (!(sampleList.contains(event.target)) && !(sampleList === event.target)) {
        setSelected({})

        // for hiding confirmation screens when clicking off of sample list
        if (deleteConfirm) setDeleteConfirm(false);

        if (unsaveConfirm) setUnsaveConfirm(false);
      }

    }

    window.addEventListener('click', handleWindowPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleWindowPress);
    };
  }, [samples, playPause, selected, deleteConfirm, unsaveConfirm]);


  function selectDiv(i, sample_id) {
    if (i === selected.index) {
      setSelected({});
    } else {
      setSelected({ playing: false, id: sample_id, index: i });
    }
  }

  function toggleSampleActions(sample_id) {

    if (actionsMenu === null) {
      setUnsaveConfirm(false);
      setDeleteConfirm(false)
    }

    if (actionsMenu !== null & !sample_id) {
      setActionsMenu(null)
    } else {
      setActionsMenu(sample_id)
    }
  }

  function downloadFile(sample) {

    APIService.DownloadFile(sample.id, sample.title)
      .then(res => console.log(res))
      .catch(err => console.log(err))

  }

  function deleteFile(sample) {
    APIService.DeleteFile(sample.id)
      .then((res) => {
        console.log(res);
        loggedUserRefetch();
        refetchSamples();
        if (refetchSaved) refetchSaved();
        setDeleteConfirm(false);
      })
      .catch(err => console.log(err))
  }

  function saveSample(sample) {
    if (!userLogged?.saved_samples.includes(sample.id)) {
      APIService.AddToSavedSample(userLogged?.user, { sample_id: sample.id })
        .then(res => {
          console.log(res);
          loggedUserRefetch();
          if (refetchSaved) refetchSaved();
        })
        .catch(err => console.log(err))
    }
  }

  function unsaveSample(sample) {
    if (userLogged?.saved_samples.includes(sample.id)) {
      APIService.RemoveSavedSample(userLogged?.user, { sample_id: sample.id })
        .then(res => {
          console.log(res);
          loggedUserRefetch();
          if (refetchSaved) refetchSaved();
          setUnsaveConfirm(false);
        })
        .catch(err => console.log(err))
    }
  }


  return (
    <div className="sampleList-wrapper">
      <div className="sampleList">

        {samples.map((sample, i) => (
          <div key={i}
            className={selected.index === i ? "sample selected" : "sample"}
            id={`id${sample.id}`}
          >

            {(deleteConfirm || unsaveConfirm) && actionsMenu === sample.id &&
              <div className="overlay-sample-list"></div>}

            {userLogged?.user === sample.user && deleteConfirm &&
              actionsMenu === sample.id &&
              <div className="confirm-delete-window">
                Confirm delete?
                <div>
                  <button onClick={() => deleteFile(sample)}>Confirm</button>
                  <button onClick={() => setDeleteConfirm(false)}>Cancel</button>
                </div>
              </div>}


            {userLogged && unsaveConfirm && actionsMenu === sample.id &&
              <div className="confirm-unsave-window">
                Remove from saved samples?
                <div>
                  <button onClick={() => unsaveSample(sample)}>Confirm</button>
                  <button onClick={() => setUnsaveConfirm(false)}>Cancel</button>
                </div>
              </div>
            }


            <div className={'sample-actions-div'}>

              <div className={`actions ${actionsMenu === sample.id ? "open" : "closed"}`}>
                <div onClick={() => downloadFile(sample)}>download</div>

                {userLogged && userLogged?.saved_samples.includes(sample.id) &&
                  <div onClick={() => setUnsaveConfirm(true)}>saved</div>
                }

                {userLogged && !(userLogged?.saved_samples.includes(sample.id)) &&
                  <div onClick={() => saveSample(sample)}>save</div>
                }

                {userLogged?.user === sample.user &&
                  <div onClick={() => setDeleteConfirm(true)} className="actions-delete">delete</div>}

              </div>

              <div className={`open-close-div 
                      ${actionsMenu === sample.id ? 'rotate-in' : 'rotate-out'}`}>
                {actionsMenu === sample.id ?
                  <FontAwesomeIcon
                    icon={faX}
                    onClick={toggleSampleActions}
                    className="open-close"
                  /> :
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    onClick={() => toggleSampleActions(sample.id)}
                    className="open-close"
                  />
                }
              </div>
            </div>


            <div className="sample-title-section">
              <div className="sample-img-wrapper">
                <img src={sample.image} alt="sample-image" />
              </div>

              <span className="sample-name" onClick={() => selectDiv(i, sample.id)}>{sample.title}</span>
              {users &&
                <div>
                  <Link reloadDocument to={`/account/${sample.user}`}>
                    {sample.username}
                  </Link>
                </div>
              }
            </div>

            <div className="sample-description-div">
              <p><strong>Description: </strong>{sample.description || 'no description'}</p>
            </div>

            <div className="sample-tags-div">
              <h6>tags:</h6>
              {tags && tags.length > 0 ? sample.tags.map((tag, i) => (
                <div key={i} className="sample-tag-div">
                  <label htmlFor={`tag-${tag}`}>
                    <input
                      id={`tag-${tag}`}
                      type='checkbox'
                      onChange={() => checkUncheckTag(tag)}
                      hidden
                      checked={currentTags?.includes(tag)}
                    ></input>
                    <div className="Filter-tag-checkbox-btn">
                      {tags.find(t => t.id === tag).name}
                    </div>
                  </label>
                </div>
              )) :
                <div>No tags...</div>}
            </div>


            <AudioVisualizer
              audio_file={sample.audio_file}
              id={sample.id}
              selected={selected}
            />

            <div className="sample-date-div">
              <p><strong>Created: </strong>{sample.date}</p>
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default SampleList;
