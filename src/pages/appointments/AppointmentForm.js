import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axiosConfig';

const initialState = {
  patientId: '',
  doctorId: '',
  appointmentDate: '',
  status: 'Scheduled',
  notes: '',
};

function AppointmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialState);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, dRes] = await Promise.all([
         // API.get('/Patient/GetAllPatients'),
          API.get('/Doctor/GetAllDoctors'),
        ]);
        setPatients(pRes.data);
        setDoctors(dRes.data);
        if (isEdit) {
          const aRes = await API.get(`/Appointment/GetAppointmentById/${id}`);
          const a = aRes.data;
          setForm({
            patientId: a.patientId,
            doctorId: a.doctorId,
            appointmentDate: a.appointmentDate?.slice(0, 16),
            status: a.status,
            notes: a.notes,
          });
        }
      } catch {
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        patientId: parseInt(form.patientId),
        doctorId: parseInt(form.doctorId),
        appointmentDate: form.appointmentDate,
        status: form.status,
        notes: form.notes,
      };
      if (isEdit) {
        await API.put(`/Appointment/UpdateAppointment/${id}`, payload);
        toast.success('Appointment updated successfully.');
      } else {
        await API.post('/Appointment/CreateAppointment', payload);
        toast.success('Appointment created successfully.');
      }
      navigate('/appointments');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e8eaed',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#202124',
    outline: 'none',
    backgroundColor: '#fafafa',
    boxSizing: 'border-box',
    appearance: 'auto',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#5f6368',
    marginBottom: '8px',
  };

  const selectedPatient = patients.find(p => p.id === parseInt(form.patientId));
  const selectedDoctor = doctors.find(d => d.id === parseInt(form.doctorId));

  const getStatusStyle = (status) => {
    if (status === 'Scheduled') return { backgroundColor: '#e6f4ea', color: '#0f9d58' };
    if (status === 'Completed')  return { backgroundColor: '#e8f0fe', color: '#1a73e8' };
    if (status === 'Cancelled')  return { backgroundColor: '#fce8e6', color: '#db4437' };
    return { backgroundColor: '#f1f3f4', color: '#5f6368' };
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontWeight: '700', color: '#202124', margin: 0 }}>
          {isEdit ? 'Edit Appointment' : 'Add Appointment'}
        </h4>
        <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
          {isEdit ? 'Update appointment details' : 'Schedule a new appointment'}
        </p>
      </div>

      {/* Two column layout — Form + Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left — Form Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid #e8eaed',
          padding: '32px',
        }}>
          <form onSubmit={handleSubmit}>

            {/* Row 1 — Patient + Doctor */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Patient</label>
                <select name="patientId" value={form.patientId} onChange={handleChange} required style={inputStyle}>
                  <option value="">Select patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Doctor</label>
                <select name="doctorId" value={form.doctorId} onChange={handleChange} required style={inputStyle}>
                  <option value="">Select doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} — {d.specialization}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 — Date + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Date & Time</label>
                <input
                  type="datetime-local"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} required style={inputStyle}>
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            {/* Row 3 — Notes full width */}
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Enter notes..."
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#1a73e8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving...' : isEdit ? 'Update Appointment' : 'Save Appointment'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/appointments')}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#fff',
                  color: '#5f6368',
                  border: '1px solid #e8eaed',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>

        {/* Right — Preview Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid #e8eaed',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e8eaed',
            fontWeight: '600',
            fontSize: '14px',
            color: '#202124',
          }}>
            Appointment Preview
          </div>
          <div style={{ padding: '20px' }}>

            {/* Patient */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: '#9aa0a6', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.05em' }}>
                PATIENT
              </div>
              {selectedPatient ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: '#e8f0fe', color: '#1a73e8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '700', flexShrink: 0,
                  }}>
                    {selectedPatient.firstName?.[0]}{selectedPatient.lastName?.[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#202124' }}>
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9aa0a6' }}>{selectedPatient.phone}</div>
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Not selected</span>
              )}
            </div>

            {/* Doctor */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: '#9aa0a6', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.05em' }}>
                DOCTOR
              </div>
              {selectedDoctor ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: '#e6f4ea', color: '#0f9d58',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '700', flexShrink: 0,
                  }}>
                    {selectedDoctor.firstName?.[0]}{selectedDoctor.lastName?.[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#202124' }}>
                      Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9aa0a6' }}>{selectedDoctor.specialization}</div>
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Not selected</span>
              )}
            </div>

            {/* Date */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: '#9aa0a6', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.05em' }}>
                DATE & TIME
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#202124' }}>
                {form.appointmentDate
                  ? new Date(form.appointmentDate).toLocaleString()
                  : <span style={{ color: '#9aa0a6', fontSize: '13px' }}>Not set</span>
                }
              </div>
            </div>

            {/* Status */}
            <div>
              <div style={{ fontSize: '11px', color: '#9aa0a6', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.05em' }}>
                STATUS
              </div>
              <span style={{
                ...getStatusStyle(form.status),
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
              }}>
                {form.status}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AppointmentForm;