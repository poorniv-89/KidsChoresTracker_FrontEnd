import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function MyKids({ kids, showAddButton }) {
    const navigate = useNavigate();

    if (!kids || kids.length === 0) {
        return (
            <div>
                <h2>Your Kids</h2>
                <p>No kids linked to your profile.</p>
                {showAddButton && <button onClick={() => navigate('/add-kid')}>➕ Add Kid</button>}
            </div>
        );
    }

    return (
        <div>
            <h2>Your Kids</h2>
            <ul>
                {kids.map((kid) => (
                    <li key={kid._id}>
                        <h3>{kid.name}</h3>
                        <p>
                            Dashboard Link: **** (click to copy)
                            <button
                                onClick={() =>
                                    navigator.clipboard.writeText(`http://localhost:5173/child/${kid._id}`)
                                }
                            >
                                📋
                            </button>
                        </p>
                        <p>Points: {kid.points}</p>
                        <p>Completed Chores: {kid.completedChores?.length || 0}</p>
                    </li>
                ))}
            </ul>
            {showAddButton && <button onClick={() => navigate('/add-kid')}>➕ Add Kid</button>}
        </div>
    );
}