import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ParentDashboardPage() {
    const { isParentLoggedIn, parentId } = useAuth();
    const navigate = useNavigate();
    const [parentData, setParentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingChores, setPendingChores] = useState([]);
    const [rejectingChore, setRejectingChore] = useState(null);
    const [rejectionComment, setRejectionComment] = useState('');

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/parent/${parentId}`);
                setParentData(response.data.parentDetails);
                setPendingChores(response.data.pendingChores || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load Parent dashboard data');
                setLoading(false);
            }
        };

        if (isParentLoggedIn && parentId) {
            fetchParentData();
        }
    }, [isParentLoggedIn, parentId]);

    if (!isParentLoggedIn) return <p>Please log in to view your dashboard.</p>;
    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p>{error}</p>;

    const { name, chores = [], rewards = [], kids = [] } = parentData;
    console.log(kids);

    const handleApprove = async (childId, choreId) => {
        await axios.post(`http://localhost:3000/api/parent/${parentId}/approveChore`, {
            childId,
            choreId
        });
    };

    const handleReject = async (childId, choreId, rejectionComment = '') => {
        await axios.post(`http://localhost:3000/api/parent/${parentId}/rejectChore`, {
            childId,
            choreId,
            rejectionComment
        });
    }

    return (
        <div className="parent-dashboard">
            <h1>Welcome, {name}</h1>

            <section className="summary">
                <div>Total Kids: {kids.length}</div>
                <div>Total Chores: {chores.length}</div>
                <div>Total Rewards: {rewards.length}</div>
            </section>
            <section className="kids-overview">
                <h2>Your Kids</h2>
                {kids.length === 0 ? (
                    <p>No kids linked to your profile.</p>
                ) : (
                    <>
                        <ul>
                            {kids.map((kid) => (
                                <li key={kid._id}>
                                    <h3>{kid.name}</h3>
                                    <p>
                                        Dashboard Link:{" "}
                                        <a
                                            href={`http://localhost:5173/child/${kid._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {`http://localhost:5173/child/${kid._id}`}
                                        </a>
                                        <button
                                            onClick={() =>
                                                navigator.clipboard.writeText(`http://localhost:5173/child/${kid._id}`)
                                            }
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Copy Link
                                        </button>
                                    </p>
                                    <p>Points: {kid.points}</p>
                                    <p>Completed Chores: {kid.completedChores?.length || 0}</p>

                                    {kid.completedChores?.length > 0 && (
                                        <>
                                            <h4>Completed Chores</h4>
                                            <ul>
                                                {kid.completedChores.map((chore, i) => (
                                                    <li key={i}>
                                                        {chore.choreTitle} – {chore.pointsEarned} pts – {chore.status}
                                                        {chore.status === 'rejected' && (
                                                            <> (Reason: {chore.rejectionComment || 'N/A'})</>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                    {kid.pendingRewards?.length > 0 && (
                                        <>
                                            <h4>Pending Rewards</h4>
                                            <ul>
                                                {kid.pendingRewards.map((reward, i) => (
                                                    <li key={i}>
                                                        {reward.title} – {reward.pointsCost} pts – Requested on {new Date(reward.dateRequested).toLocaleDateString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                    {kid.redeemedRewards?.length > 0 && (
                                        <>
                                            <h4>Redeemed Rewards</h4>
                                            <ul>
                                                {kid.redeemedRewards.map((reward, i) => (
                                                    <li key={i}>
                                                        {reward.title} – {reward.pointsCost} pts – Redeemed on {new Date(reward.dateRedeemed).toLocaleDateString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => navigate('/add-kid')}>➕ Add Kid</button>
                    </>

                )}
            </section>
            <section className="pending-chores">
                <h2>Pending Chores for Approval</h2>
                {pendingChores.length === 0 ? (
                    <p>No pending chores right now.</p>
                ) : (
                    <ul>
                        {pendingChores.map((chore, index) => (
                            <li key={chore.choreId}>
                                <strong>{chore.kidName}</strong>: {chore.choreTitle} – {chore.pointsEarned} pts
                                <button onClick={() => handleApprove(chore.childId, chore.choreId)}>Approve</button>
                                <button onClick={() => setRejectingChore(chore)}> Reject</button>

                                {rejectingChore?.choreId === chore.choreId && (
                                    <div>
                                        <textarea
                                            placeholder="Enter rejection reason"
                                            value={rejectionComment}
                                            onChange={(e) => setRejectionComment(e.target.value)}
                                            rows={3}
                                            cols={40}
                                        />
                                        <button onClick={() => {
                                            handleReject(chore.childId, chore.choreId, rejectionComment);
                                            setRejectingChore(null);
                                            setRejectionComment('');
                                        }}>
                                            Reject
                                        </button>
                                        <button onClick={() => {
                                            setRejectingChore(null);
                                            setRejectionComment('');
                                        }}>
                                            Cancel
                                        </button>
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
        </div>
    );
}