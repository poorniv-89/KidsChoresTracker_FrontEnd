import React from 'react';
import { Link } from 'react-router-dom';
import ChoreBlasterzLogo from '../assets/ChoreBlasterzLogo.svg';

export default function ChildNavbar({ childId }) {
  return (
    <nav className="homeNav">
      <div className="navContainer">
        <Link to={`/child/${childId}`}>
          <img src={ChoreBlasterzLogo} alt="ChoreBlasterz Logo" style={{ height: '40px' }} />
        </Link>
        <ul className="navList">
          <li>
            <Link to={`/child/${childId}`}>Dashboard</Link>
          </li>
          <li>
            <Link to={`/child/${childId}/history`}>History</Link>
          </li>
          <li>
            <a href="/" className="logoutBtn">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
