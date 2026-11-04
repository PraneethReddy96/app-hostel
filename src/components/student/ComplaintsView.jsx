import React, { useState, useRef } from 'react';
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
  Star,
  Camera,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

// Category-relevant sample photos (used only if user chooses "Use Category Sample Photo")
const CATEGORY_SAMPLE_PHOTOS = {
  'Plumbing': {
    name: 'plumbing_pipe_fixture.jpg',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'
  },
  'Electrical': {
    name: 'electrical_switch_fixture.jpg',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400'
  },
  'Wi-Fi & Network': {
    name: 'wifi_router_signal.jpg',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400'
  },
  'Air Conditioning': {
    name: 'ac_vent_cooling.jpg',
    url: 'https://images.unsplash.com/photo-1631545806609-35d4ae440431?auto=format&fit=crop&q=80&w=400'
  },
  'Room Cleaning': {
    name: 'room_deep_cleaning.jpg',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400'
  },
  'Furniture': {
    name: 'study_desk_carpentry.jpg',
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400'
  }
};

export const ComplaintsView = ({ isModalOpen, onCloseModal }) => {
  const { currentStudent, complaints, addComplaint, rateComplaint, addToast } = useHostel();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'open' | 'resolved'
  const [showRaiseModal, setShowRaiseModal] = useState(false);

  // Form state
  const [category, setCategory] = useState('Plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [photoFileName, setPhotoFileName] = useState('');
  const [isSamplePhoto, setIsSamplePhoto] = useState(false);

  const fileInputRef = useRef(null);

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

  // Update sample photo automatically if category changes while using a sample photo
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (isSamplePhoto) {
      const sample = CATEGORY_SAMPLE_PHOTOS[newCat] || CATEGORY_SAMPLE_PHOTOS['Plumbing'];
      setPhotoDataUrl(sample.url);
      setPhotoFileName(sample.name);
    }
  };

  // Compress & read real image captured from phone camera or gallery
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 560;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.72);

        setPhotoDataUrl(compressedUrl);
        setPhotoFileName(file.name);
        setIsSamplePhoto(false);
        addToast(`Attached photo: ${file.name}`, 'success', 'Photo Ready');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAttachCategorySample = () => {
    const sample = CATEGORY_SAMPLE_PHOTOS[category] || CATEGORY_SAMPLE_PHOTOS['Plumbing'];
    setPhotoDataUrl(sample.url);
    setPhotoFileName(sample.name);
    setIsSamplePhoto(true);
    addToast(`Attached relevant ${category} reference photo (${sample.name}).`, 'info');
  };

  const handleClearPhoto = () => {
    setPhotoDataUrl(null);
    setPhotoFileName('');
    setIsSamplePhoto(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      photo: photoDataUrl || null
    });

    setTitle('');
    setDescription('');
    handleClearPhoto();
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
            Raise repair tickets with camera/gallery photo evidence and track live technician dispatch
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
                    ticket.urgency === 'High' || ticket.urgency === 'Emergency' ? 'badge-danger' :
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
                    style={{ width: '120px', height: '82px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
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
                <div className="auth-form-grid">
                  <div className="form-group">
                    <label className="form-label">CATEGORY</label>
                    <select
                      className="form-control"
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
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
                    placeholder={`e.g. ${category === 'Room Cleaning' ? 'Full room deep cleaning requested' : 'Issue in Room ' + currentStudent.room}`}
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
                    placeholder="Please specify location in the room, details, or preferred timing..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Real Camera / File Upload + Relevant Category Photo Option */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">ATTACH PHOTO EVIDENCE (CAMERA OR GALLERY)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />

                  {!photoDataUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-block"
                        style={{ borderStyle: 'dashed', borderWidth: '2px', padding: '0.85rem' }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera size={18} color="var(--primary)" />
                        <span>Take Photo / Upload Image from Device</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', alignSelf: 'center' }}
                        onClick={handleAttachCategorySample}
                      >
                        <ImageIcon size={13} />
                        <span>Or Attach Relevant "{category}" Sample Image</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        <img
                          src={photoDataUrl}
                          alt="Preview"
                          style={{ width: '58px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            ✓ {photoFileName}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                            {isSamplePhoto ? `${category} Reference Image` : 'Captured / Uploaded from Device'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.68rem' }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', color: 'var(--danger)' }}
                          onClick={handleClearPhoto}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
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
