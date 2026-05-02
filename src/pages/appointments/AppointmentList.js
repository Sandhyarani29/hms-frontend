import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axiosConfig';

function AppointmentList() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get('/Appointment/GetAllAppointments');
      setAppointments(res.data);
    } catch {
      toast.error('Error fetching appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await API.delete(`/Appointment/DeleteAppointment/${id}`);
      setAppointments(appointments.filter(a => a.id !== id));
      toast.success('Appointment deleted.');
    } catch {
      toast.error('Error deleting appointment.');
    }
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'scheduled') return { backgroundColor: '#dcfce7', color: '#166534' };
    if (s === 'completed')  return { backgroundColor: '#dbeafe', color: '#1e40af' };
    if (s === 'cancelled')  return { backgroundColor: '#fee2e2', color: '#991b1b' };
    return { backgroundColor: '#f3f4f6', color: '#374151' };
  };

  const filtered = appointments.filter(a => {
    const matchSearch = `${a.patientName} ${a.doctorName} ${a.notes}`
      .toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus
      ? a.status?.toLowerCase() === filterStatus.toLowerCase()
      : true;
    return matchSearch && matchStatus;
  });

  const counts = {
    scheduled: appointments.filter(a => a.status?.toLowerCase() === 'scheduled').length,
    completed:  appointments.filter(a => a.status?.toLowerCase() === 'completed').length,
    cancelled:  appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length,
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h4 style={{ fontWeight: '700', color: '#202124', margin: 0 }}>Appointments</h4>
          <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
            {appointments.length} total appointments
          </p>
        </div>
        <button
          onClick={() => navigate('/appointments/create')}
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
          + Add Appointment
        </button>
      </div>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Scheduled', count: counts.scheduled, bg: '#e6f4ea', color: '#0f9d58' },
          { label: 'Completed', count: counts.completed, bg: '#e8f0fe', color: '#1a73e8' },
          { label: 'Cancelled', count: counts.cancelled, bg: '#fce8e6', color: '#db4437' },
          { label: 'Total',     count: appointments.length, bg: '#f1f3f4', color: '#5f6368' },
        ].map((c, i) => (
          <div
            key={i}
            onClick={() => setFilterStatus(c.label === 'Total' ? '' : c.label)}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid #e8eaed',
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '10px',
              backgroundColor: c.bg,
              color: c.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '700',
            }}>
              {c.count}
            </div>
            <div style={{ fontSize: '13px', color: '#5f6368', fontWeight: '500' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e8eaed', overflow: 'hidden' }}>

        {/* Card Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e8eaed',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontWeight: '600', fontSize: '15px', color: '#202124' }}>
            All Appointments
          </span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search patient, doctor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '8px 14px',
                border: '1px solid #e8eaed',
                borderRadius: '8px',
                fontSize: '13px',
                width: '220px',
                outline: 'none',
              }}
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 14px',
                border: '1px solid #e8eaed',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                backgroundColor: '#fff',
                color: '#202124',
              }}
            >
              <option value="">All Status</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9aa0a6' }}>
              No appointments found.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8eaed' }}>
                  {['Patient', 'Doctor', 'Date', 'Status', 'Notes', 'Actions'].map(h => (
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
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    style={{ borderBottom: '1px solid #f1f3f4' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#202124', fontWeight: '500' }}>
                      {a.patientName || `Patient #${a.patientId}`}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>
                      {a.doctorName || `Doctor #${a.doctorId}`}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', color: '#202124' }}>
                        {new Date(a.appointmentDate).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9aa0a6', marginTop: '2px' }}>
                        {new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        ...getStatusStyle(a.status),
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>
                      {a.notes || '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => navigate(`/appointments/edit/${a.id}`)}
                        style={{
                          padding: '6px 16px',
                          marginRight: '8px',
                          border: '1px solid #e8eaed',
                          borderRadius: '6px',
                          backgroundColor: '#fff',
                          color: '#1a73e8',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        style={{
                          padding: '6px 16px',
                          border: '1px solid #fce8e6',
                          borderRadius: '6px',
                          backgroundColor: '#fff',
                          color: '#db4437',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer',
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

export default AppointmentList;