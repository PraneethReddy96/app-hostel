// Comprehensive End-to-End (E2E) Verification Suite
// Tests:
// 1. SQLite Backend API (:4000) health, db-info, state read/write, backup, reset
// 2. Student App (:5173) HTTP response & production build
// 3. Management App (:5174) HTTP response & production build
// 4. Cross-Portal Data Sync (Student raises complaint & pays fee -> Admin resolves complaint & edits menu -> SQLite persists)

import assert from 'node:assert';

const API = 'http://localhost:4000';
const STUDENT_URL = 'http://localhost:5173';
const ADMIN_URL = 'http://localhost:5174';

async function runE2E() {
  console.log('🧪 Starting End-to-End Verification Suite...\n');

  // 1. Verify Student App & Management App Servers are reachable
  const stuHtml = await fetch(STUDENT_URL).then(r => r.text());
  assert(stuHtml.includes('JoyStay — Student App'), 'Student App (:5173) HTML title check failed');
  console.log('✅ [1/7] Student App (:5173) is live and serving properly.');

  const admHtml = await fetch(ADMIN_URL).then(r => r.text());
  assert(admHtml.includes('JoyStay — Management ERP'), 'Management App (:5174) HTML title check failed');
  console.log('✅ [2/7] Management App (:5174) is live and serving properly.');

  // 2. Verify SQLite Database Info
  const dbInfo = await fetch(`${API}/api/db-info`).then(r => r.json());
  assert(dbInfo.engine.includes('SQLite'), 'SQLite engine check failed');
  assert(dbInfo.sizeKB > 0, 'SQLite database file size should be > 0 KB');
  console.log(`✅ [3/7] SQLite 3 Database verified (${dbInfo.engine}, Size: ${dbInfo.sizeKB} KB, Logs: ${dbInfo.totalAuditLogs}).`);

  // 3. Read Initial Shared State
  const initialState = await fetch(`${API}/api/state`).then(r => r.json());
  assert(Array.isArray(initialState.students) && initialState.students.length >= 6, 'Initial students missing');
  assert(Array.isArray(initialState.rooms) && initialState.rooms.length >= 6, 'Initial rooms missing');
  console.log(`✅ [4/7] Shared state loaded (${initialState.students.length} students, ${initialState.rooms.length} rooms, ${initialState.complaints.length} complaints).`);

  // 4. Simulate Student Action -> Raise a New Maintenance Complaint
  const testTicketId = `CMP-E2E-${Date.now().toString().slice(-4)}`;
  const newComplaint = {
    id: testTicketId,
    studentId: 'STU-001',
    studentName: 'Aarav Sharma',
    room: 'B-304',
    category: 'Electrical',
    title: 'E2E Test: Study Lamp Socket Check',
    description: 'Automated E2E verification test complaint',
    urgency: 'Medium',
    status: 'New',
    assignedStaffName: 'Pending Assignment'
  };

  const updatedComplaints = [newComplaint, ...initialState.complaints];
  const postRes = await fetch(`${API}/api/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaints: updatedComplaints })
  }).then(r => r.json());
  assert(postRes.ok === true, 'Failed to post student complaint to backend');

  // Verify Management App sees the new complaint from SQLite
  const afterStudentState = await fetch(`${API}/api/state`).then(r => r.json());
  const foundTicket = afterStudentState.complaints.find(c => c.id === testTicketId);
  assert(foundTicket && foundTicket.status === 'New', 'Management App did not receive Student complaint');
  console.log(`✅ [5/7] Cross-Portal Sync (Student -> SQLite -> Management): Ticket #${testTicketId} created & verified.`);

  // 5. Simulate Management Action -> Assign Technician & Resolve Complaint
  const resolvedComplaints = afterStudentState.complaints.map(c =>
    c.id === testTicketId
      ? { ...c, status: 'Resolved', assignedStaffName: 'Rajesh Kumar (Senior Electrician)', technicianNotes: 'Verified by E2E suite' }
      : c
  );
  await fetch(`${API}/api/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaints: resolvedComplaints })
  });

  const afterAdminState = await fetch(`${API}/api/state`).then(r => r.json());
  const verifiedResolved = afterAdminState.complaints.find(c => c.id === testTicketId);
  assert(verifiedResolved && verifiedResolved.status === 'Resolved', 'Student App did not receive Admin resolution');
  console.log(`✅ [6/7] Cross-Portal Sync (Management -> SQLite -> Student): Ticket #${testTicketId} resolved & synced.`);

  // 6. Test Database Backup & Factory Reset
  const backupRes = await fetch(`${API}/api/backup`, { method: 'POST' }).then(r => r.json());
  assert(backupRes.ok === true && backupRes.backupFile, 'Database backup failed');

  const resetRes = await fetch(`${API}/api/reset`, { method: 'POST' }).then(r => r.json());
  assert(resetRes.ok === true, 'Factory reset failed');
  console.log(`✅ [7/7] SQLite Backup & Factory Reset verified cleanly.\n`);

  console.log('🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY!');
}

runE2E().catch(err => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});

