import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './components/Login.jsx';
import App from './App.jsx';
import Account from './components/Account.jsx';
import { CookiesProvider, useCookies } from 'react-cookie';

// useQuery 
import { useLoggedUser} from './hooks/useFetch.js';
import DrumPad from './components/DrumPad.jsx';

function Router() {

  const [token,] = useCookies(["my-token"]);
  const user_id = localStorage.getItem("user_id");

  // only use user_id if user_id AND token
  const [userLogged, refetch] = useLoggedUser(user_id && token ? user_id : null)


  console.log('Router', userLogged, token['my-token'])
  
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route exact
            path='/login'
            element={<Login
              userLogged={userLogged}
              loggedUserRefetch={refetch}
              userId={user_id}
            />}
          />
          <Route exact
            path='/'
            element={<App
              userLogged={userLogged}
              following={false} 
              loggedUserRefetch={refetch}
            />}
          />
          <Route exact
            path='/following'
            element={<App
              userLogged={userLogged}
              following={true}
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
          <Route exact
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