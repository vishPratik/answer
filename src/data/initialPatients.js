export const initialPatients = [
  {
    id: 'PAT001',
    name: 'John Smith',
    age: 45,
    room: '101',
    admittedDate: '2024-01-10T10:30:00Z',
    temperatureLog: [
      { date: '2024-01-15T08:30:00Z', temperature: 99.1, recordedBy: 'Nurse Smith' },
      { date: '2024-01-14T09:00:00Z', temperature: 98.6, recordedBy: 'Nurse Smith' },
      { date: '2024-01-13T08:45:00Z', temperature: 98.4, recordedBy: 'Nurse Johnson' }
    ],
    daysWithoutFever: 3,
    needsTempCheck: true,
    tempTaken: false,
    needsDoctorVisit: false,
    doctorVisited: false,
    eligibleForDischarge: true,
    discharged: false
  },
  {
    id: 'PAT002',
    name: 'Maria Garcia',
    age: 32,
    room: '102',
    admittedDate: '2024-01-12T14:20:00Z',
    temperatureLog: [
      { date: '2024-01-14T10:15:00Z', temperature: 101.2, recordedBy: 'Nurse Smith' },
      { date: '2024-01-13T09:30:00Z', temperature: 100.8, recordedBy: 'Nurse Johnson' }
    ],
    daysWithoutFever: 0,
    needsTempCheck: true,
    tempTaken: false,
    needsDoctorVisit: false,
    doctorVisited: false,
    eligibleForDischarge: false,
    discharged: false
  },
  {
    id: 'PAT003',
    name: 'Robert Chen',
    age: 58,
    room: '103',
    admittedDate: '2024-01-11T11:45:00Z',
    temperatureLog: [
      { date: '2024-01-15T07:45:00Z', temperature: 98.9, recordedBy: 'Nurse Johnson' },
      { date: '2024-01-14T08:00:00Z', temperature: 99.0, recordedBy: 'Nurse Smith' },
      { date: '2024-01-13T08:15:00Z', temperature: 98.7, recordedBy: 'Nurse Johnson' }
    ],
    daysWithoutFever: 2,
    needsTempCheck: false,
    tempTaken: true,
    needsDoctorVisit: true,
    doctorVisited: false,
    eligibleForDischarge: false,
    discharged: false
  },
  {
    id: 'PAT004',
    name: 'Sarah Williams',
    age: 29,
    room: '104',
    admittedDate: '2024-01-13T16:10:00Z',
    temperatureLog: [
      { date: '2024-01-14T13:30:00Z', temperature: 100.5, recordedBy: 'Nurse Smith' }
    ],
    daysWithoutFever: 0,
    needsTempCheck: true,
    tempTaken: false,
    needsDoctorVisit: false,
    doctorVisited: false,
    eligibleForDischarge: false,
    discharged: false
  },
  {
    id: 'PAT005',
    name: 'James Wilson',
    age: 67,
    room: '105',
    admittedDate: '2024-01-09T09:15:00Z',
    temperatureLog: [
      { date: '2024-01-15T09:00:00Z', temperature: 98.4, recordedBy: 'Nurse Johnson' },
      { date: '2024-01-14T09:15:00Z', temperature: 98.6, recordedBy: 'Nurse Smith' },
      { date: '2024-01-13T09:30:00Z', temperature: 98.3, recordedBy: 'Nurse Johnson' },
      { date: '2024-01-12T10:00:00Z', temperature: 98.7, recordedBy: 'Nurse Smith' }
    ],
    daysWithoutFever: 4,
    needsTempCheck: false,
    tempTaken: true,
    needsDoctorVisit: true,
    doctorVisited: false,
    eligibleForDischarge: true,
    discharged: false
  },
  {
    id: 'PAT006',
    name: 'Lisa Brown',
    age: 41,
    room: '106',
    admittedDate: '2024-01-14T12:45:00Z',
    temperatureLog: [],
    daysWithoutFever: 0,
    needsTempCheck: true,
    tempTaken: false,
    needsDoctorVisit: false,
    doctorVisited: false,
    eligibleForDischarge: false,
    discharged: false
  }
];