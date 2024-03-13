import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobsCard = props => {
  const {details} = props
  const {
    companyLogoUrl,
    title,
    rating,
    packagePerAnnum,
    location,
    jobDescription,
    employmentType,
  } = details
  return (
    <li className="similar-job-item-card-container">
      <div className="company-logo-name-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
        <h1 className="heading">Description</h1>
        <p>{jobDescription}</p>
      </div>
    </li>
  )
}
export default SimilarJobsCard
