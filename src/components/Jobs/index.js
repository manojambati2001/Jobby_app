import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import JobItemCard from '../JobItemCard'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    activeCheckboxList: [],
    minSalary: '',
    searchInput: '',
    apiStatus: apiStatusConstants.inProgress,
    profileApiStatus: apiStatusConstants.inProgress,
    profileDetails: {},
  }

  componentDidMount() {
    this.getJobsData()
    this.getProfileData()
  }

  getJobsData = async () => {
    const {minSalary, searchInput, activeCheckboxList} = this.state
    const employmentType = activeCheckboxList.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minSalary}&search=${searchInput}`
    console.log(url)
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getProfileData = async () => {
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok === true) {
      const fetchData = await response.json()
      const updatedData = {
        name: fetchData.profile_details.name,
        profileImageUrl: fetchData.profile_details.profile_image_url,
        shortBio: fetchData.profile_details.short_bio,
      }
      console.log(updatedData)
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileData = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <>
        <img src={profileImageUrl} alt="profile" />
        <h1 className="name">{name}</h1>
        <p>{shortBio}</p>
      </>
    )
  }

  onChangeSalaryRange = event => {
    this.setState({minSalary: event.target.value}, this.getJobsData)
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickEnter = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onClickSearchIcon = () => {
    this.getJobsData()
  }

  onClickCheckbox = event => {
    const {activeCheckboxList} = this.state
    if (activeCheckboxList.includes(event.target.id)) {
      const updatedList = activeCheckboxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckboxList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          activeCheckboxList: [
            ...prevState.activeCheckboxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  renderFilterGroup = () => (
    <div className="filter-names">
      <h1 className="heading">Type of Employment</h1>
      <ul>
        {employmentTypesList.map(each => (
          <li key={each.employmentTypeId}>
            <input
              onChange={this.onClickCheckbox}
              type="checkbox"
              id={each.employmentTypeId}
            />
            <label htmlFor={each.employmentTypeId}>{each.label}</label>
          </li>
        ))}
      </ul>
      <hr />
      <h1 className="heading">Salary Range</h1>
      <ul>
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId}>
            <input
              value={each.salaryRangeId}
              type="radio"
              id={each.salaryRangeId}
              name="salary"
              onChange={this.onChangeSalaryRange}
            />
            <label htmlFor={each.salaryRangeId}>{each.label}</label>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  )

  renderSuccessView = () => {
    const {jobsList, searchInput} = this.state
    const showNoJobs = jobsList.length === 0
    return (
      <div className="jobs-bg-container">
        <div className="filter-group-container">
          <div className="profile-container">
            {this.renderProfileResultView()}
          </div>
          <hr />
          {this.renderFilterGroup()}
        </div>
        <div className="jobs-data-container">
          <div className="search-input-container">
            <input
              placeholder="Search"
              className="search-input"
              type="search"
              value={searchInput}
              onChange={this.onChangeSearch}
              onKeyDown={this.onClickEnter}
            />
            <button
              data-testid="searchButton"
              className="search-icon-button"
              type="button"
              onClick={this.onClickSearchIcon}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>

          <ul className="jobs-list">
            {showNoJobs
              ? this.renderNoJobView()
              : jobsList.map(each => (
                  <JobItemCard key={each.id} details={each} />
                ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderLoadingViewProfile = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryJobsData = () => this.getJobsData()

  onClickRetryProfileData = () => this.getProfileData()

  renderProfileFailureView = () => (
    <>
      <button
        type="button"
        onClick={this.onClickRetryProfileData}
        className="header-button"
      >
        Retry
      </button>
    </>
  )

  renderJobsFailureView = () => (
    <div className="jobs-bg-container">
      <div className="filter-group-container">
        <div className="profile-container">
          {this.renderProfileResultView()}
        </div>
        <hr />
        {this.renderFilterGroup()}
      </div>
      <div className="loader-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="jobs-failure-img"
        />
        <h1 className="heading">Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button
          type="button"
          onClick={this.onClickRetryJobsData}
          className="header-button"
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderNoJobView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-job-image"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileResultView = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileData()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingViewProfile()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderResult()}</div>
      </>
    )
  }
}

export default Jobs
