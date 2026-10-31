import React from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Smartphone,
  Laptop,
  Monitor,
  Sun,
  Moon,
  RotateCcw,
  LogOut,
  Wifi,
  WifiOff
} from 'lucide-react';

export const HeaderNav = () => {
  const {
    appRole,
    deviceMode,
    setDeviceMode,
    theme,
    setTheme,
    students,
    currentStudentId,
    setCurrentStudentId,
    authUser,
    logout,
    backendConnected,
    resetDemoData
  } = useHostel();

  const isStudentApp = appRole === 'student';

  return (
    <header className="app-top-switcher">
      {/* Brand & Dedicated App Title */}
      <div className="switcher-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{isStudentApp ? '📱' : '🏢'}</span>
          <span style={{ fontWeight: 800, letterSpacing: '-0.02em', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            JoyStay
          </span>
        </div>
        <span className="brand-badge">
          {isStudentApp ? 'Student App (Front-End)' : 'Management ERP (Back-End)'}
        </span>

        {/* Live Backend Sync Indicator */}
        <span
          className={`badge ${backendConnected ? 'badge-success' : 'badge-warning'}`}
          style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          title="Real-time connection to Shared Hostel Backend (:4000)"
        >
          {backendConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
          <span>{backendConnected ? 'Shared DB Synced' : 'Offline Fallback'}</span>
        </span>
      </div>

      {/* Right Controls */}
      <div className="switcher-controls">
        {/* Device Viewport Switcher (Useful in Student App to toggle Phone Frame vs Fluid) */}
        {isStudentApp && (
          <div className="device-picker" title="Switch Student Viewport">
            <button
              className={deviceMode === 'mobile_preview' ? 'active' : ''}
              onClick={() => setDeviceMode('mobile_preview')}
              title="Mobile Phone Shell"
            >
              <Smartphone size={15} />
            </button>
            <button
              className={deviceMode === 'responsive' ? 'active' : ''}
              onClick={() => setDeviceMode('responsive')}
              title="Full Responsive View"
            >
              <Monitor size={15} />
            </button>
          </div>
        )}

        {/* Active Resident Switcher (Only in Student App) */}
        {isStudentApp && authUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Resident:</span>
            <select
              value={currentStudentId}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id} style={{ background: '#111827', color: '#fff' }}>
                  {s.name} ({s.room})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Active Admin Role Badge (Only in Management App) */}
        {!isStudentApp && authUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Role:</span>
            <strong style={{ color: 'var(--primary)' }}>{authUser.name} ({authUser.title})</strong>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Reset Shared Backend Data */}
        <button
          className="icon-btn"
          onClick={() => {
            if (window.confirm("Reset shared database back to default state?")) {
              resetDemoData();
            }
          }}
          title="Reset Shared Database"
        >
          <RotateCcw size={15} />
        </button>

        {/* Sign Out Button */}
        {authUser && (
          <button
            className="icon-btn"
            onClick={logout}
            title="Sign Out"
            style={{ color: 'var(--danger)' }}
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </header>
  );
};
