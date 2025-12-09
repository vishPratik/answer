import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FaUserCheck, 
  FaUserSlash, 
  FaFileMedical,
  FaArrowLeft,
  FaPrint
} from 'react-icons/fa';

const AdminDischarge = () => {
  const { currentUser, getDischargeEligiblePatients, dischargePatient, patients } = useApp();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dischargeType, setDischargeType] = useState('cured');
  const [dischargeNotes, setDischargeNotes] = useState('');
  const [showDischarged, setShowDischarged] = useState(false);

  if (!currentUser || currentUser.role !== 'admin') {
    navigate('/patients');
    return null;
  }

  const eligiblePatients = getDischargeEligiblePatients();
  const dischargedPatients = patients.filter(p => p.discharged);

  const handleDischarge = () => {
    if (!selectedPatient || !dischargeType) {
      alert('Please select a patient and discharge type');
      return;
    }

    if (dischargeType === 'deceased' && !window.confirm('Mark patient as deceased? This action cannot be undone.')) {
      return;
    }

    dischargePatient(selectedPatient.id, dischargeType, dischargeNotes);
    
    alert(`Patient ${selectedPatient.name} has been discharged`);
    setSelectedPatient(null);
    setDischargeNotes('');
    setDischargeType('cured');
  };

  const generateDischargeSummary = (patient) => {
    const summary = `
DISCHARGE SUMMARY
================
Patient ID: ${patient.id}
Name: ${patient.name}
Room: ${patient.room}
Admission Date: ${new Date(patient.admittedDate).toLocaleDateString()}
Discharge Date: ${new Date().toLocaleDateString()}
Discharge Type: ${patient.dischargeType === 'cured' ? 'Cured' : 'Deceased'}
Days in Facility: ${Math.ceil((new Date() - new Date(patient.admittedDate)) / (1000 * 60 * 60 * 24))}
Days Without Fever: ${patient.daysWithoutFever}
Total Temperature Readings: ${patient.temperatureLog.length}

Final Status: ${patient.dischargeType === 'cured' ? 'Successfully treated and discharged' : 'Deceased'}
Notes: ${patient.dischargeNotes || 'None'}
    `;
    
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discharge_${patient.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="discharge-container">
      <div className="discharge-header">
        <button onClick={() => navigate('/patients')} className="btn-back">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1><FaUserCheck /> Discharge Management</h1>
        <div className="header-actions">
          <button 
            onClick={() => setShowDischarged(!showDischarged)} 
            className="btn-toggle"
          >
            {showDischarged ? 'Show Pending' : 'Show Discharged'}
          </button>
        </div>
      </div>

      <div className="discharge-content">
        {!showDischarged ? (
          <>
            {/* Eligible Patients Section */}
            <div className="eligible-section">
              <h2>Patients Eligible for Discharge ({eligiblePatients.length})</h2>
              {eligiblePatients.length > 0 ? (
                <div className="patient-cards">
                  {eligiblePatients.map(patient => (
                    <div 
                      key={patient.id} 
                      className={`patient-card ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="card-header">
                        <h3>{patient.name}</h3>
                        <span className="patient-id">{patient.id}</span>
                      </div>
                      <div className="card-details">
                        <p><strong>Room:</strong> {patient.room}</p>
                        <p><strong>Days Fever-Free:</strong> 
                          <span className="fever-count">{patient.daysWithoutFever}</span>
                        </p>
                        <p><strong>Last Temperature:</strong> 
                          {patient.temperatureLog.length > 0 ? 
                            `${patient.temperatureLog[patient.temperatureLog.length - 1].temperature}°F` : 
                            'No records'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No patients eligible for discharge</h3>
                  <p>Patients need 3 consecutive fever-free days to become eligible.</p>
                </div>
              )}
            </div>

            {/* Discharge Form */}
            {selectedPatient && (
              <div className="discharge-form-section">
                <h2>Discharge Patient: {selectedPatient.name}</h2>
                <div className="form-card">
                  <div className="form-group">
                    <label>Discharge Type</label>
                    <div className="radio-group">
                      <label className={`radio-option ${dischargeType === 'cured' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="dischargeType"
                          value="cured"
                          checked={dischargeType === 'cured'}
                          onChange={(e) => setDischargeType(e.target.value)}
                        />
                        <FaUserCheck className="icon" />
                        <span>Cured</span>
                      </label>
                      <label className={`radio-option ${dischargeType === 'deceased' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="dischargeType"
                          value="deceased"
                          checked={dischargeType === 'deceased'}
                          onChange={(e) => setDischargeType(e.target.value)}
                        />
                        <FaUserSlash className="icon" />
                        <span>Deceased</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Discharge Notes</label>
                    <textarea
                      value={dischargeNotes}
                      onChange={(e) => setDischargeNotes(e.target.value)}
                      placeholder="Enter discharge notes or cause of death..."
                      rows="4"
                    />
                  </div>

                  <div className="patient-summary">
                    <h4>Patient Summary</h4>
                    <div className="summary-grid">
                      <div className="summary-item">
                        <span>Days in Facility:</span>
                        <span>{Math.ceil((new Date() - new Date(selectedPatient.admittedDate)) / (1000 * 60 * 60 * 24))}</span>
                      </div>
                      <div className="summary-item">
                        <span>Temperature Readings:</span>
                        <span>{selectedPatient.temperatureLog.length}</span>
                      </div>
                      <div className="summary-item">
                        <span>Current Status:</span>
                        <span className="status-eligible">Eligible for Discharge</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button onClick={() => setSelectedPatient(null)} className="btn-cancel">
                      Cancel
                    </button>
                    <button onClick={handleDischarge} className="btn-discharge">
                      {dischargeType === 'cured' ? 'Discharge Patient' : 'Mark as Deceased'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Discharged Patients History */
          <div className="discharged-history">
            <h2>Discharged Patients ({dischargedPatients.length})</h2>
            {dischargedPatients.length > 0 ? (
              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>ID</th>
                      <th>Room</th>
                      <th>Admission Date</th>
                      <th>Discharge Date</th>
                      <th>Type</th>
                      <th>Days Fever-Free</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dischargedPatients.map(patient => (
                      <tr key={patient.id}>
                        <td>{patient.name}</td>
                        <td>{patient.id}</td>
                        <td>{patient.room}</td>
                        <td>{new Date(patient.admittedDate).toLocaleDateString()}</td>
                        <td>{patient.dischargeDate ? new Date(patient.dischargeDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`discharge-type ${patient.dischargeType}`}>
                            {patient.dischargeType === 'cured' ? 'Cured' : 'Deceased'}
                          </span>
                        </td>
                        <td>{patient.daysWithoutFever}</td>
                        <td>
                          <button 
                            onClick={() => generateDischargeSummary(patient)}
                            className="btn-summary"
                          >
                            <FaPrint /> Summary
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <h3>No discharged patients</h3>
                <p>Patient discharge history will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDischarge;