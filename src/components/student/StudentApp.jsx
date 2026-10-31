import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { StudentHome } from './StudentHome';
import { RoomDetailsView } from './RoomDetailsView';
import { FeesPaymentView } from './FeesPaymentView';
import { FoodMenuView } from './FoodMenuView';
import { LaundryView } from './LaundryView';
import { ComplaintsView } from './ComplaintsView';
import { NoticesEventsView } from './NoticesEventsView';
import { ProfileHelpView } from './ProfileHelpView';
import {
  Home,
  Building,
  CreditCard,
  UtensilsCrossed,
  Shirt,
  AlertCircle,
  Bell,
  User,
  Package
} from 'lucide-react';

export const StudentApp = () => {
  const { complaints, currentStudent, parcels } = useHostel();
  const [currentTab, setCurrentTab] = useState('home');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  // Unread badge counts
  const openComplaintsCount = complaints.filter(
    c => c.studentId === currentStudent.id && c.status !== 'Resolved' && c.status !== 'Closed'
  ).length;

  const pendingParcelsCount = parcels.filter(
    p => p.studentId === currentStudent.id && p.status === 'Ready for Pickup'
  ).length;

  const navItems = [
    { key: 'home', label: 'Home', icon: <Home size={18} /> },
    { key: 'room', label: 'Room', icon: <Building size={18} /> },
    { key: 'fees', label: 'Fees', icon: <CreditCard size={18} /> },
    { key: 'food', label: 'Food', icon: <UtensilsCrossed size={18} /> },
    { key: 'laundry', label: 'Laundry', icon: <Shirt size={18} /> },
    { key: 'complaints', label: 'Tickets', icon: <AlertCircle size={18} />, badge: openComplaintsCount },
    { key: 'notices', label: 'Notices', icon: <Bell size={18} />, badge: pendingParcelsCount },
    { key: 'profile', label: 'Profile', icon: <User size={18} /> }
  ];

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <StudentHome
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onTriggerPayment={() => setIsPayModalOpen(true)}
            onOpenComplaintModal={() => setIsComplaintModalOpen(true)}
          />
        );
      case 'room':
        return <RoomDetailsView />;
      case 'fees':
        return (
          <FeesPaymentView
            isModalOpen={isPayModalOpen}
            onCloseModal={() => setIsPayModalOpen(false)}
          />
        );
      case 'food':
        return <FoodMenuView />;
      case 'laundry':
        return <LaundryView />;
      case 'complaints':
        return (
          <ComplaintsView
            isModalOpen={isComplaintModalOpen}
            onCloseModal={() => setIsComplaintModalOpen(false)}
          />
        );
      case 'notices':
        return <NoticesEventsView />;
      case 'profile':
        return <ProfileHelpView />;
      default:
        return <StudentHome onNavigateTab={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="student-shell">
      {/* Scrollable Content Container */}
      <div className="student-content">
        {renderActiveView()}
      </div>

      {/* Floating Modern Mobile Bottom Navigation Bar */}
      <nav className="student-bottom-nav">
        {navItems.map((item) => {
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.key)}
            >
              <div className="tab-icon-wrap" style={{ position: 'relative' }}>
                {item.icon}
                {item.badge > 0 && (
                  <span className="nav-tab-badge">{item.badge}</span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
