import React from "react";
import "./JobMatches.css";

export default function JobMatches({ matches }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="card">
        <h3>🎯 Job Matches</h3>
        <p className="no-matches">No matches found.</p>
      </div>
    );
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="card">
      <h3>🎯 Top Job Matches</h3>
      <p className="matches-sub">Based on your resume, here are your best-fit roles:</p>

      <div className="matches-list">
        {matches.map((match, i) => (
          <div key={i} className="match-card">
            <div className="match-header">
              <div className="match-title-group">
                <span className="medal">{medals[i] || "⭐"}</span>
                <div>
                  <p className="match-title">{match.title}</p>
                  <p className="match-company">{match.company}</p>
                </div>
              </div>
              <div className="match-score-badge" style={{
                background: match.match_score >= 80 ? "#dcfce7" : match.match_score >= 60 ? "#fef9c3" : "#fee2e2",
                color: match.match_score >= 80 ? "#166534" : match.match_score >= 60 ? "#854d0e" : "#991b1b",
              }}>
                {match.match_score}% match
              </div>
            </div>

            <div className="match-bar-bg">
              <div className="match-bar-fill" style={{
                width: `${match.match_score}%`,
                background: match.match_score >= 80 ? "#22c55e" : match.match_score >= 60 ? "#facc15" : "#f87171"
              }} />
            </div>

            {match.match_reason && (
              <p className="match-reason">✅ {match.match_reason}</p>
            )}
            {match.skill_gap && match.skill_gap !== "No major gaps identified." && (
              <p className="skill-gap">⚡ Gap: {match.skill_gap}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
