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
    <div>
      <h1>How It Works</h1>
      <div>
        {steps.map((step, index) => (
          <div key={index}>
            <div>{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}