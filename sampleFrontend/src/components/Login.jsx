import { useState, useEffect } from 'react'; 
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import APIService from '../fetching/APIService';

import Nav from './Nav';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useCookies(['my-token']);

  let navigate = useNavigate();

  useEffect(() => {
    
    if (token['my-token'] && userId) {
      navigate(`/account/${userId}`);
    }
    
  }, [navigate, token, userId])

  function loginBtn() {

    APIService.LoginUser({ username, password })
      .then(res => {
        setToken('my-token', res.token)
        setUserId(res.user_id)
        localStorage.setItem('user_id', parseInt(res.user_id));
      })
      .catch(err => console.log(err))
  }

  function registerBtn() {
    APIService.RegisterUser({ username, password })
      .then(() => loginBtn())
      .catch(err => console.log(err))
  }


  return (
    <div>

      <Nav loggedIn={false} />

      {isLogin ? <h1>Log In</h1> : <h1>Register</h1>}
      
      <div className="username-div">
        <label htmlFor="username">Username: </label>
        <input id='username' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div className="password-div">
        <label htmlFor="password">Password: </label>
        <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

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