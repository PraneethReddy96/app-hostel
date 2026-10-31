import React, { useState, useEffect } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Settings,
  Shield,
  Clock,
  Building,
  Key,
  Save,
  CheckCircle2,
  Lock,
  UserCheck,
  Database,
  Download,
  RefreshCw
} from 'lucide-react';

export const HostelSettingsView = () => {
  const { hostelSettings, updateSettings, resetDemoData, addToast } = useHostel();
  const [dbStats, setDbStats] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname || 'localhost'}:4000`;

  const fetchDbStats = () => {
    fetch(`${API_BASE}/api/db-info`)
      .then(r => r.json())
      .then(data => setDbStats(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchDbStats();
  }, []);

  const handleBackupDownload = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/backup`, { method: 'POST' });
      const payload = await res.json();
      if (payload.ok) {
        const blob = new Blob([JSON.stringify(payload.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `joystay-db-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addToast('Full SQLite database backup saved to server & downloaded!', 'success', 'Database Backed Up');
        fetchDbStats();
      }
    } catch (e) {
      addToast('Could not reach backend server for backup.', 'danger');
    }
  };

  const [form, setForm] = useState({
    hostelName: hostelSettings.hostelName || "Joy Stay Hostel & Residences",
    tagline: hostelSettings.tagline || "Smart Student Living & Community Spaces",
    address: hostelSettings.address || "Campus Rd, Knowledge Park III, Silicon City",
    contactPhone: hostelSettings.contactPhone || "+91 94444 00000",
    curfewTime: hostelSettings.curfewTime || "21:30",
    gracePeriodMinutes: hostelSettings.gracePeriodMinutes || 15,
    lateEntryFinePerIncident: hostelSettings.lateEntryFinePerIncident || 200,
    laundryQuotaPerMonth: hostelSettings.laundryQuotaPerMonth || 30
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
  };

  const rolePermissions = [
    { role: 'Super Admin', permissions: 'Full Global Access (Admissions, Financials, Settings, System Logs)', users: 'Dr. K.V. Rao & Trustees' },
    { role: 'Resident Warden', permissions: 'Student Records, Room Allocation, Outpass Sanction, Incident Reports, Complaints', users: 'Anand Kumar, Sunita Pillai' },
    { role: 'Accounts & Billing', permissions: 'Fee Invoicing, Cash Receipt Generation, Dues Reminders, Financial Ledgers', users: 'Central Accounts Desk' },
    { role: 'Campus Security', permissions: 'Gate Visitor Registers, Biometric Curfew Check-In, Parcel Delivery Logging', users: 'Inspector Balwant Singh & Guards' },
    { role: 'Mess Contractor', permissions: 'Weekly Menu Planning, Pantry Stock Inventory, Food Wastage Metrics', users: 'Head Chef Ramanathan' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hostel Settings & Access Permissions</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Campus policies, night curfew thresholds, financial defaults and role-based permissions
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Hostel Identity */}
        <div className="card">
          <div className="card-header-flex">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Hostel Profile & Identity</h3>
            <span className="badge badge-primary">Campus Core</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">HOSTEL / PROPERTY NAME</label>
              <input
                className="form-control"
                value={form.hostelName}
                onChange={e => setForm({ ...form, hostelName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">TAGLINE / SUBTITLE</label>
              <input
                className="form-control"
                value={form.tagline}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CAMPUS PHYSICAL ADDRESS</label>
              <input
                className="form-control"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">24/7 EMERGENCY CONTACT HOTLINE</label>
              <input
                className="form-control"
                value={form.contactPhone}
                onChange={e => setForm({ ...form, contactPhone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Curfew & Security Rules */}
        <div className="card">
          <div className="card-header-flex">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Curfew & Gate Timings Policies</h3>
            <span className="badge badge-warning">Disciplinary Rule</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">MAIN GATE CURFEW TIME (24H)</label>
              <input
                className="form-control"
                type="time"
                value={form.curfewTime}
                onChange={e => setForm({ ...form, curfewTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GRACE PERIOD (MINUTES)</label>
              <input
                className="form-control"
                type="number"
                value={form.gracePeriodMinutes}
                onChange={e => setForm({ ...form, gracePeriodMinutes: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">UNEXCUSED LATE FINE (INR)</label>
              <input
                className="form-control"
                type="number"
                value={form.lateEntryFinePerIncident}
                onChange={e => setForm({ ...form, lateEntryFinePerIncident: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">MONTHLY LAUNDRY QUOTA (ITEMS)</label>
              <input
                className="form-control"
                type="number"
                value={form.laundryQuotaPerMonth}
                onChange={e => setForm({ ...form, laundryQuotaPerMonth: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
              <Save size={15} />
              <span>Save Hostel Configuration</span>
            </button>
          </div>
        </div>
      </form>

      {/* Shared SQLite Database Administration Card */}
      <div className="card">
        <div className="card-header-flex">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={18} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Shared SQLite Database & Storage Engine</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Central relational database serving both Student App (:5173) and Management App (:5174)
              </p>
            </div>
          </div>
          <span className="badge badge-success">{dbStats?.engine || 'SQLite 3 (WAL Mode)'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>DATABASE FILE</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, wordBreak: 'break-all' }}>server/data/joystay.sqlite</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>STORAGE FOOTPRINT</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--success)' }}>{dbStats ? `${dbStats.sizeKB} KB` : 'Active'} (Zero Cloud Cost)</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TRANSACTION AUDIT LOGS</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{dbStats ? `${dbStats.totalAuditLogs} Entries` : 'Synced'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleBackupDownload}>
            <Download size={14} />
            <span>Download Full Database Backup (.json)</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--danger)' }}
            onClick={() => {
              if (window.confirm('Reset shared SQLite database back to factory demo records?')) {
                resetDemoData();
              }
            }}
          >
            <RefreshCw size={14} />
            <span>Factory Reset Database</span>
          </button>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Permissions Matrix */}
      <div className="card">
        <div className="card-header-flex">
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>User Roles & Access Permissions Matrix</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Granular authorization policies enforced on staff accounts</p>
          </div>
          <span className="badge badge-success">5 Roles Configured</span>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>System Role</th>
                <th>Privileges & Module Scope</th>
                <th>Assigned Staff Accounts</th>
                <th>Security Clearance</th>
              </tr>
            </thead>
            <tbody>
              {rolePermissions.map((rp, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{rp.role}</span>
                  </td>
                  <td>{rp.permissions}</td>
                  <td>{rp.users}</td>
                  <td>
                    <span className="badge badge-primary">Level {5 - idx} Clearance</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
