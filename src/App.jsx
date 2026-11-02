import React, { useState, useEffect } from 'react';
import { HostelProvider, useHostel } from './context/HostelContext';
import { HeaderNav } from './components/common/HeaderNav';
import { DeviceFrame } from './components/common/DeviceFrame';
import { ToastContainer } from './components/common/ToastContainer';
import { StudentApp } from './components/student/StudentApp';
import { StudentAuthScreen } from './components/student/StudentAuthScreen';
import { ManagementApp } from './components/management/ManagementApp';
import { AdminAuthScreen } from './components/management/AdminAuthScreen';
import { Smartphone, Building2, Copy, Check, ExternalLink } from 'lucide-react';

const AppContent = ({ appRole }) => {
  const { authUser } = useHostel();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <HeaderNav />

      {appRole === 'student' ? (
        !authUser ? (
          <StudentAuthScreen />
        ) : (
          <DeviceFrame>
            <StudentApp />
          </DeviceFrame>
        )
      ) : (
        !authUser ? (
          <AdminAuthScreen />
        ) : (
          <DeviceFrame>
            <ManagementApp />
          </DeviceFrame>
        )
      )}

      <ToastContainer />
    </div>
  );
};

const CloudPortalLauncher = () => {
  const [copiedKey, setCopiedKey] = useState(null);
  const origin = window.location.origin;
  const studentUrl = `${origin}/student`;
  const managementUrl = `${origin}/management`;

  const copyLink = (url, key) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="auth-screen-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      <div className="card auth-card" style={{ width: '100%', maxWidth: '540px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className="badge badge-success" style={{ marginBottom: '0.6rem' }}>
            ● Live Cloud Deployment Active
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>JoyStay Hostel System</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Both standalone portals are hosted on this cloud deployment. Open or copy either direct link below:
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Student App Card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Smartphone size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>1. Student App (Front-End Portal)</h3>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{studentUrl}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="/student" className="btn btn-primary btn-sm" style={{ flex: 1, textDecoration: 'none' }}>
                <ExternalLink size={14} />
                <span>Open Student App</span>
              </a>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => copyLink(studentUrl, 'student')}>
                {copiedKey === 'student' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                <span>{copiedKey === 'student' ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Management ERP Card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--secondary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Building2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>2. Management ERP (Web Manager)</h3>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{managementUrl}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="/management" className="btn btn-primary btn-sm" style={{ flex: 1, textDecoration: 'none' }}>
                <ExternalLink size={14} />
                <span>Open Management ERP</span>
              </a>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => copyLink(managementUrl, 'management')}>
                {copiedKey === 'management' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                <span>{copiedKey === 'management' ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const pathname = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const queryRole = params.get('portal')?.toLowerCase();
  const envRole = import.meta.env.VITE_APP_ROLE;
  const port = window.location.port;

  const isExplicitManagement =
    envRole === 'management' ||
    queryRole === 'management' ||
    queryRole === 'admin' ||
    pathname.startsWith('/management') ||
    pathname.startsWith('/admin') ||
    port === '5174';

  const isExplicitStudent =
    envRole === 'student' ||
    queryRole === 'student' ||
    pathname.startsWith('/student') ||
    port === '5173';

  // On cloud deployments (like Vercel) when visiting root '/' directly without /student or /management,
  // show the Cloud Portal Launcher so the user can open or copy either standalone link.
  if (!isExplicitManagement && !isExplicitStudent) {
    return <CloudPortalLauncher />;
  }

  const appRole = isExplicitManagement ? 'management' : 'student';

  useEffect(() => {
    document.title =
      appRole === 'management'
        ? 'JoyStay — Management ERP (Web Manager)'
        : 'JoyStay — Student App (Front-End Portal)';
  }, [appRole]);

  return (
    <HostelProvider appRole={appRole}>
      <AppContent appRole={appRole} />
    </HostelProvider>
  );
}
