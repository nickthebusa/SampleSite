import nic_logo from '../pictures/nic_logo.png';

function Nav() {
  return (
    <div className='Nav'>

      <img className='Nav-logo' src={nic_logo} alt="nick_logo" />
      <h1>Sampler</h1>
      <a href="/">Home</a>
      <a href="/following">Following</a>
      <a href="/search">Search</a>

      <div>
        <a href="/login">Login</a>
      </div>

    </div>
  )
}

export default Nav