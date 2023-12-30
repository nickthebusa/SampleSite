import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'


function Filter({ tags, currentTags, setCurrentTags, titleSearch, setTitleSearch }) {

  // filter by tag
  const [dropdownVis, setDropdownVis] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [tagSearchOpen, setTagSearchOpen] = useState(false);

  const tagSearchDropdownRef = useRef(null);

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


  return (
    <div className='Filter'>
      <h4>FILTER</h4>

      <div className='Filter-types'>

      <div className='Filter-by-title'>
        <label htmlFor="title-search">
            Search by title: <input id="title-search" type="text"
          value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)}  />
        </label>
      </div>

      <div className='Filter-by-tag'>
        <div className='Filter-tags-dropdown' onClick={toggleDropdown}>
          <p>Filter-Tags: </p>{
            dropdownVis ?
            <FontAwesomeIcon icon={faCaretDown} rotation={180} /> :
            <FontAwesomeIcon icon={faCaretDown} />
          }
        </div>

        <div className='Filter-dropdown' style={{ display: dropdownVis ? 'inline-block' : 'none' }}>
            <div className='search-dropdown-div' ref={tagSearchDropdownRef}>
            <label htmlFor="tag-search">
              Search Tags: <input id="tag-search" type="text" value={filterSearch}
                    onChange={(e) => updateOnSearch(e.target.value)} />
            </label>
            {searchTags.length > 0 && tagSearchOpen &&
              <div className='search-dropdown'>
                {searchTags.map((tag, i) => (
                  <p key={i} onClick={() => setCurrentTags([...currentTags, tag])}>{tags.find(t => t.id === tag).name}</p>
                ))}
              </div>
              }
          </div>
          <div className='Filter-tags-list'>
          {tags && tags.map((tag, i) => (
            <div key={i} className='Filter-tag-div'>
              <label htmlFor={`tag-${i}`}>
                <input
                  className=""
                  id={`tag-${i}`}
                  type='checkbox'
                  onChange={() => checkUncheckTag(tag.id)}
                  checked={currentTags.includes(tag.id)}
                  hidden
                ></input>
                <div className="Filter-tag-checkbox-btn">{tag?.name}</div>
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