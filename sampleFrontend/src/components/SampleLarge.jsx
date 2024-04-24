
//import AudioVisualizer from "./AudioVisualizer";
//import { Link } from 'react-router-dom';
//
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faEllipsisVertical, faX } from '@fortawesome/free-solid-svg-icons';

function SampleLarge({
  key,
  sample,
  selected,
  setSelected,
  actionsMenu,
  setActionsMenu
}) {

  return (
    <div
      key={key}
      className={sampleState.selected.index ? "sample selected" : "sample"}
      id={`id${sample.id}`}
    >
      {(sampleState.delete || sampleState.unsave) && sampleActions.sample === sample.id &&
        <div className="overlay-sample-list"></div>}
    </div>
  )
}

export default SampleLarge;


// needed Props 
//
//Vars:
// sample and key (from map function)
// userLogged
// currentTags
//
//Funcs :
// deleteFile
// unsaveSample
// downloadFile
// saveSample
// toggleSampleActions
// selectDiv
// checkUncheckTag
//
//
// STATE FOR SAMPLE (SampleLarge) 
// 
//
// STATE FOR SAMPLELIST 
// selected - an object that tells you the id of selected sample,
//            index(order that it's in in list), and
//            if playing mode is on 
//
// actionsMenu - either an id of the sample that has the open actions Menu or null
//
//
//
