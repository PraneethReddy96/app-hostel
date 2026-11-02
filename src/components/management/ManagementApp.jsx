import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { AdminDashboard } from './AdminDashboard';
import { StudentAdmissionView } from './StudentAdmissionView';
import { RoomBedAllocationView } from './RoomBedAllocationView';
import { FeeManagementView } from './FeeManagementView';
import { MessInventoryView } from './MessInventoryView';
import { ComplaintResolutionView } from './ComplaintResolutionView';
import { StaffSecurityView } from './StaffSecurityView';
import { IncidentReportsView } from './IncidentReportsView';
import { ReportsAnalyticsView } from './ReportsAnalyticsView';
import { HostelSettingsView } from './HostelSettingsView';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  CreditCard,
  UtensilsCrossed,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Settings,
  Bell,
  Search,
  Building,
  Menu,
  X
} from 'lucide-react';

export const ManagementApp = () => {
  const { complaints, students, parcels, outpasses, hostelSettings, authUser, backendConnected } = useHostel();

  const [activeNav, setActiveNav] = useState('dashboard');
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const openComplaintsCount = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const pendingOutpassCount = outpasses.filter(o => o.wardenApproval === 'Pending').length;

  const navLinks = [
    { section: 'Overview' },
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { key: 'students', label: 'Student Admissions', icon: <Users size={17} />, count: students.length },
    { key: 'rooms', label: 'Room & Bed Allocation', icon: <BedDouble size={17} /> },
    { key: 'fees', label: 'Fees & Dues Collection', icon: <CreditCard size={17} /> },

    { section: 'Operations' },
    { key: 'mess', label: 'Mess & Pantry Inventory', icon: <UtensilsCrossed size={17} /> },
    { key: 'complaints', label: 'Complaints Queue', icon: <Wrench size={17} />, count: openComplaintsCount },
    { key: 'security', label: 'Staff & Security Gate', icon: <ShieldCheck size={17} /> },
    { key: 'incidents', label: 'Incident Reports', icon: <AlertTriangle size={17} /> },

    { section: 'Administration' },
    { key: 'reports', label: 'Reports & Broadcasts', icon: <BarChart3 size={17} /> },
    { key: 'settings', label: 'Hostel Settings', icon: <Settings size={17} /> }
  ];

  const renderActiveView = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <AdminDashboard
            onNavigateNav={(nav) => setActiveNav(nav)}
            onOpenAdmissionModal={() => setIsAdmissionModalOpen(true)}
            onOpenFeeModal={() => setIsFeeModalOpen(true)}
            onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
          />
        );
      case 'students':
        return (
          <StudentAdmissionView
            isAdmissionModalOpen={isAdmissionModalOpen}
            onCloseAdmissionModal={() => setIsAdmissionModalOpen(false)}
          />
        );
      case 'rooms':
        return <RoomBedAllocationView />;
      case 'fees':
        return (
          <FeeManagementView
            isFeeModalOpen={isFeeModalOpen}
            onCloseFeeModal={() => setIsFeeModalOpen(false)}
          />
        );
      case 'mess':
        return <MessInventoryView />;
      case 'complaints':
        return <ComplaintResolutionView />;
      case 'security':
        return <StaffSecurityView />;
      case 'incidents':
        return <IncidentReportsView />;
      case 'reports':
        return (
          <ReportsAnalyticsView
            isNoticeModalOpen={isNoticeModalOpen}
            onCloseNoticeModal={() => setIsNoticeModalOpen(false)}
          />
        );
      case 'settings':
        return <HostelSettingsView />;
      default:
        return <AdminDashboard onNavigateNav={(nav) => setActiveNav(nav)} />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar (Matching RentTenant / Joy Stay Hostel PDF Screenshot) */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-logo-mark">JS</div>
          <div>
            <div className="sidebar-brand-title">Joy Stay Hostel</div>
            <div className="sidebar-brand-subtitle">RentTenant ERP v4.2</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((item, idx) => {
            if (item.section) {
              return (
                <div key={idx} className="sidebar-section-title">
                  {item.section}
                </div>
              );
            }

            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav(item.key);
                  setMobileSidebarOpen(false);
                }}
              >
                <div className="sidebar-link-content">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="sidebar-badge-count">{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer" style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <div>Logged in as: <strong>{authUser?.name || 'Chief Warden'}</strong></div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{authUser?.title || 'Administration'}</div>
          <div style={{ fontSize: '0.65rem', color: backendConnected ? 'var(--success)' : 'var(--warning)', marginTop: '2px' }}>
            ● {backendConnected ? 'Live Database Synced' : 'Reconnecting...'}
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="admin-main">
        {/* Top bar inside Admin View */}
        <div className="admin-topbar">
          <div className="admin-page-title-row">
            <button
              className="icon-btn"
              style={{ display: 'none' }}
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu size={16} />
            </button>
            <h2 className="admin-page-title">
              {navLinks.find(n => n.key === activeNav)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="admin-topbar-actions">
            <span className="badge badge-success">Hostel Gate: Locked & Active</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content-area">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};
