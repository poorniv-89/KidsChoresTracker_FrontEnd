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
  const [approvedMsg, setApprovedMsg] = useState('');
  const [shownItems, setShownItems] = useState(() => {
    const saved = localStorage.getItem(`shown-approvals-${childId}`);
    return saved ? JSON.parse(saved) : { chores: [], rewards: [] };
  });

  const previousApprovals = useRef({ completed: [], rewards: [] });
  const hasFetchedQuote = useRef(false);

  useEffect(() => {
    fetchChildData();
    fetchQuote();
  }, [childId]);

  const fetchChildData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/child/${childId}/available`);
      setPoints(res.data.childPoints);
      setChores(res.data.chores);
      setRewards(res.data.rewards);

      const profileRes = await axios.get(`http://localhost:3000/api/child/${childId}`);
      const child = profileRes.data.details;
      setChildName(child.name);

      const newCompleted = child.completedChores.map(c => c.choreTitle);
      const prevCompleted = previousApprovals.current.completed;
      const newChoreApprovals = newCompleted.filter(chore => !prevCompleted.includes(chore));

      const rewards = child.pendingRewards || [];
      const newlyApprovedRewards = rewards.filter(r => r.approved);
      const newlyRejectedRewards = rewards.filter(r => r.rejected);
      const prevRewards = previousApprovals.current.rewards;

      const newApproved = newlyApprovedRewards.filter(r => !prevRewards.includes(r.title));
      const newRejected = newlyRejectedRewards.filter(r => !prevRewards.includes(r.title));

      const unseenChores = newChoreApprovals.filter(chore => !shownItems.chores.includes(chore));
      const unseenApprovedRewards = newApproved.filter(r => !shownItems.rewards.includes(r.title));
      const unseenRejectedRewards = newRejected.filter(r => !shownItems.rewards.includes(r.title));

      if (unseenChores.length || unseenApprovedRewards.length || unseenRejectedRewards.length) {
        let msg = '';

        if (unseenChores.length) {
          msg += `✅ Chores approved: ${unseenChores.join(', ')}. `;
        }
        if (unseenApprovedRewards.length) {
          msg += `🏱 Rewards approved: ${unseenApprovedRewards.map(r => r.title).join(', ')}. `;
        }
        if (unseenRejectedRewards.length) {
          msg += `❌ Rewards rejected: ${unseenRejectedRewards.map(r => r.title).join(', ')}. `;
        }

        msg += `🎯 Updated Points: ${res.data.childPoints}`;
        setApprovedMsg(msg);

        const updatedShown = {
          chores: [...shownItems.chores, ...unseenChores],
          rewards: [...shownItems.rewards, ...unseenApprovedRewards.map(r => r.title), ...unseenRejectedRewards.map(r => r.title)],
        };
        setShownItems(updatedShown);
        localStorage.setItem(`shown-approvals-${childId}`, JSON.stringify(updatedShown));
      }

      previousApprovals.current.completed = newCompleted;
      previousApprovals.current.rewards = [...newApproved, ...newRejected].map(r => r.title);
    } catch (err) {
      console.error("Failed to fetch child data:", err);
    }
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
      setMessage(res.data.message || 'Chore marked complete!');
      fetchChildData();
    } catch (err) {
      console.error('Failed to complete chore:', err);
      const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage(errorMsg);
    }
  };

  const handleRequestReward = async (rewardId) => {
    try {
      await axios.patch(`http://localhost:3000/api/child/${childId}/redeem`, { rewardId });
      setConfirmationMsg('Reward request sent for approval!');
      fetchChildData();
    } catch (err) {
      console.error('Failed to request reward:', err);
      setConfirmationMsg('Something went wrong. Please try again.');
    }
  };

  const closeModal = () => {
    setMessage('');
    setConfirmationMsg('');
    setApprovedMsg('');
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
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-message" onClick={(e) => e.stopPropagation()}>
            <p>{message || confirmationMsg || approvedMsg}</p>
            <button className="modal-close-btn" onClick={closeModal}>Got it</button>
          </div>
        </div>
      )}
    </>
  );
}
