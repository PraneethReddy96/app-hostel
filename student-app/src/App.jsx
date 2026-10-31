import React from 'react';
import { HostelProvider, useHostel } from '../../src/context/HostelContext';
import { HeaderNav } from '../../src/components/common/HeaderNav';
import { DeviceFrame } from '../../src/components/common/DeviceFrame';
import { ToastContainer } from '../../src/components/common/ToastContainer';
import { StudentApp } from '../../src/components/student/StudentApp';
import { StudentAuthScreen } from '../../src/components/student/StudentAuthScreen';

const StudentAppContent = () => {
  const { authUser } = useHostel();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <HeaderNav />
      {!authUser ? (
        <StudentAuthScreen />
      ) : (
        <DeviceFrame>
          <StudentApp />
        </DeviceFrame>
      )}
      <ToastContainer />
    </div>
  );
};

export default function StudentPortalApp() {
  return (
    <HostelProvider appRole="student">
      <StudentAppContent />
    </HostelProvider>
  );
}

