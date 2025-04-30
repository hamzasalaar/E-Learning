import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import courseImage1 from "../assets/images/course-1.jpg";
import courseImage2 from "../assets/images/course-2.jpg";
import courseImage3 from "../assets/images/course-3.jpg";
import teacherImage1 from "../assets/images/teacher-1.jpg";
import teacherImage2 from "../assets/images/teacher-2.jpg";
import teacherImage3 from "../assets/images/teacher-3.jpg";
import teacherImage4 from "../assets/images/teacher-4.jpg";
import { ClearMessage } from "../redux/AuthSlice"; // update the path if needed

export default function Home() {

  
  const courses = [
    {
      id: 1,
      tag: "Popular",
      image: courseImage1,
      title: "Unconscious Bias",
      duration: "25 mins",
      price: "$15.90",
      discountedPrice: "Free",
      platform: "cloud academy",
      rating: "4.9",
      reviews: "43,435",
      added: true
    },
    {
      id: 2,
      tag: "Best Seller",
      image: courseImage2,
      title: "Communication",
      duration: "50 mins",
      price: "$15.90",
      platform: "Khan Academy",
      rating: "4.9",
      reviews: "30,435",
      added: false
    },
    {
      id: 3,
      tag: "New",
      image: courseImage3,
      title: "Data Science",
      duration: "40 mins",
      price: "$20.00",
      discountedPrice: "$15.00",
      platform: "edX",
      rating: "4.8",
      reviews: "25,123",
      added: false
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          {/* Left Content */}
          <div className="hero-text">
            <div className="search-box">
              <input type="text" placeholder="Search for courses" className="search-input" />
              <FaSearch className="search-icon" />
            </div>
            <h1 className="hero-title">Explore What Professionals Like You Are Learning The Most</h1>
            <Link to="/courses" className="hero-button">Visit Courses</Link>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="popular-courses">
        <div className="container">
          <h2 className="section-title">Popular Courses</h2>
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <span className={`tag ${course.tag}`}>{course.tag}</span>
                <img src={course.image} alt={course.title} className="course-image" />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>Duration: {course.duration}</p>
                  <p className="price">
                    {course.price} {course.discountedPrice && <span className="discount">{course.discountedPrice}</span>}
                  </p>
                  <p className="platform">{course.platform}</p>
                  <div className="rating">
                    {course.rating} ⭐ ({course.reviews})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructed Courses Section */}
      <section className="instructed-courses">
        <div className="container">
          <h2 className="section-title">Instructed Courses</h2>
          <p className="section-subtitle">
            Want Someone To Instruct You? No Worries, Here We Introduce Our CourseMania's
            Online Tutors To Assist & Guide You In Your Professional Path
          </p>
          <Link to="/find-tutor" className="find-tutor-button">Find A Tutor</Link>

          <h3 className="popular-tutors-title">Meet Our Popular Tutors</h3>

          <div className="tutors-grid">
            {/* Tutor 1 */}
            <div className="tutor-card">
              <img src={teacherImage1} alt="Robert James" className="tutor-image" />
              <h4 className="tutor-name">Robert James</h4>
              <p className="tutor-role">UI/UX Designer</p>
              <p className="tutor-courses">56 Courses</p>
              <p className="tutor-rating">⭐ 4.9 (76,335)</p>
            </div>

            {/* Tutor 2 */}
            <div className="tutor-card">
              <img src={teacherImage2} alt="Jessica Thomas" className="tutor-image" />
              <h4 className="tutor-name">Jessica Thomas</h4>
              <p className="tutor-role">Graphic Designer</p>
              <p className="tutor-courses">62 Courses</p>
              <p className="tutor-rating">⭐ 4.9 (87,532)</p>
            </div>

            {/* Tutor 3 */}
            <div className="tutor-card">
              <img src={teacherImage3} alt="Selena Mathew" className="tutor-image" />
              <h4 className="tutor-name">Selena Mathew</h4>
              <p className="tutor-role">Full Stack Developer</p>
              <p className="tutor-courses">37 Courses</p>
              <p className="tutor-rating">⭐ 4.8 (68,865)</p>
            </div>

            {/* Tutor 4 */}
            <div className="tutor-card">
              <img src={teacherImage4} alt="Tom Henry" className="tutor-image" />
              <h4 className="tutor-name">Tom Henry</h4>
              <p className="tutor-role">SQL, Tableau</p>
              <p className="tutor-courses">42 Courses</p>
              <p className="tutor-rating">⭐ 4.8 (89,973)</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}