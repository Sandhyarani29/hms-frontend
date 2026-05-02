import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/',              label: 'Dashboard',       icon: 'D', section: 'MAIN'       },
  { path: '/patients',      label: 'Patients',         icon: 'P', section: 'MANAGEMENT' },
  { path: '/doctors',       label: 'Doctors',          icon: 'D', section: null         },
  { path: '/appointments',  label: 'Appointments',     icon: 'A', section: null         },
  { path: '/medicalrecords',label: 'Medical Records',  icon: 'M', section: null         },
  { path: '/rooms',         label: 'Rooms',            icon: 'R', section: null         },
];

function Sidebar() {
  return (
    <div style={{
      width: '240px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e8eaed',
      paddingTop: '76px',
      zIndex: 999,
      overflowY: 'auto',
    }}>
      <div style={{ padding: '0 12px' }}>
        {menuItems.map((item, i) => (
          <div key={i}>
            {item.section && (
              <div style={{
                fontSize: '10px', fontWeight: '600',
                color: '#9aa0a6', padding: '16px 12px 6px',
                letterSpacing: '0.08em',
              }}>
                {item.section}
              </div>
            )}
            <NavLink
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                marginBottom: '2px',
                backgroundColor: isActive ? '#e8f0fe' : 'transparent',
                color: isActive ? '#1a73e8' : '#5f6368',
                fontWeight: isActive ? '600' : '400',
                fontSize: '14px',
                transition: 'all 0.15s',
              })}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: '#f1f3f4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '700', color: '#5f6368',
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              {item.label}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;