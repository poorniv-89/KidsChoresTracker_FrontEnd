import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChildNavbar from '../components/ChildNavBar';
import ChildHistorySection from '../components/ChildHistorySection';

export default function ChildHistoryPage() {
    const { childId } = useParams();
    const [completedChores, setCompletedChores] = useState([]);
    const [pendingRewards, setPendingRewards] = useState([]);
    const [redeemedRewards, setRedeemedRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistoryData();
    }, [childId]);

    const fetchHistoryData = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/child/${childId}`);
            const child = res.data.details;
            setCompletedChores(child.completedChores || []);
            setPendingRewards(child.pendingRewards || []);
            setRedeemedRewards(child.redeemedRewards || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to load history.');
            setLoading(false);
        }
    };
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <ChildNavbar childId={childId} />
            <h1>Chore & Reward History</h1>
            <ChildHistorySection
                completedChores={completedChores}
                pendingRewards={pendingRewards}
                redeemedRewards={redeemedRewards}
            />
        </div>
    );
}