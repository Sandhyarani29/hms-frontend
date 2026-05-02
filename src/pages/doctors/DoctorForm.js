import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axiosConfig';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  specialization: '',
  licenseNumber: '',
};

function DoctorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      API.get(`/Doctor/GetDoctorById/${id}`)
        .then(res => {
          const d = res.data;
          setForm({
            firstName: d.firstName,
            lastName: d.lastName,
            email: d.email,
            phone: d.phone,
            specialization: d.specialization,
            licenseNumber: d.licenseNumber,
          });
        })
        .catch(() => toast.error('Failed to load doctor.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await API.put(`/Doctor/UpdateDoctor/${id}`, form);
        toast.success('Doctor updated successfully.');
      } else {
        await API.post('/Doctor/CreateDoctor', form);
        toast.success('Doctor created successfully.');
      }
      navigate('/doctors');
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
          {isEdit ? 'Edit Doctor' : 'Add Doctor'}
        </h4>
        <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
          {isEdit ? 'Update doctor information' : 'Fill in the details to add a new doctor'}
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

          {/* Row 1 — First Name + Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 2 — Email + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="doctor@hospital.com"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 3 — Specialization + License Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={labelStyle}>Specialization</label>
              <select
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                required
                style={{ ...inputStyle, appearance: 'auto' }}
              >
                <option value="">Select specialization</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
                <option>Pediatrics</option>
                <option>Dermatology</option>
                <option>Gynecology</option>
                <option>Ophthalmology</option>
                <option>Psychiatry</option>
                <option>General Medicine</option>
                <option>ENT</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="e.g. LIC12345"
                required
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
              {saving ? 'Saving...' : isEdit ? 'Update Doctor' : 'Save Doctor'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/doctors')}
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

export default DoctorForm;