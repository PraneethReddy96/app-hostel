import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Shirt,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Package,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  FastForward
} from 'lucide-react';

export const LaundryView = () => {
  const { currentStudent, laundryOrders, bookLaundry, advanceLaundryStatus, addToast } = useHostel();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [serviceType, setServiceType] = useState('Wash & Iron');
  const [pickupSlot, setPickupSlot] = useState('Tomorrow, 09:30 AM');
  const [specialNotes, setSpecialNotes] = useState('');

  // Clothes count state
  const [counts, setCounts] = useState({
    shirts: 3,
    trousers: 2,
    tshirts: 2,
    bedsheet: 1
  });

  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);

  const studentOrders = laundryOrders.filter(o => o.studentId === currentStudent.id);
  const activeOrder = studentOrders.find(o => o.status !== 'Delivered');

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (totalItems === 0) {
      addToast("Please select at least 1 clothing item.", "warning");
      return;
    }
    bookLaundry({
      itemsCount: totalItems,
      breakdown: counts,
      serviceType,
      pickupSlot,
      notes: specialNotes
    });
    setShowBookingModal(false);
  };

  const updateItemCount = (key, delta) => {
    setCounts(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Laundry Services</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Bi-weekly doorstep pickup, washing, steam ironing & locker pickup
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowBookingModal(true)}>
          <Plus size={14} />
          <span>Book Slot</span>
        </button>
      </div>

      {/* Monthly Quota Tracker Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%), var(--bg-card)' }}>
        <div className="card-header-flex">
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
              OCTOBER LAUNDRY QUOTA
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
              19 / 30 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>items used</span>
            </div>
          </div>
          <span className="badge badge-primary">11 Clothes Left</span>
        </div>

        {/* Quota Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface)', borderRadius: '9999px', overflow: 'hidden', margin: '0.6rem 0' }}>
          <div style={{ width: `${(19 / 30) * 100}%`, height: '100%', background: 'var(--secondary-gradient)', borderRadius: '9999px' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          <span>Free allowance included in hostel package</span>
          <span>Resets on 1st November</span>
        </div>
      </div>

      {/* Active Order Progress Stepper */}
      {activeOrder && (
        <div className="card">
          <div className="card-header-flex">
            <div className="card-title">
              <div className="card-title-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
                <Shirt size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>Order #{activeOrder.id}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {activeOrder.serviceType} • {activeOrder.itemsCount} garments
                </div>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '3px 8px', gap: '4px' }}
              onClick={() => advanceLaundryStatus(activeOrder.id)}
              title="Click to simulate next stage progression"
            >
              <FastForward size={12} />
              <span>Next Stage</span>
            </button>
          </div>

          {/* Stepper Pipeline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.25rem 0 1rem' }}>
            {['Booked', 'Received', 'Washing', 'Ironing', 'Ready'].map((step, idx) => {
              const currentStep = activeOrder.currentStep || 1;
              const isDone = currentStep >= idx + 1;
              const isCurrent = currentStep === idx + 1;

              return (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isDone ? 'var(--secondary-gradient)' : 'var(--bg-surface)',
                      color: isDone ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      border: isCurrent ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
                      boxShadow: isCurrent ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none'
                    }}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.68rem', marginTop: '6px', fontWeight: isCurrent ? 700 : 500, color: isDone ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pickup Details */}
          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED READY</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{activeOrder.estimatedReady}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LOCKER DROP OTP</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.05em' }}>
                {activeOrder.dropOtp}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Laundry History */}
      <div className="card">
        <div className="card-header-flex">
          <div className="card-title">
            <div className="card-title-icon">
              <Clock size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Past Laundry History</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Completed orders this semester</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {studentOrders.map(order => (
            <div
              key={order.id}
              style={{
                background: 'var(--bg-surface)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-color)'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{order.id} • {order.serviceType}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {order.itemsCount} garments ({order.notes || "Standard"})
                </div>
              </div>
              <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-primary'}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Book Laundry Modal */}
      {showBookingModal && (
        <div className="modal-backdrop" onClick={() => setShowBookingModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shirt size={18} color="var(--secondary)" />
                <span>Book Laundry Slot</span>
              </h3>
              <button className="icon-btn" onClick={() => setShowBookingModal(false)} style={{ width: '30px', height: '30px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSubmit}>
              <div className="modal-body">
                {/* Service Type */}
                <div className="form-group">
                  <label className="form-label">SELECT SERVICE TYPE</label>
                  <select
                    className="form-control"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                  >
                    <option value="Wash & Iron">Wash & Steam Iron (Standard)</option>
                    <option value="Wash & Fold">Wash & Fold (Fast Turnaround)</option>
                    <option value="Dry Clean & Steam">Dry Clean & Steam Iron (Delicates)</option>
                  </select>
                </div>

                {/* Pickup Slot */}
                <div className="form-group">
                  <label className="form-label">DESIRED PICKUP SLOT</label>
                  <select
                    className="form-control"
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                  >
                    <option value="Today, 04:00 PM">Today, 04:00 PM - 05:30 PM</option>
                    <option value="Tomorrow, 09:30 AM">Tomorrow, 09:30 AM - 11:00 AM</option>
                    <option value="Tomorrow, 03:00 PM">Tomorrow, 03:00 PM - 04:30 PM</option>
                  </select>
                </div>

                {/* Garments Breakdown Counters */}
                <div className="form-group">
                  <label className="form-label">SELECT GARMENT COUNTS (TOTAL: {totalItems})</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    {[
                      { key: 'shirts', label: 'Shirts / Kurtas' },
                      { key: 'trousers', label: 'Trousers / Jeans' },
                      { key: 'tshirts', label: 'T-Shirts & Tops' },
                      { key: 'bedsheet', label: 'Bedsheet / Towel' }
                    ].map(item => (
                      <div
                        key={item.key}
                        style={{
                          background: 'var(--bg-surface)',
                          padding: '0.6rem 0.8rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-main)', fontWeight: 600 }}>{item.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="icon-btn"
                            style={{ width: '24px', height: '24px' }}
                            onClick={() => updateItemCount(item.key, -1)}
                          >
                            <Minus size={11} />
                          </button>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                            {counts[item.key] || 0}
                          </span>
                          <button
                            type="button"
                            className="icon-btn"
                            style={{ width: '24px', height: '24px' }}
                            onClick={() => updateItemCount(item.key, 1)}
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">SPECIAL WASH INSTRUCTIONS (OPTIONAL)</label>
                  <input
                    className="form-control"
                    placeholder="e.g. Do not bleach white formal shirt"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Booking ({totalItems} Items)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
