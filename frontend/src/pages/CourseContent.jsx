import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CourseContent = () => {
  const { id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);

  const sections = [
    "Announcements",
    "Course Outline",
    "Lecture Materials",
    "Lecture Recordings",
    "Assignments",
    "Projects",
    "Live Class (BBB)"
  ];

  return (
    <div style={styles.container}>
      <div style={styles.heading}>Manage Course Content</div>
      <div style={styles.subheading}>Course ID: {id}</div>

      <div style={styles.tabs}>
        {sections.map((label, index) => (
          <button
            key={index}
            style={styles.tab(tabIndex === index)}
            onClick={() => setTabIndex(index)}
          >
            {label}
          </button>
        ))}
      </div>

      {sections.map((section, index) =>
        tabIndex === index ? (
          <div style={styles.section} key={index}>
            <div style={styles.sectionHeader}>{section}</div>

            <div style={styles.formRow}>
              <input type="text" placeholder="Enter title..." style={styles.input} />
              <input type="file" />
              <button style={styles.button}>Upload</button>
            </div>

            <div style={styles.placeholder}>
              Existing content for <strong>{section}</strong> will be shown here.
            </div>

            {section === "Live Class (BBB)" && (
              <div style={{ marginTop: "20px" }}>
                <button style={styles.liveButton}>Start Live Class (BigBlueButton)</button>
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
};

// ✅ CSS after the return
const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  tab: (active) => ({
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: active ? "#1976d2" : "#f0f0f0",
    color: active ? "#fff" : "#000",
    borderRadius: "5px",
    border: "none",
  }),
  section: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "20px",
    padding: "15px",
  },
  sectionHeader: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "#fff",
    cursor: "pointer",
  },
  liveButton: {
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2e7d32",
    color: "#fff",
    cursor: "pointer",
  },
  placeholder: {
    color: "#888",
    fontStyle: "italic",
  },
};

export default CourseContent;
