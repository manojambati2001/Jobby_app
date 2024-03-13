import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

const Home = () => (
  <div>
    <Header />
    <div className="home-bg-container">
      <h1>Find The Job That Fits Your Life</h1>
      <p>
        Millions of people are searching for jobs, salary information, company
        reviews
      </p>
      <Link to="/jobs">
        <button type="button" className="header-button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
