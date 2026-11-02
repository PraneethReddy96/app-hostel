import React from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Sun,
  Moon,
  LogOut,
  Wifi,
  WifiOff
} from 'lucide-react';

export const HeaderNav = () => {
  const {
    appRole,
    theme,
    setTheme,
    currentStudent,
    authUser,
    logout,
    backendConnected
  } = useHostel();

  const isStudentApp = appRole === 'student';

  return (
    <header className="app-top-switcher">
      {/* Brand & Dedicated App Title */}
      <div className="switcher-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{isStudentApp ? '📱' : '🏢'}</span>
          <span style={{ fontWeight: 800, letterSpacing: '-0.02em', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            JoyStay
          </span>
        </div>
        <span className="brand-badge">
          {isStudentApp ? 'Student Portal' : 'Management ERP'}
        </span>

        {/* Live Backend Sync Indicator */}
        <span
          className={`badge sync-status-pill ${backendConnected ? 'badge-success' : 'badge-warning'}`}
          style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
          title="Real-time connection to Shared Hostel Database"
        >
          {backendConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
          <span className="sync-text-full">{backendConnected ? 'Live Synced' : 'Offline'}</span>
          <span className="sync-text-short">{backendConnected ? 'Live' : 'Offline'}</span>
        </span>
      </div>

      {/* Right Controls */}
      <div className="switcher-controls">
        {/* Logged-in Resident Badge (Student App) */}
        {isStudentApp && authUser && currentStudent && (
          <div className="user-pill-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Resident:</span>
            <strong style={{ color: 'var(--text-main)' }}>{currentStudent.name} ({currentStudent.room})</strong>
          </div>
        )}

        {/* Logged-in Admin Role Badge (Management App) */}
        {!isStudentApp && authUser && (
          <div className="user-pill-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
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
