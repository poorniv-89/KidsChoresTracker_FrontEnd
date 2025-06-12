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
  const [modalMsg, setModalMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChildHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/child/${childId}`);
        const data = res.data.details;
  
        setCompletedChores(data.completedChores || []);
        const allRewards = data.pendingRewards || [];
  
        const newPending = allRewards.filter(r => !r.approved && !r.rejected);
        const approved = allRewards.filter(r => r.approved);
        const rejected = allRewards.filter(r => r.rejected);
        const redeemed = data.redeemedRewards || [];
  
        setPendingRewards(newPending);
        setRedeemedRewards(redeemed);
  
        const shownKey = `rewards-shown-${childId}`;
        const shownTitles = JSON.parse(localStorage.getItem(shownKey)) || [];
  
        const newlyApproved = approved.filter(r => !shownTitles.includes(r.title));
        const newlyRejected = rejected.filter(r => !shownTitles.includes(r.title));
  
        if (newlyApproved.length || newlyRejected.length) {
          let msg = '';
          if (newlyApproved.length) {
            msg += `🎁 Approved reward(s): ${newlyApproved.map(r => r.title).join(', ')}.\n`;
          }
          if (newlyRejected.length) {
            msg += `❌ Rejected reward(s): ${newlyRejected.map(r => r.title).join(', ')}.`;
          }
          setModalMsg(msg);

          const updatedTitles = [...shownTitles, ...newlyApproved.map(r => r.title), ...newlyRejected.map(r => r.title)];
          localStorage.setItem(shownKey, JSON.stringify(updatedTitles));
  
          setTimeout(() => setModalMsg(''), 2000);
        }
  
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
        />
      </div>
      {modalMsg && (
  <div className="modal-overlay">
    <div className="modal-message">
      {modalMsg}
    </div>
  </div>
)}
    </>
  );
}
