import React, { useEffect, useState } from "react";
import axios from "axios";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        // Replace with your real endpoint
        const res = await axios.get("http://localhost:3000/api/public/tutors");
        setTutors(res.data.tutors || []);
      } catch (err) {
        console.error("Failed to fetch tutors:", err);
        // Mock fallback data
        setTutors([
          {
            id: 1,
            name: "Robert James",
            role: "UI/UX Designer",
            profilePicture: "https://i.postimg.cc/Ghzkf7ZK/teacher-1.jpg",
            rating: 4.9,
            totalCourses: 56,
          },
          {
            id: 2,
            name: "Jessica Thomas",
            role: "Graphic Designer",
            profilePicture: "https://i.postimg.cc/8cCPLGkW/teacher-2.jpg",
            rating: 4.8,
            totalCourses: 62,
          },
          {
            id: 3,
            name: "Selena Mathew",
            role: "Full Stack Developer",
            profilePicture: "https://i.postimg.cc/hPQjF7fC/teacher-3.jpg",
            rating: 4.9,
            totalCourses: 42,
          },
          {
            id: 4,
            name: "Tom Henry",
            role: "SQL Expert",
            profilePicture: "https://i.postimg.cc/T1b5bCPt/teacher-4.jpg",
            rating: 4.7,
            totalCourses: 37,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="tutors-page">
      <div className="container">
        <h2 className="page-title">Our Top Tutors</h2>
        <p className="page-subtitle">
          Meet our experienced instructors who are here to help you succeed.
        </p>

        {loading ? (
          <p className="loading">Loading tutors...</p>
        ) : (
          <div className="tutor-grid">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="tutor-card">
                <img src={tutor.profilePicture} alt={tutor.name} className="tutor-image" />
                <h4 className="tutor-name">{tutor.name}</h4>
                <p className="tutor-role">{tutor.role}</p>
                <p className="tutor-courses">{tutor.totalCourses} Courses</p>
                <p className="tutor-rating">⭐ {tutor.rating}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .tutors-page {
          padding: 50px 20px;
          background-color: #f9f9f9;
          font-family: 'Segoe UI', sans-serif;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .page-title {
          color: #006666;
          font-size: 32px;
          margin-bottom: 10px;
        }

        .page-subtitle {
          color: #444;
          font-size: 16px;
          margin-bottom: 30px;
        }

        .tutor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .tutor-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }

        .tutor-card:hover {
          transform: translateY(-5px);
        }

        .tutor-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 15px;
        }

        .tutor-name {
          font-size: 18px;
          color: #004d4d;
          margin: 5px 0;
        }

        .tutor-role {
          color: #666;
          font-size: 14px;
        }

        .tutor-courses,
        .tutor-rating {
          font-size: 14px;
          color: #555;
        }

        .loading {
          color: #555;
        }

        @media (max-width: 600px) {
          .page-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Tutors;
