import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  AlertTriangle,
  Plus,
  ShieldAlert,
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  Download
} from 'lucide-react';
import { downloadCSV } from '../../utils/exportCsv';

export const IncidentReportsView = () => {
  const { incidents, addIncident, students, addToast } = useHostel();

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Curfew Violation');
  const [severity, setSeverity] = useState('Minor');
  const [studentText, setStudentText] = useState('Aarav Sharma (STU-001)');
  const [room, setRoom] = useState('B-304');
  const [reportedBy, setReportedBy] = useState('Resident Warden Anand Kumar');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !actionTaken.trim()) {
      addToast("Please provide incident details and action taken.", "warning");
      return;
    }

    addIncident({
      category,
      severity,
      involvedStudent: studentText,
      room,
      reportedBy,
      description,
      actionTaken
    });

    setShowModal(false);
    setDescription('');
    setActionTaken('');
  };

  const handleExportIncidentsCSV = () => {
    downloadCSV(
      `Hostel_Incident_Reports_${new Date().toISOString().slice(0, 10)}.csv`,
      ['Incident ID', 'Date & Time', 'Category', 'Severity', 'Involved Student', 'Location / Room', 'Reported By', 'Description', 'Action Taken', 'Status'],
      incidents.map(inc => [
        inc.id,
        inc.date,
        inc.category,
        inc.severity,
        inc.involvedStudent,
        inc.room,
        inc.reportedBy,
        inc.description,
        inc.actionTaken,
        inc.status
      ])
    );
    addToast('Downloaded Incident & Disciplinary Reports CSV!', 'success', 'Incidents Exported');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Incident & Disciplinary Records</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Safety protocol tracking, curfew infractions, property damage and official notices
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExportIncidentsCSV}>
            <Download size={16} />
            <span>Print / Save Incidents PDF</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>+ Log Incident Report</span>
          </button>
        </div>
      </div>

      {/* Incidents Cards / Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {incidents.map(inc => (
          <div
            key={inc.id}
            className="card"
            style={{
              borderLeft: inc.severity === 'Severe' ? '4px solid var(--danger)' :
                          inc.severity === 'Medium' ? '4px solid var(--warning)' : '4px solid var(--primary)'
            }}
          >
            <div className="card-header-flex">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className={`badge ${
                  inc.severity === 'Severe' ? 'badge-danger' :
                  inc.severity === 'Medium' ? 'badge-warning' : 'badge-primary'
                }`}>
                  {inc.category} • {inc.severity} Severity
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inc.date}</span>
              </div>
              <span className="badge badge-success">✓ {inc.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '0.65rem 0', background: 'var(--bg-surface)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>INVOLVED RESIDENT: </span>
                <strong style={{ color: 'var(--text-main)' }}>{inc.involvedStudent}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>LOCATION / ROOM: </span>
                <strong style={{ color: 'var(--text-main)' }}>{inc.room}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.45', marginBottom: '0.65rem' }}>
              <strong>Description:</strong> {inc.description}
            </p>

            <div style={{ background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Action Taken: </span>
                <span>{inc.actionTaken}</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Reported by: {inc.reportedBy}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Log Incident Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--warning)" />
                <span>Log New Incident Report</span>
              </h3>
              <button className="icon-btn" onClick={() => setShowModal(false)} style={{ width: '30px', height: '30px' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">INCIDENT CATEGORY</label>
                    <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="Curfew Violation">Curfew Violation (Late Entry)</option>
                      <option value="Noise Complaint">Noise & Quiet Hours Disturbance</option>
                      <option value="Unauthorized Guest">Unauthorized Overnight Guest</option>
                      <option value="Property Damage">Hostel Property Damage</option>
                      <option value="Substance Violation">Smoking / Alcohol Prohibition</option>
                      <option value="Medical Emergency">Medical Emergency / Illness</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">SEVERITY LEVEL</label>
                    <select className="form-control" value={severity} onChange={e => setSeverity(e.target.value)}>
                      <option value="Minor">Minor (1st Warning)</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium (Disciplinary Action)</option>
                      <option value="Severe">Severe (Parent Escalation)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">STUDENT NAME / ROLL</label>
                    <input className="form-control" value={studentText} onChange={e => setStudentText(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ROOM / WING</label>
                    <input className="form-control" value={room} onChange={e => setRoom(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">INCIDENT SUMMARY</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide factual details, evidence, time and witness statements..."
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">DISCIPLINARY ACTION TAKEN / RESOLUTION</label>
                  <input
                    className="form-control"
                    value={actionTaken}
                    onChange={e => setActionTaken(e.target.value)}
                    placeholder="e.g. Warning letter issued, fined ₹200, parent notified"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Archive & Document Incident</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
