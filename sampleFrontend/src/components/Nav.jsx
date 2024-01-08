import { Link, useNavigate } from 'react-router-dom';
import samplesite_logo from '../pictures/samplesite_logo.png';
import {useCookies} from 'react-cookie';
import { useEffect, useState, useRef } from 'react';
import '../CSS/Nav.css';

function Nav({ userLogged, loggedUserRefetch, fromAccount }) {

  let navigate = useNavigate();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [token, , removeToken] = useCookies(['my-token']);
  
  const ref = useRef();
  const menuRef = useRef();

  // function debounce(func, wait) {
    //   let timeout;
    //   return function () {
    //     clearTimeout(timeout);
    //     timeout = setTimeout(() => func.apply(this, arguments), wait);
    //   }
    // }
  
  
  useEffect(() => {

    const handler = (e) => {
      if (navbarOpen && ref.current && !(ref.current.contains(e.target))
      && e.target !== menuRef.current) {
        setNavbarOpen(false);
      }
    }

    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    }
  }, [navbarOpen])


  function logOut() {
    if (token['my-token'] && userLogged)  {
      removeToken('my-token', {path: '/'});
      localStorage.removeItem("user_id");
      loggedUserRefetch();
      if (fromAccount) navigate('/')
      window.location.reload();
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
        {userLogged && <Link to={'/following'} onClick={loggedUserRefetch} >following</Link>}
        {userLogged && <Link to={`/account/${userLogged.user}`} reloadDocument>account</Link>}
        {userLogged ?
          <a onClick={logOut} className='link'>logout</a>
          :
          <Link to={"/login"}>login</Link>
        }
      </div>


        <div className={`menu-nav${navbarOpen ? ' show-menu' : ''}`}
        ref={ref}
        onClick={()=> {
          setNavbarOpen(false);
        }}
        >
          <Link to={'/'}>home</Link>
          {userLogged && <Link to={'/following'} onClick={loggedUserRefetch} >following</Link>}
          {userLogged && <Link reloadDocument to={`/account/${userLogged.user}`}>account</Link>}
            
          {userLogged ?
            <a onClick={logOut} className='link'>logout</a>
                          :
            <Link to={"/login"}>login</Link>
          }
        </div>
        

      <input
        onChange={() => setNavbarOpen(!navbarOpen)} 
        type="checkbox"
        role="button"
        name="nav"
        aria-label="Display the menu"
        className="menu"
        checked={navbarOpen}
        ref={menuRef}
      ></input>
      
    </div>
  )
}

export default Nav;