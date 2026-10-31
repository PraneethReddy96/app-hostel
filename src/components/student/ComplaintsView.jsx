import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  AlertCircle,
  Plus,
  Wrench,
  Zap,
  Wifi,
  Wind,
  Sparkles,
  Phone,
  CheckCircle2,
  Clock,
  Star,
  Camera,
  MessageSquare
} from 'lucide-react';

export const ComplaintsView = ({ isModalOpen, onCloseModal }) => {
  const { currentStudent, complaints, addComplaint, rateComplaint, addToast } = useHostel();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'open' | 'resolved'
  const [showRaiseModal, setShowRaiseModal] = useState(false);

  // Form state
  const [category, setCategory] = useState('Plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [hasPhoto, setHasPhoto] = useState(false);

  // Rating modal/state
  const [ratingTicketId, setRatingTicketId] = useState(null);
  const [stars, setStars] = useState(5);
  const [feedbackNote, setFeedbackNote] = useState('');

  const studentComplaints = complaints.filter(c => c.studentId === currentStudent.id);

  const filtered = studentComplaints.filter(c => {
    if (activeFilter === 'open') return c.status !== 'Resolved' && c.status !== 'Closed';
    if (activeFilter === 'resolved') return c.status === 'Resolved' || c.status === 'Closed';
    return true;
  });

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Plumbing': return <Wrench size={16} color="#06b6d4" />;
      case 'Electrical': return <Zap size={16} color="#f59e0b" />;
      case 'Wi-Fi & Network': return <Wifi size={16} color="#6366f1" />;
      case 'Air Conditioning': return <Wind size={16} color="#3b82f6" />;
      case 'Room Cleaning': return <Sparkles size={16} color="#ec4899" />;
      default: return <AlertCircle size={16} color="#8b5cf6" />;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast("Please provide a title and detailed description.", "warning");
      return;
    }

    addComplaint({
      category,
      title,
      description,
      urgency,
      photo: hasPhoto ? "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300" : null
    });

    setTitle('');
    setDescription('');
    setHasPhoto(false);
    setShowRaiseModal(false);
    if (onCloseModal) onCloseModal();
  };

  const handleRatingSubmit = (ticketId) => {
    rateComplaint(ticketId, stars, feedbackNote);
    setRatingTicketId(null);
    setFeedbackNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem' }}>
      {/* Title & Raise CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Complaints & Maintenance</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Raise repair tickets with photo evidence and track live technician dispatch
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowRaiseModal(true)}>
          <Plus size={14} />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        {[
          { key: 'all', label: `All (${studentComplaints.length})` },
          { key: 'open', label: `Active (${studentComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length})` },
          { key: 'resolved', label: `Resolved (${studentComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              background: activeFilter === tab.key ? 'var(--primary-gradient)' : 'transparent',
              color: activeFilter === tab.key ? 'white' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length > 0 ? (
          filtered.map(ticket => (
            <div key={ticket.id} className="card">
              <div className="card-header-flex">
                <div className="card-title">
                  <div className="card-title-icon">
                    {getCategoryIcon(ticket.category)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{ticket.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      #{ticket.id} • {ticket.category} • Room {ticket.room}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`badge ${
                    ticket.urgency === 'High' ? 'badge-danger' :
                    ticket.urgency === 'Medium' ? 'badge-warning' : 'badge-primary'
                  }`}>
                    {ticket.urgency}
                  </span>
                  <span className={`badge ${
                    ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'badge-success' :
                    ticket.status === 'In Progress' ? 'badge-primary' : 'badge-warning'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.4rem 0 0.8rem', lineHeight: '1.45' }}>
                {ticket.description}
              </p>

              {/* Photo preview if attached */}
              {ticket.photo && (
                <div style={{ marginBottom: '0.8rem' }}>
                  <img
                    src={ticket.photo}
                    alt="Complaint Evidence"
                    style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}
                  />
                </div>
              )}

              {/* Technician Assignment Bar */}
              <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-color)', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    🛠️
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{ticket.assignedStaffName}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{ticket.technicianNotes}</div>
                  </div>
                </div>

                {ticket.staffContact && (
                  <a
                    href={`tel:${ticket.staffContact}`}
                    className="icon-btn"
                    title="Call Technician"
                    style={{ width: '30px', height: '30px' }}
                  >
                    <Phone size={13} />
                  </a>
                )}
              </div>

              {/* Resolution & Rating Footer */}
              {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {ticket.rating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>Your Rating:</span>
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star key={st} size={14} color="#f59e0b" fill={st <= ticket.rating ? '#f59e0b' : 'none'} />
                      ))}
                      <span style={{ marginLeft: '4px', fontWeight: 700 }}>({ticket.rating}/5)</span>
                    </div>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { setRatingTicketId(ticket.id); setStars(5); }}
                      style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                    >
                      <Star size={12} color="#f59e0b" />
                      <span>Rate Repair Quality</span>
                    </button>
                  )}
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Reported: {ticket.reportedAt}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>No complaints found</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Everything in your room is functioning smoothly!
            </div>
          </div>
        )}
      </div>

      {/* Raise Ticket Modal */}
      {(showRaiseModal || isModalOpen) && (
        <div className="modal-backdrop" onClick={() => { setShowRaiseModal(false); if (onCloseModal) onCloseModal(); }}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={18} color="var(--primary)" />
                <span>Raise Maintenance Request</span>
              </h3>
              <button className="icon-btn" onClick={() => { setShowRaiseModal(false); if (onCloseModal) onCloseModal(); }} style={{ width: '30px', height: '30px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Category & Urgency */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">CATEGORY</label>
                    <select
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Plumbing">Plumbing (Tap / Flush / Leak)</option>
                      <option value="Electrical">Electrical (Light / Fan / Socket)</option>
                      <option value="Wi-Fi & Network">Wi-Fi & Internet</option>
                      <option value="Air Conditioning">Air Conditioning (AC)</option>
                      <option value="Room Cleaning">Housekeeping & Deep Clean</option>
                      <option value="Furniture">Furniture & Carpentry</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">URGENCY LEVEL</label>
                    <select
                      className="form-control"
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                    >
                      <option value="Low">Low (Within 48 hrs)</option>
                      <option value="Medium">Medium (Within 24 hrs)</option>
                      <option value="High">High (Same Day Urgent)</option>
                      <option value="Emergency">Emergency (Immediate)</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div className="form-group">
                  <label className="form-label">SHORT TITLE / ISSUE SUMMARY</label>
                  <input
                    className="form-control"
                    placeholder="e.g. Geyser water not heating in Room B-304"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">DETAILED DESCRIPTION</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Please specify location in the room, behavior, when it started..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Attach Photo Simulator */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">ATTACH PHOTO EVIDENCE</label>
                  <div
                    onClick={() => { setHasPhoto(!hasPhoto); addToast(hasPhoto ? "Photo removed." : "Photo attachment simulated!", "info"); }}
                    style={{
                      border: '2px dashed var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: hasPhoto ? 'var(--primary-light)' : 'transparent',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <Camera size={20} color={hasPhoto ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: hasPhoto ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      {hasPhoto ? '✓ Image Attached: bathroom_tap_leak.jpg' : 'Click to simulate photo attachment'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowRaiseModal(false); if (onCloseModal) onCloseModal(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Complaint Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingTicketId && (
        <div className="modal-backdrop" onClick={() => setRatingTicketId(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Rate Resolution Quality</h3>
              <button className="icon-btn" onClick={() => setRatingTicketId(null)} style={{ width: '30px', height: '30px' }}>
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                How satisfied are you with the technician repair for Ticket #{ratingTicketId}?
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                {[1, 2, 3, 4, 5].map(st => (
                  <Star
                    key={st}
                    size={28}
                    onClick={() => setStars(st)}
                    style={{
                      cursor: 'pointer',
                      color: st <= stars ? '#f59e0b' : 'var(--text-muted)',
                      fill: st <= stars ? '#f59e0b' : 'none'
                    }}
                  />
                ))}
              </div>
              <textarea
                className="form-control"
                placeholder="Optional feedback comments for warden & staff..."
                value={feedbackNote}
                onChange={e => setFeedbackNote(e.target.value)}
                rows="2"
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setRatingTicketId(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleRatingSubmit(ratingTicketId)}>
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
