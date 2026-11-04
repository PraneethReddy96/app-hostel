import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  FileCheck,
  Phone,
  Mail,
  MapPin,
  Download
} from 'lucide-react';
import { downloadCSV } from '../../utils/exportCsv';

export const StudentAdmissionView = ({ isAdmissionModalOpen, onCloseAdmissionModal }) => {
  const { students, rooms, addStudent, updateStudent, addToast } = useHostel();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  // New Student Admission Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    course: 'B.Tech Computer Science',
    year: '1st Year',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    dob: '2005-01-15',
    guardianName: '',
    guardianRelation: 'Father',
    guardianPhone: '',
    address: '',
    room: 'B-202',
    bed: 'Bed 1'
  });

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === 'All' || s.block.includes(selectedBlock);
    return matchesSearch && matchesBlock;
  });

  const handleSubmitAdmission = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.guardianName) {
      addToast("Please fill in candidate name, phone and guardian particulars.", "warning");
      return;
    }

    addStudent({
      ...formData,
      block: formData.room.startsWith('A') ? 'Block A - Phoenix' : 'Block B - Emerald',
      roomType: 'Double Sharing (AC)'
    });

    setShowModal(false);
    if (onCloseAdmissionModal) onCloseAdmissionModal();

    // Reset form
    setFormData({
      name: '',
      gender: 'Male',
      course: 'B.Tech Computer Science',
      year: '1st Year',
      email: '',
      phone: '',
      bloodGroup: 'O+',
      dob: '2005-01-15',
      guardianName: '',
      guardianRelation: 'Father',
      guardianPhone: '',
      address: '',
      room: 'B-202',
      bed: 'Bed 1'
    });
  };

  const handleExportStudentsCSV = () => {
    downloadCSV(
      `Hostel_Students_Directory_${new Date().toISOString().slice(0, 10)}.csv`,
      ['Student ID', 'Full Name', 'Roll Number', 'Gender', 'Course', 'Year', 'Block', 'Room', 'Bed', 'Phone', 'Email', 'Guardian Name', 'Guardian Phone', 'Blood Group', 'DOB', 'Address', 'KYC Status', 'Fee Status', 'Due Amount'],
      students.map(s => [
        s.id,
        s.name,
        s.rollNo,
        s.gender,
        s.course,
        s.year,
        s.block,
        s.room,
        s.bed,
        s.phone,
        s.email,
        s.guardianName,
        s.guardianPhone,
        s.bloodGroup,
        s.dob,
        s.address,
        s.kycStatus,
        s.feeStatus,
        s.dueAmount
      ])
    );
    addToast('Downloaded Student Admission & Records CSV!', 'success', 'Records Exported');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Bar with Search & Admission Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Student Admission & Records</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Candidate profiles, KYC verification, emergency contacts and academic records
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExportStudentsCSV}>
            <Download size={16} />
            <span>Print / Save Students PDF</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <UserPlus size={16} />
            <span>+ New Student Admission</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            placeholder="Search by student name, roll number, or room..."
            style={{ paddingLeft: '32px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filter Block:</span>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={selectedBlock}
            onChange={e => setSelectedBlock(e.target.value)}
          >
            <option value="All">All Blocks ({students.length})</option>
            <option value="Block A">Block A - Phoenix (Girls)</option>
            <option value="Block B">Block B - Emerald (Boys)</option>
          </select>
        </div>
      </div>

      {/* Students Records Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Student Candidate</th>
              <th>Roll Number</th>
              <th>Room & Bed</th>
              <th>Course & Year</th>
              <th>Guardian Contact</th>
              <th>KYC Status</th>
              <th>Fee Dues</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img src={student.avatar} alt={student.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{student.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{student.phone}</div>
                    </div>
                  </div>
                </td>
                <td><span style={{ fontWeight: 600 }}>{student.rollNo}</span></td>
                <td>
                  <span className="badge badge-primary">{student.room} • {student.bed}</span>
                </td>
                <td>
                  <div>{student.course}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{student.year}</div>
                </td>
                <td>
                  <div>{student.guardianName} ({student.guardianRelation})</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{student.guardianPhone}</div>
                </td>
                <td>
                  <span className="badge badge-success">✓ {student.kycStatus}</span>
                </td>
                <td>
                  <span className={`badge ${student.feeStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                    {student.feeStatus === 'Paid' ? 'Paid' : `₹${student.dueAmount?.toLocaleString()} Due`}
                  </span>
                </td>
                <td>
                  <button
                    className="icon-btn"
                    title="View Full Profile"
                    onClick={() => setViewStudent(student)}
                    style={{ width: '28px', height: '28px' }}
                  >
                    <Eye size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Student Admission Modal */}
      {(showModal || isAdmissionModalOpen) && (
        <div className="modal-backdrop" onClick={() => { setShowModal(false); if (onCloseAdmissionModal) onCloseAdmissionModal(); }}>
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} color="var(--primary)" />
                <span>New Student Admission Form</span>
              </h3>
              <button className="icon-btn" onClick={() => { setShowModal(false); if (onCloseAdmissionModal) onCloseAdmissionModal(); }} style={{ width: '30px', height: '30px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAdmission}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  {/* Candidate Name */}
                  <div className="form-group">
                    <label className="form-label">FULL NAME OF STUDENT *</label>
                    <input
                      className="form-control"
                      placeholder="e.g. Siddharth Verma"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label className="form-label">GENDER</label>
                    <select
                      className="form-control"
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male (Allocate Block B)</option>
                      <option value="Female">Female (Allocate Block A)</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">STUDENT EMAIL</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="student@campus.edu"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label">PHONE NUMBER *</label>
                    <input
                      className="form-control"
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  {/* Course */}
                  <div className="form-group">
                    <label className="form-label">COURSE / PROGRAM</label>
                    <input
                      className="form-control"
                      value={formData.course}
                      onChange={e => setFormData({ ...formData, course: e.target.value })}
                    />
                  </div>

                  {/* Academic Year */}
                  <div className="form-group">
                    <label className="form-label">ACADEMIC YEAR</label>
                    <select
                      className="form-control"
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="1st Year">1st Year (Fresher)</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year (Senior)</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  {/* Guardian Name */}
                  <div className="form-group">
                    <label className="form-label">GUARDIAN NAME *</label>
                    <input
                      className="form-control"
                      placeholder="Father / Mother / Local Guardian"
                      value={formData.guardianName}
                      onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                      required
                    />
                  </div>

                  {/* Guardian Phone */}
                  <div className="form-group">
                    <label className="form-label">GUARDIAN EMERGENCY PHONE *</label>
                    <input
                      className="form-control"
                      placeholder="+91 98765 11111"
                      value={formData.guardianPhone}
                      onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                      required
                    />
                  </div>

                  {/* Room Allocation */}
                  <div className="form-group">
                    <label className="form-label">ALLOCATE ROOM</label>
                    <select
                      className="form-control"
                      value={formData.room}
                      onChange={e => setFormData({ ...formData, room: e.target.value })}
                    >
                      <option value="B-202">Room B-202 (Block B Boys - 2 Vacant Beds)</option>
                      <option value="B-105">Room B-105 (Block B Boys - Bed 2 Vacant)</option>
                      <option value="A-102">Room A-102 (Block A Girls - Bed 1 Vacant)</option>
                      <option value="A-301">Room A-301 (Block A Girls - Bed 2 Vacant)</option>
                    </select>
                  </div>

                  {/* Bed Allocation */}
                  <div className="form-group">
                    <label className="form-label">BED SELECTION</label>
                    <select
                      className="form-control"
                      value={formData.bed}
                      onChange={e => setFormData({ ...formData, bed: e.target.value })}
                    >
                      <option value="Bed 1">Bed 1 (Window Side)</option>
                      <option value="Bed 2">Bed 2 (Desk Side)</option>
                    </select>
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">PERMANENT RESIDENCE ADDRESS</label>
                  <input
                    className="form-control"
                    placeholder="Street, City, State, PIN"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); if (onCloseAdmissionModal) onCloseAdmissionModal(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Admission & Issue Roll No
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {viewStudent && (
        <div className="modal-backdrop" onClick={() => setViewStudent(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Student Dossier: {viewStudent.name}</h3>
              <button className="icon-btn" onClick={() => setViewStudent(null)} style={{ width: '30px', height: '30px' }}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <img src={viewStudent.avatar} alt={viewStudent.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{viewStudent.name}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>Roll: {viewStudent.rollNo} • {viewStudent.course}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{viewStudent.block} • {viewStudent.room} ({viewStudent.bed})</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>PHONE</div>
                  <div>{viewStudent.phone}</div>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>EMAIL</div>
                  <div>{viewStudent.email}</div>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>PRIMARY GUARDIAN</div>
                  <div>{viewStudent.guardianName} ({viewStudent.guardianRelation})</div>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>EMERGENCY CONTACT</div>
                  <div>{viewStudent.guardianPhone}</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>RESIDENTIAL ADDRESS</div>
                <div>{viewStudent.address}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
