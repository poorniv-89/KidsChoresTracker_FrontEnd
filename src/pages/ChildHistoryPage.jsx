import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChildNavbar from '../components/ChildNavBar';
import ChildHistorySection from '../components/ChildHistorySection';
import '../styles/ChildHistoryPage.css';
import API from '../config/api';

export default function ChildHistoryPage() {
  const { childId, token } = useParams();
  const [completedChores, setCompletedChores] = useState([]);
  const [pendingRewards, setPendingRewards] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [rejectedRewards, setRejectedRewards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChildHistory = async () => {
      try {
        if (!childId && !token) {
          setError("Missing child ID or token in URL.");
          return;
        }
  
        const path = childId
          ? `/child/${childId}`
          : `/child/token/${token}`;
  
        const res = await API.get(path);
        const data = res.data.details || res.data.child;
  
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
  }, [childId, token]);
  

  return (
    <>
     <ChildNavbar childId={childId} token={token} />
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
