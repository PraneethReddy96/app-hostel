import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  Download,
  AlertCircle,
  FileText,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Building,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FeesPaymentView = ({ isModalOpen, onCloseModal }) => {
  const { currentStudent, feeTransactions, recordStudentPayment, addToast } = useHostel();

  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi' | 'card' | 'offline'
  const [isProcessing, setIsProcessing] = useState(false);
  const [offlineRef, setOfflineRef] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);

  const studentTxns = feeTransactions.filter(t => t.studentId === currentStudent.id);

  const handlePaySuccess = (mode) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPayModal(false);
      if (onCloseModal) onCloseModal();

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      recordStudentPayment({
        studentId: currentStudent.id,
        amount: currentStudent.dueAmount || currentStudent.monthlyFee,
        paymentMode: mode,
        transactionRef: mode === 'Offline Cash' ? offlineRef || 'CASH-WARDEN-RCPT' : undefined
      });
    }, 1200);
  };

  const downloadReceipt = (txn) => {
    addToast(`Downloading official invoice & tax receipt for ${txn.id}...`, 'info', 'Receipt Generated');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Fee Status & Payments</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Monthly hostel fee ledger, online instant UPI payments, and downloadable receipts
        </p>
      </div>

      {/* Main Fee Summary Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%), var(--bg-card)' }}>
        <div className="card-header-flex">
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 700 }}>
              CURRENT BILLING CYCLE
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.2rem 0' }}>
              October 2026
            </h3>
          </div>
          <span className={`badge ${currentStudent.feeStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.82rem', padding: '0.35rem 0.8rem' }}>
            {currentStudent.feeStatus === 'Paid' ? '✓ Fully Paid' : `₹${currentStudent.dueAmount.toLocaleString()} Due`}
          </span>
        </div>

        {/* Breakdown Table */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '1rem', margin: '0.8rem 0', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Room Rent ({currentStudent.roomType})</span>
            <span style={{ fontWeight: 600 }}>₹{Math.round(currentStudent.monthlyFee * 0.6).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Mess & Dining (4 Meals Daily)</span>
            <span style={{ fontWeight: 600 }}>₹{Math.round(currentStudent.monthlyFee * 0.28).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Electricity & Water Charges</span>
            <span style={{ fontWeight: 600 }}>₹{Math.round(currentStudent.monthlyFee * 0.08).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Maintenance, Wi-Fi & Housekeeping</span>
            <span style={{ fontWeight: 600 }}>₹{Math.round(currentStudent.monthlyFee * 0.04).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem', fontSize: '0.95rem', fontWeight: 800 }}>
            <span>Total Monthly Dues</span>
            <span style={{ color: 'var(--primary)' }}>₹{currentStudent.monthlyFee.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Button */}
        {currentStudent.feeStatus !== 'Paid' ? (
          <button
            className="btn btn-primary btn-block"
            onClick={() => setShowPayModal(true)}
            style={{ padding: '0.8rem' }}
          >
            <CreditCard size={18} />
            <span>Pay Due Amount (₹{currentStudent.dueAmount.toLocaleString()})</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '0.5rem', background: 'var(--success-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontSize: '0.82rem', fontWeight: 700 }}>
            <CheckCircle2 size={16} />
            <span>No pending dues for this billing month!</span>
          </div>
        )}
      </div>

      {/* Payment History & Invoices */}
      <div className="card">
        <div className="card-header-flex">
          <div className="card-title">
            <div className="card-title-icon">
              <FileText size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Payment History & Receipts</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>All past transactions and downloadable tax receipts</div>
            </div>
          </div>
        </div>

        {studentTxns.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {studentTxns.map((txn) => (
              <div
                key={txn.id}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>₹{txn.totalAmount.toLocaleString()}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{txn.status}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {txn.month} • {txn.paymentMode}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Ref: {txn.transactionRef}
                  </div>
                </div>

                <button
                  onClick={() => downloadReceipt(txn)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '4px' }}
                >
                  <Download size={13} />
                  <span>Receipt</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
            No past transactions recorded yet.
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {(showPayModal || isModalOpen) && (
        <div className="modal-backdrop" onClick={() => { setShowPayModal(false); if (onCloseModal) onCloseModal(); }}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="var(--primary)" />
                <span>Hostel Fee Payment</span>
              </h3>
              <button
                className="icon-btn"
                onClick={() => { setShowPayModal(false); if (onCloseModal) onCloseModal(); }}
                style={{ width: '30px', height: '30px' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Payment Mode Selector Tabs */}
              <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    background: paymentTab === 'upi' ? 'var(--primary-gradient)' : 'transparent',
                    color: paymentTab === 'upi' ? 'white' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPaymentTab('upi')}
                >
                  UPI & QR Code
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    background: paymentTab === 'card' ? 'var(--primary-gradient)' : 'transparent',
                    color: paymentTab === 'card' ? 'white' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPaymentTab('card')}
                >
                  Card / Netbanking
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    background: paymentTab === 'offline' ? 'var(--primary-gradient)' : 'transparent',
                    color: paymentTab === 'offline' ? 'white' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPaymentTab('offline')}
                >
                  Offline Cash
                </button>
              </div>

              {/* UPI Tab */}
              {paymentTab === 'upi' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', display: 'inline-block', marginBottom: '1rem', boxShadow: 'var(--shadow-md)' }}>
                    {/* Simulated SVG QR Code */}
                    <svg width="160" height="160" viewBox="0 0 100 100" style={{ display: 'block' }}>
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Corner markers */}
                      <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                      <rect x="13" y="13" width="12" height="12" fill="#6366f1" rx="2" />

                      <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                      <rect x="75" y="13" width="12" height="12" fill="#6366f1" rx="2" />

                      <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                      <rect x="13" y="75" width="12" height="12" fill="#6366f1" rx="2" />

                      {/* Random QR pixels */}
                      <rect x="40" y="8" width="8" height="8" fill="#0f172a" />
                      <rect x="52" y="8" width="6" height="6" fill="#0f172a" />
                      <rect x="42" y="22" width="16" height="6" fill="#0f172a" />
                      <rect x="10" y="42" width="6" height="16" fill="#0f172a" />
                      <rect x="22" y="42" width="16" height="6" fill="#0f172a" />
                      <rect x="42" y="42" width="16" height="16" fill="#6366f1" rx="2" />
                      <rect x="65" y="42" width="26" height="6" fill="#0f172a" />
                      <rect x="80" y="52" width="10" height="18" fill="#0f172a" />
                      <rect x="42" y="66" width="14" height="12" fill="#0f172a" />
                      <rect x="65" y="72" width="16" height="8" fill="#0f172a" />
                      <rect x="85" y="78" width="8" height="14" fill="#0f172a" />
                      <rect x="40" y="86" width="24" height="6" fill="#0f172a" />
                    </svg>
                  </div>

                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    UPI ID: <span style={{ color: 'var(--primary)' }}>joystayhostel@hdfcbank</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Scan with Google Pay, PhonePe, Paytm, or BHIM
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    disabled={isProcessing}
                    onClick={() => handlePaySuccess('UPI / QR')}
                  >
                    {isProcessing ? 'Verifying Bank Authorization...' : `Simulate Pay ₹${(currentStudent.dueAmount || currentStudent.monthlyFee).toLocaleString()}`}
                  </button>
                </div>
              )}

              {/* Card Tab */}
              {paymentTab === 'card' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">CARD NUMBER</label>
                    <input className="form-control" placeholder="4532 •••• •••• 8912" defaultValue="4532 9988 2314 8912" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">VALID THRU</label>
                      <input className="form-control" placeholder="MM/YY" defaultValue="08/29" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input className="form-control" placeholder="•••" type="password" defaultValue="782" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">CARDHOLDER NAME</label>
                    <input className="form-control" defaultValue={currentStudent.name} />
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    disabled={isProcessing}
                    onClick={() => handlePaySuccess('Visa / Mastercard')}
                    style={{ marginTop: '0.5rem' }}
                  >
                    {isProcessing ? 'Processing Secure Card Payment...' : `Pay ₹${(currentStudent.dueAmount || currentStudent.monthlyFee).toLocaleString()}`}
                  </button>
                </div>
              )}

              {/* Offline Tab */}
              {paymentTab === 'offline' && (
                <div>
                  <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                    Submit offline cash receipt voucher or NEFT/IMPS bank transfer UTR number. Management will verify and stamp your digital ledger.
                  </div>
                  <div className="form-group">
                    <label className="form-label">CASH VOUCHER / BANK UTR NUMBER</label>
                    <input
                      className="form-control"
                      placeholder="e.g. CASH-REC-2026-99 or UTR-283719"
                      value={offlineRef}
                      onChange={(e) => setOfflineRef(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    disabled={isProcessing}
                    onClick={() => handlePaySuccess('Offline Cash')}
                  >
                    {isProcessing ? 'Recording Offline Submission...' : 'Submit Offline Payment Proof'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
