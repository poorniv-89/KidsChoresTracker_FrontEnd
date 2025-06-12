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
  const [approvedMsg, setApprovedMsg] = useState([]);

  const previousApprovals = useRef({ completed: [], rewards: [] });
  const hasFetchedQuote = useRef(false);
  const hasShownModalToday = useRef(false);

  useEffect(() => {
    if (childId) {
      fetchChildData();
      fetchQuote();
    }
  }, [childId]);

  const isToday = (someDate) => {
    const today = new Date();
    return new Date(someDate).toDateString() === today.toDateString();
  };

  const fetchChildData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/child/${childId}/available`);
      setPoints(res.data.childPoints);
      setChores(res.data.chores);
      setRewards(res.data.rewards);

      const profileRes = await axios.get(`http://localhost:3000/api/child/${childId}`);
      const child = profileRes.data.details;
      setChildName(child.name);

      const completedToday = child.completedChores.filter(c => c.status === 'approved' && isToday(c.dateCompleted)).map(c => c.choreTitle);
      const approvedRewards = (child.redeemedRewards || [])
      .filter(r => isToday(r.dateRedeemed))
      .map(r => r.title);
      const rejectedRewards = (child.pendingRewards || [])
      .filter(r => isToday(r.dateRequested) && r.rejected)
      .map(r => r.title);

      const prevCompleted = previousApprovals.current.completed;
      const prevRewards = previousApprovals.current.rewards;

      const newChoreApprovals = completedToday.filter(title => !prevCompleted.includes(title));
      const newApprovedRewards = approvedRewards.filter(title => !prevRewards.includes(title));
      const newRejectedRewards = rejectedRewards.filter(title => !prevRewards.includes(title));

      if (!hasShownModalToday.current && (newChoreApprovals.length || newApprovedRewards.length || newRejectedRewards.length)) {
        const msgLines = [];
      
        if (newChoreApprovals.length) {
          msgLines.push(`✅ Chores approved: ${newChoreApprovals.join(', ')}`);
        }
        if (newApprovedRewards.length) {
          msgLines.push(`🎁 Rewards approved: ${newApprovedRewards.join(', ')}`);
        }
        if (newRejectedRewards.length) {
          msgLines.push(`❌ Rewards rejected: ${newRejectedRewards.join(', ')}`);
        }
      
        msgLines.push(`🎯 Updated Points: ${res.data.childPoints}`);
        setApprovedMsg(msgLines);
        hasShownModalToday.current = true;
      }
      previousApprovals.current.completed = completedToday;
      previousApprovals.current.rewards = [...approvedRewards, ...rejectedRewards];
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
      const responseMsg = res.data.message || 'Chore marked complete!';
      if (responseMsg.toLowerCase().includes('already')) {
        setApprovedMsg([responseMsg]);
      } else {
        setMessage(responseMsg);
      }
      fetchChildData();
    } catch (err) {
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
      setConfirmationMsg('Something went wrong. Please try again.');
    }
  };

  const closeModal = () => {
    setMessage('');
    setConfirmationMsg('');
    setApprovedMsg([]);
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

      {(message || confirmationMsg || approvedMsg.length > 0) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-message" onClick={(e) => e.stopPropagation()}>
            {approvedMsg.length > 0 ? (
              <ul className="status-list">
                {approvedMsg.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            ) : (
              <p>{message || confirmationMsg}</p>
            )}
            <button className="modal-close-btn" onClick={closeModal}>Got it</button>
          </div>
        </div>
      )}
    </>
  );
}
