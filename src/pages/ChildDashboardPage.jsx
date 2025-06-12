import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChildNavbar from '../components/ChildNavBar';
import '../styles/ChildDashboardPage.css';

export default function ChildDashboardPage() {
  const { childId } = useParams();
  const [points, setPoints] = useState(0);
  const [chores, setChores] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [childName, setChildName] = useState('');
  const [requestedRewardId, setRequestedRewardId] = useState(null);
  const [confirmationMsg, setConfirmationMsg] = useState('');
  const [message, setMessage] = useState('');
  const [quote, setQuote] = useState(null);
  const hasFetchedQuote = useRef(false);

  useEffect(() => {
    fetchChildData();
    fetchQuote();
  }, [childId]);

  const fetchChildData = async () => {
    const res = await axios.get(`http://localhost:3000/api/child/${childId}/available`);
    setPoints(res.data.childPoints);
    setChores(res.data.chores);
    setRewards(res.data.rewards);
    const profileRes = await axios.get(`http://localhost:3000/api/child/${childId}`);
    setChildName(profileRes.data.details.name);
  };

  const fetchQuote = async () => {
    if (hasFetchedQuote.current) return;
    hasFetchedQuote.current = true;

    try {
      const res = await fetch('https://api.realinspire.live/v1/quotes/random?limit=1&maxLength=120');
      const data = await res.json();
      setQuote({ text: data[0].content, author: data[0].author });
    } catch {
      console.log('Failed to fetch quote');
    }
  };

  const handleCompleteChore = async (choreId) => {
    try {
      const res = await axios.put(`http://localhost:3000/api/child/${childId}/choreComplete`, {
        choreId
      });
      setMessage(res.data.message);
      fetchChildData();
      setTimeout(() => setMessage(''), 3000); 
    } catch (err) {
      console.error('Failed to complete chore:', err);
      const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 3000); 
    }
  };

  const handleRequestReward = async (rewardId) => {
    try {
      await axios.patch(`http://localhost:3000/api/child/${childId}/redeem`, { rewardId });
      setRequestedRewardId(rewardId);
      setConfirmationMsg('Reward request sent for approval!');
      setTimeout(() => setConfirmationMsg(''), 3000); 
    } catch (err) {
      console.error('Failed to request reward:', err);
      setConfirmationMsg('Something went wrong. Please try again.');
      setTimeout(() => setConfirmationMsg(''), 3000); 
    }
  };

  return (
    <>
      <ChildNavbar childId={childId} />
      <div className="child-dashboard">
        {quote && (
          <div className="quote-standalone">
            “{quote.text}”<br />
            <span>— {quote.author}</span>
          </div>
        )}

        <div className="dashboard-container">
          <h1 className="welcome">Welcome, {childName}!</h1>
          <div className="points-box">Points: {points}</div>

          <div className="section chores">
            <h2>Available Chores</h2>
            {message && (
              <div className="status-msg">{message}</div>
            )}
            <ul>
              {chores.length === 0 ? (
                <p>No chores available.</p>
              ) : (
                chores.map(chore => (
                  <li key={chore._id}>
                    <span>{chore.title} – {chore.points} pts</span>
                    <button onClick={() => handleCompleteChore(chore._id)}>Mark as Done</button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="section rewards">
            <h2>Available Rewards</h2>
            {confirmationMsg && (
              <div className="status-msg">{confirmationMsg}</div>
            )}
            <ul>
              {rewards.length === 0 ? (
                <p>No rewards available.</p>
              ) : (
                rewards
                  .filter(reward => reward._id !== requestedRewardId)
                  .map(reward => (
                    <li key={reward._id}>
                      <span>{reward.title} – {reward.pointsCost} pts</span>
                      <button
                        onClick={() => handleRequestReward(reward._id)}
                        disabled={points < reward.pointsCost}
                      >
                        {points < reward.pointsCost ? 'Not Enough Points' : 'Request Reward'}
                      </button>
                    </li>
                  ))
              )}
            </ul>
          </div>
        </div>
      </div>
      {(message || confirmationMsg) && (
        <div className="modal-overlay">
          <div className="modal-message">
            <p>{message || confirmationMsg}</p>
          </div>
        </div>
      )}
    </>
  );
}
