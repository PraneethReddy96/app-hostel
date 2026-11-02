import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { ShieldCheck, UserPlus, LogIn, Smartphone, Mail, Phone, Building, Lock } from 'lucide-react';

export const StudentAuthScreen = () => {
  const { students, loginStudent, addStudent, backendConnected } = useHostel();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'STU-001');
  const [password, setPassword] = useState('student123');

  // Registration state
  const [regForm, setRegForm] = useState({
    name: '',
    gender: 'Male',
    course: 'B.Tech Computer Science',
    year: '1st Year',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    dob: '2005-04-12',
    guardianName: '',
    guardianRelation: 'Father',
    guardianPhone: '',
    secondaryContact: '',
    address: '',
    room: 'B-202',
    bed: 'Bed 1'
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginStudent(selectedStudentId);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const created = addStudent({
      ...regForm,
      block: regForm.room.startsWith('A') ? 'Block A - Phoenix' : 'Block B - Emerald',
      roomType: 'Double Sharing (AC)'
    });
    loginStudent(created.id);
  };

  return (
    <div className="auth-screen-wrapper">
      <div className="card auth-card" style={{ width: '100%', maxWidth: mode === 'login' ? '430px' : '560px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.35rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--primary-gradient)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '0.65rem', boxShadow: 'var(--shadow-sm)' }}>
            <Smartphone size={25} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>JoyStay Student App</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Resident Front-End Portal • Smart Campus Living
          </p>
          <div style={{ marginTop: '8px' }}>
            <span className={`badge ${backendConnected ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
              {backendConnected ? '● Real-Time Cloud Sync Active' : '● Connecting to Live Database...'}
            </span>
          </div>
        </div>

        {/* Toggle Login / Registration */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              background: mode === 'login' ? 'var(--primary-gradient)' : 'transparent',
              color: mode === 'login' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              background: mode === 'register' ? 'var(--primary-gradient)' : 'transparent',
              color: mode === 'register' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            New Candidate Registration
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">SELECT RESIDENT ACCOUNT (ROLL NO / ROOM)</label>
              <select
                className="form-control"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} • Room {st.room} ({st.rollNo})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">STUDENT PORTAL PIN / PASSWORD</label>
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
              <span>Sign In to Student Portal</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="auth-form-grid">
              <div className="form-group">
                <label className="form-label">CANDIDATE FULL NAME *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Karthik Nair"
                  value={regForm.name}
                  onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">STUDENT PHONE *</label>
                <input
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={regForm.phone}
                  onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="student@campus.edu"
                  value={regForm.email}
                  onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">COURSE & YEAR</label>
                <input
                  className="form-control"
                  value={regForm.course}
                  onChange={e => setRegForm({ ...regForm, course: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMERGENCY GUARDIAN NAME *</label>
                <input
                  className="form-control"
                  placeholder="Parent / Guardian Name"
                  value={regForm.guardianName}
                  onChange={e => setRegForm({ ...regForm, guardianName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMERGENCY CONTACT PHONE *</label>
                <input
                  className="form-control"
                  placeholder="+91 98765 00000"
                  value={regForm.guardianPhone}
                  onChange={e => setRegForm({ ...regForm, guardianPhone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PREFERRED ROOM</label>
                <select
                  className="form-control"
                  value={regForm.room}
                  onChange={e => setRegForm({ ...regForm, room: e.target.value })}
                >
                  <option value="B-202">Room B-202 (Boys Wing)</option>
                  <option value="B-105">Room B-105 (Boys Wing)</option>
                  <option value="A-102">Room A-102 (Girls Wing)</option>
                  <option value="A-301">Room A-301 (Girls Wing)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">BLOOD GROUP</label>
                <select
                  className="form-control"
                  value={regForm.bloodGroup}
                  onChange={e => setRegForm({ ...regForm, bloodGroup: e.target.value })}
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">PERMANENT HOME ADDRESS *</label>
              <input
                className="form-control"
                placeholder="House No, Street, City, State"
                value={regForm.address}
                onChange={e => setRegForm({ ...regForm, address: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
              <UserPlus size={16} />
              <span>Complete Registration & Sign In</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

