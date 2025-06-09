import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function RewardsPage() {
  const { parentId } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/parent/${parentId}`);
        setRewards(res.data.parentDetails.rewards || []);
      } catch (err) {
        setError('Failed to load rewards');
      } finally {
        setLoading(false);
      }
    };

    if (parentId) fetchRewards();
  }, [parentId]);

  if (loading) return <p>Loading rewards...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="rewards-page">
      <h1>Rewards</h1>
      <ul>
        {rewards.length === 0 ? (
          <p>No rewards added yet.</p>
        ) : (
          rewards.map((reward, index) => (
            <li key={index}>
              {reward.title} – {reward.pointsCost} pts
            </li>
          ))
        )}
      </ul>
    </div>
  );
}