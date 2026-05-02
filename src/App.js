import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/patients/PatientList';
import PatientForm from './pages/patients/PatientForm';
import DoctorList from './pages/doctors/DoctorList';
import DoctorForm from './pages/doctors/DoctorForm';
import AppointmentList from './pages/appointments/AppointmentList';
import AppointmentForm from './pages/appointments/AppointmentForm';
import MedicalRecordList from './pages/medicalrecords/MedicalRecordList';
import MedicalRecordForm from './pages/medicalrecords/MedicalRecordForm';
import RoomList from './pages/rooms/RoomList';
import RoomForm from './pages/rooms/RoomForm';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
        <Sidebar />
        <div style={{
          marginLeft: '240px',
          marginTop: '60px',
          padding: '24px',
          width: 'calc(100% - 240px)',
          minHeight: 'calc(100vh - 60px)',
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/create" element={<PatientForm />} />
            <Route path="/patients/edit/:id" element={<PatientForm />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/create" element={<DoctorForm />} />
            <Route path="/doctors/edit/:id" element={<DoctorForm />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/appointments/create" element={<AppointmentForm />} />
            <Route path="/appointments/edit/:id" element={<AppointmentForm />} />
            <Route path="/medicalrecords" element={<MedicalRecordList />} />
            <Route path="/medicalrecords/create" element={<MedicalRecordForm />} />
            <Route path="/medicalrecords/edit/:id" element={<MedicalRecordForm />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/rooms/create" element={<RoomForm />} />
            <Route path="/rooms/edit/:id" element={<RoomForm />} />
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
    </Router>
  );
}

export default App;