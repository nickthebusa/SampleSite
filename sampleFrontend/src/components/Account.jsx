import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import { useParams} from 'react-router-dom';
import APIService from '../fetching/APIService';
import Nav from './Nav';

import SampleList from './SampleList';

function Account() {

  const [user, setUser] = useState(null);
  const [samples, setSamples] = useState([]);
  const [tags, setTags] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const [token, ] = useCookies(['my-token']);

  
  const { id } = useParams();
  

  useEffect(() => {

    if (!user) {
      APIService.GetUser(id)
        .then(res => setUser(res))
      
      APIService.GetTags()
        .then(res => setTags(res))
    }
    if (user) {
      APIService.GetSamples()
        .then(res => {
          res = res.filter(sample => sample.user === user.id)
          setSamples(res)
        })
    }
    

    if (token['my-token']) {
      setLoggedIn(true);
    }


  }, [user, id, token])

  // console.log("Account", userId);

  return (
    <div>

      <Nav loggedIn={loggedIn} />

      {user &&
        <div className='Account-div'>
          <h4 className='Account-username'>{user.username}</h4>
          <div className='Account-follow-div'>
            <div>
              <p>following</p>
              <p>{user.following.length}</p>
            </div>
            <div>
              <p>followers</p>
              <p>{user.followers.length}</p>
              </div>
          </div>
        </div>

      }

      {samples && samples.length > 0 && <SampleList samples={samples} tags={tags} users={user} />}
      
    </div>
  )
}

export default Account