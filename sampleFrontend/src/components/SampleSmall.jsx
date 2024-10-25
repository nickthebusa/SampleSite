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
      <div className="left-side">
        <AudioVisualizer
          audio_file={sample.audio_file}
          id={sample.id}
          selected={selected}
        />
        <p onClick={() => selectDiv(i, sample.id)} title={sample.title}>{sample.title}</p>
      </div>
      <div className="right-side">
        <Link reloadDocument to={`/account/${sample.user}`}>
          {sample.username}
        </Link>
      </div>
    </div>
  )
}

export default SampleSmall;
