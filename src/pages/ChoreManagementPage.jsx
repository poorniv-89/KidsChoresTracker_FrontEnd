import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ChoreForm from '../components/NewChoresForm';
import '../styles/ChoreManagementPage.css';


export default function ChoreManagementPage() {
  const { parentId } = useAuth();
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [choreToEdit, setChoreToEdit] = useState(null);

  const fetchChores = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/parent/${parentId}`);
      setChores(res.data.parentDetails.chores || []);
    } catch (err) {
      setError('Failed to load chores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) fetchChores();
  }, [parentId]);

  const handleDelete = async (choreId) => {
    try {
      await axios.delete(`http://localhost:3000/api/parent/${parentId}/chores/${choreId}`);
      fetchChores();
    } catch (err) {
      setError('Failed to delete chore');
    }
  };

  if (loading) return <p>Loading chores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="chore-management">
      <h1>Manage Chores</h1>

      <ChoreForm choreToEdit={choreToEdit} onSuccess={() => {
        fetchChores();
        setChoreToEdit(null);
      }} />
      <ul className="chore-list">
        {chores.length === 0 ? (
          <p>No chores found.</p>
        ) : (
          chores.map((chore, index) => (
            <li key={index}>
              <span>{chore.title} – {chore.points} pts</span>
              <button onClick={() => setChoreToEdit({ ...chore, index })}>Edit</button>
              <button onClick={() => handleDelete(chore._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
