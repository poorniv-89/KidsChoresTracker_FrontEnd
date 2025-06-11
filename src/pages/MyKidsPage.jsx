import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MyKids from '../components/MyKids';
import '../styles/MyKidsPage.css'; 

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

  if (!isParentLoggedIn) {
    return <div className="my-kids-container"><p>Please log in to view your kids.</p></div>;
  }

  if (loading) {
    return <div className="my-kids-container"><p>Loading kids...</p></div>;
  }

  if (error) {
    return <div className="my-kids-container"><p>{error}</p></div>;
  }

  return <MyKids kids={kids} showAddButton={true} />;
}