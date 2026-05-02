import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axiosConfig';

function MedicalRecordList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const res = await API.get('/MedicalRecord/GetAllMedicalRecords');
      setRecords(res.data);
    } catch {
      toast.error('Error fetching medical records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medical record?')) return;
    try {
      await API.delete(`/MedicalRecord/DeleteMedicalRecord/${id}`);
      setRecords(records.filter(r => r.id !== id));
      toast.success('Medical record deleted.');
    } catch {
      toast.error('Error deleting record.');
    }
  };

  const filtered = records.filter(r =>
    `${r.diagnosis} ${r.prescription} ${r.notes}`
      .toLowerCase().includes(search.toLowerCase())
  );

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
          <h4 style={{ fontWeight: '700', color: '#202124', margin: 0 }}>Medical Records</h4>
          <p style={{ color: '#5f6368', fontSize: '13px', margin: '4px 0 0' }}>
            {records.length} total records
          </p>
        </div>
        <button
          onClick={() => navigate('/medicalrecords/create')}
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
          + Add Record
        </button>
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
        }}>
          <span style={{ fontWeight: '600', fontSize: '15px', color: '#202124' }}>
            All Medical Records
          </span>
          <input
            type="text"
            placeholder="Search by diagnosis, prescription..."
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

        {/* Table */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9aa0a6' }}>
              No medical records found.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8eaed' }}>
                  {['Patient', 'Doctor', 'Diagnosis', 'Prescription', 'Record Date', 'Notes', 'Actions'].map(h => (
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
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    style={{ borderBottom: '1px solid #f1f3f4' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#202124', fontWeight: '500' }}>
                      Patient #{r.patientId}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>
                      Doctor #{r.doctorId}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}>
                        {r.diagnosis}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>
                      {r.prescription}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#5f6368' }}>
                      {new Date(r.recordDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#9aa0a6' }}>
                      {r.notes || '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => navigate(`/medicalrecords/edit/${r.id}`)}
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalRecordList;