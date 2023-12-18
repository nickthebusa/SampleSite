import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import { useParams} from 'react-router-dom';
import APIService from '../fetching/APIService';
import Nav from './Nav';

import SampleList from './SampleList';
// import { isButtonElement } from 'react-router-dom/dist/dom';

function Account({userId}) {

  const [userAccount, setUserAccount] = useState(null);
  const [userLogged, setUserLogged] = useState(null);
  const [samples, setSamples] = useState([]);
  const [tags, setTags] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const [token] = useCookies(['my-token']);
  const [csrf] = useCookies(['csrftoken'])
  
  const { id } = useParams();
  

  useEffect(() => {

    if (!userAccount) {
      APIService.GetUser(id)
        .then(res => setUserAccount(res))
      
      APIService.GetTags()
        .then(res => setTags(res))
    }
    if (userAccount) {
      APIService.GetSamples()
        .then(res => {
          res = res.filter(sample => sample.user === userAccount.id)
          setSamples(res)
        })
    }
    if (userId) {
      APIService.GetUser(userId, )
        .then(res => setUserLogged(res))
    }

    if (token['my-token']) {
      setLoggedIn(true);
    }


  }, [userAccount, id, token])

  function followBtn() {
    if (userLogged) {
      debugger;
      console.log(userLogged.followers)
      APIService.PostUser(userLogged.id, token['my-token'], csrf, {
        ...userLogged, following: [...userLogged.followers, userAccount.id]
      })
        .then(res => console.log(res))
    }
  }

  // console.log("Account", userId);
  // console.log(userId, id);
  console.log(token['my-token'])

  return (
    <div>

      <Nav loggedIn={loggedIn} />

      {userAccount &&
        <div className='Account-div'>
          <h4 className='Account-username'>{userAccount.username}</h4>
          <div className='Account-follow-div'>
            <div>
              <p>following</p>
              <p>{userAccount.following.length}</p>
            </div>
            <div>
              <p>followers</p>
              <p>{userAccount.followers.length}</p>
            </div>

            {
              userLogged && userAccount &&
              userLogged.id !== userAccount.id &&
              <button onClick={followBtn}>
                {
                  userLogged.following.includes(userAccount.id) ?
                  "Following" : "Follow"
                }
              </button>
            }

          </div>
        </div>

      }

      {samples && samples.length > 0 && <SampleList samples={samples} tags={tags} users={userAccount} />}
      
    </div>
  )
}

export default Account