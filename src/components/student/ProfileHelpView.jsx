import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  FileCheck2,
  QrCode,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Plus,
  Send,
  ExternalLink,
  Upload,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

export const ProfileHelpView = () => {
  const { currentStudent, outpasses, requestOutpass, staffList, addToast } = useHostel();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'outpass' | 'helpdesk'
  const [showOutpassModal, setShowOutpassModal] = useState(false);

  // Outpass form
  const [passType, setPassType] = useState('Weekend Home Visit');
  const [departureDate, setDepartureDate] = useState('2026-10-31 06:00 PM');
  const [returnDate, setReturnDate] = useState('2026-11-02 08:30 PM');
  const [destination, setDestination] = useState('Home (Pune)');
  const [reason, setReason] = useState('Family celebration & Diwali holidays');
  const [parentContact, setParentContact] = useState(currentStudent.guardianPhone);

  // Helpdesk live chat simulation
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello Aarav! Welcome to JoyStay 24/7 Virtual Helpdesk. How can we assist you with hostel facilities or permissions today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const studentOutpasses = outpasses.filter(o => o.studentId === currentStudent.id);

  const handleOutpassSubmit = (e) => {
    e.preventDefault();
    requestOutpass({
      type: passType,
      departureDate,
      returnDate,
      destination,
      reason,
      parentContact
    });
    setShowOutpassModal(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    // Simulated intelligent bot reply
    setTimeout(() => {
      let reply = "Your query has been logged with Assistant Warden Anand Kumar. Average response time is under 15 minutes.";
      const lower = userText.toLowerCase();
      if (lower.includes('curfew') || lower.includes('gate') || lower.includes('time')) {
        reply = "Hostel gates close promptly at 09:30 PM. Late entries up to 10:00 PM require a digital Outpass generated from the 'Gate Outpass' tab.";
      } else if (lower.includes('mess') || lower.includes('food') || lower.includes('dinner')) {
        reply = "Dinner is served in the Dining Hall from 07:45 PM to 09:45 PM. You can also skip meals in the Food Menu tab to prevent food wastage.";
      } else if (lower.includes('wifi') || lower.includes('internet') || lower.includes('speed')) {
        reply = "High-speed SSID 'JoyStay_Ultra_5G' is available across all rooms. Key is JoyStay_Guest_5G@2026. For network issues, please raise an IT ticket.";
      } else if (lower.includes('laundry')) {
        reply = "You have 30 clothes allowance per month included in your hostel fee. Laundry pickups run twice a week.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Profile, Documents & Help Desk</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Candidate details, emergency contacts, KYC documents, and 24x7 help desk
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: activeTab === 'profile' ? 'var(--primary-gradient)' : 'transparent',
            color: activeTab === 'profile' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Profile, Emergency Contacts & Documents
        </button>
        <button
          onClick={() => setActiveTab('helpdesk')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: activeTab === 'helpdesk' ? 'var(--primary-gradient)' : 'transparent',
            color: activeTab === 'helpdesk' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          24/7 Help Desk
        </button>
      </div>

      {/* 1. Candidate Details Tab */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Identity Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', flexShrink: 0 }}>
              <img src={currentStudent.avatar} alt={currentStudent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{currentStudent.name}</h3>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>KYC Verified</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Roll: <strong>{currentStudent.rollNo}</strong> • {currentStudent.course} ({currentStudent.year})
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Allocated: {currentStudent.block} • {currentStudent.room} ({currentStudent.bed})
              </div>
            </div>
          </div>

          {/* Candidate Bio & Details Grid */}
          <div className="card">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Official Student Particulars</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.78rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>BLOOD GROUP</div>
                <div style={{ fontWeight: 700 }}>{currentStudent.bloodGroup}</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>DATE OF BIRTH</div>
                <div style={{ fontWeight: 700 }}>{currentStudent.dob}</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>CONTACT NUMBER</div>
                <div style={{ fontWeight: 700 }}>{currentStudent.phone}</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>STUDENT EMAIL</div>
                <div style={{ fontWeight: 700 }}>{currentStudent.email}</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem', fontSize: '0.78rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>PERMANENT RESIDENCE ADDRESS</div>
              <div style={{ fontWeight: 600 }}>{currentStudent.address}</div>
            </div>
          </div>

          {/* Emergency Contacts Card */}
          <div className="card">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Emergency Contacts & Guardians</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{currentStudent.guardianName} ({currentStudent.guardianRelation})</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Primary Guardian Contact</div>
                </div>
                <a href={`tel:${currentStudent.guardianPhone}`} className="icon-btn" style={{ width: '32px', height: '32px' }}>
                  <Phone size={14} />
                </a>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{currentStudent.secondaryContact}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Secondary Emergency Contact</div>
                </div>
                <button className="icon-btn" style={{ width: '32px', height: '32px' }} onClick={() => addToast("Connecting to secondary contact...", "info")}>
                  <Phone size={14} />
                </button>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Dr. K.V. Rao (Chief Warden)</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Campus Medical & Emergency Desk: +91 94444 12345</div>
                </div>
                <a href="tel:+919444412345" className="icon-btn" style={{ width: '32px', height: '32px' }}>
                  <Phone size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* KYC Documents Preview */}
          <div className="card">
            <div className="card-header-flex">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>KYC Documents & Verification</h4>
              <button className="btn btn-secondary btn-sm" onClick={() => addToast("Document re-upload simulation triggered.", "info")}>
                <Upload size={12} />
                <span>Upload</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
              {[
                { name: 'National ID / Aadhaar Card', status: 'Verified', ref: '•••• •••• 9012' },
                { name: 'University Admission Letter', status: 'Verified', ref: 'ADM-2024-ENG' },
                { name: 'Medical Fitness Certificate', status: 'Verified', ref: 'MED-FIT-O+' }
              ].map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{doc.ref}</div>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>✓ {doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Gate Outpass Tab */}
      {activeTab === 'outpass' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Digital Gate Passes</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Show digital QR pass to security turnstiles upon leaving/entering</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowOutpassModal(true)}>
              <Plus size={14} />
              <span>Apply Outpass</span>
            </button>
          </div>

          {studentOutpasses.map(pass => (
            <div key={pass.id} className="card" style={{ borderLeft: '4px solid var(--success)' }}>
              <div className="card-header-flex">
                <span className="badge badge-primary">{pass.type}</span>
                <span className="badge badge-success">✓ {pass.wardenApproval}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{pass.destination}</h4>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '2px 0' }}>{pass.reason}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Depart: <strong>{pass.departureDate}</strong> • Return: <strong>{pass.returnDate}</strong>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Sanctioned By: {pass.wardenName}
                  </div>
                </div>

                {/* QR Code Icon for Gate scanner */}
                <div style={{ background: '#ffffff', padding: '8px', borderRadius: '8px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <svg width="60" height="60" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="#ffffff" />
                    <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="11" y="11" width="16" height="16" fill="#ffffff" />
                    <rect x="15" y="15" width="8" height="8" fill="#10b981" />

                    <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="73" y="11" width="16" height="16" fill="#ffffff" />
                    <rect x="77" y="15" width="8" height="8" fill="#10b981" />

                    <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="11" y="73" width="16" height="16" fill="#ffffff" />
                    <rect x="15" y="77" width="8" height="8" fill="#10b981" />

                    <rect x="42" y="42" width="16" height="16" fill="#10b981" rx="2" />
                  </svg>
                  <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#0f172a' }}>VALID PASS</div>
                </div>
              </div>
            </div>
          ))}

          {/* Outpass Request Modal */}
          {showOutpassModal && (
            <div className="modal-backdrop" onClick={() => setShowOutpassModal(false)}>
              <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileCheck2 size={18} color="var(--primary)" />
                    <span>Apply Gate Outpass</span>
                  </h3>
                  <button className="icon-btn" onClick={() => setShowOutpassModal(false)} style={{ width: '30px', height: '30px' }}>✕</button>
                </div>

                <form onSubmit={handleOutpassSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">PASS TYPE</label>
                      <select className="form-control" value={passType} onChange={e => setPassType(e.target.value)}>
                        <option value="Weekend Home Visit">Weekend Home Visit</option>
                        <option value="Late Night Academic Lab">Late Night Academic Lab (Until 1 AM)</option>
                        <option value="Medical Emergency / Clinic">Medical Emergency / Clinic Visit</option>
                        <option value="Local Market / Day Outing">Local Market / Day Outing</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">DEPARTURE TIME</label>
                        <input className="form-control" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">EXPECTED RETURN</label>
                        <input className="form-control" value={returnDate} onChange={e => setReturnDate(e.target.value)} required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">DESTINATION ADDRESS</label>
                      <input className="form-control" value={destination} onChange={e => setDestination(e.target.value)} required />
                    </div>

                    <div className="form-group">
                      <label className="form-label">REASON FOR LEAVE</label>
                      <textarea className="form-control" rows="2" value={reason} onChange={e => setReason(e.target.value)} required />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">PARENT / GUARDIAN VERIFIED PHONE</label>
                      <input className="form-control" value={parentContact} onChange={e => setParentContact(e.target.value)} required />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowOutpassModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Generate Digital QR Pass</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Help Desk Tab */}
      {activeTab === 'helpdesk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Hotline Bar */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(244, 63, 94, 0.12) 100%), var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--danger)', fontWeight: 800 }}>
                  24/7 EMERGENCY & SECURITY CONTROL ROOM
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '2px' }}>
                  +91 94444 00000
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Head Guard: Inspector Balwant Singh (Main North Gate)
                </div>
              </div>
              <a href="tel:+919444400000" className="btn btn-danger btn-sm" style={{ gap: '6px' }}>
                <Phone size={14} />
                <span>Call Gate</span>
              </a>
            </div>
          </div>

          {/* Interactive Live Chat Simulator */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '380px' }}>
            <div className="card-header-flex" style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>JoyStay Assistant & Warden Desk</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Typical reply: &lt; 1 min</span>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingRight: '4px' }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'var(--bg-surface)',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    lineHeight: '1.4',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)'
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <input
                className="form-control"
                placeholder="Ask about curfew, mess, wi-fi, visitors..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                style={{ fontSize: '0.78rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem' }}>
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
