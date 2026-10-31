import React from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  CreditCard,
  UtensilsCrossed,
  Shirt,
  AlertCircle,
  PackageCheck,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  MapPin
} from 'lucide-react';

export const StudentHome = ({ onNavigateTab, onTriggerPayment, onOpenComplaintModal }) => {
  const {
    currentStudent,
    rooms,
    messMenu,
    laundryOrders,
    complaints,
    parcels,
    outpasses,
    skippedMeals,
    toggleSkipMeal,
    addToast
  } = useHostel();

  // Find room info
  const roomInfo = rooms.find(r => r.roomNumber === currentStudent.room) || rooms[0];
  const roommate = roomInfo?.beds?.find(b => b.studentId && b.studentId !== currentStudent.id);

  // Active items
  const activeLaundry = laundryOrders.find(o => o.studentId === currentStudent.id && o.status !== 'Delivered');
  const activeParcels = parcels.filter(p => p.studentId === currentStudent.id && p.status === 'Ready for Pickup');
  const openComplaints = complaints.filter(c => c.studentId === currentStudent.id && c.status !== 'Closed');
  const activeOutpass = outpasses.find(o => o.studentId === currentStudent.id && o.status === 'Active Pass');

  // Today's lunch
  const todayLunch = messMenu.Monday.lunch; // Demo display
  const lunchSkipped = skippedMeals['Monday-lunch'];

  const handleSosTrigger = () => {
    addToast(
      "EMERGENCY SOS DISPATCHED! Control room & Warden Anand Kumar notified with your live room location.",
      "danger",
      "🚨 Emergency Alert Sent"
    );
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Student Welcome Header */}
      <div className="student-header" style={{ marginBottom: '1rem', borderRadius: 'var(--radius-lg)' }}>
        <div className="student-info-meta">
          <div className="student-avatar-wrap">
            <img src={currentStudent.avatar} alt={currentStudent.name} />
            <div className="student-status-dot" title="Biometrically Verified" />
          </div>
          <div className="student-header-text">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{currentStudent.name}</h3>
            <div className="student-subbadge">
              <MapPin size={11} color="var(--primary)" />
              <span>{currentStudent.block} • {currentStudent.room}</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>● Active Resident</span>
        </div>
      </div>

      {/* Urgent Alert Banner if Parcel Ready */}
      {activeParcels.length > 0 && (
        <div
          onClick={() => onNavigateTab('notices')}
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--success)', color: 'white', borderRadius: '50%', padding: '6px', display: 'flex' }}>
              <PackageCheck size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                {activeParcels.length} Parcel Waiting at Security Gate!
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
                {activeParcels[0].courier} • Pickup OTP: <strong style={{ color: 'var(--success)' }}>{activeParcels[0].pickupOtp}</strong>
              </div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
      )}

      {/* Quick Action Navigation Grid (Matching PDF mobile screen) */}
      <div className="quick-action-grid">
        <button className="quick-action-btn" onClick={() => onNavigateTab('fees')}>
          <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <CreditCard size={18} />
          </div>
          <span className="quick-action-label">Pay Fees</span>
        </button>

        <button className="quick-action-btn" onClick={() => onNavigateTab('food')}>
          <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <UtensilsCrossed size={18} />
          </div>
          <span className="quick-action-label">Food Menu</span>
        </button>

        <button className="quick-action-btn" onClick={() => onNavigateTab('laundry')}>
          <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
            <Shirt size={18} />
          </div>
          <span className="quick-action-label">Laundry</span>
        </button>

        <button className="quick-action-btn" onClick={() => onNavigateTab('complaints')}>
          <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <AlertCircle size={18} />
          </div>
          <span className="quick-action-label">Complaints</span>
        </button>
      </div>

      {/* Secondary Quick Action Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          className="quick-action-btn"
          onClick={() => onNavigateTab('room')}
          style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '0.75rem 1rem', gap: '0.75rem' }}
        >
          <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: 'var(--radius-sm)', color: 'var(--primary)', display: 'flex' }}>
            <MapPin size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Room Details</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{currentStudent.room} • {currentStudent.bed}</div>
          </div>
        </button>

        <button
          className="quick-action-btn"
          onClick={() => onNavigateTab('profile')}
          style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '0.75rem 1rem', gap: '0.75rem' }}
        >
          <div style={{ background: 'rgba(236, 72, 153, 0.15)', padding: '8px', borderRadius: 'var(--radius-sm)', color: '#ec4899', display: 'flex' }}>
            <FileCheck2 size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Profile & Help</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Documents & 24/7 Desk
            </div>
          </div>
        </button>
      </div>

      {/* Monthly Fee Status Snapshot */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header-flex">
          <div className="card-title">
            <div className="card-title-icon" style={{ background: currentStudent.feeStatus === 'Paid' ? 'var(--success-bg)' : 'var(--danger-bg)', color: currentStudent.feeStatus === 'Paid' ? 'var(--success)' : 'var(--danger)' }}>
              <CreditCard size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>October 2026 Fee Status</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Due date: 10th of every month</div>
            </div>
          </div>
          <span className={`badge ${currentStudent.feeStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
            {currentStudent.feeStatus === 'Paid' ? '✓ Paid' : `₹${currentStudent.dueAmount.toLocaleString()} Due`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Monthly Hostel & Mess Total</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              ₹{currentStudent.monthlyFee.toLocaleString()}
            </div>
          </div>
          {currentStudent.feeStatus !== 'Paid' ? (
            <button className="btn btn-primary btn-sm" onClick={onTriggerPayment}>
              Pay Now
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigateTab('fees')}>
              View Receipt
            </button>
          )}
        </div>
      </div>

      {/* Today's Food Menu Card (Matching PDF Food Menu widget) */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header-flex">
          <div className="card-title">
            <div className="card-title-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <UtensilsCrossed size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Upcoming Meal: Today's Lunch</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{todayLunch.time}</div>
            </div>
          </div>
          <span className="badge badge-primary">
            {todayLunch.tag}
          </span>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)', background: 'var(--success-bg)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
              {todayLunch.tag}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{todayLunch.calories}</span>
          </div>
          <div style={{ fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            {todayLunch.items.slice(0, 4).join(' • ')} + more
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onNavigateTab('food')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Full 7-Day Menu</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Laundry Status (Active Order Tracker) */}
      {activeLaundry && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-header-flex">
            <div className="card-title">
              <div className="card-title-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
                <Shirt size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Laundry #{activeLaundry.id}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{activeLaundry.serviceType} ({activeLaundry.itemsCount} clothes)</div>
              </div>
            </div>
            <span className="badge badge-primary">{activeLaundry.status}</span>
          </div>

          {/* Stepper Progress */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.8rem 0' }}>
            {['Booked', 'Received', 'Washing', 'Ironing', 'Ready'].map((step, idx) => {
              const isPast = (activeLaundry.currentStep || 1) >= idx + 1;
              const isCurrent = (activeLaundry.currentStep || 1) === idx + 1;
              return (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isPast ? 'var(--primary)' : 'var(--bg-surface)',
                      color: isPast ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      border: isCurrent ? '2px solid var(--primary-border)' : '1px solid var(--border-color)',
                      zIndex: 2
                    }}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.62rem', marginTop: '4px', color: isPast ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isCurrent ? 700 : 500 }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Est. Ready: <strong>{activeLaundry.estimatedReady}</strong></span>
            <span>Drop OTP: <strong style={{ color: 'var(--primary)' }}>{activeLaundry.dropOtp}</strong></span>
          </div>
        </div>
      )}

      {/* Complaints Snapshot */}
      <div className="card">
        <div className="card-header-flex">
          <div className="card-title">
            <div className="card-title-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
              <AlertCircle size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Maintenance & Complaints</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{openComplaints.length} active ticket(s)</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onOpenComplaintModal}>
            + Raise Ticket
          </button>
        </div>

        {openComplaints.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {openComplaints.slice(0, 2).map(c => (
              <div
                key={c.id}
                onClick={() => onNavigateTab('complaints')}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>{c.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Assigned: {c.assignedStaffName}
                  </div>
                </div>
                <span className={`badge ${c.status === 'In Progress' ? 'badge-primary' : 'badge-warning'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.8rem 0' }}>
            No unresolved complaints. All facilities in order!
          </div>
        )}
      </div>
    </div>
  );
};
