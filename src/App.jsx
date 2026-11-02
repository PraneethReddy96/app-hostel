import React, { useEffect } from 'react';
import { HostelProvider, useHostel } from './context/HostelContext';
import { HeaderNav } from './components/common/HeaderNav';
import { DeviceFrame } from './components/common/DeviceFrame';
import { ToastContainer } from './components/common/ToastContainer';
import { StudentApp } from './components/student/StudentApp';
import { StudentAuthScreen } from './components/student/StudentAuthScreen';
import { ManagementApp } from './components/management/ManagementApp';
import { AdminAuthScreen } from './components/management/AdminAuthScreen';

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

export default function App() {
  // Determine which standalone app this server/URL is running:
  // - /management, /admin, ?portal=management, or Port 5174 -> Management App (Admin ERP)
  // - /student, /, ?portal=student, or Port 5173           -> Student App (Front-End)
  const pathname = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const queryRole = params.get('portal')?.toLowerCase();
  const envRole = import.meta.env.VITE_APP_ROLE;

  const isManagementRoute =
    envRole === 'management' ||
    queryRole === 'management' ||
    queryRole === 'admin' ||
    pathname.startsWith('/management') ||
    pathname.startsWith('/admin') ||
    window.location.port === '5174';

  const appRole = isManagementRoute ? 'management' : 'student';

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
