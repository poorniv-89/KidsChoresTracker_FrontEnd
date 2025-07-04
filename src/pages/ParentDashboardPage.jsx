import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ParentDashboardPage.css';
import API from '../config/api'; 

export default function ParentDashboardPage() {
  const { isParentLoggedIn, parentId } = useAuth();
  const navigate = useNavigate();

  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingChores, setPendingChores] = useState([]);
  const [pendingRewards, setPendingRewards] = useState([]);
  const [rejectingReward, setRejectingReward] = useState(null);
  const [rewardRejectionComment, setRewardRejectionComment] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [rejectingChore, setRejectingChore] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');

  const fetchParentData = async () => {
    try {
      console.log('Fetching dashboard data for parentId:', parentId);
      const response = await API.get(`/parent/${parentId}`);
      const data = response.data.parentDetails;

      setParentData(data);
      setPendingChores(response.data.pendingChores || []);
      setPendingRewards(response.data.pendingRewards || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load Parent dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isParentLoggedIn && parentId) {
      fetchParentData();
    } else {
      navigate('/'); 
    }
  }, [isParentLoggedIn, parentId, navigate]);

  const handleApprove = async (childId, choreId) => {
    try {
      await API.post(`/parent/${parentId}/approveChore`, { childId, choreId });
      setResponseMsg('✅ Chore approved!');
      fetchParentData();
      setTimeout(() => setResponseMsg(''), 5000);
    } catch (err) {
      console.error('Error approving chore:', err);
    }
  };

  const handleReject = async (childId, choreId, comment = '') => {
    try {
      await API.post(`/parent/${parentId}/rejectChore`, {
        childId,
        choreId,
        rejectionComment: comment
      });
      setResponseMsg('❌ Chore rejected.');
      setRejectingChore(null);
      setRejectionComment('');
      fetchParentData();
      setTimeout(() => setResponseMsg(''), 5000);
    } catch (err) {
      console.error('Error rejecting chore:', err);
    }
  };

  const handleApproveReward = async (childId, rewardId) => {
    try {
      await API.post(`/parent/${parentId}/approveReward`, { childId, rewardId });
      setResponseMsg('🎁 Reward request approved!');
      setRejectingReward(null);
      setRewardRejectionComment('');
      fetchParentData();
      setTimeout(() => setResponseMsg(''), 5000);
    } catch (err) {
      console.error('Error approving reward:', err);
    }
  };

  const handleRejectReward = async (childId, rewardId, comment = '') => {
    try {
      await API.post(`/parent/${parentId}/rejectReward`, {
        childId,
        rewardId,
        rejectionComment: comment
      });
      setResponseMsg('❌ Reward request rejected.');
      setRejectingReward(null);
      setRewardRejectionComment('');
      fetchParentData();
      setTimeout(() => setResponseMsg(''), 5000);
    } catch (err) {
      console.error('Error rejecting reward:', err);
      setResponseMsg('⚠️ Something went wrong while rejecting reward.');
      setTimeout(() => setResponseMsg(''), 5000);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  const { name, chores = [], rewards = [], kids = [] } = parentData || {};
  if (!parentData) return <p>Loading parent data...</p>;
  return (
    <div className="parent-dashboard">
      <h1>Welcome, {name}</h1>

      <section className="summary">
        <div>Total Kids: {kids.length}</div>
        <div>Total Chores: {chores.length}</div>
        <div>Total Rewards: {rewards.length}</div>
      </section>

      <section className="pending-chores">
        <h2>Pending Chores for Approval</h2>
        {pendingChores.length === 0 ? (
          <p>No pending chores right now.</p>
        ) : (
          <ul>
            {pendingChores.map(chore => (
              <li key={chore.choreId}>
                <div className="chore-details">
                  <strong>{chore.kidName}</strong>: {chore.choreTitle} – {chore.pointsEarned} pts
                </div>
                <div className="button-group">
                  <button onClick={() => handleApprove(chore.childId, chore.choreId)}>Approve</button>
                  <button className="reject" onClick={() => setRejectingChore(chore)}>Reject</button>
                </div>

                {rejectingChore?.choreId === chore.choreId && (
                  <div className="action-row">
                    <textarea
                      placeholder="Enter rejection reason"
                      value={rejectionComment}
                      onChange={(e) => setRejectionComment(e.target.value)}
                      rows={2}
                    />
                    <div className="button-group">
                      <button onClick={() => handleReject(chore.childId, chore.choreId, rejectionComment)}>Reject</button>
                      <button className="reject" onClick={() => {
                        setRejectingChore(null);
                        setRejectionComment('');
                      }}>Cancel</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="pending-rewards">
        <h2>Pending Reward Requests</h2>
        {pendingRewards.length === 0 ? (
          <p>No pending reward requests right now.</p>
        ) : (
          <ul>
            {pendingRewards.map(reward => (
              <li key={reward.rewardId}>
                <div className="chore-details">
                  <strong>{reward.kidName}</strong>: {reward.title} – {reward.pointsCost} pts
                </div>
                <div className="button-group">
                  <button onClick={() => handleApproveReward(reward.childId, reward.rewardId)}>Approve</button>
                  <button className="reject" onClick={() => setRejectingReward(reward)}>Reject</button>
                </div>

                {rejectingReward?.rewardId === reward.rewardId && (
                  <div className="action-row">
                    <textarea
                      placeholder="Enter rejection reason"
                      value={rewardRejectionComment}
                      onChange={(e) => setRewardRejectionComment(e.target.value)}
                      rows={2}
                    />
                    <div className="button-group">
                      <button onClick={() => handleRejectReward(reward.childId, reward.rewardId, rewardRejectionComment)}>Reject</button>
                      <button className="reject" onClick={() => {
                        setRejectingReward(null);
                        setRewardRejectionComment('');
                      }}>Cancel</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <button onClick={() => navigate('/chores')}>➕ Add Chore</button>
        <button onClick={() => navigate('/rewards')}>🎁 Add Reward</button>
      </section>

      {responseMsg && (
        <div className="parent-modal-overlay" onClick={() => setResponseMsg('')}>
          <div className="parent-modal-message" onClick={e => e.stopPropagation()}>
            <p>{responseMsg}</p>
            <button className="modal-close-btn" onClick={() => setResponseMsg('')}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
