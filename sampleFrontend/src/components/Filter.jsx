import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import '../CSS/Filter.css';


function Filter({ tags, currentTags, setCurrentTags, titleSearch, setTitleSearch }) {

  const searchModes = ['TITLE', 'DESCRIPTION', 'USER'];

  // filter by tag
  const [dropdownVis, setDropdownVis] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [tagSearchOpen, setTagSearchOpen] = useState(false);
  const [openSearchModes, setOpenSearchModes] = useState(false);
  const [searchMode, setSearchMode] = useState(searchModes[0]);

  const searchDropdownCarrot = useRef(null);
  const tagSearchDropdownRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {

      if (tagSearchDropdownRef.current &&
        !tagSearchDropdownRef.current.contains(e.target)) {
        setTagSearchOpen(false);
      }

      // console.log(e.target)
      // if (searchDropdownCarrot.current &&
      //   !searchDropdownCarrot.current.contains(e.target) &&
      //   openSearchModes) {
      //   setOpenSearchModes(false);
      // }

    }

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };

  }, [openSearchModes])

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

  function toggleSearchModeWindow() {
    if (openSearchModes) {
      setOpenSearchModes(false);
    } else {
      setOpenSearchModes(true);
    }
  }


  return (
    <div className='Filter'>
      <h4>FILTER</h4>

      <div className='Filter-types'>

      <div className='Filter-by-title'>
        <div className='custom-input-div'>
          <label htmlFor="title-search" className='custom-input-label'>
            Search by 
            <div className='search-main' ref={searchDropdownCarrot}>
            { openSearchModes ? 
            <FontAwesomeIcon icon={faCaretDown} 
            rotation={180} 
            onClick={toggleSearchModeWindow}/> :
            <FontAwesomeIcon icon={faCaretDown} 
            onClick={toggleSearchModeWindow}/>
            }
            { openSearchModes && 
              <div className='searchModesDropdown'>
                <ul>
                  {searchModes.map((e, i) => (
                    e !== searchMode && (
                    <li key={i} onClick={(e)=>setSearchMode(e.target.innerText)}>{e}</li>
                    )
                  ))}
                </ul>
              </div>
            }
            </div>
            {searchMode}:
          </label>
          <input 
            id="title-search" 
            type="text" 
            className='custom-input-text'
            value={titleSearch} 
            onChange={(e) => setTitleSearch(e.target.value)}  
          />

        </div>
      </div>

      <div className='Filter-by-tag'>
        <div className='Filter-tags-dropdown'>
          <p>Filter-Tags: </p>{
            dropdownVis ?
            <FontAwesomeIcon icon={faCaretDown} rotation={180} onClick={toggleDropdown}/> :
            <FontAwesomeIcon icon={faCaretDown} onClick={toggleDropdown}/>
          }
          {dropdownVis && 
          <div className='custom-input-div search-tags'>
            <label htmlFor="tag-search" className='custom-input-label'>Search Tags: </label>
            <input 
              className='custom-input-text'
              id="tag-search" 
              type="text" 
              value={filterSearch}
              onChange={(e) => updateOnSearch(e.target.value)} />

            <div className='search-dropdown-div' ref={tagSearchDropdownRef}>
            {searchTags.length > 0 && tagSearchOpen &&
              <div className='search-dropdown'>
                {searchTags.map((tag, i) => (
                  <p key={i} onClick={() => setCurrentTags([...currentTags, tag])}>{tags.find(t => t.id === tag).name}</p>
                ))}
              </div>}
          </div>
          </div> }
        </div>

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