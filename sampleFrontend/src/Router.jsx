import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './components/Login.jsx';
import App from './App.jsx';
import Account from './components/Account.jsx';
import { CookiesProvider, useCookies } from 'react-cookie';

// useQuery 
import { useLoggedUser } from './hooks/useFetch.js';
import DrumPad from './components/DrumPad.jsx';

function Router() {

  const [token,] = useCookies(["my-token"]);
  const user_id = localStorage.getItem("user_id");


  // Gets the user's profile if user_id saved in local storage & my-token exists
  const [userLogged, refetch] = useLoggedUser(user_id && Object.keys(token).length > 0 ? user_id : null)


  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path='/login'
            element={<Login
              userLogged={userLogged}
              userId={user_id}
              register={false}
            />}
          />
          <Route
            exact
            path='/'
            element={<App
              userLogged={userLogged}
              followingPage={false}
              loggedUserRefetch={refetch}
            />}
          />
          <Route
            exact
            path='/following'
            element={<App
              userLogged={userLogged}
              followingPage={true}
              loggedUserRefetch={refetch}
            />}
          />
          <Route
            path='/account/:id'
            element={<Account
              userLogged={userLogged}
              loggedUserRefetch={refetch}
            />}
          />
          <Route
            exact
            path='/drumpad'
            element={<DrumPad
              userLogged={userLogged}
            />}
          />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  )
}

export default Router;
