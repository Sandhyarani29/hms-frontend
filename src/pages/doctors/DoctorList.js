import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig';

function DoctorList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get('/Doctor/GetAllDoctors');
      setDoctors(res.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await API.delete(`/Doctor/DeleteDoctor/${id}`);
      setDoctors(doctors.filter(d => d.id !== id));
      alert('Doctor deleted successfully.');
    } catch (error) {
      alert('Error deleting doctor.');
    }
  };

  const filtered = doctors.filter(d =>
    `${d.firstName} ${d.lastName} ${d.email} ${d.specialization}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
  <div>
    <h4 style={{ fontWeight: '700', color: '#202124', margin: 0 }}>Doctors</h4>
    <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
      {doctors.length} total doctors
    </p>
  </div>
  <button
    onClick={() => navigate('/doctors/create')}
    style={{
      padding: '10px 20px',
      backgroundColor: '#1a73e8',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    }}
  >
    + Add Doctor
  </button>
</div>
  {/* Stats Row */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
  {[
    { label: 'Total Doctors',    value: doctors.length,                                              color: '#1a73e8', bg: '#e8f0fe' },
    { label: 'Specializations',  value: [...new Set(doctors.map(d => d.specialization))].length,     color: '#0f9d58', bg: '#e6f4ea' },
  ].map((s, i) => (
    <div key={i} style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      border: '1px solid #e8eaed',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px',
        backgroundColor: s.bg, color: s.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', fontWeight: '700',
      }}>
        {s.value}
      </div>
      <div style={{ fontSize: '13px', color: '#5f6368', fontWeight: '500' }}>{s.label}</div>
    </div>
  ))}
</div>

      {/* Table Card */}
     <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e8eaed', overflow: 'hidden' }}>
  <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8eaed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontWeight: '600', fontSize: '15px', color: '#202124' }}>All Doctors</span>
    <input
      type="text"
      placeholder="Search by name, email or specialization..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      style={{
        padding: '8px 14px',
        border: '1px solid #e8eaed',
        borderRadius: '8px',
        fontSize: '13px',
        width: '280px',
        outline: 'none',
      }}
    />
  </div>
  <div>
          {filtered.length === 0 ? (
            <div className="text-center text-muted py-5">
              <div style={{ fontSize: '40px' }}>👨‍⚕️</div>
              <p className="mt-2">No doctors found.</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead>
  <tr style={{ borderBottom: '1px solid #e8eaed' }}>
    {['Doctor', 'Email', 'Phone', 'Specialization', 'License No', 'Actions'].map(h => (
      <th key={h} style={{
        padding: '12px 16px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#5f6368',
        backgroundColor: '#f8f9fa',
        textAlign: 'left',
      }}>{h}</th>
    ))}
  </tr>
</thead>
              <tbody>
            {filtered.map((d) => (
  <tr
    key={d.id}
    style={{ borderBottom: '1px solid #f1f3f4' }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
  >
    <td style={{ padding: '14px 16px' }}>
      <div style={{ fontWeight: '500', fontSize: '14px', color: '#202124' }}>
        Dr. {d.firstName} {d.lastName}
      </div>
      <div style={{ fontSize: '12px', color: '#9aa0a6', marginTop: '2px' }}>
        {d.licenseNumber}
      </div>
    </td>
    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>{d.email}</td>
    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>{d.phone}</td>
    <td style={{ padding: '14px 16px' }}>
      <span style={{
        backgroundColor: '#e8f0fe',
        color: '#1a73e8',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
      }}>
        {d.specialization}
      </span>
    </td>
    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>{d.licenseNumber}</td>
    <td style={{ padding: '14px 16px' }}>
      <button
        onClick={() => navigate(`/doctors/edit/${d.id}`)}
        style={{
          padding: '6px 16px', marginRight: '8px',
          border: '1px solid #e8eaed', borderRadius: '6px',
          backgroundColor: '#fff', color: '#1a73e8',
          fontSize: '13px', fontWeight: '500', cursor: 'pointer',
        }}
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(d.id)}
        style={{
          padding: '6px 16px',
          border: '1px solid #fce8e6', borderRadius: '6px',
          backgroundColor: '#fff', color: '#db4437',
          fontSize: '13px', fontWeight: '500', cursor: 'pointer',
        }}
      >
        Delete
      </button>
    </td>
  </tr>
))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorList;


