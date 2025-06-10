import React from 'react';

export default function MyKids({ kids }) {
    if (!kids || kids.length === 0) {
        return (
            <div>
                <h2>Your Kids</h2>
                <p>No kids linked to your profile.</p>
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
                            Dashboard Link: 
                            <button onClick={() => navigator.clipboard.writeText(`http://localhost:5173/child/${kid._id}`)}>
                                Copy Link
                            </button>
                        </p>
                        <p>Points: {kid.points}</p>
                        <p>Completed Chores: {kid.completedChores?.length || 0}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}