
export default class APIService {

  static async GetSamples() {
    const res = await fetch('http://127.0.0.1:8000/api/samples/', {
      mode: 'cors'
    });
    const samples = await res.json();
    return samples;
  }


  static async GetTags() {
    const res = await fetch('http://127.0.0.1:8000/api/tags/', {
      mode: 'cors'
    });
    const tags = await res.json();
    return tags;
  }

  static async GetUsers() {
    const res = await fetch('http://127.0.0.1:8000/api/users/', {
      mode: 'cors',
    });
    const users = await res.json();
    return users;
  }

  static async RequestAuthorization() {
    const res = await fetch('http://127.0.0.1:8000/auth', {
      mode: 'cors'
    })
    return res
  }


}