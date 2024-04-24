import axios from 'axios';

// const siteName = "http://192.168.1.177:8000";
//const siteName = 'http://127.0.0.1:8000';
const siteName = "http://172.31.162.37:8000";

export default class APIService {

  static async GetSamples() {
    return axios
      .get(`${siteName}/api/samples/`)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetTags() {
    return axios
      .get(`${siteName}/api/tags/`)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetUsers() {
    return axios
      .get(`${siteName}/api/users/`)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetProfiles() {
    return axios
      .get(`${siteName}/api/profiles/`)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetUser(id) {
    const res = await fetch(`${siteName}/api/users/${id}`, {
      mode: 'cors',
    });
    const user = await res.json();
    return user;
  }

  static async GetProfile(id) {
    return axios
      .get(`${siteName}/api/profiles/${id}/`)
      .then(res => {
        return res
      })
      .catch(err => { throw err })
  }


  static async UpdateProfile(id, body) {
    const res = await fetch(`${siteName}/api/profiles/${id}/`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
    const status = await res.json();
    return status;
  }

  static async LoginUser(body) {
    console.log(body);
    const res = await fetch(`${siteName}/auth/`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    const status = await res.json();
    return status;
  }

  static async RegisterUser(body) {
    const res = await fetch(`${siteName}/api/users/`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    const status = await res.json();
    return status;
  }

  static async AddTag(body) {
    return axios
      .post(`${siteName}/api/tags/`, body)
      .then(res => { return res })
      .catch(err => { throw err })
  }


  static async UploadSample(formData) {

    // const config = {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     'X-CSRFToken': csrftoken
    //   }
    // }

    return axios
      .post(`${siteName}/api/samples/`, formData)
      .then(res => { return res })
      .catch(err => { throw err })
  }


  // static async GetSamplesById(id_array) {
  //   return axios 
  //     .get(`http://127.0.0.1:8000/api/get_samples_by_ids/?${id_array.map(id => `samples_ids[]=${id}`).join('&')}`)
  //     .then(res => { return res })
  //     .catch(err => { throw err })
  // }

  static async GetUserSamplesByUserId(id) {
    return axios
      .get(`${siteName}/api/get_user_samples_by_user_id/${id}`)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetUserSavedSamples(id) {
    return axios
      .get(`${siteName}/api/get_user_saved_samples/${id}`)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async AddToSavedSample(user_id, body) {
    return axios
      .put(`${siteName}/api/add_saved_sample/${user_id}/`, body)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async RemoveSavedSample(user_id, body) {
    return axios
      .put(`${siteName}/api/remove_saved_sample/${user_id}/`, body)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async EditProfile(id, body) {
    return axios
      .put(`${siteName}/api/edit_profile/${id}/`, body)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async DownloadFile(id, title) {
    return axios
      .get(`${siteName}/api/download_file/${id}/`, {
        responseType: 'blob'
      })
      .then(res => {
        const blobUrl = URL.createObjectURL(new Blob([res.data]))

        // create element and trigger download
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${title}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.log(err))
  }

  static async Follow_Unfollow(followed_id, follower_id) {
    return axios.put(`${siteName}/api/follow_unfollow/${followed_id}/${follower_id}/`)
      .then(res => { return res })
      .catch(err => { return err })
  }

  static async DeleteFile(id) {
    return axios.delete(`${siteName}/api/samples/${id}/`)
      .then(res => { return res })
      .then(err => { return err })
  }

}

// static async GetTags() {
//   const res = await fetch('http://127.0.0.1:8000/api/tags/', {
//     mode: 'cors'
//   });
//   const tags = await res.json();
//   return tags;
// }

// static async FollowUnfollow(body) {
//   const res = await fetch(`http://127.0.0.1:8000/api/follow_unfollow/`, {
//     mode: 'cors',
//     method: 'PUT',
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(body)
//   })
//   const status = await res.json();
//   return status;
// }
