import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons'

//components
import Nav from './Nav';
import FollowList from './FollowList';
import SampleList from './SampleList';
import Filter from "./Filter";
//import UploadSample from './UploadSample';
import NewUploadSample from './NewUploadSample';
import EditProfile from './EditProfile';

import { sampleSearch } from '../functions/samplesSearch';
import { useTags, useProfile, useUserSamplesById, useUserSavedSamples } from "../hooks/useFetch";

import '../CSS/Account.css';

function Account({ userLogged, loggedUserRefetch }) {

  // PUT request for follow_unfollow, user_id in body
  const mutation = useMutation({
    mutationFn: async (body) => {
      return axios.put('http://127.0.0.1:8000/api/follow_unfollow/', body)
        .then(() => refetchProfile())
    },
  });

  // id of user who's page app is on
  const { id } = useParams();

  // state for FollowList, null for not open, then modes ('following', followers)
  const [followComp, setFollowComp] = useState(null);

  // state for Filter Component
  const [currentTags, setCurrentTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [searchMode, setSearchMode] = useState('TITLE');

  // state for displaying user's posts or saved posts
  const [savedOn, setSavedOn] = useState(false);

  // state for displaying pop up forms
  const [editProfile, setEditProfile] = useState(false);
  const [uploadForm, setUploadForm] = useState(false);

  // useQuery
  const [tags] = useTags();
  const [userAccount, refetchProfile] = useProfile(id);
  const [userSamples, refetchSamples] = useUserSamplesById(id);
  const [savedSamples, refetchSaved] = useUserSavedSamples(id);

  useEffect(() => {

    // filter by loggedUser's saved samples
    if (savedOn) {
      if (savedSamples) {

        let tempFilteredSamples = savedSamples;

        // filter by tags and search query
        if (currentTags.length > 0 || searchQuery.trim() !== '') {
          tempFilteredSamples =
            sampleSearch(savedSamples, searchQuery, currentTags, searchMode);
        }
        setFilteredSamples(tempFilteredSamples);
      } 
    }
    // default, display account page user's samples
    else {
      if (userSamples?.length > 0) {

        let tempFilteredSamples = userSamples;

        // filter by tags and search query
        if (currentTags.length > 0 || searchQuery.trim() !== '') {
          tempFilteredSamples =
            sampleSearch(userSamples, searchQuery, currentTags, searchMode);
        }
        setFilteredSamples(tempFilteredSamples);
      } 
    }

    // for clicking out of pop up form 
    function handleWindowPress(e) {
      const overlay = document.querySelector('.overlay');
      if (e.target === overlay && editProfile) {
        setEditProfile(false);
      }
      if (e.target === overlay && uploadForm) {
        setUploadForm(false);
      }
    }

    window.addEventListener('click', handleWindowPress)

    return () => {
      window.removeEventListener('click', handleWindowPress);
    };

  }, [userSamples, currentTags, tags, searchQuery, editProfile, uploadForm, searchMode, savedOn, savedSamples])


  // For following and un-following
  function followBtn(e) {
    e.target.disabled = true;
    mutation.mutate({ userLogged: userLogged.user, userAccount: userAccount.user })
    setTimeout(() => {
      e.target.disabled = false;
    }, 200)
  }

  // closes upload form and reloads page on successful submit
  function onFormUploaded() {
    setUploadForm(false);
    refetchSamples(userAccount?.user_samples);
    window.location.reload();
  }


  return (
    <div className='Account'>

      {(uploadForm || editProfile) &&
      <div className='overlay' />}

      <Nav
        userLogged={userLogged}
        loggedUserRefetch={loggedUserRefetch}
        fromAccount={userLogged ? true : false}
      />

      {userAccount &&
        <div className='Account-div'>

          <div className='Account-pic-name'>
            <img src={userAccount.image} alt="profile-pic" className='profile-pic' />
            <h4 className='Account-username'>{userAccount.name}</h4>
          </div>

          <div className='Account-follow-div'>
            <div>
              <p>following</p>
              <p
                className='follow-count'
                onClick={() => setFollowComp('following')}>{userAccount.following.length}
              </p>
            </div>
            <div>
              <p>followers</p>
              <p
                className='follow-count'
                onClick={() => setFollowComp('followers')}>{userAccount.followers.length}
              </p>
            </div>

            {
              userLogged?.user !== userAccount?.user &&
              <button onClick={(e) => followBtn(e)}>
                {
                  !(userAccount.followers.includes(userLogged?.user)) ?
                  "follow" : "following" 
                }
              </button>
            }

            {
              userLogged?.user === userAccount?.user && 
              <button onClick={() => setEditProfile(true)}>
                  EDIT PROFILE
              </button>
            }

            {
              followComp !== null && 
              <FollowList userAccount={userAccount} type={followComp} />
            }

          </div>
          
          { userLogged?.user === userAccount?.user &&
            <>
                <div className='upload-sample-link-div'>
                  <p>upload sample! </p>
                  <FontAwesomeIcon icon={faPlus} onClick={() => setUploadForm(!uploadForm)} />
                </div>
              { uploadForm &&
                <div className='upload-sample-window-div'>
                  <FontAwesomeIcon
                    className='x'
                    icon={faX}
                    onClick={() => setUploadForm(!uploadForm)}
                  />
                  <NewUploadSample
                    userLogged={userLogged}
                    onFormUploaded={onFormUploaded}
                  />
                </div>}
            </>
          }
        </div>
      }

      {/* EDIT ACCOUNT POP UP FORM */}
      {
        userLogged?.user === userAccount?.user && editProfile &&
        <div className='edit-profile-window-div'>
          <EditProfile userLogged={userLogged} setEditProfile={setEditProfile} />
        </div>
      }

      <Filter
        tags={tags}
        currentTags={currentTags}
        setCurrentTags={setCurrentTags}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
      />

      {/* SWITCH BETWEEN USER SAMPLES AND SAVED SAMPLES */}
      {userLogged?.user === userAccount?.user &&
        <div className='user-or-saved-div'>
            <div className={!savedOn ? 'selected' : ''} onClick={() => {
              setSavedOn(false);
            }
            }>Your Uploads</div>
            <div className={savedOn ? 'selected' : ''} onClick={() => {
              setSavedOn(true);
            }
            }>Saved</div>
        </div>
      }

      {filteredSamples?.length > 0 && userAccount ?
        <SampleList
          samples={filteredSamples}
          tags={tags}
          users={[userAccount]}
          currentTags={currentTags}
          setCurrentTags={setCurrentTags}
          userLogged={userLogged}
          loggedUserRefetch={loggedUserRefetch}
          refetchSamples={refetchSamples}
          refetchSaved={refetchSaved}
        />
        :
        <div>NONE</div>
      }
    </div>
  )
}

export default Account;
