import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config/api';

export default function AuthPage() {
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const baseURL = `${import.meta.env.VITE_API_BASE_URL}/parent`;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const url = isSignUp ? `/parent` : `/parent/signin`;
  
    try {
      const res = await API.post(url, formData);
      const { token, parent } = res.data;
  
      sessionStorage.setItem('token', token);    
      sessionStorage.setItem('parentId', parent.id); 
      
  
      login(parent.id);
  
      setMessage(isSignUp ? 'Signup successful!' : 'Signin successful!');
      navigate('/parent-dashboard');
  
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="authWrapper">
    <div className="authContainer">
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
    </div>
  );
}
