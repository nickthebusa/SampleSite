import { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './components/Login.jsx';
import App from './App.jsx';
import Account from './components/Account.jsx';
import { CookiesProvider } from 'react-cookie';

function Router() {

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user_id");
    if (loggedInUser) {
      setUserId(loggedInUser);
    }
  }, [])

  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route exact
            path='/login'
            element={<Login />}
          />
          <Route exact
            path='/'
            element={<App userId={userId} />} />
          <Route 
            path='/account/:id'
            element={<Account />}
          />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  )
}

export default Router;