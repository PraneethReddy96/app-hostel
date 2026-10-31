import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { BedDouble } from 'lucide-react';

export const RoomBedAllocationView = () => {
  const { rooms, students, allocateBed, vacateBed } = useHostel();

  const [filterBlock, setFilterBlock] = useState('All');
  const [filterFloor, setFilterFloor] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [allocatingStudentId, setAllocatingStudentId] = useState('');

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchBlock = filterBlock === 'All' || room.block.includes(filterBlock);
    const matchFloor = filterFloor === 'All' || room.floor.includes(filterFloor);
    return matchBlock && matchFloor;
  });

  const handleOpenAllocationModal = (room, bed) => {
    setSelectedRoom(room);
    setSelectedBed(bed);
    setAllocatingStudentId(students[0]?.id || '');
  };

  const handleConfirmAllocation = () => {
    const student = students.find(s => s.id === allocatingStudentId);
    if (!student || !selectedRoom || !selectedBed) return;

    allocateBed(selectedRoom.roomNumber, selectedBed.bedId, student.id, student.name);
    setSelectedRoom(null);
    setSelectedBed(null);
  };

  const handleVacate = (roomNumber, bedId) => {
    if (window.confirm(`Are you sure you want to vacate ${bedId} in Room ${roomNumber}?`)) {
      vacateBed(roomNumber, bedId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Room & Bed Allocation</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Interactive visual floor matrix, real-time bed occupancy, assignment & vacating
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />
            <span>Occupied Bed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }} />
            <span>Vacant Bed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)' }} />
            <span>Under Maintenance</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hostel Wing:</span>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={filterBlock}
            onChange={e => setFilterBlock(e.target.value)}
          >
            <option value="All">All Wings (Block A & B)</option>
            <option value="Block A">Block A - Phoenix (Girls)</option>
            <option value="Block B">Block B - Emerald (Boys)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Floor Level:</span>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={filterFloor}
            onChange={e => setFilterFloor(e.target.value)}
          >
            <option value="All">All Floors</option>
            <option value="1st Floor">1st Floor</option>
            <option value="2nd Floor">2nd Floor</option>
            <option value="3rd Floor">3rd Floor</option>
          </select>
        </div>
      </div>

      {/* Visual Room Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredRooms.map(room => {
          const occupiedCount = room.beds?.filter(b => b.status === 'Occupied').length || 0;
          const isFull = occupiedCount === room.totalBeds;

          return (
            <div key={room.roomNumber} className="card">
              {/* Room Header */}
              <div className="card-header-flex">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Room {room.roomNumber}</h3>
                    <span className={`badge ${isFull ? 'badge-primary' : 'badge-success'}`}>
                      {occupiedCount} / {room.totalBeds} Beds Filled
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {room.block} • {room.floor}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{room.ratePerMonth?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/ month</div>
                </div>
              </div>

              {/* Beds Visualization */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: '0.85rem 0' }}>
                {room.beds?.map(bed => {
                  const isOccupied = bed.status === 'Occupied';
                  const isMaintenance = bed.status === 'Under Maintenance';
                  const student = isOccupied ? students.find(s => s.id === bed.studentId) : null;

                  return (
                    <div
                      key={bed.bedId}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: isOccupied ? '1px solid var(--border-color)' : '1px dashed var(--success-border)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-xs)',
                            background: isOccupied ? 'var(--primary-light)' : isMaintenance ? 'var(--warning-bg)' : 'var(--success-bg)',
                            color: isOccupied ? 'var(--primary)' : isMaintenance ? 'var(--warning)' : 'var(--success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          <BedDouble size={14} />
                        </div>

                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                            {bed.bedId} {isOccupied ? `— ${bed.studentName}` : isMaintenance ? '(Under Maintenance)' : '(Vacant Bed)'}
                          </div>
                          {student && (
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                              Roll: {student.rollNo} • Fee: <span style={{ color: student.feeStatus === 'Paid' ? 'var(--success)' : 'var(--danger)' }}>{student.feeStatus}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      {isOccupied ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.68rem', padding: '2px 8px', color: 'var(--danger)' }}
                          onClick={() => handleVacate(room.roomNumber, bed.bedId)}
                          title="Vacate Bed"
                        >
                          Vacate
                        </button>
                      ) : !isMaintenance ? (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                          onClick={() => handleOpenAllocationModal(room, bed)}
                        >
                          + Allocate
                        </button>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Maintenance</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Amenities footnote */}
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Type: {room.type}</span>
                <span>Cleaned: {room.lastCleaned || "Inspected"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Allocation Modal */}
      {selectedRoom && selectedBed && (
        <div className="modal-backdrop" onClick={() => setSelectedRoom(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BedDouble size={18} color="var(--primary)" />
                <span>Allocate {selectedBed.bedId} in Room {selectedRoom.roomNumber}</span>
              </h3>
              <button className="icon-btn" onClick={() => setSelectedRoom(null)} style={{ width: '30px', height: '30px' }}>✕</button>
            </div>

            <div className="modal-body">
              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.75rem' }}>
                <div>Hostel Wing: <strong>{selectedRoom.block}</strong></div>
                <div>Room Type: <strong>{selectedRoom.type}</strong> (₹{selectedRoom.ratePerMonth?.toLocaleString()}/month)</div>
              </div>

              <div className="form-group">
                <label className="form-label">SELECT STUDENT CANDIDATE</label>
                <select
                  className="form-control"
                  value={allocatingStudentId}
                  onChange={e => setAllocatingStudentId(e.target.value)}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Roll: {s.rollNo} • Current: {s.room})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedRoom(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirmAllocation}>
                Confirm Bed Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
