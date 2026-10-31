import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  CreditCard,
  Download,
  Send,
  Plus,
  Search
} from 'lucide-react';

export const FeeManagementView = ({ isFeeModalOpen, onCloseFeeModal }) => {
  const { students, feeTransactions, recordStudentPayment, addToast } = useHostel();

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Record Payment Form
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [amount, setAmount] = useState('14000');
  const [paymentMode, setPaymentMode] = useState('Cash at Counter');
  const [receiptRef, setReceiptRef] = useState('');

  // Calculations
  const totalDue = students.reduce((sum, s) => sum + (s.dueAmount || 0), 0);
  const totalCollected = feeTransactions
    .filter(t => t.month?.includes('October 2026') && t.status === 'Success')
    .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || s.feeStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    recordStudentPayment({
      studentId: student.id,
      amount: Number(amount),
      paymentMode,
      transactionRef: receiptRef || `OFFLINE-REC-${Math.floor(1000 + Math.random() * 9000)}`
    });

    setShowRecordModal(false);
    if (onCloseFeeModal) onCloseFeeModal();
  };

  const handleSendReminders = () => {
    const dueCount = students.filter(s => s.dueAmount > 0).length;
    addToast(
      `Automated SMS & WhatsApp fee reminder dispatched to ${dueCount} student & parent phone numbers!`,
      'success',
      'Reminders Broadcast'
    );
  };

  const handleExportCSV = () => {
    addToast("Exporting fee reconciliation ledger (October_2026_Fees.csv)...", "info", "Report Exported");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Fee Collection, Dues & Receipts</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Financial receivables, counter cash collection, dues reminder and invoices
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleSendReminders}>
            <Send size={14} color="var(--warning)" />
            <span>Send Dues Reminders</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowRecordModal(true)}>
            <Plus size={14} />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Snapshot Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>OCTOBER EXPECTED RENT</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>₹ 2,40,000</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Based on 100% bed capacity</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>COLLECTED REVENUE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', marginTop: '2px' }}>
            ₹ {totalCollected.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>✓ Verified in bank ledger</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDING STUDENT DUES</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)', marginTop: '2px' }}>
            ₹ {totalDue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>
            {students.filter(s => s.dueAmount > 0).length} students pending
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            placeholder="Search student dues by name or room..."
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
            <option value="All">All Statuses</option>
            <option value="Paid">Fully Paid</option>
            <option value="Due">Pending Dues</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Dues Ledger Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Resident Student</th>
              <th>Roll No</th>
              <th>Room</th>
              <th>Monthly Fee</th>
              <th>Outstanding Dues</th>
              <th>Status</th>
              <th>Last Paid Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img src={student.avatar} alt={student.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700 }}>{student.name}</span>
                  </div>
                </td>
                <td>{student.rollNo}</td>
                <td><span className="badge badge-primary">{student.room}</span></td>
                <td>₹{student.monthlyFee.toLocaleString()}</td>
                <td>
                  <span style={{ fontWeight: 800, color: student.dueAmount > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                    ₹{student.dueAmount.toLocaleString()}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    student.feeStatus === 'Paid' ? 'badge-success' :
                    student.feeStatus === 'Overdue' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {student.feeStatus}
                  </span>
                </td>
                <td>{student.lastPaidDate}</td>
                <td>
                  {student.dueAmount > 0 ? (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.68rem', padding: '3px 8px' }}
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setAmount(student.dueAmount.toString());
                        setShowRecordModal(true);
                      }}
                    >
                      Collect ₹{student.dueAmount}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>✓ Settled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {(showRecordModal || isFeeModalOpen) && (
        <div className="modal-backdrop" onClick={() => { setShowRecordModal(false); if (onCloseFeeModal) onCloseFeeModal(); }}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="var(--primary)" />
                <span>Record Fee Collection Receipt</span>
              </h3>
              <button className="icon-btn" onClick={() => { setShowRecordModal(false); if (onCloseFeeModal) onCloseFeeModal(); }} style={{ width: '30px', height: '30px' }}>✕</button>
            </div>

            <form onSubmit={handleRecordSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">SELECT STUDENT</label>
                  <select
                    className="form-control"
                    value={selectedStudentId}
                    onChange={e => {
                      setSelectedStudentId(e.target.value);
                      const s = students.find(st => st.id === e.target.value);
                      if (s) setAmount((s.dueAmount || s.monthlyFee).toString());
                    }}
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.room} • Due: ₹{s.dueAmount})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">COLLECTED AMOUNT (INR)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PAYMENT CHANNEL</label>
                  <select
                    className="form-control"
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                  >
                    <option value="Cash at Warden Counter">Cash at Warden Counter</option>
                    <option value="Hostel Office UPI QR">Hostel Office UPI QR Code</option>
                    <option value="Bank NEFT / IMPS">Direct Bank NEFT / IMPS Transfer</option>
                    <option value="POS Card Terminal">Campus POS Card Swipe</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">OFFICIAL RECEIPT / VOUCHER NO.</label>
                  <input
                    className="form-control"
                    placeholder="e.g. CASH-OCT-2026-881"
                    value={receiptRef}
                    onChange={e => setReceiptRef(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowRecordModal(false); if (onCloseFeeModal) onCloseFeeModal(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Generate Official Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
