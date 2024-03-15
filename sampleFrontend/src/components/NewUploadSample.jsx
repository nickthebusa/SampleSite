import { useState, useEffect, useRef } from 'react';
import { useTags } from '../hooks/useFetch';
import APIService from '../fetching/APIService';

import '../CSS/NewUploadSample.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import defaultLogo from '../pictures/output01.webp';


function NewUploadSample({ userLogged, onFormUploaded }) {

  const [tags, refetch] = useTags();

  const [newTag, setNewTag] = useState('');
  const [addedTags, setAddedTags] = useState([]);

  const descRef = useRef(null);

  const [imagePrev, setImagePrev] = useState(defaultLogo);
  const [data, setData] = useState({
    title: "",
    description: "",
    audio_file: "",
    tags: [],
    image: ""
  })

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    audio_file: "",
    tags: [],
    image: ""
  })


  function handleChange(type, value) {
    if (type === "title") {
      if (value?.length > 50) {
        setErrors({ ...errors, title: "Over character limit" });
        console.log("Reached char limit.");
        return;
      }
    }
    else if (type === "description") {
      if (value?.length > 150) {
        setErrors({ ...errors, description: "Over character limit" });
        console.log("Reached char limit.");
        return;
      }
    }
    let newData = { ...data };
    newData[type] = value;
    setData(newData);
  }

  function handleFileChange(type, e) {
    let newData = { ...data };
    newData[type] = e.target.files[0];
    setData(newData);

    // set Image Prev to readable file 
    if (type === "image") {
      const theFile = e.target.files;
      if (theFile.length > 0) {
        let fileReader = new FileReader();
        fileReader.onload = function(event) {
          setImagePrev(event.target.result)
        }
        fileReader.readAsDataURL(theFile[0]);
        return;
      }
    }
  }

  function isFileAccepted(file, type) {
    if (type === "audio") {
      return file && file.type.startsWith('audio/');
    }
    else if (type === "image") {
      return file && file.type.startsWith('image/');
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, type) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (type === "audio") {
      if (isFileAccepted(file, "audio")) {
        setData({ ...data, audio_file: file })
      } else {
        setErrors({ ...errors, audio_file: "not accepted type" })
      }
    } else if (type === "image") {
      if (isFileAccepted(file, "image")) {
        setData({ ...data, image: file })
      }
      else {
        setErrors({ ...errors, image: "not accepted type" })
      }
    }
  }

  function addRemoveTag(id) {
    let newData = { ...data };
    if (newData.tags?.includes(id)) {
      newData.tags.splice(newData.tags.indexOf(id));
      setData(newData);
    } else {
      newData.tags.push(id);
      setData(newData);
    }
  }


  function submitNewTag() {

    const tagNames = tags.map(t => t.name)
    if (newTag.trim() !== "" &&
      !(tagNames.includes(newTag.trim().toUpperCase()))) {
      APIService.AddTag({ name: newTag.toUpperCase() })
        .then(res => {
          refetch();
          let newData = { ...data };
          newData["tags"] = [...data.tags, res.data.id]
          setData(newData);
        })
        .catch(err => console.log(err))
    } else if (tagNames.includes(newTag.trim().toUpperCase())) {
      let newData = { ...data };
      newData["tags"] = [
        ...data.tags, tags.find(t => t.name === newTag.trim().toUpperCase()).id
      ]
      setData(newData);
    }
  }


  function createModelEntry() {
    const formData = new FormData();
    formData.append("user", userLogged.user);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("audio_file", data.audio_file);
    for (let i of data.tags) {
      formData.append('tags', i);
    }
    formData.append("image", data.image);
    return formData;
  }

  async function doSubmit() {

    if (data.title.trim() === "" || data.audio_file === "") {
      const newErrors = { ...errors }
      if (data.title.trim() === "") {
        newErrors['title'] = 'missing required title.';
      }
      if (data.audio_file === "") {
        newErrors['audio_file'] = 'missing required audio file.';
      }
      setErrors(newErrors);
      return;
    }

    const formData = createModelEntry();
    APIService.UploadSample(formData)
      .then(res => {
        console.log(res)
        onFormUploaded();
      })
      .catch(err => {
        console.log(err)
        setErrors(err)
      })
  }

  // resize textarea
  function resizeArea() {
    if (descRef.current) {
      descRef.current.style.paddingBottom = 0;
      descRef.current.style.height = "auto";
      descRef.current.style.height = (descRef.current.scrollHeight) + "px";
    }
  }

  // resets text area if too big of text gets copy and pasted
  useEffect(() => {

    if (errors.description && data.description === "") {
      setTimeout(() => {
        setErrors({ ...errors, description: "" });
      }, 2000)
      resizeArea();
    }
    if (errors.title && data.title === "") {
      setTimeout(() => {
        setErrors({ ...errors, title: "" });
      }, 2000)
    }

  }, [errors, data])

  useEffect(() => {


    descRef.current?.addEventListener("input", resizeArea);

    return () => {
      descRef.current?.removeEventListener("input", resizeArea);
    }

  }, [])

  return (
    <div className="UploadSample">

      <h3>Upload Sample</h3>

      <div className="pic-title-username-div">
        <div className="img-and-input-div">
          <div className='img-container'>
            <img src={imagePrev} alt="profile-image" className='image-preview' />
          </div>
          <div className="image-upload-div">
            <label
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "image")}
              htmlFor="image"
              className="upload-image-label"
            >
              Image:
              <FontAwesomeIcon icon={faPaperclip} />
            </label>
            <input
              className="upload-image-input"
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => handleFileChange('image', e)}
            />
            <p className="errors image">{errors.image}</p>
          </div>
        </div>

        <div className="title-upload-div">
          <div className="profile-name">
            <p>{userLogged?.name}</p>
          </div>

          <div className='custom-input-div title'>
            <label htmlFor="title" className='custom-input-label'>Title
            </label>
            <input
              className='custom-input-text title'
              type="text"
              name="title"
              value={data.title}
              autoComplete='off'
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <p className="errors title">{errors.title}</p>
          </div>

        </div>

      </div>

      <div>


        <div className='custom-input-div description'>
          <p className="errors description">{errors.description}</p>
          <label htmlFor="description" className='custom-input-label'>Description
          </label>
          <textarea
            ref={descRef}
            rows="1" cols="50"
            className='custom-input-text description'
            type="text"
            name="description"
            value={data.description}
            autoComplete='off'
            onChange={(e) => handleChange('description', e.target.value)}
          ></textarea>
        </div>


      </div>

      <div className='div-form'>

        <div className="audio-upload-div">
          <label
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "audio")}
            htmlFor="audio-file-upload"
            className='upload-audio-label'
          >
            Audio File:
            <FontAwesomeIcon icon={faPaperclip} />
            <p>{`${data.audio_file?.name || "none"}`}</p>
          </label>
          <input
            className='upload-audio-input'
            type="file"
            id="audio-file-upload"
            accept="audio/*"
            onChange={(e) => handleFileChange('audio_file', e)}
          />
          <p className="errors audio-file">{errors.audio_file}</p>

        </div>

        <div className="select-tag-list">
          <label htmlFor="tags" className="select-tags-label">Tags: </label>
          <div
            className="select-tags-div"
            multiple
            name="tags"
          >
            {tags && tags.map((tag, i) => (
              <div key={i} className="sample-tag-div">
                <label htmlFor={`tag-${tag.id}`}>
                  <input
                    id={`tag-${tag.id}`}
                    type="checkbox"
                    onChange={() => addRemoveTag(tag.id)}
                    hidden
                    checked={data.tags?.includes(tag.id)}
                  ></input>
                  <div className="Filter-tag-checkbox-btn">
                    {tag.name}
                  </div>
                </label>
              </div>

            ))}
          </div>
        </div>
        {errors.tags}

        <div className="add-tag-container">
          <div className="custom-input-div add-tag">
            <label htmlFor="add-tag" className='custom-input-label add-tag'>
              Add a tag:
            </label>
            <input
              className="custom-input-text add-tag"
              type='text'
              name='add-tag'
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
          </div>
          <button onClick={submitNewTag}>ADD</button>
        </div>

        <button onClick={(e) => doSubmit(e)}>ADD SAMPLE</button>

      </div>

    </div>
  )
}

export default NewUploadSample;
