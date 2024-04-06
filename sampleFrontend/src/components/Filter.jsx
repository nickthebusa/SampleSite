import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faX } from '@fortawesome/free-solid-svg-icons'
import '../CSS/Filter.css';
import FlippingText from './FlippingText.jsx';


function Filter({ tags, currentTags, setCurrentTags, searchQuery, setSearchQuery,
  searchMode, setSearchMode }) {

  const searchModes = ['title', 'description', 'username'];

  // filter by tag
  const [dropdownVis, setDropdownVis] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [tagSearchOpen, setTagSearchOpen] = useState(false);

  const tagSearchDropdownRef = useRef(null);
  // const searchModeDisplay = useRef(null);


  useEffect(() => {
    function handleOutsideClick(e) {

      if (tagSearchDropdownRef.current &&
        !tagSearchDropdownRef.current.contains(e.target)) {
        setTagSearchOpen(false);
      }

    }

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };

  }, [])

  function checkUncheckTag(id) {

    if (!currentTags.includes(id)) {
      setCurrentTags([...currentTags, id])
    } else {
      const newTags = currentTags.filter(t => t !== id)
      setCurrentTags(newTags);
    }

  }


  function toggleDropdown() {
    setDropdownVis(!dropdownVis);
  }


  function updateOnSearch(v) {
    if (v !== '') {
      let newTags = [];
      for (let i of tags) {
        const search = v.toUpperCase();
        const tagName = tags.find(ele => ele.id === i.id).name.toUpperCase();
        if (tagName.startsWith(search)) {
          newTags.push(i.id);
        }
      }
      setSearchTags(newTags);
      setTagSearchOpen(true);
    }
    else {
      setSearchTags([]);
      setTagSearchOpen(false);
    }
    setFilterSearch(v);
  }
  function clickSearchResult(tag) {
    setCurrentTags([...currentTags, tag])
    setTagSearchOpen(!tagSearchOpen)
  }

  function toggleSearchMode() {
    setSearchMode(getNextSearchMode());
  }

  function getNextSearchMode() {
    switch (searchMode) {
      case "title":
        return "description";
      case "description":
        return "username";
      case "username":
        return "title";
      default:
        return "title";
    }
  }


  function clearCurrentTags() {
    setCurrentTags([]);
  }


  return (
    <div className='Filter'>
      <h4>FILTER</h4>

      <div className='Filter-types'>

        <div className='Filter-by-title'>
          <div className='custom-input-div-search'>
            <label htmlFor="title-search" className='custom-input-label-search'>
              Search by :
              <div className='search-main-select' onClick={toggleSearchMode}>
                <FontAwesomeIcon className='search-main-arrow' icon={faCaretDown} rotation={270} />
                <div className="flip-animate" tabIndex={0}>
                  <FlippingText
                    words={searchModes}
                    searchMode={searchMode}
                  />
                </div>
              </div>
            </label>
            <input
              id="title-search"
              type="text"
              className='custom-input-text-search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>
        </div>



        <div className='Filter-by-tag'>
          <div className='Filter-tags-dropdown'>
            <p>Filter-Tags: </p>{
              dropdownVis ?
                <FontAwesomeIcon icon={faCaretDown} rotation={180} onClick={toggleDropdown} /> :
                <FontAwesomeIcon icon={faCaretDown} onClick={toggleDropdown} />
            }
            {dropdownVis &&
              <div className='custom-input-div search-tags'>
                <label htmlFor="tag-search" className='custom-input-label'>Search Tags: </label>
                <input
                  className='custom-input-text'
                  id="tag-search"
                  type="text"
                  autoComplete='off'
                  value={filterSearch}
                  onChange={(e) => updateOnSearch(e.target.value)} />

                <div className='search-dropdown-div' ref={tagSearchDropdownRef}>
                  {searchTags.length > 0 && tagSearchOpen &&
                    <div className='search-dropdown'>
                      {searchTags.map((tag, i) => (
                        <p key={i} onClick={() => clickSearchResult(tag)}>
                          {tags.find(t => t.id === tag).name}
                        </p >
                      ))}
                    </div>}
                </div>
              </div>}
          </div>

          {
            dropdownVis && currentTags?.length !== 0 &&
            <p className='clear-tags' onClick={clearCurrentTags}><FontAwesomeIcon icon={faX} />CLEAR TAGS</p>
          }

          <div className='Filter-dropdown' style={{ display: dropdownVis ? 'inline-block' : 'none' }}>
            <div className='Filter-tags-list'>
              {tags && tags.map((tag, i) => (
                <div key={i} className='Filter-tag-div'>
                  <label htmlFor={`filter-tag-${i}`}>
                    <input
                      id={`filter-tag-${i}`}
                      type='checkbox'
                      onChange={() => checkUncheckTag(tag.id)}
                      checked={currentTags.includes(tag.id)}
                      hidden
                    ></input>
                    <div className='Filter-tag-checkbox-btn'>{tag?.name}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Filter
