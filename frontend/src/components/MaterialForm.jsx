import React from "react";

const MaterialForm = ({
  mode = "add", // "add" or "edit"
  newMaterial,
  setNewMaterial,
  handleSubmit,
  handleRemoveFile,
  handleFileChange,
  uploadProgress = 0,
  handleCancel,
}) => {
  return (
    <form onSubmit={handleSubmit} className="material-form">
      <h3>{mode === "edit" ? "Edit Material" : "Add New Material"}</h3>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={newMaterial.title}
          onChange={(e) =>
            setNewMaterial({ ...newMaterial, title: e.target.value })
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <select
          value={newMaterial.type}
          onChange={(e) =>
            setNewMaterial({ ...newMaterial, type: e.target.value })
          }
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
            onChange={(e) =>
              setNewMaterial({ ...newMaterial, url: e.target.value })
            }
            required
          />
        </div>
      )}

      {(newMaterial.type === "assignment" ||
        newMaterial.type === "reading" ||
        newMaterial.type === "lecture" ||
        newMaterial.type === "quiz") && (
        <>
          <div className="form-group">
            <label>Instructions</label>
            <textarea
              value={newMaterial.instructions}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, instructions: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="datetime-local"
              value={newMaterial.dueDate}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, dueDate: e.target.value })
              }
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
            onChange={handleFileChange}
          />
        </div>
      )}

      {newMaterial.file?.length > 0 && (
        <ul className="file-preview-list">
          {newMaterial.file.map((file, index) => (
            <li key={index} className="file-preview-item">
              📄 {file.name}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="remove-file-btn"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="form-actions">
        <button type="submit">
          {mode === "edit" ? "Update" : "Add"} Material
        </button>
        {mode === "edit" && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>

      {uploadProgress > 0 && (
        <p style={{ marginTop: "10px" }}>Upload: {uploadProgress}%</p>
      )}
    </form>
  );
};

export default MaterialForm;
