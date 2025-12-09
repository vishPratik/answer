import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from './StatusBadge';
import { 
  FaThermometer, 
  FaStethoscope, 
  FaUserCheck,
  FaPlus,
  FaBed,
  FaCalendarCheck
} from 'react-icons/fa';

const PatientList = () => {
  const { currentUser, getActivePatients, markDoctorVisited } = useApp();
  const navigate = useNavigate();
  const patients = getActivePatients();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleTemperatureClick = (patientId) => {
    navigate(`/temperature/${patientId}`);
  };

  const handleDoctorVisit = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient.tempTaken) {
      if (window.confirm('Temperature not recorded today. Record temperature first?')) {
        navigate(`/temperature/${patientId}`);
      }
      return;
    }
    markDoctorVisited(patientId);
  };

  const handleViewDetails = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  // Stats calculation
  const stats = {
    needsTemp: patients.filter(p => p.needsTempCheck).length,
    needsDoctor: patients.filter(p => p.tempTaken && !p.doctorVisited).length,
    eligibleDischarge: patients.filter(p => p.eligibleForDischarge).length,
    capacity: patients.length
  };

  return (
    <div className="patient-list-container">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <div className="user-info">
          <span className="user-role">{currentUser.role.toUpperCase()}</span>
          <span className="user-name">{currentUser.name}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <FaBed />
          <div className="stat-info">
            <h3>{stats.capacity}/74</h3>
            <p>Beds Occupied</p>
          </div>
        </div>
        <div className="stat-card orange">
          <FaThermometer />
          <div className="stat-info">
            <h3>{stats.needsTemp}</h3>
            <p>Need Temp Check</p>
          </div>
        </div>
        <div className="stat-card green">
          <FaStethoscope />
          <div className="stat-info">
            <h3>{stats.needsDoctor}</h3>
            <p>Awaiting Doctor</p>
          </div>
        </div>
        <div className="stat-card purple">
          <FaCalendarCheck />
          <div className="stat-info">
            <h3>{stats.eligibleDischarge}</h3>
            <p>Ready for Discharge</p>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="patient-list-header">
        <h2>Active Patients ({patients.length})</h2>
        {currentUser.role === 'admin' && (
          <button className="btn-add" onClick={() => navigate('/discharge')}>
            <FaUserCheck /> Discharge Queue
          </button>
        )}
      </div>

      <div className="patient-table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Room</th>
              <th>Status</th>
              <th>Days Fever-Free</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.room}</td>
                <td>
                  <StatusBadge patient={patient} />
                </td>
                <td>
                  <div className="fever-counter">
                    <span className={`counter ${patient.daysWithoutFever >= 3 ? 'eligible' : ''}`}>
                      {patient.daysWithoutFever}
                    </span>
                    {patient.daysWithoutFever >= 3 && 
                      <span className="badge-success">✓ Ready</span>
                    }
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    {currentUser.role === 'nurse' && patient.needsTempCheck && (
                      <button 
                        className="btn-action btn-temp"
                        onClick={() => handleTemperatureClick(patient.id)}
                      >
                        <FaThermometer /> Temp
                      </button>
                    )}
                    
                    {currentUser.role === 'doctor' && patient.tempTaken && !patient.doctorVisited && (
                      <button 
                        className="btn-action btn-doctor"
                        onClick={() => handleDoctorVisit(patient.id)}
                      >
                        <FaStethoscope /> Visit
                      </button>
                    )}
                    
                    <button 
                      className="btn-action btn-view"
                      onClick={() => handleViewDetails(patient.id)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {patients.length === 0 && (
        <div className="empty-state">
          <h3>No Active Patients</h3>
          <p>All patients have been discharged or the facility is empty.</p>
        </div>
      )}
    </div>
  );
};

export default PatientList;