import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faX } from '@fortawesome/free-solid-svg-icons'
import '../CSS/SampleSmall.css';
import AudioVisualizer from './AudioVisualizer';

function SampleSmall({
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
      <p onClick={() => selectDiv(i, sample.id)}>{sample.title}</p>

      <div className="sample-actions-small">

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

      <AudioVisualizer
        audio_file={sample.audio_file}
        id={sample.id}
        selected={selected}
      />


    </div>
  )
}

export default SampleSmall;
