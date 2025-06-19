import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChoreBlasterzLogo from '../assets/ChoreBlasterzLogo.svg';

export default function ChildNavbar({ childId, token }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = () => {
    sessionStorage.setItem('cameFromDashboardNav', 'true');
  };

  const dashboardLink = token ? `/child/token/${token}` : `/child/${childId}`;
  const historyLink = token ? `/child/token/${token}/history` : `/child/${childId}/history`;

  return (
    <nav className="homeNav">
      <div className="navContainer">
        <Link to={dashboardLink}>
          <img src={ChoreBlasterzLogo} alt="ChoreBlasterz Logo" style={{ height: '40px' }} />
        </Link>
        <ul className="navList">
          <li>
            <Link to={dashboardLink} onClick={handleDashboardClick}>Dashboard</Link>
          </li>
          <li>
            <Link to={historyLink}>History</Link>
          </li>
          {!token && (
            <li>
              <button onClick={handleLogout} className="logoutBtn">Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
