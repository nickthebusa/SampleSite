import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useFetch';

import '../CSS/FollowList.css';

function FollowList({ userAccount, type }) {

  const [list, setList] = useState([])

  const [profiles] = useProfiles();

  useEffect(() => {
    if (userAccount) {

      switch (type) {
        case "following":
          setList(userAccount.following);
          break;
        case "followers":
          setList(userAccount.followers);
          break;
        default:
          setList([])
          break;
      }
    }
  }, [setList, type, userAccount])


  return (
    <>
      <h4>{type}</h4>
      <div className='follow-list-div'>
        <ul className='follow-list'>
          {
            userAccount &&
              profiles &&
              list.length > 0 ? list.map((item, i) => (
                <div className='follow-list-item' key={i}>
                  <img className="follow-list-img"
                    src={profiles.find(p => p?.user === item)?.image}
                    alt="profile-pic"
                  />
                  <Link reloadDocument to={`/account/${item}`}>
                    {profiles.find(p => p?.user === item)?.name}
                  </Link>
                </div>
              ))
              :
              <div style={{ textAlign: 'left' }}>none</div>
          }
        </ul >
      </div >
    </>
  )
}

export default FollowList
