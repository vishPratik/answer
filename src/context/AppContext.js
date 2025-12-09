import React, { createContext, useState, useContext, useEffect } from 'react';
import { initialPatients } from '../data/initialPatients';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const FEVER_THRESHOLD = 100.4; // °F
const MAX_CAPACITY = 74;

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('quarantinePatients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  // Save to localStorage whenever patients change
  useEffect(() => {
    localStorage.setItem('quarantinePatients', JSON.stringify(patients));
  }, [patients]);

  // Login function
  const login = (email, password) => {
    const users = {
      'nurse@facility.com': { role: 'nurse', name: 'Nurse Smith' },
      'doctor@facility.com': { role: 'doctor', name: 'Dr. Johnson' },
      'admin@facility.com': { role: 'admin', name: 'Admin User' }
    };
    
    if (users[email] && password === 'pass123') {
      setCurrentUser(users[email]);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Record temperature
  const recordTemperature = (patientId, temperature) => {
    const today = new Date().toISOString().split('T')[0];
    
    setPatients(prev => prev.map(patient => {
      if (patient.id === patientId) {
        const hasTempToday = patient.temperatureLog.some(log => 
          log.date.split('T')[0] === today
        );
        
        if (hasTempToday) {
          alert('Temperature already recorded for today');
          return patient;
        }

        const newLog = {
          date: new Date().toISOString(),
          temperature: parseFloat(temperature),
          recordedBy: currentUser.name
        };

        const isFever = temperature >= FEVER_THRESHOLD;
        const newDaysWithoutFever = isFever ? 0 : patient.daysWithoutFever + 1;
        
        return {
          ...patient,
          temperatureLog: [...patient.temperatureLog, newLog],
          lastTempCheck: today,
          needsTempCheck: false,
          tempTaken: true,
          daysWithoutFever: newDaysWithoutFever,
          eligibleForDischarge: newDaysWithoutFever >= 3
        };
      }
      return patient;
    }));
  };

  // Mark doctor visited
  const markDoctorVisited = (patientId) => {
    const today = new Date().toISOString().split('T')[0];
    
    setPatients(prev => prev.map(patient => {
      if (patient.id === patientId) {
        return {
          ...patient,
          doctorVisited: true,
          needsDoctorVisit: false,
          lastDoctorVisit: today
        };
      }
      return patient;
    }));
  };

  // Discharge patient
  const dischargePatient = (patientId, dischargeType, notes = '') => {
    setPatients(prev => prev.map(patient => {
      if (patient.id === patientId) {
        return {
          ...patient,
          discharged: true,
          dischargeDate: new Date().toISOString(),
          dischargeType,
          dischargeNotes: notes
        };
      }
      return patient;
    }));
  };

  // Get active patients
  const getActivePatients = () => {
    return patients.filter(p => !p.discharged).slice(0, MAX_CAPACITY);
  };

  // Get patients eligible for discharge
  const getDischargeEligiblePatients = () => {
    return patients.filter(p => p.eligibleForDischarge && !p.discharged);
  };

  // Add new patient
  const addPatient = (patientData) => {
    if (getActivePatients().length >= MAX_CAPACITY) {
      alert('Facility at maximum capacity (74 patients)');
      return false;
    }

    const newPatient = {
      id: `PAT${Date.now()}`,
      ...patientData,
      admittedDate: new Date().toISOString(),
      temperatureLog: [],
      daysWithoutFever: 0,
      needsTempCheck: true,
      tempTaken: false,
      needsDoctorVisit: false,
      doctorVisited: false,
      eligibleForDischarge: false,
      discharged: false
    };

    setPatients(prev => [...prev, newPatient]);
    return true;
  };

  const value = {
    currentUser,
    patients,
    login,
    logout,
    recordTemperature,
    markDoctorVisited,
    dischargePatient,
    getActivePatients,
    getDischargeEligiblePatients,
    addPatient,
    FEVER_THRESHOLD,
    MAX_CAPACITY
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};