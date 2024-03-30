import { useState, useEffect } from 'react'
import APIService from '../fetching/APIService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'


import '../CSS/EditProfile.css';

function EditProfile({ userLogged, onFormUploaded }) {

  const [data, setData] = useState({
    user: userLogged?.user,
    name: userLogged?.name,
    image: userLogged?.image
  })

  const [errors, setErrors] = useState({
    user: "",
    name: "",
    image: ""
  })

  const [imagePrev, setImagePrev] = useState(userLogged?.image);


  function handleChange(type, v) {
    if (type === "name") {
      if (v?.length > 50) {
        setErrors({ ...errors, name: "Over character limit" });
        return;
      }
    }
    let newData = { ...data };
    newData[type] = v;
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

  function submitEdit() {
    if (userLogged) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('image', data.image);

      APIService.EditProfile(userLogged?.user, formData)
        .then(() => {
          onFormUploaded();
        })
        .catch(err => console.log(err))
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function isFileAccepted(file, type) {
    if (type === "audio") {
      return file && file.type.startsWith('audio/');
    }
    else if (type === "image") {
      return file && file.type.startsWith('image/');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (isFileAccepted(file, "image")) {
      previewImage(e.dataTransfer.files);
      setData({ ...data, image: file });
      setErrors({ ...errors, image: "" });
    }
    else {
      setErrors({ ...errors, image: "not accepted type" });
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

    imgInput.addEventListener('dragover', addHoverClass, false);
    imgInput.addEventListener('dragleave', removeHoverClass, false);
    imgInput.addEventListener('drop', removeHoverClass, false);

    return () => {
      imgInput.removeEventListener('dragover', addHoverClass, false);
      imgInput.removeEventListener('dragleave', removeHoverClass, false);
      imgInput.removeEventListener('drop', removeHoverClass, false);
    }

  }, [])


  return (
    <div className='EditProfile'>
      <h3>Edit Profile</h3>
      <div>
        <div className='div-form'>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e)}
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
          <div className='custom-input-div name'>
            <label htmlFor="name" className='custom-input-label'>NAME
            </label>
            <input
              className='custom-input-text name'
              type="text"
              name="name"
              value={data.name}
              autoComplete='off'
              onChange={e => handleChange("name", e.target.value)}
            />
            <p className="errors name">{errors.name}</p>
          </div>
        </div>
        <button onClick={submitEdit}>EDIT</button>
      </div>

    </div>
  )
}

export default EditProfile;
