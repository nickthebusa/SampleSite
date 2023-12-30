import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import APIService from '../fetching/APIService';


function EditProfile({ userLogged, setEditProfile }) {

  const [data, setData] = useState({
    user: userLogged?.user,
    name: userLogged?.name,
    image: userLogged?.image
  })

  const [imagePrev, setImagePrev] = useState(userLogged?.image);


  function handleChange(type, v) {
    let newData = { ...data };
    newData[type] = v;
    setData(newData);
  }

  function handleFileChange(type, e) {
    let newData = { ...data };
    newData[type] = e.target.files[0];
    setData(newData);
    
    // set Image Prev to readable file 
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

  function submitEdit() {
    if (userLogged) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('image', data.image);

      APIService.EditProfile(userLogged?.user, formData)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }


  return (
    <div className='EditProfile'>
      <h3>Edit Profile</h3>

      <FontAwesomeIcon
        icon={faX}
        onClick={() => setEditProfile(false)}
        className="open-close"
      />

      <div className='div-form'>
        <input type="text" value={data.name} onChange={e => handleChange("name", e.target.value)} />
        <input type="file" onChange={e => handleFileChange("image", e)} />
        <img src={imagePrev} alt="profile-image" className='image-preview' />
        <button onClick={submitEdit}>EDIT</button>
      </div>

    </div>
  )
}

export default EditProfile;
