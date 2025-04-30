import { Link } from "react-router-dom";
import { FaStar, } from "react-icons/fa";
import "../styles.css";
import courseImage1 from "../assets/images/course-1.jpg";
import cloudAcademyLogo from "../assets/images/logoen@2x.png"; // Import the logo image

const CourseDetails = () => {
  // const { courseId } = useParams(); // To dynamically get course data in the future

  return (
    <div className="course-details">
      <section className="course-main">
        <h2 className="course-name">Unconscious Bias</h2>
        <div className="video-preview">
          <img src={courseImage1} alt="Course Preview" className="preview-image" />
        
        </div>
        <div className="course-meta">
          <span className="badge popular">Popular</span>
          <span className="duration">25mins</span>
          <div className="rating">
            <FaStar color="gold" /> <FaStar color="gold" /> <FaStar color="gold" /> <FaStar color="gold" /> <FaStar color="gold" />
            <span>(43,435)</span>
          </div>
        </div>

        <div className="course-info">
          <p><strong>Creator:</strong> <Link to="/instructor">Boma Jacob</Link></p>
          <p><strong>Updated:</strong> Dec 12, 2022</p>
          <p><strong>Duration:</strong> 25mins</p>
          <p><strong>Language:</strong> English</p>
        </div>

        <div className="cta-buttons">
          <button className="enroll-button">Enroll Now</button>
          <button className="price-button">Free</button>
        </div>
      </section>

      <section className="course-details-section">
        <h3>Details</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </section>

      <section className="lessons-section">
        <h3>Lessons</h3>
        <ul>
          <li><strong>Lesson 1:</strong> Lesson Title</li>
          <li><strong>Lesson 2:</strong> Lesson Title</li>
          <li><strong>Lesson 3:</strong> Lesson Title</li>
        </ul>
      </section>

      <section className="reviews-section">
        <h3>Write A Review</h3>
        <textarea placeholder="Type something..."></textarea>
        <div className="review-actions">
          <div className="stars">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </div>
          <Link to="/reviews">View Other's Reviews</Link>
        </div>
      </section>

      <footer className="course-footer">
        <img src={cloudAcademyLogo} alt="Cloud Academy" className="footer-logo" />
      </footer>
    </div>
  );
};

export default CourseDetails;