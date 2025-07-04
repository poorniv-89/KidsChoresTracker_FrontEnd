import { useNavigate } from 'react-router-dom';
import React from 'react';
import '../styles/MyKidsPage.css';

export default function MyKids({ kids, showAddButton }) {
  const navigate = useNavigate();
  const appBaseURL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173';
  console.log('APP BASE URL:', appBaseURL);
  return (
    <div className="my-kids-container">
      <h2>My Kids</h2>

      {(!kids || kids.length === 0) ? (
        <p>No kids linked to your profile.</p>
      ) : (
        <div className="kids-grid">
          {kids.map((kid) => (
            <div className="kid-card" key={kid._id}>
              <h3>{kid.name}</h3>
              <p>Points: {kid.points}</p>
              <p>Completed Chores: {kid.completedChores?.length || 0}</p>
              <button
                className="copy-button"
                onClick={() =>
                  navigator.clipboard.writeText(`${appBaseURL}/child/token/${kid.publicLinkToken}`)
                }
              >
                📋 Copy Dashboard Link
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddButton && (
        <button className="add-kid-button" onClick={() => navigate('/add-kid')}>
          ➕ Add Kid
        </button>
      )}
    </div>
  );
}