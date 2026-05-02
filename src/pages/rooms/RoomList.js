import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axiosConfig';

function RoomList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get('/Room/GetAllRooms');
      setRooms(res.data);
    } catch {
      toast.error('Error fetching rooms.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await API.delete(`/Room/DeleteRoom/${id}`);
      setRooms(rooms.filter(r => r.id !== id));
      toast.success('Room deleted.');
    } catch {
      toast.error('Error deleting room.');
    }
  };

  const getRoomTypeColor = (type) => {
    const t = type?.toLowerCase();
    if (t === 'icu')     return { bg: '#fce8e6', color: '#db4437' };
    if (t === 'private') return { bg: '#f3e8fd', color: '#9334e6' };
    return                      { bg: '#e8f0fe', color: '#1a73e8' };
  };

  const filtered = rooms.filter(r => {
    const matchSearch = `${r.roomNumber} ${r.roomType}`.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType ? r.roomType?.toLowerCase() === filterType.toLowerCase() : true;
    return matchSearch && matchType;
  });

  const available = rooms.filter(r => r.isAvailable).length;
  const occupied  = rooms.filter(r => !r.isAvailable).length;

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
          <h4 style={{ fontWeight: '700', color: '#202124', margin: 0 }}>Rooms</h4>
          <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
            {rooms.length} total rooms
          </p>
        </div>
        <button
          onClick={() => navigate('/rooms/create')}
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
          + Add Room
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Rooms', count: rooms.length,   bg: '#f1f3f4', color: '#5f6368' },
          { label: 'Available',   count: available,      bg: '#e6f4ea', color: '#0f9d58' },
          { label: 'Occupied',    count: occupied,       bg: '#fce8e6', color: '#db4437' },
          { label: 'ICU Rooms',   count: rooms.filter(r => r.roomType?.toLowerCase() === 'icu').length, bg: '#fef3c7', color: '#f59e0b' },
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
              width: '44px', height: '44px',
              borderRadius: '10px',
              backgroundColor: s.bg,
              color: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '700',
            }}>
              {s.count}
            </div>
            <div style={{ fontSize: '13px', color: '#5f6368', fontWeight: '500' }}>{s.label}</div>
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
            All Rooms
          </span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search room number or type..."
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
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
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
              <option value="">All Types</option>
              <option>General</option>
              <option>ICU</option>
              <option>Private</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9aa0a6' }}>
              No rooms found.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8eaed' }}>
                  {['Room Number', 'Type', 'Price / Day', 'Availability', 'Actions'].map(h => (
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
                {filtered.map((r) => {
                  const typeColor = getRoomTypeColor(r.roomType);
                  return (
                    <tr
                      key={r.id}
                      style={{ borderBottom: '1px solid #f1f3f4' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px', color: '#202124' }}>
                          Room {r.roomNumber}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9aa0a6', marginTop: '2px' }}>
                          #{r.roomNumber}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          backgroundColor: typeColor.bg,
                          color: typeColor.color,
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {r.roomType}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#202124' }}>
                          ₹{r.pricePerDay?.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '12px', color: '#9aa0a6' }}> /day</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {r.isAvailable ? (
                          <span style={{
                            backgroundColor: '#e6f4ea',
                            color: '#0f9d58',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}>Available</span>
                        ) : (
                          <span style={{
                            backgroundColor: '#fce8e6',
                            color: '#db4437',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}>Occupied</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => navigate(`/rooms/edit/${r.id}`)}
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
                          onClick={() => handleDelete(r.id)}
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomList;