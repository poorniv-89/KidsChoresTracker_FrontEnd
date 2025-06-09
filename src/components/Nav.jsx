import { Link } from "react-router-dom";
import ChoreBlasterzLogo from '../assets/ChoreBlasterzLogo.svg';

export default function Nav() {
  return (
    <nav className="homeNav">
      <div className="navContainer">
        <Link to="/">
          <img src={ChoreBlasterzLogo} alt="ChoreBlasterz Logo" className="logo" />
        </Link>
        <ul className="navList">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          <li><Link to="/auth">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
}