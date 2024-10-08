import { useState, useEffect, useMemo } from "react";

import Nav from "./components/Nav";
import SampleList from "./components/SampleList";
import Filter from "./components/Filter";

import { sampleSearch } from './functions/sampleSearch';

import { useSamples, useTags, useProfiles } from "./hooks/useFetch";


/* NOTES: */
// add loading functionally for slow connection
// (maybe ) mini sample list
// edit sample in SampleList, also figure out where to add edit button
// (maybe ) add icon for download, save, and delete in actions menu
// probably need to make a sample element it's own component to make minimalsamplelist work
// with all the functionality

/* SECURITY */
// - have secret key in django & react .env files 

function App({ userLogged, followingPage, loggedUserRefetch }) {

  // state for Filter Component
  const [currentTags, setCurrentTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('title');
  const [miniList, setMiniList] = useState(false);

  // samples that get sent to SampleList Component
  const [filteredSamples, setFilteredSamples] = useState([]);

  // useQuery
  const [samples, refetchSamples] = useSamples();
  const [tags] = useTags();
  const [profiles] = useProfiles();


  // filter samples
  const memoizedFilteredSamples = useMemo(() => {
    let samplesToFilter = (followingPage && userLogged) ? samples.filter(s => userLogged.following.includes(s.user)) : samples;
    if (samplesToFilter?.length > 0) {
      if (currentTags.length > 0 || searchQuery.trim() !== '') {
        return sampleSearch(samplesToFilter, searchQuery, currentTags, searchMode);
      }
      return samplesToFilter;
    }
    return [];
  }, [samples, currentTags, searchQuery, searchMode, followingPage, userLogged]);

  useEffect(() => {
    setFilteredSamples(memoizedFilteredSamples);
  }, [memoizedFilteredSamples]);

  /*
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

  }, [samples, currentTags, searchQuery, followingPage, userLogged, searchMode])
  */

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
        miniList={miniList}
        setMiniList={setMiniList}
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
            miniList={miniList}
          // refetchSaved passed in props from Account component
          />
          :
          <div>NONE</div>
      }

    </div>
  )
}

export default App; 
