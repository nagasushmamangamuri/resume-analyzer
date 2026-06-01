import React, { useState } from "react";
import UploadSection from "./components/UploadSection";
import AnalysisResult from "./components/AnalysisResult";
import JobMatches from "./components/JobMatches";
import "./App.css";

function App() {
  const [step, setStep] = useState("upload");
  const [analysis, setAnalysis] = useState(null);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setStep("analyzing");
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);

      const matchRes = await fetch("http://localhost:8000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: data.resume_text }),
      });
      const matchData = await matchRes.json();
      setMatches(matchData.matches);
      setStep("results");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStep("upload");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setAnalysis(null);
    setMatches(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🤖 AI Resume Analyzer</h1>
          <p>Upload your resume — get instant AI analysis & top job matches</p>
        </div>
      </header>

      <main className="main">
        {error && <div className="error-banner">⚠️ {error}</div>}

        {step === "upload" && <UploadSection onUpload={handleUpload} />}

        {step === "analyzing" && (
          <div className="loading">
            <div className="spinner"></div>
            <h2>Analyzing your resume...</h2>
            <p>Our AI is reading your resume and finding the best job matches.</p>
          </div>
        )}

        {step === "results" && analysis && (
          <>
            <div className="results-header">
              <h2>Results for <span>{analysis.name || "Your Resume"}</span></h2>
              <button className="btn-secondary" onClick={handleReset}>
                ↩ Analyze Another Resume
              </button>
            </div>
            <div className="results-grid">
              <AnalysisResult analysis={analysis} />
              <JobMatches matches={matches} />
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>Built with React · FastAPI · OpenAI GPT-4o-mini · FAISS · LangChain</p>
      </footer>
    </div>
  );
}

export default App;
