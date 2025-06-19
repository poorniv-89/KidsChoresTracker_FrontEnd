import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/NewChoresForm.css';
import API from '../config/api';

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
        await API.put(`/parent/${parentId}/chores/${choreToEdit._id}`, {
          title,
          points
        });
      } else {
        await API.post(`/parent/${parentId}/chores`, {
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
