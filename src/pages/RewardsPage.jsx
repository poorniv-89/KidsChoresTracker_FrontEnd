import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/RewardsPage.css'; 

export default function RewardsPage() {
  const { parentId } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPoints, setNewPoints] = useState('');

  const fetchRewards = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/parent/${parentId}`);
      const allRewards = res.data.parentDetails.rewards || [];
      setRewards(allRewards.filter(r => !r.deleted));
    } catch (err) {
      setError('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) fetchRewards();
  }, [parentId]);

  const handleAddReward = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPoints) return;

    try {
      const newReward = { title: newTitle, pointsCost: parseInt(newPoints) };
      await axios.post(`http://localhost:3000/api/parent/${parentId}/rewards`, newReward);
      setNewTitle('');
      setNewPoints('');
      fetchRewards();
    } catch (err) {
      setError('Failed to add reward');
    }
  };

  const handleDelete = async (rewardId) => {
    try {
      await axios.delete(`http://localhost:3000/api/parent/${parentId}/rewards/${rewardId}`);
      fetchRewards();
    } catch (err) {
      setError('Failed to delete reward');
    }
  };

  if (loading) return <p>Loading rewards...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="rewards-management">
      <h1>Rewards</h1>

      <form onSubmit={handleAddReward} className="reward-form">
        <h2>Add New Reward</h2>
        <input
          type="text"
          placeholder="Reward Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Points Cost"
          value={newPoints}
          onChange={(e) => setNewPoints(e.target.value)}
          required
        />

        <button type="submit">Add Reward</button>
      </form>

      <ul className="reward-list">
        {rewards.length === 0 ? (
          <p>No rewards added yet.</p>
        ) : (
          rewards.map((reward) => (
            <li key={reward._id}>
              <span>{reward.title} – {reward.pointsCost} pts</span>
              <button onClick={() => handleDelete(reward._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}