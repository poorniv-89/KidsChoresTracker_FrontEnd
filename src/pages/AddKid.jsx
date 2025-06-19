import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AddKidPage.css';
import API from '../config/api'; 

export default function AddKidPage() {
  const { parentId } = useAuth();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleAddKid = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/child', {
        name,
        parent: parentId,
      });
      const { childLink } = res.data;
      alert(`Share this link with your child: ${childLink}`);
      navigate('/parent-dashboard');
    } catch (err) {
      console.error('Failed to add kid:', err);
    }
  };

  return (
    <div className="add-kid-container">
      <h1>Add a New Kid</h1>
      <form onSubmit={handleAddKid}>
        <label>Kid's Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Add Kid</button>
      </form>
    </div>
  );
}
