import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  const aboutImage = "https://i.postimg.cc/tC2wG0SJ/pexels-nicole-berro-991141-2393793.jpg"; // Replace with your PostImages link

  return (
    <div className="about-wrapper">
      <div className="about-container">
        <div className="about-image-wrapper">
          <img src={aboutImage} alt="About Us" className="about-image" />
        </div>
        <div className="about-content">
          <h4 className="about-subtitle">Innovative Business</h4>
          <h1 className="about-title">About Us</h1>
          <p className="about-description">
            We believe education should be accessible to everyone, everywhere. Our platform empowers students
            to grow their careers with guidance from experienced professionals. Join us and explore a world
            of knowledge.
          </p>
          <Link to="#/learn-more" className="about-button">
            Learn More
          </Link>
        </div>
      </div>

      <p className="image-credit">
        Image from <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer">Freepik</a>
      </p>

      <style>{`
        .about-wrapper {
          background-color:  #ffffff;
          padding: 60px 20px;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .about-container {
          display: flex;
          flex-wrap: wrap;
          max-width: 1000px;
          margin: 0 auto;
          background-color: #fdfdfd;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .about-image-wrapper {
          flex: 1 1 50%;
          min-height: 300px;
        }

        .about-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .about-content {
          flex: 1 1 50%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .about-subtitle {
          text-transform: uppercase;
          font-size: 14px;
          letter-spacing: 1px;
          color: #7a7a7a;
          margin-bottom: 10px;
        }

        .about-title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #2c3e50;
        }

        .about-description {
          font-size: 16px;
          color: #444;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .about-button {
          background-color: #5c6b7e;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          font-size: 14px;
          border-radius: 4px;
          transition: background-color 0.3s;
          display: inline-block;
        }

        .about-button:hover {
          background-color: #3b4a5c;
        }

        .image-credit {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #e6ecf2;
        }

        .image-credit a {
          color: #fff;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .about-container {
            flex-direction: column;
          }

          .about-content {
            padding: 25px;
          }

          .about-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
