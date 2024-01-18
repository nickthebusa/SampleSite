import { useState } from 'react';
import { useTags } from '../hooks/useFetch';
import APIService from '../fetching/APIService';

function UploadSample({ userLogged, onFormUploaded }) {

  const [tags, refetch] = useTags();

  const [newTag, setNewTag] = useState('')

  const [imagePrev, setImagePrev] = useState('');
  
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
        fileReader.onload = function (event) {
          setImagePrev(event.target.result)
        }
        fileReader.readAsDataURL(theFile[0]);
        return;
      }
    }
  }

  function handleSelectChange(e) {
    let newData = { ...data }
    const selected = Array.from(e.target.selectedOptions, (option => parseInt(option.value)))
    newData["tags"] = selected;
    setData(newData);
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
    console.log(formData)
    return formData;
  }

  async function doSubmit() {

    if (data.title.trim() === "" || data.audio_file === "") {
      const newErrors = {...errors}
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


  return (
    <div className="UploadSample">

      <h3>Upload Sample</h3>

      <div className='div-form'>

        <div className='custom-input-div'>
          <label htmlFor="title" className='custom-input-label'>Title</label>
          <input
            className='custom-input-text'
            type="text"
            name="title"
            value={data.title}
            autoComplete='off'
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
          {errors.title}

        <div className='custom-input-div'>
          <label htmlFor="description" className='custom-input-label'>Description</label>
          <input
            className='custom-input-text'
            type="text"
            name="description"
            value={data.description}
            autoComplete='off'
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
          {errors.description}
          


        <label htmlFor="audio-file">
          Audio File: <input
          type="file"
          name="audio_file"
          accept="audio/*"
          onChange={(e) => handleFileChange('audio_file', e)}
          />
          {errors.audio_file}
        </label>

        <label htmlFor="tags">
          Tags: <select
            multiple
            name="tags"
            value={data.tags}
            onChange={(e) => handleSelectChange(e)}>
            {tags && tags.map((tag, i) => (
              <option
                key={i}
                value={tag.id}
              >
                {tag.name}
              </option>
            ))}
          </select>
          {errors.tags}
        </label>

        <label htmlFor="add-tag" className='add-tag-label'>
        Add a tag: <input
          type='text'
          name='add-tag'
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          />
        <button onClick={submitNewTag}>ADD</button>
      </label>

        <label htmlFor="image">
        Image: <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => handleFileChange('image', e)}
          />
          {errors.image}
        </label>
        {
          imagePrev !== "" &&
          <div className='img-container'>
            <img src={imagePrev} alt="profile-image" className='image-preview' />
          </div>
        }
        

        <button onClick={(e) => doSubmit(e)}>ADD SAMPLE</button>

    </div>

    </div>
  )
}

export default UploadSample;