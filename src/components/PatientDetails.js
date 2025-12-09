import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FaArrowLeft, 
  FaThermometerHalf, 
  FaCalendar,
  FaHistory,
  FaChartLine 
} from 'react-icons/fa';

const PatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { currentUser, patients, FEVER_THRESHOLD } = useApp();
  const patient = patients.find(p => p.id === patientId);

  const [showChart, setShowChart] = useState(false);

  if (!currentUser || !patient) {
    navigate('/patients');
    return null;
  }

  // Calculate statistics
  const tempLog = patient.temperatureLog;
  const latestTemp = tempLog[tempLog.length - 1];
  const feverDays = tempLog.filter(log => log.temperature >= FEVER_THRESHOLD).length;
  const normalDays = tempLog.length - feverDays;

  return (
    <div className="patient-details-container">
      <div className="details-header">
        <button onClick={() => navigate('/patients')} className="btn-back">
          <FaArrowLeft /> Back to List
        </button>
        <h1>Patient Details</h1>
      </div>

      <div className="details-grid">
        {/* Patient Info Card */}
        <div className="info-card">
          <h2><FaCalendar /> Patient Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Patient ID</label>
              <p className="value">{patient.id}</p>
            </div>
            <div className="info-item">
              <label>Full Name</label>
              <p className="value">{patient.name}</p>
            </div>
            <div className="info-item">
              <label>Room Number</label>
              <p className="value">{patient.room}</p>
            </div>
            <div className="info-item">
              <label>Age</label>
              <p className="value">{patient.age}</p>
            </div>
            <div className="info-item">
              <label>Admission Date</label>
              <p className="value">{new Date(patient.admittedDate).toLocaleDateString()}</p>
            </div>
            <div className="info-item">
              <label>Status</label>
              <p className={`value status ${patient.discharged ? 'discharged' : 'active'}`}>
                {patient.discharged ? 'Discharged' : 'Active'}
              </p>
            </div>
          </div>
        </div>

        {/* Fever Status Card */}
        <div className="fever-card">
          <h2><FaThermometerHalf /> Fever Status</h2>
          <div className="fever-counter-large">
            <div className="counter-display">
              <span className="counter-number">{patient.daysWithoutFever}</span>
              <span className="counter-label">Days without fever</span>
            </div>
            {patient.daysWithoutFever >= 3 && (
              <div className="eligible-badge">
                ✅ Eligible for Discharge
              </div>
            )}
            <div className="fever-stats">
              <div className="stat-item">
                <span className="stat-label">Normal Days</span>
                <span className="stat-value normal">{normalDays}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Fever Days</span>
                <span className="stat-value fever">{feverDays}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Readings</span>
                <span className="stat-value total">{tempLog.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Temperature History */}
        <div className="history-card">
          <div className="history-header">
            <h2><FaHistory /> Temperature History</h2>
            <button onClick={() => setShowChart(!showChart)} className="btn-chart">
              <FaChartLine /> {showChart ? 'Show Table' : 'Show Chart'}
            </button>
          </div>

          {showChart ? (
            <div className="temp-chart">
              {/* Simple bar chart implementation */}
              <div className="chart-container">
                {tempLog.slice(-10).map((log, index) => {
                  const isFever = log.temperature >= FEVER_THRESHOLD;
                  const height = (log.temperature - 96) * 10; // Scale for visualization
                  return (
                    <div key={index} className="chart-bar-container">
                      <div className="chart-bar-wrapper">
                        <div 
                          className={`chart-bar ${isFever ? 'fever-bar' : 'normal-bar'}`}
                          style={{ height: `${height}px` }}
                        >
                          <span className="bar-value">{log.temperature}°</span>
                        </div>
                      </div>
                      <div className="chart-label">
                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color normal-bar"></div>
                  <span>Normal (&lt; {FEVER_THRESHOLD}°F)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color fever-bar"></div>
                  <span>Fever (≥ {FEVER_THRESHOLD}°F)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Temperature (°F)</th>
                    <th>Status</th>
                    <th>Recorded By</th>
                  </tr>
                </thead>
                <tbody>
                  {tempLog.length > 0 ? (
                    [...tempLog].reverse().map((log, index) => (
                      <tr key={index}>
                        <td>{new Date(log.date).toLocaleString()}</td>
                        <td className={log.temperature >= FEVER_THRESHOLD ? 'fever-value' : 'normal-value'}>
                          {log.temperature}°F
                        </td>
                        <td>
                          <span className={`status-badge ${log.temperature >= FEVER_THRESHOLD ? 'badge-fever' : 'badge-normal'}`}>
                            {log.temperature >= FEVER_THRESHOLD ? 'FEVER' : 'NORMAL'}
                          </span>
                        </td>
                        <td>{log.recordedBy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">No temperature records available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Daily Status */}
        <div className="status-card">
          <h2>Today's Status</h2>
          <div className="status-grid">
            <div className={`status-item ${patient.needsTempCheck ? 'pending' : 'completed'}`}>
              <span className="status-label">Temperature Check</span>
              <span className="status-value">
                {patient.needsTempCheck ? 'Pending' : 'Completed'}
              </span>
            </div>
            <div className={`status-item ${patient.needsDoctorVisit ? 'pending' : 'completed'}`}>
              <span className="status-label">Doctor Visit</span>
              <span className="status-value">
                {patient.doctorVisited ? 'Completed' : patient.tempTaken ? 'Pending' : 'Awaiting Temp'}
              </span>
            </div>
            <div className={`status-item ${patient.eligibleForDischarge ? 'eligible' : 'not-eligible'}`}>
              <span className="status-label">Discharge Status</span>
              <span className="status-value">
                {patient.eligibleForDischarge ? 'Eligible' : 'Not Eligible'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;