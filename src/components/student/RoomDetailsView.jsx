import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Building2,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Wifi,
  Phone,
  Mail,
  Shield,
  Layers,
  Check,
  Copy
} from 'lucide-react';

export const RoomDetailsView = () => {
  const { currentStudent, rooms, addToast } = useHostel();
  const [copied, setCopied] = useState(false);

  const room = rooms.find(r => r.roomNumber === currentStudent.room) || rooms[0];
  const roommates = room.beds?.filter(b => b.studentId && b.studentId !== currentStudent.id) || [];

  const handleCopyWifi = () => {
    navigator.clipboard?.writeText?.("JoyStay_Guest_5G@2026");
    setCopied(true);
    addToast("Wi-Fi password copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem' }}>
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Room & Building Details</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Detailed specifications, allocated bed, roommates, and housekeeping
        </p>
      </div>

      {/* Building & Room Hero Banner */}
      <div className="student-hero-banner">
        <div className="hero-room-meta">
          <div>
            <span className="hero-room-badge">{room.block}</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.3rem 0' }}>
              Room {room.roomNumber}
            </h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {room.floor} • {room.type}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-success">Bed: {currentStudent.bed}</span>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Monthly Rate: ₹{room.ratePerMonth?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="hero-stats-row">
          <div className="hero-stat-col">
            <div className="hero-stat-val">{room.totalBeds} Beds</div>
            <div className="hero-stat-label">Capacity</div>
          </div>
          <div className="hero-stat-col">
            <div className="hero-stat-val" style={{ color: 'var(--success)' }}>Active</div>
            <div className="hero-stat-label">Biometric Lock</div>
          </div>
          <div className="hero-stat-col">
            <div className="hero-stat-val" style={{ color: 'var(--secondary)' }}>300 Mbps</div>
            <div className="hero-stat-label">Wi-Fi Speed</div>
          </div>
        </div>
      </div>

      {/* Roommates Card */}
      <div className="card">
        <div className="card-header-flex">
          <div className="card-title">
            <div className="card-title-icon">
              <Users size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>Roommate(s)</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Current occupants sharing Room {room.roomNumber}</div>
            </div>
          </div>
          <span className="badge badge-primary">{roommates.length} Roommate</span>
        </div>

        {roommates.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {roommates.map((rm, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--primary-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: 'white'
                    }}
                  >
                    {rm.studentName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{rm.studentName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      Allocated to <strong>{rm.bedId}</strong> • Verified Resident
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="icon-btn" title="Call Roommate" style={{ width: '32px', height: '32px' }}>
                    <Phone size={14} />
                  </button>
                  <button className="icon-btn" title="Message" style={{ width: '32px', height: '32px' }}>
                    <Mail size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
            Single occupancy or other bed is currently vacant.
          </div>
        )}
      </div>

      {/* Room Amenities Grid */}
      <div className="card">
        <div className="card-header-flex">
          <div className="card-title">
            <div className="card-title-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
              <Layers size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>Furnishing & Room Amenities</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Included in your hostel residence</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' }}>
          {(room.amenities || [
            "High-speed Wi-Fi (1 Gbps)",
            "Daikin Inverter AC",
            "Geyser in Ensuite Bath",
            "Individual Wardrobes & Lockers",
            "Study Desk & Ergonomic Chair",
            "Balcony with Sunshade",
            "Biometric RFID Door Lock",
            "24/7 Power Backup (DG Sync)"
          ]).map((amenity, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                padding: '0.65rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                border: '1px solid var(--border-color)'
              }}
            >
              <CheckCircle2 size={14} color="var(--success)" style={{ flexShrink: 0 }} />
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wi-Fi & Access Credentials */}
      <div className="card">
        <div className="card-header-flex">
          <div className="card-title">
            <div className="card-title-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Wifi size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>In-Room High-Speed Wi-Fi</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Block B dedicated access point</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NETWORK SSID</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>JoyStay_Ultra_5G (Room B-304)</div>
          </div>
          <button
            onClick={handleCopyWifi}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Key'}</span>
          </button>
        </div>
      </div>

      {/* Housekeeping & Cleaning Schedule */}
      <div className="card">
        <div className="card-header-flex">
          <div className="card-title">
            <div className="card-title-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>Housekeeping Schedule</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Periodic deep cleaning & garbage clearance</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>REGULAR CLEANING</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0.2rem 0' }}>{room.cleaningSchedule || "Mon, Wed, Fri"}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>10:30 AM - 11:30 AM</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LAST SANITIZED</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0.2rem 0' }}>{room.lastCleaned || "Yesterday 11:15 AM"}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>✓ Inspected & Certified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
