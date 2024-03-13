import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import SimilarJobsCard from '../SimilarJobsCard'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    apiStatus: apiStatusConstants.initial,
    skills: [],
    similarJobs: [],
    lifeAtCompany: {},
  }

  componentDidMount() {
    this.getJobItemDetailsData()
  }

  getJobItemDetailsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const each = {...fetchedData.job_details}
      const updatedItemDetails = {
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
        companyWebsiteUrl: each.company_website_url,
        lifeAtCompany: {
          description: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
      }
      const skills = each.skills.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))
      const similarJobs = fetchedData.similar_jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobItemDetails: updatedItemDetails,
        apiStatus: apiStatusConstants.success,
        skills,
        similarJobs,
        lifeAtCompany: updatedItemDetails.lifeAtCompany,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {skills, similarJobs, jobItemDetails, lifeAtCompany} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      packagePerAnnum,
      location,
      jobDescription,
      employmentType,
    } = jobItemDetails
    return (
      <div className="job-item-details-bg-container">
        <div className="job-item-card-container">
          <div className="company-logo-name-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1 className="heading">{title}</h1>
              <div className="rating-container">
                <AiFillStar color="gold" size={25} />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="in-line">
            <div className="in-row">
              <div className="location-container">
                <MdLocationOn size={25} />
                <p>{location}</p>
              </div>
              <div className="location-container">
                <BsBriefcaseFill size={20} />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <div className="company-website-url-container">
              <h1 className="heading-element">Description</h1>
              <a href={companyWebsiteUrl}>Visit</a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <hr />
          <div>
            <h1 className="heading-element">Skills</h1>
            <ul className="skills-list">
              {skills.map(each => (
                <li key={each.name} className="each-skill">
                  <img
                    src={each.imageUrl}
                    alt={each.name}
                    className="skill-img"
                  />
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className="heading-element">Life at Company</h1>
            <div className="lifeAtCompany-container">
              <p>{lifeAtCompany.description}</p>
              <img
                className="lifeAtCompany-img"
                src={lifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <h1 className="heading-element">Similar Jobs</h1>
        <ul className="similar-job-list">
          {similarJobs.map(each => (
            <SimilarJobsCard details={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  onClickRetry = () => {
    this.getJobItemDetailsData()
  }

  renderFailureView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        onClick={this.onClickRetry}
        className="header-button"
      >
        Retry
      </button>
    </div>
  )

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderResult()}
      </>
    )
  }
}

export default JobItemDetails
