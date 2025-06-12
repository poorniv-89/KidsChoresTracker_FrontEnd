import React from 'react';
import { useParams } from 'react-router-dom';
import ChildNavbar from '../components/ChildNavBar';
import ChildHistorySection from '../components/ChildHistorySection';
import '../styles/ChildHistoryPage.css';

export default function ChildHistoryPage({ completedChores = [], pendingRewards = [], redeemedRewards = [] }) {
  const { childId } = useParams(); 

  return (
    <>
      <ChildNavbar childId={childId} /> 
      <div className="child-history-page">
        <ChildHistorySection
          completedChores={completedChores}
          pendingRewards={pendingRewards}
          redeemedRewards={redeemedRewards}
        />
      </div>
    </>
  );
}