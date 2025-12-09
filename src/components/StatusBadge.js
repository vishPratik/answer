import React from 'react';
import { FaThermometer, FaStethoscope, FaCheckCircle, FaHospitalUser } from 'react-icons/fa';

const StatusBadge = ({ patient }) => {
  const getStatus = () => {
    if (patient.discharged) {
      return {
        text: 'Discharged',
        icon: <FaCheckCircle />,
        color: 'gray',
        className: 'badge-discharged'
      };
    }

    if (patient.eligibleForDischarge) {
      return {
        text: 'Eligible for Discharge',
        icon: <FaHospitalUser />,
        color: 'purple',
        className: 'badge-eligible'
      };
    }

    if (patient.doctorVisited) {
      return {
        text: 'Doctor Visited',
        icon: <FaCheckCircle />,
        color: 'green',
        className: 'badge-visited'
      };
    }

    if (patient.tempTaken && !patient.doctorVisited) {
      return {
        text: 'Needs Doctor Visit',
        icon: <FaStethoscope />,
        color: 'orange',
        className: 'badge-needs-doctor'
      };
    }

    if (patient.needsTempCheck) {
      return {
        text: 'Needs Temp Check',
        icon: <FaThermometer />,
        color: 'red',
        className: 'badge-needs-temp'
      };
    }

    return {
      text: 'Unknown Status',
      icon: null,
      color: 'gray',
      className: 'badge-unknown'
    };
  };

  const status = getStatus();

  return (
    <span className={`status-badge ${status.className}`}>
      {status.icon}
      <span className="badge-text">{status.text}</span>
    </span>
  );
};

export default StatusBadge;