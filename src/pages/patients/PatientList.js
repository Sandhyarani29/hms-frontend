import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axiosConfig';

function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get('/Patient/GetAllPatients');
      setPatients(res.data);
    } catch (error) {
      toast.error('Error fetching patients.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await API.delete(`/Patient/DeletePatient/${id}`);
      setPatients(patients.filter(p => p.id !== id));
      toast.success('Patient deleted successfully.');
    } catch {
      toast.error('Error deleting patient.');
    }
  };

  const filtered = patients.filter(p =>
    `${p.firstName} ${p.lastName} ${p.email} ${p.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h4 style={{ fontWeight: '700', color: '#202124', margin: 0 }}>Patients</h4>
          <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
            {patients.length} total patients
          </p>
        </div>
        <button
          onClick={() => navigate('/patients/create')}
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
          + Add Patient
        </button>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #e8eaed',
        overflow: 'hidden',
      }}>

        {/* Card Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e8eaed',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontWeight: '600', fontSize: '15px', color: '#202124' }}>
            All Patients
          </span>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 14px',
              border: '1px solid #e8eaed',
              borderRadius: '8px',
              fontSize: '13px',
              width: '260px',
              outline: 'none',
            }}
          />
        </div>

        {/* Table */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9aa0a6' }}>
              No patients found.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8eaed' }}>
                  {['Name', 'Email', 'Phone', 'Blood Group', 'Gender', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#5f6368',
                      backgroundColor: '#f8f9fa',
                      textAlign: 'left',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid #f1f3f4' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#202124', fontWeight: '500' }}>
                      {p.firstName} {p.lastName}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>
                      {p.email}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>
                      {p.phone}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        backgroundColor: '#e8f0fe',
                        color: '#1a73e8',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}>
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>
                      {p.gender}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => navigate(`/patients/edit/${p.id}`)}
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
                        onClick={() => handleDelete(p.id)}
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

export default PatientList;