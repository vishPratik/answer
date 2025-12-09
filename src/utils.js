// Utility functions for the application

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const validateTemperature = (temp, threshold = 100.4) => {
  if (temp < 95 || temp > 110) {
    return { valid: false, message: 'Temperature must be between 95°F and 110°F' };
  }
  if (isNaN(temp)) {
    return { valid: false, message: 'Please enter a valid number' };
  }
  return { valid: true, message: temp >= threshold ? 'Fever detected' : 'Normal temperature' };
};

export const checkDuplicateTemperature = (patient, date) => {
  return patient.temperatureLog.some(log => {
    const logDate = new Date(log.date).toISOString().split('T')[0];
    return logDate === date;
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'needsTempCheck':
      return '#ef4444'; // red
    case 'tempTaken':
      return '#f59e0b'; // orange
    case 'doctorVisited':
      return '#10b981'; // green
    case 'eligibleForDischarge':
      return '#8b5cf6'; // purple
    default:
      return '#64748b'; // gray
  }
};