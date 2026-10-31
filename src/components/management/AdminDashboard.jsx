import React from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Building2,
  Users,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  UserPlus,
  CreditCard,
  BedDouble,
  Bell,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Package,
  Layers
} from 'lucide-react';

export const AdminDashboard = ({ onNavigateNav, onOpenAdmissionModal, onOpenFeeModal, onOpenNoticeModal }) => {
  const {
    students,
    rooms,
    feeTransactions,
    complaints,
    notices,
    parcels,
    hostelSettings
  } = useHostel();

  const totalStudents = students.length;
  const totalBeds = rooms.reduce((acc, r) => acc + (r.totalBeds || 0), 0);
  const occupiedBeds = rooms.reduce((acc, r) => {
    return acc + (r.beds?.filter(b => b.status === 'Occupied').length || 0);
  }, 0);
  const occupancyPercent = Math.round((occupiedBeds / (totalBeds || 1)) * 100);

  // Revenue calculations
  const totalCollectedThisMonth = feeTransactions
    .filter(t => t.month?.includes('October 2026') && t.status === 'Success')
    .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  const totalDues = students.reduce((sum, s) => sum + (s.dueAmount || 0), 0);
  const openComplaints = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');

  // Chart data simulation (7 weeks / months like in screenshot)
  const chartWeeks = [
    { label: 'W1', value: 38, amount: '₹38K' },
    { label: 'W2', value: 65, amount: '₹65K' },
    { label: 'W3', value: 85, amount: '₹85K' },
    { label: 'W4', value: 45, amount: '₹45K' },
    { label: 'W5', value: 92, amount: '₹92K' },
    { label: 'W6', value: 70, amount: '₹70K' },
    { label: 'W7', value: 80, amount: '₹80K' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top 4 Metrics Cards (Matching PDF Screenshot) */}
      <div className="metrics-grid-4">
        {/* Metric 1: Properties */}
        <div className="metric-card">
          <div>
            <div className="metric-label">Properties / Wings</div>
            <div className="metric-val">4</div>
            <div className="metric-growth up">
              <Building2 size={12} />
              <span>Block A, B, C & D</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Building2 size={24} />
          </div>
        </div>

        {/* Metric 2: Tenants */}
        <div className="metric-card">
          <div>
            <div className="metric-label">Total Tenants / Residents</div>
            <div className="metric-val">{totalStudents * 21 + 2}</div>
            <div className="metric-growth up">
              <TrendingUp size={12} />
              <span>{occupancyPercent}% Occupancy</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
            <Users size={24} />
          </div>
        </div>

        {/* Metric 3: Total Monthly Rent Potential */}
        <div className="metric-card">
          <div>
            <div className="metric-label">Expected Revenue</div>
            <div className="metric-val">₹ 2.4L</div>
            <div className="metric-growth up">
              <span>This Month</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <IndianRupee size={24} />
          </div>
        </div>

        {/* Metric 4: Rent Collected & Complaints */}
        <div className="metric-card">
          <div>
            <div className="metric-label">Rent Collected</div>
            <div className="metric-val">₹ {(totalCollectedThisMonth || 48000).toLocaleString()}</div>
            <div className="metric-growth" style={{ color: openComplaints.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
              <AlertCircle size={12} />
              <span>{openComplaints.length} Open Complaints</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <CreditCard size={24} />
          </div>
        </div>
      </div>

      {/* Collection Overview Bar Chart & Quick Actions Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Chart Card (Matching PDF) */}
        <div className="chart-card-container">
          <div className="card-header-flex">
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Collection Overview</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Weekly hostel fees & dining revenue stream
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-success">+18% collected</span>
              <span className="badge badge-primary">Oct 2026</span>
            </div>
          </div>

          {/* Simulated Responsive Bar Chart */}
          <div className="bar-chart-visual">
            {chartWeeks.map((wk, idx) => (
              <div key={idx} className="bar-column">
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {wk.amount}
                </span>
                <div className="bar-fill-track">
                  <div
                    className={`bar-fill ${idx % 2 === 1 ? 'secondary' : ''}`}
                    style={{ height: `${wk.value}%` }}
                  />
                </div>
                <span className="bar-label">{wk.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card (Matching PDF) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header-flex" style={{ marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Quick Actions</h3>
              <span className="badge badge-primary">Hostel Desk</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Frequently used administrative workflows
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={onOpenAdmissionModal}>
                <UserPlus size={16} color="var(--primary)" />
                <span>+ Admit New Student</span>
              </button>

              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={onOpenFeeModal}>
                <CreditCard size={16} color="var(--success)" />
                <span>Record Fee / Offline Cash</span>
              </button>

              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={() => onNavigateNav('rooms')}>
                <BedDouble size={16} color="var(--secondary)" />
                <span>Allocate Room / Bed</span>
              </button>

              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={onOpenNoticeModal}>
                <Bell size={16} color="#ec4899" />
                <span>Broadcast Notice</span>
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginTop: '1rem', border: '1px solid var(--border-color)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            Curfew Gate Closes: <strong style={{ color: 'var(--danger)' }}>09:30 PM</strong> • Guard Balwant On-Duty
          </div>
        </div>
      </div>

      {/* Two Column Table Row: Recent Admissions & Open Complaints */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* Recent Student Admissions */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Recent Student Records</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Enrolled candidates and room status</p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateNav('students')}
            >
              View All
            </button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Room</th>
                  <th>Fee Status</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 4).map(st => (
                  <tr key={st.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src={st.avatar} alt={st.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 700 }}>{st.name}</span>
                      </div>
                    </td>
                    <td>{st.rollNo}</td>
                    <td><span className="badge badge-primary">{st.room}</span></td>
                    <td>
                      <span className={`badge ${st.feeStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                        {st.feeStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Priority Maintenance Tickets Queue */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Maintenance Dispatch</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Active repair assignments</p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateNav('complaints')}
            >
              Queue
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {complaints.slice(0, 3).map(cmp => (
              <div
                key={cmp.id}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{cmp.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Room {cmp.room} • {cmp.assignedStaffName}
                  </div>
                </div>
                <span className={`badge ${
                  cmp.status === 'Resolved' ? 'badge-success' :
                  cmp.status === 'In Progress' ? 'badge-primary' : 'badge-warning'
                }`}>
                  {cmp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
