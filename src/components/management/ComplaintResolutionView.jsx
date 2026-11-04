import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  Star,
  Search,
  Filter,
  Phone,
  Download
} from 'lucide-react';
import { downloadCSV } from '../../utils/exportCsv';

export const ComplaintResolutionView = () => {
  const { complaints, updateComplaint, staffList, addToast } = useHostel();

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);
  const [assignStaff, setAssignStaff] = useState('');
  const [resNotes, setResNotes] = useState('');

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchCat = filterCategory === 'All' || c.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const handleOpenAssign = (ticket) => {
    setActiveTicket(ticket);
    setAssignStaff(ticket.assignedStaffName || 'Suresh Babu (Campus Plumber)');
    setResNotes(ticket.technicianNotes || '');
  };

  const handleSaveResolution = (newStatus = 'In Progress') => {
    if (!activeTicket) return;

    updateComplaint(activeTicket.id, {
      status: newStatus,
      assignedStaffName: assignStaff,
      technicianNotes: resNotes
    });

    setActiveTicket(null);
  };

  const handleExportComplaintsCSV = () => {
    downloadCSV(
      `Hostel_Maintenance_Complaints_${new Date().toISOString().slice(0, 10)}.csv`,
      ['Ticket ID', 'Student Name', 'Room', 'Category', 'Title', 'Urgency', 'Assigned Staff', 'Status', 'Reported At', 'Technician Notes', 'Student Rating'],
      complaints.map(c => [
        c.id,
        c.studentName,
        c.room,
        c.category,
        c.title,
        c.urgency,
        c.assignedStaffName,
        c.status,
        c.reportedAt,
        c.technicianNotes,
        c.rating || 'Pending'
      ])
    );
    addToast('Downloaded Maintenance Complaints CSV!', 'success', 'Tickets Exported');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Complaint Assignment & Resolution Queue</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Maintenance tickets triage, technician dispatch, SLA tracking and resolution closure
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleExportComplaintsCSV}>
          <Download size={14} />
          <span>Print / Save Complaints PDF</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            placeholder="Search tickets by title, student, or room..."
            style={{ paddingLeft: '32px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses ({complaints.length})</option>
            <option value="New">New Unassigned</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved / Closed</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category:</span>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Wi-Fi & Network">Wi-Fi & Network</option>
            <option value="Air Conditioning">Air Conditioning</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Resident & Room</th>
              <th>Issue Title & Category</th>
              <th>Priority</th>
              <th>Assigned Technician</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ticket => (
              <tr key={ticket.id}>
                <td><span style={{ fontWeight: 800 }}>#{ticket.id}</span></td>
                <td>
                  <div style={{ fontWeight: 700 }}>{ticket.studentName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Room {ticket.room}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {ticket.photo && (
                      <img
                        src={ticket.photo}
                        alt="Evidence"
                        style={{ width: '40px', height: '32px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)', flexShrink: 0 }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{ticket.title}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{ticket.category} • {ticket.reportedAt}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    ticket.urgency === 'High' ? 'badge-danger' :
                    ticket.urgency === 'Medium' ? 'badge-warning' : 'badge-primary'
                  }`}>
                    {ticket.urgency}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{ticket.assignedStaffName}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{ticket.technicianNotes}</div>
                </td>
                <td>
                  <span className={`badge ${
                    ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'badge-success' :
                    ticket.status === 'In Progress' ? 'badge-primary' : 'badge-warning'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td>
                  {ticket.rating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>
                      <Star size={12} fill="#f59e0b" />
                      <span>{ticket.rating}/5</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pending</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                    onClick={() => handleOpenAssign(ticket)}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Assignment Modal */}
      {activeTicket && (
        <div className="modal-backdrop" onClick={() => setActiveTicket(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={18} color="var(--primary)" />
                <span>Ticket #{activeTicket.id}: {activeTicket.title}</span>
              </h3>
              <button className="icon-btn" onClick={() => setActiveTicket(null)} style={{ width: '30px', height: '30px' }}>✕</button>
            </div>

            <div className="modal-body">
              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.75rem', lineHeight: '1.5' }}>
                <div><strong>Resident:</strong> {activeTicket.studentName} (Room {activeTicket.room})</div>
                <div><strong>Category:</strong> {activeTicket.category} • Priority: {activeTicket.urgency}</div>
                <div style={{ marginTop: '4px', color: 'var(--text-main)' }}>"{activeTicket.description}"</div>
                {activeTicket.photo && (
                  <div style={{ marginTop: '0.6rem' }}>
                    <img
                      src={activeTicket.photo}
                      alt="Attached Evidence"
                      style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">ASSIGN TECHNICIAN / STAFF</label>
                <select
                  className="form-control"
                  value={assignStaff}
                  onChange={e => setAssignStaff(e.target.value)}
                >
                  <option value="Suresh Babu (Master Plumber)">Suresh Babu (Master Plumber)</option>
                  <option value="Rajesh Kumar (Senior Electrician)">Rajesh Kumar (Senior Electrician)</option>
                  <option value="Karan Johar (IT Network Admin)">Karan Johar (IT Network Admin)</option>
                  <option value="Ramesh (HVAC AC Specialist)">Ramesh (HVAC AC Specialist)</option>
                  <option value="Rama (Housekeeping Supervisor)">Rama (Housekeeping Supervisor)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">TECHNICIAN WORK REMARKS & LOG</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={resNotes}
                  onChange={e => setResNotes(e.target.value)}
                  placeholder="e.g. Parts replaced, tested water pressure, student signed off..."
                />
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSaveResolution('In Progress')}
              >
                Save as In Progress
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSaveResolution('Resolved')}
              >
                Mark Resolved & Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
