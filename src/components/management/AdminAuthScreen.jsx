import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { Building2, ShieldCheck, LogIn } from 'lucide-react';

export const AdminAuthScreen = () => {
  const { staffList, loginAdmin, backendConnected } = useHostel();

  const [selectedStaffId, setSelectedStaffId] = useState(staffList[0]?.id || 'STF-001');
  const [password, setPassword] = useState('admin123');

  const handleLogin = (e) => {
    e.preventDefault();
    const staff = staffList.find(s => s.id === selectedStaffId) || staffList[0];
    loginAdmin(staff);
  };

  return (
    <div className="auth-screen-wrapper">
      <div className="card auth-card" style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.35rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--secondary-gradient)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '0.65rem', boxShadow: 'var(--shadow-sm)' }}>
            <Building2 size={25} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>JoyStay Management ERP</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Administration & Control Portal • Role-Based Access
          </p>
          <div style={{ marginTop: '8px' }}>
            <span className={`badge ${backendConnected ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
              {backendConnected ? '● Real-Time Cloud Sync Active' : '● Connecting to Live Database...'}
            </span>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">SELECT STAFF / WARDEN / ADMIN ROLE</label>
            <select
              className="form-control"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
            >
              {staffList.map((stf) => (
                <option key={stf.id} value={stf.id}>
                  {stf.name} — {stf.role}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">ADMINISTRATION ACCESS KEY</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '0.75rem', padding: '0.75rem' }}>
            <LogIn size={16} />
            <span>Sign In to Management Console</span>
          </button>
        </form>
      </div>
    </div>
  );
};

