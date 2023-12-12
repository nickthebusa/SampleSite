import AudioVisualizer from "./AudioVisualizer";


function SampleList(props) {

  return (
    <div className="sampleList">
      {props.samples.map((sample, i) => (
        <div key={i} className="sample" id={`id${sample.id}`}>
          <div className="sample-title-section">
            <img src={sample.image} alt="sample-image" />
            <h5>{sample.title}</h5>
            <a href="">{props.users.find(n => n.id === sample.user).username}</a>
          </div>
          

          <div className="tags-div">
            <h6>tags:</h6>
            {sample.tags.map((tagID, i) => (
              <div key={i} className="tag-div">
                {props.tags.find(tag => tag.id === tagID).name}
              </div>
            ))}
          </div>

          <AudioVisualizer audio_file={sample.audio_file} id={sample.id} />

        </div>
      ))}

    </div>
  )
}

export default SampleList;