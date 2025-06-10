import React from 'react';
import { Link } from 'react-router-dom';
import ChoreBlasterzLogo from '../assets/ChoreBlasterzLogo.svg';

export default function ChildNavbar({ childId }) {
  return (
    <nav>
      <div>
        <Link to={`/child/${childId}`}>
          <img src={ChoreBlasterzLogo} alt="ChoreBlasterz Logo" />
        </Link>
      </div>
      <ul>
        <li>
        <Link to={`/child/${childId}`}>Dashboard</Link>
        </li>
        <li>
          <Link to={`/child/${childId}/history`}>History</Link>
        </li>
        <li>
          <a href="/">Logout</a>
        </li>
      </ul>
    </nav>
  );
}
