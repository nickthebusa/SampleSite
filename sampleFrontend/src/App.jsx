import { useState, useEffect } from "react";
import APIService from "./fetching/APIService";

import Nav from "./components/Nav";
import SampleList from "./components/SampleList";

/* NOTES: */
// add loading functionally for slow connection
// add login capability (restrict certain functions when logged out)
// register users
// update sample display component (aesthetic)
// add form for uploading samples
// add form for creating new tag
// implement search feature (with text & tag)
// token authorization django
// fetch users

/* SECURITY*/
// - have secret key in django & react .env files 

function App() {

  const [samples, setSamples] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {

    APIService.GetSamples()
      .then(res => setSamples(res))
    
    APIService.GetTags()
      .then(res => setTags(res))
    
    APIService.GetUsers()
      .then(res => setUsers(res))

    // APIService.RequestAuthorization()
    //   .then(res => console.log(res))

  }, [])

  return (
    <div className="App">

      <Nav />
      {samples.length > 0 && <SampleList samples={samples} tags={tags} users={users} />}

    </div>
  )
}

export default App; 