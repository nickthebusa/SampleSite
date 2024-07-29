import AudioVisualizer from "./AudioVisualizer";
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faX } from '@fortawesome/free-solid-svg-icons'


function SampleLarge({
  sample,
  selected,
  selectDiv,
  actionsMenu,
  setActionsMenu,
  deleteConfirm,
  setDeleteConfirm,
  unsaveConfirm,
  setUnsaveConfirm,
  userLogged,
  tags,
  currentTags,
  checkUncheckTag,
  downloadFile,
  deleteFile,
  saveSample,
  unsaveSample,
  i
}) {

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


  return (
    <div
      className={selected.id === sample.id ? "sample selected" : "sample"}
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
            <div onClick={() => setDeleteConfirm(true)} className="actions-delete">delete</div>
          }

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
        <div>
          <Link reloadDocument to={`/account/${sample.user}`}>
            {sample.username}
          </Link>
        </div>
      </div>

      <div className="sample-description-div">
        <p><strong>Description: </strong>{sample.description || 'no description'}</p>
      </div>

      <div className="sample-tags-div">
        <h6>tags:</h6>
        {tags?.length > 0 && sample.tags.length > 0 ? sample.tags.map(tag => (
          <div key={tag} className="sample-tag-div">
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
          <div>none</div>}
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
  )
}

export default SampleLarge;
