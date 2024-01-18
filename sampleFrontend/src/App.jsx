import { useState, useEffect } from "react";

import Nav from "./components/Nav";
import SampleList from "./components/SampleList";
import Filter from "./components/Filter";

import { sampleSearch } from './functions/samplesSearch';

import { useSamples, useTags, useProfiles } from "./hooks/useFetch";

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

// add a list mode in sample list where it's just the name, user and a play/pause button (maybe mini picture) and use the same motions to trigger sample

/* SECURITY*/
// - have secret key in django & react .env files 

function App({ userLogged, following, loggedUserRefetch }) {

  // state for Filter Component
  const [currentTags, setCurrentTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('TITLE');

  // Filtered 
  const [filteredSamples, setFilteredSamples] = useState([]);

  // useQuery
  const [samples] = useSamples();
  const [tags] = useTags();
  const [profiles] = useProfiles();
  
  useEffect(() => {

    if (samples) {
      let tempFilteredSamples = samples;

      // (for following page)
      // first check if samples should filtered based on following status
      if (following && userLogged) {
        tempFilteredSamples =
          samples.filter(s => userLogged.following.includes(s.user))
      }

      // then if any filter tags or queries exist filter samples based on that
      if (samples.length > 0 && (currentTags.length > 0 || searchQuery.trim() !== '')) {
        tempFilteredSamples =
          sampleSearch(tempFilteredSamples, searchQuery, currentTags, searchMode);
        setFilteredSamples(tempFilteredSamples);
        return;
      }

      // if no filters set filtered samples
      else if (samples.length > 0 && currentTags.length <= 0 && searchQuery.trim() === '') {
        setFilteredSamples(tempFilteredSamples);
        return;
      }
    }

  }, [samples, tags, profiles, currentTags, searchQuery, following, userLogged, searchMode])


  return (
    <div className="App">

      <Nav userLogged={userLogged} loggedUserRefetch={loggedUserRefetch} />

      {following && <h3 className="App-following">FOLLOWING</h3>}

      <Filter
        tags={tags}
        currentTags={currentTags}
        setCurrentTags={setCurrentTags}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
      />

      {filteredSamples?.length > 0 && profiles ?
        <SampleList
          samples={filteredSamples}
          tags={tags}
          users={profiles}
          currentTags={currentTags}
          setCurrentTags={setCurrentTags}
          userLogged={userLogged}
          loggedUserRefetch={loggedUserRefetch}
        />
        :
        <div>NONE</div>
      }

    </div>
  )
}

export default App; 