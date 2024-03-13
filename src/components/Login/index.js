import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    textUsername: '',
    textPassword: '',
    error: '',
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onClickLogin = async event => {
    event.preventDefault()
    this.onBlurUsername()
    this.onBlurPassword()

    const {usernameInput, passwordInput} = this.state
    const userDetails = {
      username: usernameInput,
      password: passwordInput,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  onSuccess = token => {
    Cookies.set('jwt_token', token, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onFailure = msg => {
    this.setState({error: msg})
  }

  onBlurUsername = () => {
    const {usernameInput} = this.state
    if (usernameInput === '') {
      this.setState({textUsername: '*Required'})
    } else {
      this.setState({textUsername: ''})
    }
  }

  onBlurPassword = () => {
    const {passwordInput} = this.state
    if (passwordInput === '') {
      this.setState({textPassword: '*Required'})
    } else {
      this.setState({textPassword: ''})
    }
  }

  render() {
    const {usernameInput, passwordInput, textPassword, textUsername, error} =
      this.state

    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <form onSubmit={this.onClickLogin} className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <label htmlFor="username">USERNAME</label>
          <input
            placeholder="Username"
            className="input-container"
            value={usernameInput}
            type="text"
            id="username"
            onBlur={this.onBlurUsername}
            onChange={this.onChangeUsername}
          />
          <p className="error-msg">{textUsername}</p>
          <label htmlFor="password">PASSWORD</label>
          <input
            placeholder="Password"
            className="input-container"
            type="password"
            id="password"
            value={passwordInput}
            onBlur={this.onBlurPassword}
            onChange={this.onChangePassword}
          />
          <p className="error-msg">{textPassword}</p>
          <button className="login-button" type="submit">
            Login
          </button>
          <p className="error-msg">{error}</p>
        </form>
      </div>
    )
  }
}

export default Login
