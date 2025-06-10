import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChildNavbar from '../components/ChildNavBar';

export default function ChildDashboardPage() {
    const { childId } = useParams();
    const [points, setPoints] = useState(0);
    const [chores, setChores] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [childName, setChildName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        fetchChildData();
        fetchQuote();
    }, [childId]);

    const fetchChildData = async () => {
        try {
            const availableRes = await axios.get(`http://localhost:3000/api/child/${childId}/available`);
            setPoints(availableRes.data.childPoints);
            setChores(availableRes.data.chores);
            setRewards(availableRes.data.rewards);
            const profileRes = await axios.get(`http://localhost:3000/api/child/${childId}`);
            setChildName(profileRes.data.details.name);
            setLoading(false);
        } catch (err) {
            setError('Failed to load child dashboard.');
            setLoading(false);
        }
    };

    const fetchQuote = async () => {
        try {
            const res = await fetch('https://api.realinspire.live/v1/quotes/random?limit=1&maxLength=120');
            const data = await res.json();
            setQuote({ text: data[0].content, author: data[0].author });
        } catch (err) {
            console.error('Failed to fetch quote');
        }
    };

    const handleCompleteChore = async (choreId) => {
        try {
            const res = await axios.put(`http://localhost:3000/api/child/${childId}/choreComplete`, {
                choreId,
            });
            setMessage(res.data.message);
            setPoints(res.data.updatedPoints);
            fetchChildData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete chore');
        }
    };

    const handleRequestReward = async (rewardId) => {
        try {
            const res = await axios.patch(`http://localhost:3000/api/child/${childId}/redeem`, {
                rewardId,
            });
            setMessage(res.data.message);
            fetchChildData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request reward');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <ChildNavbar childId={childId} />
            <h1>Welcome, {childName}!</h1>
            {quote && (
                <blockquote style={{ fontStyle: 'italic', margin: '1em 0' }}>
                    “{quote.text}” — {quote.author}
                </blockquote>
            )}
            <h1 id="dashboard">Child Dashboard</h1>
            <h2>Points: {points}</h2>

            {message && <p>{message}</p>}

            <h3 id="chores">Available Chores</h3>
            {chores.length === 0 ? (
                <p>No chores available.</p>
            ) : (
                <ul>
                    {chores.map(chore => (
                        <li key={chore._id}>
                            {chore.title} – {chore.points} pts
                            <button onClick={() => handleCompleteChore(chore._id)}>Mark as Done</button>
                        </li>
                    ))}
                </ul>
            )}

            <h3 id="rewards">Available Rewards</h3>
            {rewards.length === 0 ? (
                <p>No rewards available.</p>
            ) : (
                <ul>
                    {rewards.map(reward => (
                        <li key={reward._id}>
                            {reward.title} – {reward.pointsCost} pts
                            <button onClick={() => handleRequestReward(reward._id)}>Request Reward</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
