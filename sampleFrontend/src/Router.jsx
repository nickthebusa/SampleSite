import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './components/Login.jsx';
import App from './App.jsx';
import Account from './components/Account.jsx';
import { CookiesProvider } from 'react-cookie';

function Router() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/' element={<App />} />
          <Route exact path='/account' element={<Account />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  )
}

export default Router;