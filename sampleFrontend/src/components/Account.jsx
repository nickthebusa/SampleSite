import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons'
import '../CSS/Account.css';

//components
import Nav from './Nav';
import FollowList from './FollowList';
import SampleList from './SampleList';
import Filter from "./Filter";
import NewUploadSample from './NewUploadSample';
import EditProfile from './EditProfile';

import APIService from '../fetching/APIService';
import { sampleSearch } from '../functions/sampleSearch';
import { useTags, useProfile, useUserSamplesById, useUserSavedSamples } from "../hooks/useFetch";


function Account({ userLogged, loggedUserRefetch }) {

  const { id } = useParams();

  // state for FollowList, null for not open, then modes ('following', followers)
  const [followComp, setFollowComp] = useState(null);

  // state for Filter Component
  const [currentTags, setCurrentTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [searchMode, setSearchMode] = useState('title');
  const [miniList, setMiniList] = useState(false);

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

  // filter samples
  const memoizedFilteredSamples = useMemo(() => {
    let samplesToFilter = savedOn ? savedSamples : userSamples;
    if (samplesToFilter?.length > 0) {
      if (currentTags.length > 0 || searchQuery.trim() !== '') {
        return sampleSearch(samplesToFilter, searchQuery, currentTags, searchMode);
      }
      return samplesToFilter;
    }
    return [];
  }, [userSamples, savedSamples, currentTags, searchQuery, searchMode, savedOn]);

  useEffect(() => {
    setFilteredSamples(memoizedFilteredSamples);
  }, [memoizedFilteredSamples]);

  useEffect(() => {
    window.addEventListener('click', handleWindowPress);

    return () => {
      window.removeEventListener('click', handleWindowPress);
    };

  }, [editProfile, uploadForm, followComp])

  // for clicking out of pop up form
  function handleWindowPress(e) {
    const overlay = document.querySelector('.overlay');
    if (overlay && e.target === overlay && (editProfile || uploadForm || followComp)) {
      setEditProfile(false);
      setUploadForm(false);
      setFollowComp(null);
    }
  }

  // For following and un-following
  function followBtn(e) {
    e.target.disabled = true;
    APIService.Follow_Unfollow(userAccount.user, userLogged.user)
      .then(() => {
        loggedUserRefetch();
        refetchProfile();
      })
      .catch((err) => {
        console.log(err);
      })
    setTimeout(() => {
      e.target.disabled = false;
    }, 200)
  }

  // closes upload form and reloads page on successful submit
  function onFormUploaded(so = null) {
    if (so) {
      setUploadForm(false);
      refetchSamples(userAccount?.user_samples);
      return;
    }
    setEditProfile(false);
    refetchProfile();
    loggedUserRefetch();
  }

  console.log("Account")

  return (
    <div className='Account'>

      {(uploadForm || editProfile || followComp) &&
        <div className='overlay' />}

      <Nav
        userLogged={userLogged}
        loggedUserRefetch={loggedUserRefetch}
        fromAccount={userLogged ? true : false}
      />

      {userAccount &&
        <div className='Account-div'>

          <div className='Account-pic-name'>
            <div className="img-container">
              <img src={userAccount.image} alt="profile-pic" className='profile-pic' />
            </div>
            <h4 className='Account-username'>{userAccount.name}</h4>
          </div>

          <div className='Account-follow-div'>
            <div>
              <p>following</p>
              <p
                className='follow-count'
                onClick={() => setFollowComp('following')}>{userAccount.following?.length}
              </p>
            </div>
            <div>
              <p>followers</p>
              <p
                className='follow-count'
                onClick={() => setFollowComp('followers')}>{userAccount.followers?.length}
              </p>
            </div>

            {
              userLogged?.user !== userAccount?.user &&
              <button onClick={(e) => followBtn(e)}>
                {
                  userAccount.followers.includes(userLogged?.user) ?
                    "following" : "follow"
                }
              </button>
            }

            {
              userLogged?.user === userAccount?.user &&
              <button onClick={() => setEditProfile(true)}>
                EDIT PROFILE
              </button>
            }

            {/* FOLLOW LIST POP UP FORM */}
            {
              followComp &&
              <div className='follow-list-window-div'>
                <FontAwesomeIcon
                  className='x'
                  icon={faX}
                  onClick={() => setFollowComp(null)}
                />
                <FollowList
                  userAccount={userAccount}
                  type={followComp}
                />
              </div>
            }

          </div>

          {/* UPLOAD SAMPLE SECTION */}
          {userLogged?.user === userAccount?.user &&
            <>
              <div className='upload-sample-link-div'>
                <p>upload sample! </p>
                <FontAwesomeIcon icon={faPlus} onClick={() => setUploadForm(true)} />
              </div>
              {/* UPLOAD SAMPLE POP UP FORM */}
              {uploadForm &&
                <div className='upload-sample-window-div'>
                  <FontAwesomeIcon
                    className='x'
                    icon={faX}
                    onClick={() => setUploadForm(false)}
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
          <FontAwesomeIcon
            className='x'
            icon={faX}
            onClick={() => setEditProfile(false)}
          />
          <EditProfile userLogged={userLogged} onFormUploaded={onFormUploaded} />
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
        miniList={miniList}
        setMiniList={setMiniList}
      />

      {/* SWITCH BETWEEN USER SAMPLES AND SAVED SAMPLES */}
      {userLogged?.user === userAccount?.user &&
        <div className='user-or-saved-div'>
          <div className={!savedOn ? 'selected' : ''}
            style={{ borderRadius: "1rem 0 0 1rem", borderRight: "none" }}
            onClick={() => {
              setSavedOn(false);
            }
            }>Your Uploads</div>
          <div className={savedOn ? 'selected' : ''}
            style={{ borderRadius: "0 1rem 1rem 0", borderLeft: "none" }}
            onClick={() => {
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
          miniList={miniList}
        />
        :
        <div>NONE</div>
      }
    </div>
  )
}

export default Account;
