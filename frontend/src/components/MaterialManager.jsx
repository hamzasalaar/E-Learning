import React from "react";
import { MaterialCard } from "../components/MaterialCard";

const MaterialManager = ({
  editMode,
  newMaterial,
  uploadProgress,
  materials,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
  onFileChange,
  onRemoveFile,
}) => {
  return (
    <section className="materials-section">
      <h2>{editMode ? "Edit Material" : "Add New Material"}</h2>
      <form onSubmit={onSubmit} className="material-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={newMaterial.title}
            onChange={(e) => onChange("title", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            value={newMaterial.type}
            onChange={(e) => onChange("type", e.target.value)}
          >
            <option value="lecture">Lecture</option>
            <option value="video">Video</option>
            <option value="reading">Reading</option>
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>

        {newMaterial.type === "video" && (
          <div className="form-group">
            <label>Video URL</label>
            <input
              type="url"
              value={newMaterial.url}
              onChange={(e) => onChange("url", e.target.value)}
              required
            />
          </div>
        )}

        {newMaterial.type !== "video" && (
          <>
            <div className="form-group">
              <label>Instructions</label>
              <textarea
                value={newMaterial.instructions}
                onChange={(e) => onChange("instructions", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="datetime-local"
                value={newMaterial.dueDate}
                onChange={(e) => onChange("dueDate", e.target.value)}
              />
            </div>
          </>
        )}

        {newMaterial.type !== "video" && (
          <div className="form-group">
            <label>Upload File</label>
            <input
              type="file"
              name="files"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              multiple
              onChange={onFileChange}
            />
          </div>
        )}

        {newMaterial.file.length > 0 && (
          <ul className="file-preview-list">
            {newMaterial.file.map((file, index) => (
              <li key={index} className="file-preview-item">
                📄 {file.name}
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="remove-file-btn"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="form-actions">
          <button type="submit">{editMode ? "Update" : "Add"} Material</button>
          {editMode && <button type="button" onClick={onCancel}>Cancel</button>}
        </div>

        {uploadProgress > 0 && <p style={{ marginTop: "10px" }}>Upload: {uploadProgress}%</p>}
      </form>

      <h2 style={{ marginTop: "40px" }}>Course Materials</h2>
      {materials.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          No materials added yet. Use the form above to get started.
        </p>
      ) : (
        <div className="materials-grid">
          {materials.map((mat) => (
            <MaterialCard
              key={mat._id}
              mat={mat}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MaterialManager;
