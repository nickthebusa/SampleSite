import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';


function Account() {
  const [token, setToken] = useCookies(['my-token']);
  let navigate = useNavigate();


  if (!token['my-token']) {
    navigate('/login')
  }


  return (
    <div>
      Account
    </div>
  )
}

export default Account