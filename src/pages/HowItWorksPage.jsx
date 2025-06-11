import { FaTasks, FaCheckCircle, FaStar, FaGift } from 'react-icons/fa';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <FaTasks />,
      title: 'Assign Chores',
      description: 'Parents create and assign tasks to kids.',
    },
    {
      icon: <FaCheckCircle />,
      title: 'Complete & Check Off',
      description: 'Kids complete chores and mark them as done.',
    },
    {
      icon: <FaStar />,
      title: 'Earn Points',
      description: 'Kids earn points for every completed task.',
    },
    {
      icon: <FaGift />,
      title: 'Redeem Rewards',
      description: 'Points can be redeemed for custom rewards.',
    },
  ];

  return (
    <div style={{
      padding: '3rem 2rem',
      backgroundColor: '#fefefe',
      textAlign: 'center',
      fontFamily: 'Fredoka, sans-serif',
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#ff8a00' }}>How It Works</h1>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {steps.map((step, index) => (
          <div key={index} style={{
            backgroundColor: '#e4f3ff',
            padding: '2rem 1.5rem',
            borderRadius: '16px',
            width: '240px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s ease',
          }}>
            <div style={{ fontSize: '2rem', color: '#007acc', marginBottom: '1rem' }}>
              {step.icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#007acc', marginBottom: '0.5rem' }}>{step.title}</h3>
            <p style={{ fontSize: '0.95rem', color: '#444' }}>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}