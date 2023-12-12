import AudioVisualizer from "./AudioVisualizer";
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom';

function SampleList(props) {

  let navigate = useNavigate();

  return (
    <div className="sampleList">
      {props.samples.map((sample, i) => (
        <div key={i} className="sample" id={`id${sample.id}`}>
          <div className="sample-title-section">
            <div className="sample-img-wrapper">
              <img src={sample.image} alt="sample-image" />
            </div>
            <h5>{sample.title}</h5>
            {props.users.length > 0 && 
            <Link to={`/account/${sample.user}`}>{props.users.find(n => n.id === sample.user).username}</Link> 
            }
          </div>
          
          <div className="sample-description-div">
            <p><strong>Descripton: </strong>{sample.description || 'no description'}</p>
          </div>

          <div className="tags-div">
            <h6>tags:</h6>
            {props.tags.length > 0 ? sample.tags.map((tagID, i) => (
              <div key={i} className="tag-div">
                {props.tags.find(tag => tag.id === tagID).name}
              </div>
            )) : 
            <div>No tags..</div>}
          </div>

          <AudioVisualizer audio_file={sample.audio_file} id={sample.id} />

        </div>
      ))}

    </div>
  )
}

export default SampleList;