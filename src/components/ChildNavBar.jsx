import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChoreBlasterzLogo from '../assets/ChoreBlasterzLogo.svg';

export default function ChildNavbar({ childId }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = () => {
    sessionStorage.setItem('cameFromDashboardNav', 'true');
  };

  return (
    <nav className="homeNav">
      <div className="navContainer">
        <Link to={`/child/${childId}`}>
          <img src={ChoreBlasterzLogo} alt="ChoreBlasterz Logo" style={{ height: '40px' }} />
        </Link>
        <ul className="navList">
          <li>
            <Link to={`/child/${childId}`} onClick={handleDashboardClick}>Dashboard</Link>
          </li>
          <li>
            <Link to={`/child/${childId}/history`}>History</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logoutBtn">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}