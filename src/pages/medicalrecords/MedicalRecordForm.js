import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axiosConfig';

const initialState = {
  patientId: '',
  doctorId: '',
  diagnosis: '',
  prescription: '',
  notes: '',
  recordDate: '',
};

function MedicalRecordForm() {
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
          API.get('/Patient/GetAllPatients'),
          API.get('/Doctor/GetAllDoctors'),
        ]);
        setPatients(pRes.data);
        setDoctors(dRes.data);
        if (isEdit) {
          const rRes = await API.get(`/MedicalRecord/GetMedicalRecordById/${id}`);
          const r = rRes.data;
          setForm({
            patientId: r.patientId,
            doctorId: r.doctorId,
            diagnosis: r.diagnosis,
            prescription: r.prescription,
            notes: r.notes,
            recordDate: r.recordDate?.split('T')[0],
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
        diagnosis: form.diagnosis,
        prescription: form.prescription,
        notes: form.notes,
        recordDate: form.recordDate,
      };
      if (isEdit) {
        await API.put(`/MedicalRecord/UpdateMedicalRecord/${id}`, payload);
        toast.success('Record updated successfully.');
      } else {
        await API.post('/MedicalRecord/CreateMedicalRecord', payload);
        toast.success('Record created successfully.');
      }
      navigate('/medicalrecords');
    } catch {
      toast.error('Something went wrong.');
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
          {isEdit ? 'Edit Medical Record' : 'Add Medical Record'}
        </h4>
        <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
          {isEdit ? 'Update record details' : 'Create a new medical record'}
        </p>
      </div>

      {/* Form Card */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid #e8eaed',
        padding: '32px',
        maxWidth: '860px',
      }}>
        <form onSubmit={handleSubmit}>

          {/* Row 1 — Patient + Doctor */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Patient</label>
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Doctor</label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select doctor</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} — {d.specialization}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 — Diagnosis + Prescription */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Enter diagnosis"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Prescription</label>
              <input
                type="text"
                name="prescription"
                value={form.prescription}
                onChange={handleChange}
                placeholder="Enter prescription"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 3 — Record Date + Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={labelStyle}>Record Date</label>
              <input
                type="date"
                name="recordDate"
                value={form.recordDate}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes"
                style={inputStyle}
              />
            </div>
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
              {saving ? 'Saving...' : isEdit ? 'Update Record' : 'Save Record'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/medicalrecords')}
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
    </div>
  );
}

export default MedicalRecordForm;