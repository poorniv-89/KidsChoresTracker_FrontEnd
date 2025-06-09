import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const baseURL = 'http://localhost:3000/api/parent'
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignUp ? `${baseURL}` : `${baseURL}/signin`;
    try {
        const res = await axios.post(url, formData);
        setMessage(isSignUp ? 'Signup successful!' : 'Signin successful!');
        navigate('/parent-dashboard');
       
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Something went wrong. Please try again.';
        setMessage(errorMessage);
      }
    };

  return (
    <div>
      <h1>{isSignUp ? 'Parent Sign Up' : 'Parent Sign In'}</h1>

      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
        )}

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>

      <p>{message}</p>

      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
}
