import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/NewChoresForm.css'; // make sure to import your CSS

export default function ChoreForm({ choreToEdit, onSuccess }) {
  const { parentId } = useAuth();
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState('');
  const isEditing = Boolean(choreToEdit && choreToEdit._id);

  useEffect(() => {
    if (isEditing) {
      setTitle(choreToEdit.title || '');
      setPoints(choreToEdit.points || '');
    } else {
      setTitle('');
      setPoints('');
    }
  }, [choreToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/api/parent/${parentId}/chores/${choreToEdit._id}`, {
          title,
          points
        });
      } else {
        await axios.post(`http://localhost:3000/api/parent/${parentId}/chores`, {
          title,
          points
        });
      }
      setTitle('');
      setPoints('');
      onSuccess();
    } catch (err) {
      console.error('Error submitting chore:', err);
    }
  };

  return (
    <div className="chore-form">
      <h2>{isEditing ? 'Edit Chore' : 'Add New Chore'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            placeholder="Chore Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="points">Points</label>
          <input
            id="points"
            type="number"
            value={points}
            placeholder="Points"
            onChange={(e) => setPoints(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          {isEditing ? 'Update Chore' : 'Add Chore'}
        </button>
      </form>
    </div>
  );
}
