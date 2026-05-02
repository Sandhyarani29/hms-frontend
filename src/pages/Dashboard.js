import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0, rooms: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, d, a, r] = await Promise.all([
          API.get('/Patient/GetAllPatients'),
          API.get('/Doctor/GetAllDoctors'),
          API.get('/Appointment/GetAllAppointments'),
          API.get('/Room/GetAllRooms'),
        ]);
        setCounts({
          patients: p.data.length,
          doctors: d.data.length,
          appointments: a.data.length,
          rooms: r.data.length,
        });
        setRecentAppointments(a.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: 'Total Patients',     value: counts.patients,     path: '/patients',      color: '#1a73e8', bg: '#e8f0fe', abbr: 'P'  },
    { label: 'Total Doctors',      value: counts.doctors,      path: '/doctors',       color: '#0f9d58', bg: '#e6f4ea', abbr: 'D'  },
    { label: 'Appointments',       value: counts.appointments, path: '/appointments',  color: '#f4b400', bg: '#fef8e1', abbr: 'A'  },
    { label: 'Total Rooms',        value: counts.rooms,        path: '/rooms',         color: '#db4437', bg: '#fce8e6', abbr: 'R'  },
  ];

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'scheduled') return { bg: '#e6f4ea', color: '#0f9d58' };
    if (s === 'completed') return { bg: '#e8f0fe', color: '#1a73e8' };
    if (s === 'cancelled') return { bg: '#fce8e6', color: '#db4437' };
    return { bg: '#f1f3f4', color: '#5f6368' };
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontWeight: '700', color: '#202124', margin: 0 }}>Dashboard</h4>
        <p style={{ color: '#5f6368', fontSize: '14px', margin: '4px 0 0' }}>
          Welcome back! Here is what is happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={() => navigate(c.path)}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e8eaed',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: c.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: '700', color: c.color, flexShrink: 0,
            }}>
              {c.abbr}
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#202124', lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>

        {/* Recent Appointments */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e8eaed', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8eaed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '15px', color: '#202124' }}>Recent Appointments</div>
              <div style={{ fontSize: '12px', color: '#5f6368' }}>Latest scheduled appointments</div>
            </div>
            <button
              onClick={() => navigate('/appointments')}
              style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid #e8eaed', background: '#fff', color: '#1a73e8', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
            >
              View All
            </button>
          </div>
          <div>
            {recentAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9aa0a6' }}>
                No appointments found.
              </div>
            ) : recentAppointments.map((a, i) => {
              const statusStyle = getStatusStyle(a.status);
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '12px 20px',
                    borderBottom: i < recentAppointments.length - 1 ? '1px solid #f1f3f4' : 'none',
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: '#e8f0fe', color: '#1a73e8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '600', flexShrink: 0,
                  }}>
                    {a.patientName?.[0]}{a.patientName?.split(' ')[1]?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '14px', color: '#202124' }}>
                      {a.patientName || `Patient #${a.patientId}`}
                    </div>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>
                      {a.doctorName || `Doctor #${a.doctorId}`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>
                      {new Date(a.appointmentDate).toLocaleDateString()}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                      }}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e8eaed', padding: '20px' }}>
            <div style={{ fontWeight: '600', fontSize: '15px', color: '#202124', marginBottom: '16px' }}>Quick Actions</div>
            {[
              { label: 'Add New Patient',      path: '/patients/create',      color: '#1a73e8', bg: '#e8f0fe' },
              { label: 'Add New Doctor',       path: '/doctors/create',       color: '#0f9d58', bg: '#e6f4ea' },
              { label: 'Schedule Appointment', path: '/appointments/create',  color: '#f4b400', bg: '#fef8e1' },
              { label: 'Add Medical Record',   path: '/medicalrecords/create', color: '#9334e6', bg: '#f3e8fd' },
              { label: 'Add Room',             path: '/rooms/create',         color: '#db4437', bg: '#fce8e6' },
            ].map((q, i) => (
              <div
                key={i}
                onClick={() => navigate(q.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '8px',
                  cursor: 'pointer', marginBottom: '6px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: q.bg, color: q.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700', flexShrink: 0,
                }}>
                  +
                </div>
                <span style={{ fontSize: '13px', color: '#202124', fontWeight: '500' }}>{q.label}</span>
                <span style={{ marginLeft: 'auto', color: '#9aa0a6', fontSize: '16px' }}>›</span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ backgroundColor: '#1a73e8', borderRadius: '12px', padding: '20px', color: '#fff' }}>
            <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Today Summary</div>
            {[
              { label: 'Available Rooms',  value: counts.rooms      },
              { label: 'Active Doctors',   value: counts.doctors    },
              { label: 'Total Patients',   value: counts.patients   },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                <span style={{ fontSize: '13px', opacity: 0.85 }}>{s.label}</span>
                <span style={{ fontWeight: '700', fontSize: '18px' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;