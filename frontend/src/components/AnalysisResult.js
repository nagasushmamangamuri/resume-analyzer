import React from "react";
import "./AnalysisResult.css";

export default function AnalysisResult({ analysis }) {
  const score = analysis.score || 0;
  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";

  return (
    <div className="card">
      <h3>📊 Resume Analysis</h3>

      <div className="score-section">
        <div className="score-circle" style={{ borderColor: color }}>
          <span className="score-number" style={{ color }}>{score}</span>
          <span className="score-label">/ 100</span>
        </div>
        <div className="score-info">
          <p className="score-title">Resume Score</p>
          <p className="score-sub" style={{ color }}>
            {score >= 80 ? "Excellent!" : score >= 60 ? "Good — room to grow" : "Needs improvement"}
          </p>
        </div>
      </div>

      {analysis.summary && (
        <div className="section">
          <h4>📝 Summary</h4>
          <p className="summary-text">{analysis.summary}</p>
        </div>
      )}

      {analysis.skills?.length > 0 && (
        <div className="section">
          <h4>🛠 Top Skills</h4>
          <div className="tags">
            {analysis.skills.map((s, i) => <span key={i} className="tag">{s}</span>)}
          </div>
        </div>
      )}

      {analysis.strengths?.length > 0 && (
        <div className="section">
          <h4>✅ Strengths</h4>
          <ul className="list green">
            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {analysis.weaknesses?.length > 0 && (
        <div className="section">
          <h4>⚠️ Areas to Improve</h4>
          <ul className="list orange">
            {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      {analysis.suggestions?.length > 0 && (
        <div className="section">
          <h4>💡 Suggestions</h4>
          <ul className="list blue">
            {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
