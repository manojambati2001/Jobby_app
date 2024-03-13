import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-bg-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-website-logo"
        />
      </Link>
      <ul className="nav-container">
        <li>
          <Link className="link" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="link" to="/jobs">
            Jobs
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={onClickLogout}
            className="header-button"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
