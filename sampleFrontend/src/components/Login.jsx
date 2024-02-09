import { useState, useEffect } from 'react'; 
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import APIService from '../fetching/APIService';
import { useLocation } from 'react-router-dom';
import { useProfiles } from '../hooks/useFetch';
import '../CSS/Login.css';

import Nav from './Nav';

function Login({userLogged, userId}) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState('');
  
  const [token, setToken] = useCookies(['my-token']);

  const location = useLocation();
  const { register } = location.state;

  // useQuery
  const [users] = useProfiles();

  let navigate = useNavigate();


  useEffect(() => {

    if (register) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
    
    if (token['my-token'] && userId) {
      navigate(`/account/${userId}`);
    }
    
  }, [navigate, token, userId, register])

  function loginBtn() {

    APIService.LoginUser({ username, password })
      .then(res => {
        if (res.token && res.user_id) {
          // sets auth token in cookies && userId in local-storage
          setToken('my-token', res.token, {path: '/'})
          localStorage.setItem('user_id', parseInt(res.user_id));
        } else {
          setLoginErrors("Credentials didn't match");
        }

      })
      .catch(err => {
        console.log(err);
        setLoginErrors("Credentials didn't match")
      })
  }

  function registerBtn() {
    console.log(users.some(u => u.name === username));
    if (users?.length > 0 & users.some(u => u.name === username)) {
      setLoginErrors("Username taken");
      return;
    }
    if (password !== confirmPassword) {
      setLoginErrors("Passwords do not match")
      return;
    }
    APIService.RegisterUser({ username, password })
      .then(() => loginBtn())
      .catch(err => {
        console.log(err)
      })
  }


  return (
    <div className='Login'>

      <Nav userLogged={userLogged}  />

      {isLogin ? <h2>Log In</h2> : <h2>Register</h2>}
      
      {/*  LOGIN FORM  */}

      <div className="div-form">
        <div className="custom-input-div">
          <label htmlFor="username" className='custom-input-label'>Username: </label>
          <input
            className='custom-input-text'
            id='username'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="custom-input-div">
          <label htmlFor="password" className='custom-input-label'>Password: </label>
          <input
            className='custom-input-password'
            id='password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {!isLogin &&
          <div className='custom-input-div'>
            <label htmlFor="password-confirm" className='custom-input-label'>Confirm Password: </label>
            <input
              className='custom-input-password'
              id="password-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        }
      </div>

      {loginErrors &&
        <div className='login-errors'>
          {loginErrors}
        </div>
      }

      {/*  CHECKS IF MODE IS LOGIN OR REGISTER  */}
      {isLogin ? <button onClick={loginBtn} >LOGIN</button>
        :  
      <button onClick={registerBtn} >Register</button>}

      <div>
        <br />
        {isLogin ? <h5>No account? Please <button onClick={() => setIsLogin(false)}>Register</button> here</h5> 
          :
        <h5>If you have account, please <button onClick={() => setIsLogin(true)}>Log in</button></h5>}
      </div>


    </div>
  )
}

export default Login;