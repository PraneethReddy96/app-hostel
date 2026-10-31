import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  BellRing,
  Calendar,
  PackageCheck,
  Package,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  PartyPopper,
  MapPin,
  Clock,
  Check,
  UserCheck
} from 'lucide-react';

export const NoticesEventsView = () => {
  const { currentStudent, notices, parcels, markParcelPickedUp, addToast } = useHostel();

  const [subTab, setSubTab] = useState('notices'); // 'notices' | 'events' | 'parcels'
  const [rsvpEvents, setRsvpEvents] = useState({ 1: true });

  const studentParcels = parcels.filter(p => p.studentId === currentStudent.id);

  const events = [
    {
      id: 1,
      title: "Diwali Courtyard Night & Grand Feast 🪔",
      date: "Saturday, 31st October 2026",
      time: "07:00 PM onwards",
      venue: "Central Quadrangle & Amphitheatre",
      category: "Festival & Dinner",
      desc: "Live DJ, music band, ethnic fashion walk, fireworks show, and special festive buffet dinner (Rajasthani Dal Baati, Paneer Tikka, Jalebi & Rabdi). Free entry for all residents!",
      rsvps: 94
    },
    {
      id: 2,
      title: "Inter-Hostel Badminton & Table Tennis Tournament 🏸",
      date: "Sunday, 1st November 2026",
      time: "09:30 AM",
      venue: "Indoor Sports Complex",
      category: "Sports",
      desc: "Singles and doubles knockout matches between Block A, B, C & D. Cash prizes and trophy for winners. Refreshments provided.",
      rsvps: 42
    },
    {
      id: 3,
      title: "Campus Coding Marathon: HackJoy 2026 💻",
      date: "Friday, 6th November 2026",
      time: "06:00 PM (24 Hours)",
      venue: "Common Study Hall, Block B",
      category: "Tech & Innovation",
      desc: "24-hour hackathon on Smart Living & Sustainable Campus tech. High-speed Wi-Fi, midnight pizzas and energy drinks sponsored.",
      rsvps: 58
    }
  ];

  const toggleRsvp = (eventId) => {
    setRsvpEvents(prev => {
      const next = !prev[eventId];
      addToast(next ? "RSVP confirmed! See you at the event." : "RSVP cancelled.", next ? "success" : "info");
      return { ...prev, [eventId]: next };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Notices, Events & Parcels</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Official hostel circulars, weekend festivals, and gate delivery package arrivals
        </p>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setSubTab('notices')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: subTab === 'notices' ? 'var(--primary-gradient)' : 'transparent',
            color: subTab === 'notices' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Notices ({notices.length})
        </button>
        <button
          onClick={() => setSubTab('events')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: subTab === 'events' ? 'var(--primary-gradient)' : 'transparent',
            color: subTab === 'events' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Events ({events.length})
        </button>
        <button
          onClick={() => setSubTab('parcels')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: subTab === 'parcels' ? 'var(--primary-gradient)' : 'transparent',
            color: subTab === 'parcels' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          Parcels ({studentParcels.filter(p => p.status === 'Ready for Pickup').length})
        </button>
      </div>

      {/* 1. Notices Tab */}
      {subTab === 'notices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notices.map(notice => (
            <div
              key={notice.id}
              className="card"
              style={{
                borderLeft: notice.priority === 'High' ? '4px solid var(--danger)' : '4px solid var(--primary)'
              }}
            >
              <div className="card-header-flex">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge ${notice.priority === 'High' ? 'badge-danger' : 'badge-primary'}`}>
                    {notice.badge || notice.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{notice.date}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>By: {notice.author}</span>
              </div>

              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.4rem 0 0.35rem' }}>
                {notice.title}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.45', marginBottom: '0.6rem' }}>
                {notice.content}
              </p>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-xs)' }}>
                ℹ️ Summary: {notice.summary}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Events Tab */}
      {subTab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map(ev => {
            const isGoing = !!rsvpEvents[ev.id];
            return (
              <div key={ev.id} className="card">
                <div className="card-header-flex">
                  <span className="badge badge-primary">{ev.category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {ev.rsvps + (isGoing ? 1 : 0)} students attending
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.35rem 0' }}>
                  {ev.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '0.4rem 0 0.8rem', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="var(--primary)" />
                    <span>{ev.date} • {ev.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--primary)" />
                    <span>{ev.venue}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.45', marginBottom: '1rem' }}>
                  {ev.desc}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => toggleRsvp(ev.id)}
                    className={`btn ${isGoing ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    style={{ gap: '6px' }}
                  >
                    {isGoing ? <Check size={14} color="var(--success)" /> : <PartyPopper size={14} />}
                    <span>{isGoing ? '✓ You are Attending' : 'RSVP (I am Going)'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Parcels Tab */}
      {subTab === 'parcels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {studentParcels.length > 0 ? (
            studentParcels.map(pkg => (
              <div
                key={pkg.id}
                className="card"
                style={{
                  borderLeft: pkg.status === 'Ready for Pickup' ? '4px solid var(--success)' : '4px solid var(--border-color)'
                }}
              >
                <div className="card-header-flex">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>{pkg.courier}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tracking: {pkg.trackingNo}</div>
                    </div>
                  </div>
                  <span className={`badge ${pkg.status === 'Ready for Pickup' ? 'badge-success' : 'badge-primary'}`}>
                    {pkg.status}
                  </span>
                </div>

                {/* Pickup details */}
                <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)', margin: '0.75rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PICKUP LOCATION</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{pkg.securityGate}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Recv: {pkg.receivedByGuard}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SECURITY HANDOVER OTP</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.1em' }}>
                      {pkg.pickupOtp}
                    </div>
                  </div>
                </div>

                {pkg.status === 'Ready for Pickup' ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Show this OTP to guard for collection</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => markParcelPickedUp(pkg.id)}
                    >
                      Mark Collected
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    ✓ Collected on {pkg.collectedAt || "Earlier"}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
              <Package size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>No pending parcels</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                When Amazon, Flipkart or couriers arrive at the gate, your notification and OTP will appear here!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
