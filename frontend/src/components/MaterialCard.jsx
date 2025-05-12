// Refactored CourseContent UI with improved styling and icons
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaDownload, FaLink } from "react-icons/fa";

const MaterialCard = ({ mat, onEdit, onDelete }) => {
  return (
    <div className="material-card">
      <h4>{mat.title}</h4>
      <span className={`material-badge type-${mat.type}`}>
        Type :{" "}
        {mat.type.toUpperCase()}
      </span>
      {mat.dueDate && <p>Due: {new Date(mat.dueDate).toLocaleString()}</p>}
      <div className="material-actions">
        {mat.url ? (
          <a
            href={mat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-button"
          >
            <FaLink /> View
          </a>
        ) : mat.filePaths?.length > 0 ? (
          mat.filePaths.map((fp, idx) => (
            <a
              key={idx}
              href={`http://localhost:3000/${fp.replace(/\\/g, "/")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button"
            >
              <FaDownload /> File {idx + 1}
            </a>
          ))
        ) : (
          <span>No file</span>
        )}
        <button onClick={() => onEdit(mat)} className="icon-button">
          <FaEdit /> Edit
        </button>
        <button
          onClick={() => onDelete(mat._id)}
          className="icon-button danger"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

const CourseContentStyles = `
.material-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.material-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.icon-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  text-decoration: none;
}

.icon-button:hover {
  background-color: #4338ca;
}

.icon-button.danger {
  background-color: #dc2626;
}

.icon-button.danger:hover {
  background-color: #b91c1c;
}

.material-badge {
  display: inline-block;
  font-size: 12px;
  padding: 4px 8px;
  background-color: #e5e7eb;
  color: #374151;
  border-radius: 9999px;
  font-weight: 600;
}

.type-assignment { background: #fef3c7; color: #92400e; }
.type-video { background: #dbeafe; color: #1e40af; }
.type-reading { background: #fce7f3; color: #9d174d; }
.type-lecture { background: #e0f2fe; color: #0369a1; }
.type-quiz { background: #ede9fe; color: #5b21b6; }
`;

export { MaterialCard, CourseContentStyles };

// Inject styles in your main component file (e.g., CourseContent.jsx)
// import { MaterialCard, CourseContentStyles } from './MaterialCard';
// Then add: <style>{CourseContentStyles}</style> inside the return
