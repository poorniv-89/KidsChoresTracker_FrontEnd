import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MyKids from '../components/MyKids';

export default function MyKidsPage() {
    const { isParentLoggedIn, parentId } = useAuth();
    const [kids, setKids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchKids = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/parent/${parentId}`);
                setKids(res.data.parentDetails.kids || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load kids');
                setLoading(false);
            }
        };

        if (isParentLoggedIn && parentId) {
            fetchKids();
        }
    }, [isParentLoggedIn, parentId]);

    if (!isParentLoggedIn) return <p>Please log in to view your kids.</p>;
    if (loading) return <p>Loading kids...</p>;
    if (error) return <p>{error}</p>;

    return <MyKids kids={kids} showAddButton={true} />;;
}