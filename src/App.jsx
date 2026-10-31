import React from 'react';
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
  // Determine which standalone app this server instance is running:
  // Port 5174 or VITE_APP_ROLE='management' -> Management App (Admin ERP)
  // Port 5173 or VITE_APP_ROLE='student'    -> Student App (Front-End)
  const envRole = import.meta.env.VITE_APP_ROLE;
  const portRole = window.location.port === '5174' ? 'management' : 'student';
  const appRole = envRole || portRole;

  return (
    <HostelProvider appRole={appRole}>
      <AppContent appRole={appRole} />
    </HostelProvider>
  );
}
