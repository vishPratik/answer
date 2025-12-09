import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FaSignOutAlt, 
  FaHome, 
  FaUserMd,
  FaUserNurse,
  FaUserShield,
  FaHospital
} from 'react-icons/fa';

const Header = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser || location.pathname === '/login') {
    return null;
  }

  const getRoleIcon = () => {
    switch(currentUser.role) {
      case 'doctor': return <FaUserMd />;
      case 'nurse': return <FaUserNurse />;
      case 'admin': return <FaUserShield />;
      default: return <FaHospital />;
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo" onClick={() => navigate('/patients')}>
          <FaHospital className="logo-icon" />
          <span className="logo-text">Quarantine Facility</span>
        </div>
        <div className="breadcrumb">
          {location.pathname !== '/patients' && (
            <button onClick={() => navigate('/patients')} className="btn-home">
              <FaHome /> Dashboard
            </button>
          )}
        </div>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span className="user-icon">{getRoleIcon()}</span>
          <div className="user-details">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">{currentUser.role.toUpperCase()}</span>
          </div>
        </div>
        
        <button onClick={logout} className="btn-logout">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;