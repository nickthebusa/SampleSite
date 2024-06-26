import { useState, useEffect, useRef } from 'react';
import { useTags } from '../hooks/useFetch';
import APIService from '../fetching/APIService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import defaultLogo from '../pictures/output01.webp';
import '../CSS/NewUploadSample.css';

function NewUploadSample({ userLogged, onFormUploaded }) {

  const [tags, refetch] = useTags();

  const [newTag, setNewTag] = useState('');

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
    tags: "",
    image: ""
  })


  function handleChange(type, value) {
    if (type === "title") {
      if (value?.length > 50) {
        setErrors({ ...errors, title: "Over character limit" });
        return;
      }
    }
    else if (type === "description") {
      if (value?.length > 150) {
        setErrors({ ...errors, description: "Over character limit" });
        return;
      }
    }
    let newData = { ...data };
    newData[type] = value;
    setData(newData);
    let newErrors = { ...errors };
    newErrors[type] = "";
    setErrors(newErrors);
  }


  function handleFileChange(type, e) {

    let newData = { ...data };
    newData[type] = e.target.files[0];
    setData(newData);

    // set Image Prev to readable file 
    if (type === "image") {
      previewImage(e.target.files);
    }
  }


  function previewImage(targetFiles) {
    const theFile = targetFiles;
    if (theFile.length > 0) {
      let fileReader = new FileReader();
      fileReader.onload = function(event) {
        setImagePrev(event.target.result)
      }
      fileReader.readAsDataURL(theFile[0]);
    }
    return;
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
        setData({ ...data, audio_file: file });
        setErrors({ ...errors, audio_file: "" });
      } else {
        setErrors({ ...errors, audio_file: "not accepted type" });
      }
    } else if (type === "image") {
      if (isFileAccepted(file, "image")) {
        previewImage(e.dataTransfer.files);
        setData({ ...data, image: file });
        setErrors({ ...errors, image: "" });
      }
      else {
        setErrors({ ...errors, image: "not accepted type" });
      }
    }
  }


  function addRemoveTag(id) {
    let newData = { ...data };
    if (newData.tags?.includes(id)) {
      newData.tags.splice(newData.tags.indexOf(id), 1);
      setData(newData);
      setErrors({ ...errors, tags: "" })
    } else {
      if (newData.tags.length < 5) {
        newData.tags.push(id);
        setData(newData);
      } else {
        setErrors({ ...errors, tags: "max 5 tags" })
      }
    }
  }

  function addNewTag(e) {
    if (e.target.value.length > 25) {
      setErrors({ ...errors, tags: "Over character limit" });
      return;
    }
    setNewTag(e.target.value);
    setErrors({ ...errors, tags: "" });
  }


  function submitNewTag() {

    const tagNames = tags.map(t => t.name)

    // if newtag doesn't match any existing tags
    if (newTag.trim() !== "" && !(tagNames.includes(newTag.trim().toUpperCase()))) {
      if (data.tags.length < 5) {
        // add tag to DB
        APIService.AddTag({ name: newTag.toUpperCase() })
          .then(res => {
            refetch();
            let newData = { ...data };
            newData["tags"] = [...data.tags, res.data.id]
            setData(newData);
          })
          .catch(err => console.log(err))
      } else {
        setErrors({ ...errors, tags: "max 5 tags" })
      }
    }
    // if tag already exists
    else if (tagNames.includes(newTag.trim().toUpperCase())) {

      const newTagId = tags.find(t => t.name === newTag.trim().toUpperCase()).id;

      if (!data.tags.includes(newTagId)) {
        let newData = { ...data };
        newData["tags"] = [
          ...data.tags, newTagId
        ]
        setData(newData);
      }

    }
    setNewTag("")
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
        onFormUploaded('uploaded_sample');
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
    // for adding outline to inputs when dragging file over them
    function addHoverClass(e) {
      e.preventDefault();
      this.classList.add("hover");
    }
    function removeHoverClass(e) {
      e.preventDefault();
      this.classList.remove("hover");
    }

    const imgInput = document.querySelector(".img-and-input-div");
    const audioInput = document.querySelector(".upload-audio-label");

    imgInput.addEventListener('dragover', addHoverClass, false);
    imgInput.addEventListener('dragleave', removeHoverClass, false);
    imgInput.addEventListener('drop', removeHoverClass, false);

    audioInput.addEventListener('dragover', addHoverClass, false);
    audioInput.addEventListener('dragleave', removeHoverClass, false);
    audioInput.addEventListener('drop', removeHoverClass, false);

    // resizes textarea
    descRef.current?.addEventListener("input", resizeArea);

    return () => {
      imgInput.removeEventListener('dragover', addHoverClass, false);
      imgInput.removeEventListener('dragleave', removeHoverClass, false);
      imgInput.removeEventListener('drop', removeHoverClass, false);

      audioInput.removeEventListener('dragover', addHoverClass, false);
      audioInput.removeEventListener('dragleave', removeHoverClass, false);
      audioInput.removeEventListener('drop', removeHoverClass, false);

      descRef.current?.removeEventListener("input", resizeArea);
    }

  }, [])

  console.log(data.tags.length)
  console.log(data.tags)

  return (
    <div className="UploadSample">

      <h3>Upload Sample</h3>

      <div className="pic-title-username-div">
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "image")}
          className="img-and-input-div"
        >
          <label
            htmlFor="image"
            className="upload-image-label"
          >
            <div className='img-container'>
              <img src={imagePrev} alt="profile-image" className='image-preview' />
            </div>
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


        <p className="errors description">{errors.description}</p>
        <div className='custom-input-div description'>
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

        <label
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "audio")}
          htmlFor="audio-file-upload"
          className='upload-audio-label'
        >
          <div className="audio-upload-div">
            Audio File:
            <FontAwesomeIcon icon={faPaperclip} />
            <p>{`${data.audio_file?.name || "none"}`}</p>
            <input
              className='upload-audio-input'
              type="file"
              id="audio-file-upload"
              accept="audio/*"
              onChange={(e) => handleFileChange('audio_file', e)}
            />
            <p className="errors audio-file">{errors.audio_file}</p>

          </div>
        </label>

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
          <p className="errors tags">{errors.tags}</p>
        </div>

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
              onChange={addNewTag}
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
