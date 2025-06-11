import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-image.jpg';

export default function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div>
      <section className="heroSection">
        <div className="heroText">
          <h1>Make Chores a Blast!</h1>
          <p>
            ChoreBlasterz helps families track chores, earn rewards, and build responsibility — the fun way!
          </p>
          <button onClick={handleGetStarted}>Get Started</button>
        </div>
        <div className="heroImage">
          <img src={heroImage} alt="Family doing chores" />
        </div>
      </section>

      <section id="how-it-works" className="howItWorks">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">Parent assigns tasks</div>
          <div className="step">Kids complete them</div>
          <div className="step">Everyone earns rewards</div>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <ul>
          <li>Multiple Kids & Parent Accounts</li>
          <li>Badges & Levels</li>
          <li>Point & Reward System</li>
          <li>Daily/Weekly Chore Planner</li>
        </ul>
      </section>

      <footer>
        <button onClick={handleGetStarted}>Get Started</button>
      </footer>
    </div>
  );
}