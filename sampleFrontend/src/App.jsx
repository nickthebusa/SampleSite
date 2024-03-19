import { useState, useEffect } from "react";

import Nav from "./components/Nav";
import SampleList from "./components/SampleList";
import Filter from "./components/Filter";

import { sampleSearch } from './functions/sampleSearch';

import { useSamples, useTags, useProfiles } from "./hooks/useFetch";

/* NOTES: */
// add loading functionally for slow connection
// post to users to add usr id to following or followers

/* SECURITY*/
// - have secret key in django & react .env files 


function App({ userLogged, followingPage, loggedUserRefetch }) {


  // state for Filter Component
  const [currentTags, setCurrentTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('title');

  // samples that get sent to SampleList Component
  const [filteredSamples, setFilteredSamples] = useState([]);

  // useQuery
  const [samples, refetchSamples] = useSamples();
  const [tags] = useTags();
  const [profiles] = useProfiles();


  useEffect(() => {

    if (samples?.length > 0) {
      let tempFilteredSamples = samples;

      // filter by the user's following
      if (followingPage && userLogged) {
        tempFilteredSamples =
          samples.filter(s => userLogged.following.includes(s.user))
      }

      // filter by tags and search query
      if (currentTags.length > 0 || searchQuery.trim() !== '') {
        tempFilteredSamples =
          sampleSearch(tempFilteredSamples, searchQuery, currentTags, searchMode);
      }

      setFilteredSamples(tempFilteredSamples);
    }
    else {
      setFilteredSamples([]);
    }

  }, [samples, tags, profiles, currentTags, searchQuery, followingPage, userLogged, searchMode])


  return (
    <div className="App">

      <Nav
        userLogged={userLogged}
        loggedUserRefetch={loggedUserRefetch}
      />

      {followingPage && <h3 className="App-following">FOLLOWING</h3>}

      <Filter
        tags={tags}
        currentTags={currentTags}
        setCurrentTags={setCurrentTags}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
      />

      {
        filteredSamples?.length > 0 && profiles
          ?
          <SampleList
            samples={filteredSamples}
            tags={tags}
            users={profiles}
            currentTags={currentTags}
            setCurrentTags={setCurrentTags}
            userLogged={userLogged}
            loggedUserRefetch={loggedUserRefetch}
            refetchSamples={refetchSamples}
          // refetchSaved passed in props from Account component
          />
          :
          <div>NONE</div>
      }

    </div>
  )
}

export default App; 
