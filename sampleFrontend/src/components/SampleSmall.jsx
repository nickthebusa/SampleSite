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
      className={selected.id === sample.id ? "sample small selected" : "sample small"}
      id={`id${sample.id}`}
    >
      <p onClick={() => selectDiv(i, sample.id)}>{sample.title}</p>

      <AudioVisualizer
        audio_file={sample.audio_file}
        id={sample.id}
        selected={selected}
      />


    </div>
  )
}

export default SampleSmall;
