import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaUserMd, FaUserNurse, FaUserShield } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      navigate('/patients');
    } else {
      setError('Invalid credentials. Use nurse@facility.com, doctor@facility.com, or admin@facility.com with password: pass123');
    }
  };

  const demoCredentials = [
    { role: 'Nurse', email: 'nurse@facility.com', icon: <FaUserNurse />, color: 'blue' },
    { role: 'Doctor', email: 'doctor@facility.com', icon: <FaUserMd />, color: 'green' },
    { role: 'Admin', email: 'admin@facility.com', icon: <FaUserShield />, color: 'purple' }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏥 Quarantine Facility</h1>
          <p>Secure Login Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="demo-credentials">
          <h3>Demo Credentials:</h3>
          <div className="credential-cards">
            {demoCredentials.map((cred, index) => (
              <div key={index} className={`credential-card ${cred.color}`}>
                <div className="cred-icon">{cred.icon}</div>
                <div className="cred-info">
                  <strong>{cred.role}</strong>
                  <small>{cred.email}</small>
                  <small>Password: pass123</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;