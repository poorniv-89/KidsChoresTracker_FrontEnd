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
  const [confirmationMsg, setConfirmationMsg] = useState('');
  const [message, setMessage] = useState('');
  const [quote, setQuote] = useState(null);
  const [approvalShown, setApprovalShown] = useState(() => {
    const saved = localStorage.getItem(`approval-shown-${childId}`);
    return saved === 'true';
  });


  const [approvedMsg, setApprovedMsg] = useState('');
  const previousApprovals = useRef({ completed: [], rewards: [] });

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
    const child = profileRes.data.details;
    setChildName(child.name);

    const newCompleted = child.completedChores.map(c => c.choreTitle);
    const prevCompleted = previousApprovals.current.completed;

    const newApprovals = newCompleted.filter(chore => !prevCompleted.includes(chore));

    const approvedRewards = child.requestedRewards?.filter(r => r.status === 'approved') || [];
    const prevRewards = previousApprovals.current.rewards;
    const newRewardApprovals = approvedRewards.filter(r => !prevRewards.includes(r.title));

    if ((newApprovals.length || newRewardApprovals.length) && !approvalShown) {
      let msg = '';
      if (newApprovals.length) msg += `🎉 Chores approved: ${newApprovals.join(', ')}. `;
      if (newRewardApprovals.length) msg += `🎁 Rewards approved: ${newRewardApprovals.map(r => r.title).join(', ')}. `;
      msg += `🎯 Updated Points: ${res.data.childPoints}`;
      setApprovedMsg(msg);
      setApprovalShown(true);
      localStorage.setItem(`approval-shown-${childId}`, 'true');
      setTimeout(() => setApprovedMsg(''), 5000);
    }

    previousApprovals.current.completed = newCompleted;
    previousApprovals.current.rewards = approvedRewards.map(r => r.title);
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
      const res = await axios.put(`http://localhost:3000/api/child/${childId}/choreComplete`, { choreId });
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
      setConfirmationMsg('Reward request sent for approval!');
      setTimeout(() => setConfirmationMsg(''), 3000);
      fetchChildData();
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
            {message && <div className="status-msg">{message}</div>}
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
            {confirmationMsg && <div className="status-msg">{confirmationMsg}</div>}
            <ul>
              {rewards.length === 0 ? (
                <p>No rewards available.</p>
              ) : (
                rewards.map(reward => (
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

      {(message || confirmationMsg || approvedMsg) && (
        <div className="modal-overlay">
          <div className="modal-message">
            <p>{message || confirmationMsg || approvedMsg}</p>
          </div>
        </div>
      )}
    </>
  );
}
