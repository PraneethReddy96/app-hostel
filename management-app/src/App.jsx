import React from 'react';
import { HostelProvider, useHostel } from '../../src/context/HostelContext';
import { HeaderNav } from '../../src/components/common/HeaderNav';
import { DeviceFrame } from '../../src/components/common/DeviceFrame';
import { ToastContainer } from '../../src/components/common/ToastContainer';
import { ManagementApp } from '../../src/components/management/ManagementApp';
import { AdminAuthScreen } from '../../src/components/management/AdminAuthScreen';

const ManagementAppContent = () => {
  const { authUser } = useHostel();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <HeaderNav />
      {!authUser ? (
        <AdminAuthScreen />
      ) : (
        <DeviceFrame>
          <ManagementApp />
        </DeviceFrame>
      )}
      <ToastContainer />
    </div>
  );
};

export default function ManagementPortalApp() {
  return (
    <HostelProvider appRole="management">
      <ManagementAppContent />
    </HostelProvider>
  );
}

