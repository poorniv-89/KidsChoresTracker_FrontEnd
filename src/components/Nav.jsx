import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import ChoreBlasterzLogo from '../assets/ChoreBlasterzLogo.svg';
import '../App.css';

export default function Nav() {
  const { isParentLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isChildRoute = location.pathname.startsWith('/child/');
  if (isChildRoute) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="homeNav">
      <div className="navContainer">
        <Link to={isParentLoggedIn ? "/parent-dashboard" : "/"} className="logoLink">
          <img src={ChoreBlasterzLogo} alt="ChoreBlasterz Logo" className="logo" />
        </Link>

        <ul className="navList">
          {isParentLoggedIn ? (
            <>
              <li><Link to="/parent-dashboard">Dashboard</Link></li>
              <li><Link to="/chores">Manage Chores</Link></li>
              <li><Link to="/rewards">Manage Rewards</Link></li>
              <li><Link to="/my-kids">My Kids</Link></li>
              <li><button className="logoutBtn" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/auth">Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}