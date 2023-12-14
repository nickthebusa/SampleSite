import { Link } from 'react-router-dom';
import samplesite_logo from '../pictures/samplesite_logo.png';
import {useCookies} from 'react-cookie';
import { useEffect, useState, useRef } from 'react';


function Nav({ loggedIn, userId }) {

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [token, , removeToken] = useCookies(['my-token']);
  
  const ref = useRef();
  const menuRef = useRef();
  
  useEffect(() => {
    function handler(e) {
      if (navbarOpen && ref.current && !ref.current.contains(e.target)) {
        setNavbarOpen(false);
        menuRef.current.checked = false;
      }
    }
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    }
  }, [navbarOpen])

  function logOut() {
    if (token['my-token'] && loggedIn)  {
      removeToken('my-token');
      localStorage.removeItem("user_id");
    }
  }


  return ( 
    <div className='Nav'>

      <Link to={'/'} className='logo-and-name'>
        <div className='Nav-img-wrapper'>
          <img className='Nav-img' src={samplesite_logo} alt="nick_logo" />
        </div>
        <h1 className='Nav-name'>Sampler</h1>
      </Link>

      <div className='Nav-links'>
        <Link to={'/'}>home</Link>
        <Link to={'/'}>following</Link>
        <Link to={'/'}>search</Link>
        {loggedIn && <Link to={`/account/${userId}`}>account</Link>}
        {loggedIn ?
          <a onClick={logOut} className='link'>logout</a>
          :
          <Link to={"/login"}>login</Link>
        }
      </div>


        <div className={`menu-nav${navbarOpen ? ' show-menu' : ''}`}
        onClick={() => {
          setNavbarOpen(false)
          menuRef.current.checked = false;
        }}
        ref={ref}
        >
            <Link to={'/'}>home</Link>
            <Link to={'/'}>following</Link>
            <Link to={'/'}>search</Link>
            {loggedIn && <Link to={`/account/${userId}`}>account</Link>}
            {loggedIn ?
            <a onClick={logOut} className='link'>logout</a>
                          :
            <Link to={"/login"}>login</Link>
            }
        </div>
        

      <input
        onClick={() => setNavbarOpen(!navbarOpen)}
        type="checkbox"
        role="button"
        aria-label="Display the menu"
        className="menu"
        ref={menuRef}
      ></input>
      
    </div>
  )
}

export default Nav;