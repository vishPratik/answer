import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './components/Login';
import PatientList from './components/PatientList';
import TemperatureInput from './components/TemperatureInput';
import PatientDetails from './components/PatientDetails';
import AdminDischarge from './components/AdminDischarge';
import Header from './components/Header';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/temperature/:patientId" element={<TemperatureInput />} />
              <Route path="/patient/:patientId" element={<PatientDetails />} />
              <Route path="/discharge" element={<AdminDischarge />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;