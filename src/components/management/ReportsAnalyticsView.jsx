import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  BarChart3,
  TrendingUp,
  Bell,
  Send,
  Trash2,
  Users,
  CheckCircle2,
  PieChart,
  Calendar,
  Building2
} from 'lucide-react';

export const ReportsAnalyticsView = ({ isNoticeModalOpen, onCloseNoticeModal }) => {
  const { notices, addNotice, deleteNotice, students, rooms, hostelSettings, addToast } = useHostel();

  const [showComposeModal, setShowComposeModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Important Notice');
  const [priority, setPriority] = useState('Normal');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      addToast("Please provide notice title and full circular content.", "warning");
      return;
    }

    addNotice({
      title,
      category,
      badge: category,
      priority,
      summary: summary || title,
      content
    });

    setShowComposeModal(false);
    if (onCloseNoticeModal) onCloseNoticeModal();
    setTitle('');
    setSummary('');
    setContent('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Broadcast CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Reports, Analytics & Broadcast Engine</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Operational performance KPIs, occupancy forecasts, and circular broadcasting
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowComposeModal(true)}>
          <Send size={16} />
          <span>+ Compose Notice Broadcast</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>OVERALL OCCUPANCY</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--primary)' }}>92.4%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>↑ +3.2% vs last semester</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>AVG COMPLAINT RESOLUTION</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--secondary)' }}>3.8 hrs</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>✓ 94% resolved within 24 hrs</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>MESS SATISFACTION INDEX</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: '#f59e0b' }}>4.6 / 5.0</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Based on 482 student meal ratings</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>FOOD WASTE REDUCTION</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--success)' }}>- 18.5%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>Via Student Skip-Meal preference</div>
        </div>
      </div>

      {/* Wing Breakdown & Broadcasts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem' }}>
        {/* Hostel Wing Capacity Progress Bars */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            Wing Occupancy Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {hostelSettings.blocks.map((blk, idx) => {
              const pct = Math.round((blk.occupiedRooms / blk.totalRooms) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    <span>{blk.name}</span>
                    <span>{blk.occupiedRooms} / {blk.totalRooms} Rooms ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: idx === 0 ? 'var(--primary-gradient)' : idx === 1 ? 'var(--secondary-gradient)' : 'var(--success-border)',
                        borderRadius: '9999px'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Broadcast Circulars Feed */}
        <div className="card">
          <div className="card-header-flex">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Broadcast Announcements</h3>
            <span className="badge badge-primary">{notices.length} Live Notices</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
            {notices.map(notice => (
              <div
                key={notice.id}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                    <span className={`badge ${notice.priority === 'High' ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '0.62rem' }}>
                      {notice.badge || notice.category}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{notice.date}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{notice.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{notice.summary}</div>
                </div>

                <button
                  className="icon-btn"
                  title="Delete Circular"
                  style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                  onClick={() => deleteNotice(notice.id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Compose Modal */}
      {(showComposeModal || isNoticeModalOpen) && (
        <div className="modal-backdrop" onClick={() => { setShowComposeModal(false); if (onCloseNoticeModal) onCloseNoticeModal(); }}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} color="var(--primary)" />
                <span>Broadcast New Hostel Notice</span>
              </h3>
              <button className="icon-btn" onClick={() => { setShowComposeModal(false); if (onCloseNoticeModal) onCloseNoticeModal(); }} style={{ width: '30px', height: '30px' }}>✕</button>
            </div>

            <form onSubmit={handleComposeSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">CATEGORY</label>
                    <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="Important Notice">Important Notice (Curfew / Rules)</option>
                      <option value="Maintenance">Maintenance & Service Pause</option>
                      <option value="Events & Festivals">Events & Festivals</option>
                      <option value="Technology">Technology & Wi-Fi Updates</option>
                      <option value="Mess & Dining">Mess & Dining Notice</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">PRIORITY</label>
                    <select className="form-control" value={priority} onChange={e => setPriority(e.target.value)}>
                      <option value="Normal">Normal</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High (Red Banner Alert)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">NOTICE HEADLINE</label>
                  <input
                    className="form-control"
                    placeholder="e.g. Mandatory Room Inspection Tomorrow 10 AM"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">QUICK 1-LINE SUMMARY</label>
                  <input
                    className="form-control"
                    placeholder="Brief overview visible on dashboard widgets"
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">FULL CIRCULAR CONTENT</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Detailed explanation, instructions, consequences, and guidelines..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowComposeModal(false); if (onCloseNoticeModal) onCloseNoticeModal(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish to All Student Devices
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
