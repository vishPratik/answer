import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaThermometerHalf, FaArrowLeft } from 'react-icons/fa';

const TemperatureInput = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { currentUser, patients, recordTemperature, FEVER_THRESHOLD } = useApp();
  
  const patient = patients.find(p => p.id === patientId);
  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');

  if (!currentUser || currentUser.role !== 'nurse') {
    navigate('/patients');
    return null;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!temperature || isNaN(temperature)) {
      alert('Please enter a valid temperature');
      return;
    }

    const tempValue = parseFloat(temperature);
    
    recordTemperature(patientId, tempValue);
    alert('Temperature recorded successfully!');
    navigate('/patients');
  };

  const hasTempToday = patient.temperatureLog.some(log => {
    const logDate = new Date(log.date).toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  });

  if (hasTempToday) {
    return (
      <div className="temperature-container">
        <div className="alert alert-warning">
          <h3>Temperature Already Recorded</h3>
          <p>Temperature has already been recorded for this patient today.</p>
          <button onClick={() => navigate('/patients')} className="btn-back">
            <FaArrowLeft /> Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="temperature-container">
      <div className="temperature-card">
        <div className="card-header">
          <button onClick={() => navigate('/patients')} className="btn-back">
            <FaArrowLeft /> Back
          </button>
          <h2><FaThermometerHalf /> Record Temperature</h2>
        </div>

        <div className="patient-info">
          <h3>{patient.name}</h3>
          <p>ID: {patient.id} | Room: {patient.room}</p>
          <p>Days without fever: <strong>{patient.daysWithoutFever}</strong></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Temperature (°F)
              <span className="hint">Fever threshold: {FEVER_THRESHOLD}°F</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="e.g., 98.6"
              required
              min="95"
              max="110"
            />
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any observations..."
              rows="3"
            />
          </div>

          <div className="temp-indicator">
            <div className={`temp-display ${temperature >= FEVER_THRESHOLD ? 'fever' : 'normal'}`}>
              {temperature || '--'}°F
              {temperature && (
                <span className="temp-status">
                  {temperature >= FEVER_THRESHOLD ? 'FEVER' : 'NORMAL'}
                </span>
              )}
            </div>
          </div>

          <div className="button-group">
            <button type="button" onClick={() => navigate('/patients')} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Record Temperature
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemperatureInput;