import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MyKids from '../components/MyKids';
import '../styles/MyKidsPage.css'; 
import API from '../config/api'; 

export default function MyKidsPage() {
  const { isParentLoggedIn, parentId } = useAuth();
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKids = async () => {
      try {
        const res = await API.get(`/parent/${parentId}`);
        setKids(res.data.parentDetails.kids || []);
      } catch (err) {
        setError('Failed to load kids');
      } finally {
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
