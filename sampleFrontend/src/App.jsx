import { useState, useEffect } from "react";
import APIService from "./fetching/APIService";
import {useCookies} from 'react-cookie';

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
// select sample by pressing the name then going down with arrow key it plays the next sample
  // by selecting the sample it will have a lit box around it showing its selected
// post to users to add usr id to following or followers

/* SECURITY*/
// - have secret key in django & react .env files 

function App({ userId }) {

  const [samples, setSamples] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [token,] = useCookies(['my-token']);
  


  useEffect(() => {

    APIService.GetSamples()
      .then(res => setSamples(res))
    
    APIService.GetTags()
      .then(res => setTags(res))
    
    APIService.GetUsers()
      .then(res => setUsers(res))

    if (token['my-token']) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }

  }, [token])

  console.log("App", userId);

  return (
    <div className="App">

      <Nav loggedIn={loggedIn} userId={userId} />
      {samples.length > 0 && <SampleList samples={samples} tags={tags} users={users} />}

    </div>
  )
}

export default App; 