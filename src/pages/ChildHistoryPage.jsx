import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChildNavbar from '../components/ChildNavBar';
import ChildHistorySection from '../components/ChildHistorySection';
import '../styles/ChildHistoryPage.css';

export default function ChildHistoryPage() {
  const { childId } = useParams();
  const [completedChores, setCompletedChores] = useState([]);
  const [pendingRewards, setPendingRewards] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [rejectedRewards, setRejectedRewards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChildHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/child/${childId}`);
        const data = res.data.details;

        setCompletedChores(data.completedChores || []);
        const allRewards = data.pendingRewards || [];

        const newPending = allRewards.filter(r => !r.approved && !r.rejected);
        const rejected = allRewards.filter(r => r.rejected);
        const redeemed = data.redeemedRewards || [];

        setPendingRewards(newPending);
        setRejectedRewards(rejected);
        setRedeemedRewards(redeemed);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError('Something went wrong while loading history.');
      }
    };

    fetchChildHistory();
  }, [childId]);

  return (
    <>
      <ChildNavbar childId={childId} />
      <div className="child-history-page">
        {error && <p className="status-msg">{error}</p>}
        <ChildHistorySection
          completedChores={completedChores}
          pendingRewards={pendingRewards}
          redeemedRewards={redeemedRewards}
          rejectedRewards={rejectedRewards}
        />
      </div>
    </>
  );
}