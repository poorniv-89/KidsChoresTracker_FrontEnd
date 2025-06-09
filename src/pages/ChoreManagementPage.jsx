import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ChoreManagementPage() {
  const { parentId } = useAuth();
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    if (parentId) fetchChores();
  }, [parentId]);

  if (loading) return <p>Loading chores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="chore-management">
      <h1>All Chores</h1>
      <ul>
        {chores.length === 0 ? (
          <p>No chores found.</p>
        ) : (
          chores.map((chore, index) => (
            <li key={index}>
              {chore.title} – {chore.points} pts
            </li>
          ))
        )}
      </ul>
    </div>
  );
}