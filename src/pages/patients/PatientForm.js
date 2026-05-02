import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axiosConfig';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  bloodGroup: '',
};

function PatientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      API.get(`/Patient/GetPatientById/${id}`)
        .then(res => {
          const p = res.data;
          setForm({ ...p, dateOfBirth: p.dateOfBirth?.split('T')[0] });
        })
        .catch(() => toast.error('Failed to load patient.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await API.put(`/Patient/UpdatePatient/${id}`, form);
        toast.success('Patient updated successfully.');
      } else {
        await API.post('/Patient/CreatePatient', form);
        toast.success('Patient created successfully.');
      }
      navigate('/patients');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
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
          {isEdit ? 'Edit Patient' : 'Add Patient'}
        </h4>
        <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
          {isEdit ? 'Update patient information' : 'Fill in the details to add a new patient'}
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
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5f6368', marginBottom: '8px' }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e8eaed',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#202124',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5f6368', marginBottom: '8px' }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e8eaed',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#202124',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Row 2 — Email + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5f6368', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@gmail.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e8eaed',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#202124',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5f6368', marginBottom: '8px' }}>
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e8eaed',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#202124',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Row 3 — Date of Birth + Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5f6368', marginBottom: '8px' }}>
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e8eaed',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#202124',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5f6368', marginBottom: '8px' }}>
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                style={{
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
                }}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Row 4 — Blood Group + Address */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5f6368', marginBottom: '8px' }}>
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                required
                style={{
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
                }}
              >
                <option value="">Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5f6368', marginBottom: '8px' }}>
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Pune"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e8eaed',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#202124',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
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
              {saving ? 'Saving...' : isEdit ? 'Update Patient' : 'Save Patient'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/patients')}
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

export default PatientForm;