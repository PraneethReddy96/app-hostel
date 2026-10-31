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
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '1.85rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--secondary-gradient)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
            <Building2 size={26} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>JoyStay Management ERP</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Administration & Control Portal • Role-Based Access
          </p>
          <div style={{ marginTop: '8px' }}>
            <span className={`badge ${backendConnected ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
              {backendConnected ? '● Connected to Shared Backend API (:4000)' : '● Connecting to Shared Backend...'}
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
                  {stf.name} — {stf.role} ({stf.department})
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

