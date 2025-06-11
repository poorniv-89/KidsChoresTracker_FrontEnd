import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/ParentDashboardPage.css'

export default function ParentDashboardPage() {
    const { isParentLoggedIn, parentId } = useAuth();
    const navigate = useNavigate();
    const [parentData, setParentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingChores, setPendingChores] = useState([]);
    const [rejectingChore, setRejectingChore] = useState(null);
    const [rejectionComment, setRejectionComment] = useState('');

    const fetchParentData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/parent/${parentId}`);
            const data = response.data.parentDetails;
            setParentData(data);

            const pendingList = [];
            data.kids.forEach(kid => {
                kid.completedChores?.forEach(chore => {
                    if (chore.status === 'pending') {
                        pendingList.push({
                            choreId: chore._id,
                            choreTitle: chore.choreTitle,
                            pointsEarned: chore.pointsEarned,
                            childId: kid._id,
                            kidName: kid.name
                        });
                    }
                });
            });

            setPendingChores(pendingList);
            setLoading(false);
        } catch (err) {
            setError('Failed to load Parent dashboard data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isParentLoggedIn && parentId) {
            fetchParentData();
        }
    }, [isParentLoggedIn, parentId]);

    const handleApprove = async (childId, choreId) => {
        try {
            await axios.post(`http://localhost:3000/api/parent/${parentId}/approveChore`, {
                childId,
                choreId
            });
            fetchParentData();
        } catch (err) {
            console.error('Error approving chore:', err);
        }
    };

    const handleReject = async (childId, choreId, rejectionComment = '') => {
        try {
            await axios.post(`http://localhost:3000/api/parent/${parentId}/rejectChore`, {
                childId,
                choreId,
                rejectionComment
            });
            setRejectingChore(null);
            setRejectionComment('');
            fetchParentData();
        } catch (err) {
            console.error('Error rejecting chore:', err);
        }
    };

    if (!isParentLoggedIn) return <p>Please log in to view your dashboard.</p>;
    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p>{error}</p>;

    const { name, chores = [], rewards = [], kids = [] } = parentData;

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
                        {pendingChores.map((chore) => (
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

            <section className="quick-actions">
                <h2>Quick Actions</h2>
                <button onClick={() => navigate('/chores')}>➕ Add Chore</button>
                <button onClick={() => navigate('/rewards')}>🎁 Add Reward</button>
            </section>
        </div>
    );
}
