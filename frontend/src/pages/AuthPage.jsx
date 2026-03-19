import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const config = { headers: { 'Content-type': 'application/json' } };
      let res;
      if (isLogin) {
        res = await axios.post('http://localhost:5001/api/user/login', { email, password }, config);
      } else {
        res = await axios.post('http://localhost:5001/api/user/register', { name, email, password }, config);
      }
      setUser(res.data);
      navigate('/chats');
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Welcome Back' : 'Create an Account'}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Enter your name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Enter your email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <div className="switch-auth">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign up' : 'Login'}
        </span>
      </div>
    </div>
  );
};

export default AuthPage;
