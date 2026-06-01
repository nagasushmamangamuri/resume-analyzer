import React, { useState, useRef } from "react";
import "./UploadSection.css";

export default function UploadSection({ onUpload }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="upload-wrapper">
      <div className="upload-hero">
        <h2>Get AI Feedback on Your Resume</h2>
        <p>Upload your resume PDF and our AI will analyze your skills, score your resume, and match you with the best jobs.</p>
      </div>

      <div
        className={`dropzone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <div className="dropzone-icon">📄</div>
        {selectedFile ? (
          <>
            <p className="file-name">✅ {selectedFile.name}</p>
            <p className="file-hint">Click to change file</p>
          </>
        ) : (
          <>
            <p className="dropzone-text">Drag & drop your resume here</p>
            <p className="file-hint">or click to browse — PDF only</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {selectedFile && (
        <div className="upload-action">
          <button className="btn-primary" onClick={() => onUpload(selectedFile)}>
            🚀 Analyze My Resume
          </button>
        </div>
      )}

      <div className="features">
        <div className="feature">📊 <span>Resume Score</span></div>
        <div className="feature">💡 <span>Strengths & Gaps</span></div>
        <div className="feature">🎯 <span>Top Job Matches</span></div>
        <div className="feature">✏️ <span>Improvement Tips</span></div>
      </div>
    </div>
  );
}
