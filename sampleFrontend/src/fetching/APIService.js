import axios from 'axios';

export default class APIService {

  static async GetSamples() {
    return axios
      .get('http://127.0.0.1:8000/api/samples/')
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetTags() {
    return axios
      .get('http://127.0.0.1:8000/api/tags/')
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetUsers() {
    return axios
      .get('http://127.0.0.1:8000/api/users/')
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetProfiles() {
    return axios
      .get('http://127.0.0.1:8000/api/profiles/')
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetUser(id) {
    const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
      mode: 'cors',
    });
    const user = await res.json();
    return user;
  }

  static async GetProfile(id) {
    return axios
    .get(`http://127.0.0.1:8000/api/profiles/${id}/`)
    .then(res => {
        return res
      })
    .catch(err => { throw err })
  }


  static async UpdateProfile(id, body) {
    const res = await fetch(`http://127.0.0.1:8000/api/profiles/${id}/`, {
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
    const res = await fetch('http://127.0.0.1:8000/auth/', {
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
    const res = await fetch('http://127.0.0.1:8000/api/users/', {
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
      .post('http://127.0.0.1:8000/api/tags/', body)
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
      .post('http://127.0.0.1:8000/api/samples/', formData)
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
      .get(`http://127.0.0.1:8000/api/get_user_samples_by_user_id/${id}`)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async GetUserSavedSamples(id) {
    return axios 
      .get(`http://127.0.0.1:8000/api/get_user_saved_samples/${id}`)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async AddToSavedSample(user_id, body) {
    return axios 
      .put(`http://127.0.0.1:8000/api/add_saved_sample/${user_id}/`, body)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async RemoveSavedSample(user_id, body) {
    return axios 
      .put(`http://127.0.0.1:8000/api/remove_saved_sample/${user_id}/`, body)
      .then(res => { return res })
      .catch(err => { throw err })
  }

  static async EditProfile(id, body) {
    return axios 
      .put(`http://127.0.0.1:8000/api/edit_profile/${id}/`, body)
      .then(res => { return res })
      .catch(err => { throw err })
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