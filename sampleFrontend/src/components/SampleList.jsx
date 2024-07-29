import { useState, useEffect, useRef, useCallback } from "react";
import SampleLarge from "./SampleLarge";
import SampleSmall from "./SampleSmall";
import APIService from "../fetching/APIService";
import '../CSS/SampleList.css';


function SampleList({
  samples,
  tags,
  currentTags,
  setCurrentTags,
  userLogged,
  loggedUserRefetch,
  refetchSamples,
  refetchSaved,
  miniList,
}) {

  const [selected, setSelected] = useState({});
  const selectedRef = useRef(selected);

  const [actionsMenu, setActionsMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [unsaveConfirm, setUnsaveConfirm] = useState(false);

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
    if (sample_id === selected.id) {
      setSelected({});
    } else {
      setSelected({ playing: false, id: sample_id, index: i });
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

      {miniList ?
        (
          <div className="sampleList minimal">
            {samples.length > 0 && samples.map((sample, i) => (
              <SampleSmall
                key={sample.id}
                sample={sample}
                selected={selected}
                selectDiv={selectDiv}
                actionsMenu={actionsMenu}
                setActionsMenu={setActionsMenu}
                deleteConfirm={deleteConfirm}
                setDeleteConfirm={setDeleteConfirm}
                unsaveConfirm={unsaveConfirm}
                setUnsaveConfirm={setUnsaveConfirm}
                userLogged={userLogged}
                i={i}
              />
            ))}
          </div>
        )
        :
        (
          <div className="sampleList">
            {samples.length > 0 && samples.map((sample, i) => (
              <SampleLarge
                key={sample.id}
                sample={sample}
                selected={selected}
                selectDiv={selectDiv}
                actionsMenu={actionsMenu}
                setActionsMenu={setActionsMenu}
                deleteConfirm={deleteConfirm}
                setDeleteConfirm={setDeleteConfirm}
                unsaveConfirm={unsaveConfirm}
                setUnsaveConfirm={setUnsaveConfirm}
                userLogged={userLogged}
                tags={tags}
                currentTags={currentTags}
                checkUncheckTag={checkUncheckTag}
                downloadFile={downloadFile}
                deleteFile={deleteFile}
                saveSample={saveSample}
                unsaveSample={unsaveSample}
                i={i}
              />
            ))}
          </div>
        )
      }

    </div >
  )
}

export default SampleList;
