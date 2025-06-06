import { Link } from "react-router-dom";

export default function Nav() {
    return (
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/auth">Login</Link></li>
        </ul>
      </nav>
    );
  }