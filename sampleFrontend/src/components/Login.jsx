import { useState } from 'react'; 


function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  return (
    <div>

      {isLogin ? <h1>Log In</h1> : <h1>Register</h1>}
      
      <div className="username-div">
        <label htmlFor="username">Username: </label>
        <input id='username' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div className="password-div">
        <label htmlFor="password">Password-: </label>
        <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {/* {isLogin ? <button onClick={loginBtn} >LOGIN</button>
        :  
      <button onClick={registerBtn} >Register</button>} */}

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