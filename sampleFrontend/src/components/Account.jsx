import {useEffect} from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate, useParams} from 'react-router-dom';


function Account(props) {
  const [token, setToken] = useCookies(['my-token']);
  let navigate = useNavigate();

  const { id } = useParams();
  console.log(id);

  // useEffect(() => {
  //   if (!token['my-token']) {
  //     navigate('/login')
  //   }
  // })

  console.log(props);

  return (
    <div>
      Account
    </div>
  )
}

export default Account