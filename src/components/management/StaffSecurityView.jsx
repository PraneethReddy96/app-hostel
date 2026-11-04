import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  ShieldCheck,
  Users,
  Clock,
  Phone,
  Mail,
  Plus,
  UserCheck,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Lock,
  DoorOpen,
  Download
} from 'lucide-react';
import { downloadCSV } from '../../utils/exportCsv';

export const StaffSecurityView = () => {
  const { staffList, visitors, outpasses, updateOutpassStatus, addVisitor, checkOutVisitor, addToast } = useHostel();

  const [activeSubTab, setActiveSubTab] = useState('staff'); // 'staff' | 'visitors' | 'outpasses'
  const [showVisitorModal, setShowVisitorModal] = useState(false);

  // New visitor form
  const [visitorName, setVisitorName] = useState('');
  const [relation, setRelation] = useState('Parent');
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [studentRoom, setStudentRoom] = useState('B-304');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [purpose, setPurpose] = useState('Personal family visit');

  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone) return;

    addVisitor({
      visitorName,
      relation,
      studentName,
      studentRoom,
      phone: visitorPhone,
      purpose
    });

    setShowVisitorModal(false);
    setVisitorName('');
    setVisitorPhone('');
  };

  const handleExportStaffCSV = () => {
    downloadCSV(
      `Hostel_Staff_Directory_${new Date().toISOString().slice(0, 10)}.csv`,
      ['Staff ID', 'Name', 'Role', 'Department', 'Shift Timings', 'Phone', 'Email', 'Current Status'],
      staffList.map(stf => [
        stf.id,
        stf.name,
        stf.role,
        stf.department,
        stf.shift,
        stf.phone,
        stf.email,
        stf.status
      ])
    );
    addToast('Downloaded Staff & Wardens Directory CSV!', 'success', 'Staff Exported');
  };

  const handleExportVisitorsCSV = () => {
    downloadCSV(
      `Hostel_Gate_Visitors_Log_${new Date().toISOString().slice(0, 10)}.csv`,
      ['Visitor ID', 'Visitor Name', 'Relation', 'Student Visited', 'Room', 'Phone', 'ID Proof', 'Check-In Time', 'Check-Out Time', 'Status', 'Purpose'],
      visitors.map(v => [
        v.id,
        v.visitorName,
        v.relation,
        v.studentName,
        v.studentRoom,
        v.phone,
        v.idProof,
        v.checkInTime,
        v.checkOutTime,
        v.status,
        v.purpose
      ])
    );
    addToast('Downloaded Gate Security Visitor Logs CSV!', 'success', 'Visitor Logs Exported');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Export Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Staff, Warden & Security Management</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Campus security personnel shifts, warden directory, and main gate security logs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportStaffCSV}>
            <Download size={14} />
            <span>Print / Save Staff PDF</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportVisitorsCSV}>
            <Download size={14} />
            <span>Print / Save Visitors PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setActiveSubTab('staff')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: activeSubTab === 'staff' ? 'var(--primary-gradient)' : 'transparent',
            color: activeSubTab === 'staff' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Staff & Wardens Directory ({staffList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('visitors')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: activeSubTab === 'visitors' ? 'var(--primary-gradient)' : 'transparent',
            color: activeSubTab === 'visitors' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Gate Security Logs ({visitors.length})
        </button>
      </div>

      {/* 1. Staff Directory */}
      {activeSubTab === 'staff' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {staffList.map(member => (
            <div key={member.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{member.name}</h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>{member.role}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{member.department}</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shift Timings:</span>
                  <span style={{ fontWeight: 600 }}>{member.shift}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Campus Duty:</span>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>● {member.status}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{member.phone}</span>
                <a href={`tel:${member.phone}`} className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}>
                  <Phone size={12} />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Visitor Logs */}
      {activeSubTab === 'visitors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Gate 1 & 2 Turnstile Visitor Register</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowVisitorModal(true)}>
              <Plus size={14} />
              <span>+ Log Visitor Entry</span>
            </button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Relationship</th>
                  <th>Student Visited</th>
                  <th>Phone Number</th>
                  <th>In / Out Timings</th>
                  <th>Campus Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map(vis => (
                  <tr key={vis.id}>
                    <td><span style={{ fontWeight: 700 }}>{vis.visitorName}</span></td>
                    <td>{vis.relation}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{vis.studentName}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Room {vis.studentRoom}</div>
                    </td>
                    <td>{vis.phone}</td>
                    <td>
                      <div>In: <strong>{vis.checkInTime}</strong></div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Out: {vis.checkOutTime}</div>
                    </td>
                    <td>
                      <span className={`badge ${vis.status.includes('Currently') ? 'badge-warning' : 'badge-success'}`}>
                        {vis.status}
                      </span>
                    </td>
                    <td>
                      {vis.status.includes('Currently') ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                          onClick={() => checkOutVisitor(vis.id)}
                        >
                          Check Out
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visitor Entry Modal */}
          {showVisitorModal && (
            <div className="modal-backdrop" onClick={() => setShowVisitorModal(false)}>
              <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Main Gate Visitor Check-In</h3>
                  <button className="icon-btn" onClick={() => setShowVisitorModal(false)} style={{ width: '30px', height: '30px' }}>✕</button>
                </div>

                <form onSubmit={handleVisitorSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">VISITOR FULL NAME</label>
                      <input className="form-control" value={visitorName} onChange={e => setVisitorName(e.target.value)} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">RELATION TO STUDENT</label>
                        <input className="form-control" value={relation} onChange={e => setRelation(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">VISITOR PHONE</label>
                        <input className="form-control" value={visitorPhone} onChange={e => setVisitorPhone(e.target.value)} required />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">STUDENT NAME</label>
                        <input className="form-control" value={studentName} onChange={e => setStudentName(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">ROOM NUMBER</label>
                        <input className="form-control" value={studentRoom} onChange={e => setStudentRoom(e.target.value)} required />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">VISIT PURPOSE</label>
                      <input className="form-control" value={purpose} onChange={e => setPurpose(e.target.value)} required />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowVisitorModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Check-In Visitor & Issue Gate Pass</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Outpass Sanctions */}
      {activeSubTab === 'outpasses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Pass ID</th>
                  <th>Student & Room</th>
                  <th>Pass Type & Reason</th>
                  <th>Departure & Return</th>
                  <th>Parent Consent</th>
                  <th>Approval Status</th>
                  <th>Warden Decision</th>
                </tr>
              </thead>
              <tbody>
                {outpasses.map(pass => (
                  <tr key={pass.id}>
                    <td><span style={{ fontWeight: 800 }}>#{pass.id}</span></td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{pass.studentName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Room {pass.room}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{pass.type}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{pass.destination} • {pass.reason}</div>
                    </td>
                    <td>
                      <div>Dep: {pass.departureDate}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Ret: {pass.returnDate}</div>
                    </td>
                    <td>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>✓ Verified</span>
                    </td>
                    <td>
                      <span className={`badge ${pass.wardenApproval === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {pass.wardenApproval}
                      </span>
                    </td>
                    <td>
                      {pass.wardenApproval !== 'Approved' ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                            onClick={() => updateOutpassStatus(pass.id, 'Approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.68rem', padding: '2px 8px', color: 'var(--danger)' }}
                            onClick={() => updateOutpassStatus(pass.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>
                          Sanctioned by {pass.wardenName}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
