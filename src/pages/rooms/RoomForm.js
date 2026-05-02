import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axiosConfig';

const initialState = {
  roomNumber: '',
  roomType: '',
  isAvailable: true,
  pricePerDay: '',
};

function RoomForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      API.get(`/Room/GetRoomById/${id}`)
        .then(res => {
          const r = res.data;
          setForm({
            roomNumber: r.roomNumber,
            roomType: r.roomType,
            isAvailable: r.isAvailable,
            pricePerDay: r.pricePerDay,
          });
        })
        .catch(() => toast.error('Failed to load room.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        roomNumber: form.roomNumber,
        roomType: form.roomType,
        isAvailable: form.isAvailable,
        pricePerDay: parseFloat(form.pricePerDay),
      };
      if (isEdit) {
        await API.put(`/Room/UpdateRoom/${id}`, payload);
        toast.success('Room updated successfully.');
      } else {
        await API.post('/Room/CreateRoom', payload);
        toast.success('Room created successfully.');
      }
      navigate('/rooms');
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const getRoomTypeColor = (type) => {
    const t = type?.toLowerCase();
    if (t === 'icu')     return { bg: '#fce8e6', color: '#db4437' };
    if (t === 'private') return { bg: '#f3e8fd', color: '#9334e6' };
    return                      { bg: '#e8f0fe', color: '#1a73e8' };
  };

  const typeColor = getRoomTypeColor(form.roomType);

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
          {isEdit ? 'Edit Room' : 'Add Room'}
        </h4>
        <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
          {isEdit ? 'Update room details' : 'Add a new room to the hospital'}
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

            {/* Row 1 — Room Number + Room Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  placeholder="e.g. 101"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Room Type</label>
                <select
                  name="roomType"
                  value={form.roomType}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select room type</option>
                  <option>General</option>
                  <option>ICU</option>
                  <option>Private</option>
                </select>
              </div>
            </div>

            {/* Row 2 — Price + Availability */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={labelStyle}>Price Per Day (₹)</label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={form.pricePerDay}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  min="0"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Availability</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: '1px solid #e8eaed',
                  borderRadius: '10px',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                }}
                  onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}
                >
                  {/* Toggle Switch */}
                  <div style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: form.isAvailable ? '#0f9d58' : '#e8eaed',
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: form.isAvailable ? '23px' : '3px',
                      transition: 'left 0.2s',
                    }} />
                  </div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: form.isAvailable ? '#0f9d58' : '#db4437',
                  }}>
                    {form.isAvailable ? 'Available' : 'Occupied'}
                  </span>
                </div>
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
                {saving ? 'Saving...' : isEdit ? 'Update Room' : 'Save Room'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/rooms')}
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
            Room Preview
          </div>
          <div style={{ padding: '24px' }}>

            {/* Room Number Icon */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: typeColor.bg,
                color: typeColor.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700',
                margin: '0 auto',
              }}>
                {form.roomNumber || '?'}
              </div>
            </div>

            {/* Details */}
            {[
              {
                label: 'Room No.',
                value: form.roomNumber || '—',
                isText: true,
              },
              {
                label: 'Type',
                value: form.roomType,
                isTag: true,
                tagStyle: { backgroundColor: typeColor.bg, color: typeColor.color },
              },
              {
                label: 'Price',
                value: form.pricePerDay ? `₹${Number(form.pricePerDay).toLocaleString()} /day` : '—',
                isText: true,
              },
              {
                label: 'Status',
                value: form.isAvailable ? 'Available' : 'Occupied',
                isTag: true,
                tagStyle: {
                  backgroundColor: form.isAvailable ? '#e6f4ea' : '#fce8e6',
                  color: form.isAvailable ? '#0f9d58' : '#db4437',
                },
              },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < 3 ? '1px solid #f1f3f4' : 'none',
              }}>
                <span style={{ fontSize: '13px', color: '#9aa0a6' }}>{item.label}</span>
                {item.isTag && item.value ? (
                  <span style={{
                    ...item.tagStyle,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}>
                    {item.value}
                  </span>
                ) : (
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#202124' }}>
                    {item.value || '—'}
                  </span>
                )}
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomForm;