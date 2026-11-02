import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  initialStudents,
  initialRooms,
  initialFeeTransactions,
  initialMessMenu,
  initialLaundryOrders,
  initialComplaints,
  initialNotices,
  initialParcels,
  initialOutpasses,
  initialStaff,
  initialMessInventory,
  initialIncidents,
  initialVisitors,
  initialHostelSettings
} from '../data/mockData';

const HostelContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || '';

export const HostelProvider = ({ children, appRole = 'student' }) => {
  // Determine portal mode strictly from the standalone app role
  const [portalMode, setPortalMode] = useState(appRole);

  const [deviceMode, setDeviceMode] = useState('responsive');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(`joystay_theme_${appRole}`) || 'dark';
  });

  // Authentication state per standalone app
  const [authUser, setAuthUser] = useState(() => {
    const saved = sessionStorage.getItem(`joystay_auth_${appRole}`);
    return saved ? JSON.parse(saved) : null;
  });

  // Current active student (for student app session)
  const [currentStudentId, setCurrentStudentId] = useState(() => {
    return localStorage.getItem('joystay_current_student_id') || 'STU-001';
  });

  // Backend connection state
  const [backendConnected, setBackendConnected] = useState(false);

  // Shared domain states (synced with Backend API :4000)
  const [students, setStudents] = useState(initialStudents);
  const [rooms, setRooms] = useState(initialRooms);
  const [feeTransactions, setFeeTransactions] = useState(initialFeeTransactions);
  const [messMenu, setMessMenu] = useState(initialMessMenu);
  const [laundryOrders, setLaundryOrders] = useState(initialLaundryOrders);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [notices, setNotices] = useState(initialNotices);
  const [parcels, setParcels] = useState(initialParcels);
  const [outpasses, setOutpasses] = useState(initialOutpasses);
  const [staffList, setStaffList] = useState(initialStaff);
  const [messInventory, setMessInventory] = useState(initialMessInventory);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [visitors, setVisitors] = useState(initialVisitors);
  const [hostelSettings, setHostelSettings] = useState(initialHostelSettings);
  const [skippedMeals, setSkippedMeals] = useState({});

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Apply incoming shared state from Backend API
  const applyRemoteState = (data) => {
    if (!data) return;
    if (data.students) setStudents(data.students);
    if (data.rooms) setRooms(data.rooms);
    if (data.feeTransactions) setFeeTransactions(data.feeTransactions);
    if (data.messMenu) setMessMenu(data.messMenu);
    if (data.laundryOrders) setLaundryOrders(data.laundryOrders);
    if (data.complaints) setComplaints(data.complaints);
    if (data.notices) setNotices(data.notices);
    if (data.parcels) setParcels(data.parcels);
    if (data.outpasses) setOutpasses(data.outpasses);
    if (data.staffList) setStaffList(data.staffList);
    if (data.messInventory) setMessInventory(data.messInventory);
    if (data.incidents) setIncidents(data.incidents);
    if (data.visitors) setVisitors(data.visitors);
    if (data.hostelSettings) setHostelSettings(data.hostelSettings);
    if (data.skippedMeals) setSkippedMeals(data.skippedMeals);
  };

  // Push partial state updates to Backend API
  const syncToBackend = async (partialUpdate) => {
    try {
      const res = await fetch(`${API_BASE}/api/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialUpdate)
      });
      if (res.ok) {
        setBackendConnected(true);
      }
    } catch (err) {
      setBackendConnected(false);
    }
  };

  // Connect to Shared Backend via Server-Sent Events (SSE) + initial fetch
  useEffect(() => {
    let eventSource = null;
    let retryTimer = null;

    const connectSSE = () => {
      fetch(`${API_BASE}/api/state`)
        .then(r => r.json())
        .then(data => {
          applyRemoteState(data);
          setBackendConnected(true);
        })
        .catch(() => setBackendConnected(false));

      eventSource = new EventSource(`${API_BASE}/api/events`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          applyRemoteState(data);
          setBackendConnected(true);
        } catch (e) {}
      };
      eventSource.onerror = () => {
        setBackendConnected(false);
        eventSource.close();
        retryTimer = setTimeout(connectSSE, 3000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  // Persist local UI preferences
  useEffect(() => {
    localStorage.setItem(`joystay_device_mode_${appRole}`, deviceMode);
    localStorage.setItem(`joystay_theme_${appRole}`, theme);
    localStorage.setItem('joystay_current_student_id', currentStudentId);
  }, [deviceMode, theme, currentStudentId, appRole]);

  useEffect(() => {
    if (authUser) {
      sessionStorage.setItem(`joystay_auth_${appRole}`, JSON.stringify(authUser));
      if (appRole === 'student' && authUser.studentId) {
        setCurrentStudentId(authUser.studentId);
      }
    } else {
      sessionStorage.removeItem(`joystay_auth_${appRole}`);
    }
  }, [authUser, appRole]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Derived current student
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  // Auth helpers
  const loginStudent = (studentId) => {
    const st = students.find(s => s.id === studentId) || students[0];
    setCurrentStudentId(st.id);
    setAuthUser({
      role: 'student',
      studentId: st.id,
      name: st.name,
      rollNo: st.rollNo,
      room: st.room
    });
    addToast(`Welcome back, ${st.name}! Connected to live hostel backend.`, 'success', 'Student Login');
  };

  const loginAdmin = (staffMember) => {
    setAuthUser({
      role: 'admin',
      staffId: staffMember.id,
      name: staffMember.name,
      title: staffMember.role,
      department: staffMember.department
    });
    addToast(`Logged in as ${staffMember.name} (${staffMember.role}).`, 'success', 'Management Login');
  };

  const logout = () => {
    setAuthUser(null);
    addToast('Signed out of session.', 'info', 'Logged Out');
  };

  // ==========================================================
  // SHARED DOMAIN ACTIONS (Mutate state + Sync to Backend API)
  // ==========================================================

  // 1. Fee Payments
  const recordStudentPayment = ({ studentId, amount, breakdown, paymentMode, transactionRef, month = "October 2026" }) => {
    const student = students.find(s => s.id === studentId);
    const newTxn = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      studentId,
      studentName: student ? student.name : "Resident",
      room: student ? student.room : "B-304",
      month,
      totalAmount: Number(amount),
      breakdown: breakdown || {
        roomRent: Math.round(Number(amount) * 0.6),
        messCharges: Math.round(Number(amount) * 0.28),
        electricityWater: Math.round(Number(amount) * 0.08),
        maintenance: Math.round(Number(amount) * 0.04)
      },
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode,
      transactionRef: transactionRef || `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}/OKPAY`,
      status: "Success",
      receiptUrl: `#receipt-${Date.now()}`
    };

    const nextTxns = [newTxn, ...feeTransactions];
    const nextStudents = students.map(s => {
      if (s.id === studentId) {
        const remaining = Math.max(0, (s.dueAmount || 0) - Number(amount));
        return {
          ...s,
          feeStatus: remaining === 0 ? "Paid" : "Due",
          dueAmount: remaining,
          lastPaidDate: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    });

    setFeeTransactions(nextTxns);
    setStudents(nextStudents);
    syncToBackend({ feeTransactions: nextTxns, students: nextStudents });

    addToast(`Payment of ₹${amount.toLocaleString()} received via ${paymentMode}! Receipt generated.`, 'success', 'Payment Successful');
    return newTxn;
  };

  // 2. Complaints Management
  const addComplaint = ({ category, title, description, urgency, photo = null }) => {
    const newCmp = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      room: currentStudent.room,
      category,
      title,
      description,
      urgency,
      status: "New",
      assignedStaffId: null,
      assignedStaffName: "Pending Assignment",
      staffContact: null,
      reportedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      updatedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      technicianNotes: "Complaint logged in portal and queued for maintenance dispatch.",
      photo,
      rating: null
    };

    const nextComplaints = [newCmp, ...complaints];
    setComplaints(nextComplaints);
    syncToBackend({ complaints: nextComplaints });

    addToast(`Complaint #${newCmp.id} raised! Sent to Management Queue.`, 'info', 'Ticket Created');
    return newCmp;
  };

  const updateComplaint = (id, updates) => {
    const nextComplaints = complaints.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...updates,
          updatedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
        };
      }
      return c;
    });
    setComplaints(nextComplaints);
    syncToBackend({ complaints: nextComplaints });
    addToast(`Complaint #${id} updated and synced to Student App.`, 'info', 'Ticket Updated');
  };

  const rateComplaint = (id, rating, feedback) => {
    const nextComplaints = complaints.map(c => {
      if (c.id === id) {
        return {
          ...c,
          rating,
          feedbackText: feedback,
          status: 'Closed'
        };
      }
      return c;
    });
    setComplaints(nextComplaints);
    syncToBackend({ complaints: nextComplaints });
    addToast(`Thank you! Your feedback (${rating} ⭐) was submitted.`, 'success', 'Feedback Received');
  };

  // 3. Laundry Booking
  const bookLaundry = ({ itemsCount, breakdown, serviceType, pickupSlot, notes }) => {
    const dropOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder = {
      id: `LND-${Math.floor(9000 + Math.random() * 999)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      room: currentStudent.room,
      itemsCount: Number(itemsCount),
      breakdown,
      serviceType,
      pickupSlot,
      status: "Booked",
      currentStep: 1,
      estimatedReady: "Tomorrow by 05:00 PM",
      dropOtp,
      notes: notes || "Standard laundry care"
    };

    const nextOrders = [newOrder, ...laundryOrders];
    setLaundryOrders(nextOrders);
    syncToBackend({ laundryOrders: nextOrders });
    addToast(`Laundry order #${newOrder.id} confirmed! Locker Drop OTP: ${dropOtp}`, 'success', 'Laundry Booked');
    return newOrder;
  };

  const advanceLaundryStatus = (orderId) => {
    const steps = ['Booked', 'Received', 'Washing', 'Ironing', 'Ready', 'Delivered'];
    const nextOrders = laundryOrders.map(order => {
      if (order.id === orderId) {
        const nextStepIdx = Math.min(steps.length - 1, (order.currentStep || 1));
        return {
          ...order,
          currentStep: nextStepIdx + 1,
          status: steps[nextStepIdx]
        };
      }
      return order;
    });
    setLaundryOrders(nextOrders);
    syncToBackend({ laundryOrders: nextOrders });
    addToast(`Order #${orderId} status advanced.`, 'info', 'Laundry Updated');
  };

  // 4. Outpass / Gate Pass
  const requestOutpass = ({ type, departureDate, returnDate, destination, reason, parentContact }) => {
    const newPass = {
      id: `OUT-${Math.floor(300 + Math.random() * 699)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      room: currentStudent.room,
      type,
      departureDate,
      returnDate,
      destination,
      reason,
      parentConsentConfirmed: true,
      parentContact: parentContact || currentStudent.guardianPhone,
      wardenApproval: "Pending",
      wardenName: "Awaiting Warden Review",
      qrCodeToken: `JS-OUTPASS-${currentStudent.name.split(' ')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Awaiting Sanction"
    };

    const nextOutpasses = [newPass, ...outpasses];
    setOutpasses(nextOutpasses);
    syncToBackend({ outpasses: nextOutpasses });
    addToast(`Outpass request sent to Warden Desk for approval!`, 'info', 'Outpass Requested');
    return newPass;
  };

  const updateOutpassStatus = (id, wardenApproval, wardenName = "Warden Office") => {
    const nextOutpasses = outpasses.map(p => {
      if (p.id === id) {
        return {
          ...p,
          wardenApproval,
          wardenName,
          status: wardenApproval === 'Approved' ? 'Active Pass' : 'Rejected'
        };
      }
      return p;
    });
    setOutpasses(nextOutpasses);
    syncToBackend({ outpasses: nextOutpasses });
    addToast(`Outpass #${id} marked as ${wardenApproval}`, 'info');
  };

  // 5. Notices Broadcast
  const addNotice = ({ title, category, badge, priority, summary, content, author = "Chief Warden Office" }) => {
    const newNotice = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      title,
      category,
      badge: badge || category,
      date: new Date().toISOString().split('T')[0],
      priority: priority || "Normal",
      author,
      summary,
      content
    };

    const nextNotices = [newNotice, ...notices];
    setNotices(nextNotices);
    syncToBackend({ notices: nextNotices });
    addToast(`Notice broadcasted to all student portals: "${title}"`, 'success', 'Notice Published');
    return newNotice;
  };

  const deleteNotice = (id) => {
    const nextNotices = notices.filter(n => n.id !== id);
    setNotices(nextNotices);
    syncToBackend({ notices: nextNotices });
    addToast(`Notice deleted.`, 'info');
  };

  // 6. Parcel Management
  const addParcel = ({ studentId, courier, trackingNo, boxType, securityGate = "Gate 1 - North Security" }) => {
    const student = students.find(s => s.id === studentId);
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newParcel = {
      id: `PKG-${Math.floor(9800 + Math.random() * 199)}`,
      studentId,
      studentName: student ? student.name : "Resident",
      room: student ? student.room : "B-304",
      courier,
      trackingNo: trackingNo || `TRACK-${Math.floor(100000 + Math.random() * 900000)}`,
      boxType: boxType || "Delivery Package",
      receivedAt: "Just Now",
      securityGate,
      pickupOtp,
      status: "Ready for Pickup",
      receivedByGuard: "Security Guard on Duty"
    };

    const nextParcels = [newParcel, ...parcels];
    setParcels(nextParcels);
    syncToBackend({ parcels: nextParcels });
    addToast(`Parcel logged for ${newParcel.studentName} (${newParcel.room}). OTP: ${pickupOtp}`, 'success', 'Parcel Received');
    return newParcel;
  };

  const markParcelPickedUp = (parcelId) => {
    const nextParcels = parcels.map(p => {
      if (p.id === parcelId) {
        return {
          ...p,
          status: "Collected",
          collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return p;
    });
    setParcels(nextParcels);
    syncToBackend({ parcels: nextParcels });
    addToast(`Parcel marked as collected.`, 'info', 'Parcel Handover Complete');
  };

  // 7. Student Management (Admission & Records)
  const addStudent = (studentData) => {
    const newId = `STU-00${students.length + 1}`;
    const newRoll = `JS-2024-${Math.floor(100 + Math.random() * 900)}`;
    const newStudent = {
      id: newId,
      rollNo: newRoll,
      avatar: studentData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256`,
      status: "Active",
      kycStatus: "Verified",
      monthlyFee: studentData.roomType?.includes('Single') ? 18000 : 14000,
      feeStatus: "Due",
      dueAmount: studentData.roomType?.includes('Single') ? 18000 : 14000,
      lastPaidDate: "N/A",
      ...studentData
    };

    const nextStudents = [newStudent, ...students];
    let nextRooms = rooms;

    if (studentData.room && studentData.bed) {
      nextRooms = rooms.map(room => {
        if (room.roomNumber === studentData.room) {
          const updatedBeds = room.beds.map(b => {
            if (b.bedId === studentData.bed) {
              return { ...b, status: "Occupied", studentId: newStudent.id, studentName: newStudent.name };
            }
            return b;
          });
          return { ...room, beds: updatedBeds };
        }
        return room;
      });
    }

    setStudents(nextStudents);
    setRooms(nextRooms);
    syncToBackend({ students: nextStudents, rooms: nextRooms });

    addToast(`Student ${newStudent.name} admitted! Roll: ${newRoll}`, 'success', 'Admission Confirmed');
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    const nextStudents = students.map(s => (s.id === id ? { ...s, ...updates } : s));
    setStudents(nextStudents);
    syncToBackend({ students: nextStudents });
    addToast(`Student profile updated.`, 'info');
  };

  // 8. Room & Bed Allocation
  const allocateBed = (roomNumber, bedId, studentId, studentName) => {
    const nextRooms = rooms.map(room => {
      if (room.roomNumber === roomNumber) {
        const updatedBeds = room.beds.map(b => {
          if (b.bedId === bedId) {
            return {
              ...b,
              status: "Occupied",
              studentId,
              studentName
            };
          }
          return b;
        });
        return { ...room, beds: updatedBeds };
      }
      return room;
    });

    const nextStudents = students.map(s => {
      if (s.id === studentId) {
        return { ...s, room: roomNumber, bed: bedId };
      }
      return s;
    });

    setRooms(nextRooms);
    setStudents(nextStudents);
    syncToBackend({ rooms: nextRooms, students: nextStudents });

    addToast(`Bed ${bedId} in Room ${roomNumber} allocated to ${studentName}.`, 'success', 'Bed Allocation Complete');
  };

  const vacateBed = (roomNumber, bedId) => {
    let studentIdVacated = null;
    const nextRooms = rooms.map(room => {
      if (room.roomNumber === roomNumber) {
        const updatedBeds = room.beds.map(b => {
          if (b.bedId === bedId) {
            studentIdVacated = b.studentId;
            return {
              ...b,
              status: "Vacant",
              studentId: null,
              studentName: null
            };
          }
          return b;
        });
        return { ...room, beds: updatedBeds };
      }
      return room;
    });

    let nextStudents = students;
    if (studentIdVacated) {
      nextStudents = students.map(s => {
        if (s.id === studentIdVacated) {
          return { ...s, room: "Unallocated", bed: "None" };
        }
        return s;
      });
    }

    setRooms(nextRooms);
    setStudents(nextStudents);
    syncToBackend({ rooms: nextRooms, students: nextStudents });

    addToast(`Bed ${bedId} in Room ${roomNumber} is now vacant.`, 'info', 'Bed Vacated');
  };

  // 9. Mess Menu Update
  const updateDayMenu = (day, mealType, updatedDetails) => {
    const nextMenu = {
      ...messMenu,
      [day]: {
        ...messMenu[day],
        [mealType]: {
          ...messMenu[day][mealType],
          ...updatedDetails
        }
      }
    };
    setMessMenu(nextMenu);
    syncToBackend({ messMenu: nextMenu });
    addToast(`${day} ${mealType} menu updated & published to Student App!`, 'success');
  };

  const toggleSkipMeal = (mealKey) => {
    const nextSkipped = { ...skippedMeals, [mealKey]: !skippedMeals[mealKey] };
    setSkippedMeals(nextSkipped);
    syncToBackend({ skippedMeals: nextSkipped });
    addToast(
      nextSkipped[mealKey] ? "Marked as SKIPPING this meal. Thank you for reducing food waste!" : "Meal opt-in restored.",
      nextSkipped[mealKey] ? 'warning' : 'info',
      'Meal Preference'
    );
  };

  // 10. Inventory CRUD (Add, Edit, Restock, Delete)
  const updateInventoryStock = (id, newQty, status) => {
    const nextInv = messInventory.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stockQty: newQty,
          status: status || item.status,
          lastPurchased: new Date().toISOString().slice(0, 10)
        };
      }
      return item;
    });
    setMessInventory(nextInv);
    syncToBackend({ messInventory: nextInv });
    addToast(`Inventory stock adjusted.`, 'info');
  };

  const addInventoryItem = ({ item, category, stockQty, minAlertQty, price, status, supplier }) => {
    const newItem = {
      id: `INV-${String(messInventory.length + 1).padStart(2, '0')}-${Math.floor(10 + Math.random() * 89)}`,
      item,
      category: category || 'Grains & Rice',
      stockQty,
      minAlertQty: minAlertQty || '20 kg',
      price: Number(price) || 0,
      status: status || 'Optimal',
      supplier: supplier || 'Local Mandi',
      lastPurchased: new Date().toISOString().slice(0, 10)
    };
    const nextInv = [newItem, ...messInventory];
    setMessInventory(nextInv);
    syncToBackend({ messInventory: nextInv });
    addToast(`${item} (${stockQty}) added to Mess Inventory.`, 'success', 'Inventory Added');
    return newItem;
  };

  const updateInventoryItem = (id, updates) => {
    const nextInv = messInventory.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          ...updates,
          price: updates.price !== undefined ? Number(updates.price) : inv.price,
          lastPurchased: new Date().toISOString().slice(0, 10)
        };
      }
      return inv;
    });
    setMessInventory(nextInv);
    syncToBackend({ messInventory: nextInv });
    addToast(`Updated inventory item "${updates.item || id}".`, 'success', 'Inventory Updated');
  };

  const deleteInventoryItem = (id) => {
    const target = messInventory.find(i => i.id === id);
    const nextInv = messInventory.filter(i => i.id !== id);
    setMessInventory(nextInv);
    syncToBackend({ messInventory: nextInv });
    addToast(`Removed "${target?.item || id}" from Mess Inventory.`, 'warning', 'Inventory Deleted');
  };

  // 11. Incident Reporting
  const addIncident = ({ category, severity, involvedStudent, room, reportedBy, description, actionTaken }) => {
    const newInc = {
      id: `INC-${Math.floor(880 + Math.random() * 119)}`,
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      category,
      severity,
      involvedStudent,
      room,
      reportedBy: reportedBy || "Warden on Duty",
      description,
      actionTaken,
      status: "Resolved"
    };

    const nextInc = [newInc, ...incidents];
    setIncidents(nextInc);
    syncToBackend({ incidents: nextInc });
    addToast(`Incident #${newInc.id} logged in official disciplinary records.`, 'warning', 'Incident Reported');
    return newInc;
  };

  // 12. Visitor Gate Logs
  const addVisitor = ({ visitorName, relation, studentName, studentRoom, phone, idProof, purpose }) => {
    const newVis = {
      id: `VIS-${Math.floor(100 + Math.random() * 899)}`,
      visitorName,
      relation,
      studentName,
      studentRoom,
      phone,
      idProof: idProof || "Aadhaar Card / ID verified",
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOutTime: "Ongoing",
      status: "Currently on Campus",
      purpose
    };

    const nextVis = [newVis, ...visitors];
    setVisitors(nextVis);
    syncToBackend({ visitors: nextVis });
    addToast(`Visitor ${visitorName} checked-in for ${studentName} (${studentRoom}).`, 'success', 'Visitor Entry Logged');
    return newVis;
  };

  const checkOutVisitor = (id) => {
    const nextVis = visitors.map(v => {
      if (v.id === id) {
        return {
          ...v,
          checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "Checked Out"
        };
      }
      return v;
    });
    setVisitors(nextVis);
    syncToBackend({ visitors: nextVis });
    addToast(`Visitor checked-out. Gate exit cleared.`, 'info');
  };

  // 13. Hostel Settings
  const updateSettings = (newSettings) => {
    const nextSettings = { ...hostelSettings, ...newSettings };
    setHostelSettings(nextSettings);
    syncToBackend({ hostelSettings: nextSettings });
    addToast(`Hostel policies & configurations saved.`, 'success', 'Settings Saved');
  };

  // Reset to initial demo data on shared server
  const resetDemoData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        applyRemoteState(data.state);
      }
    } catch (e) {}
    addToast(`Shared database restored to initial demo state.`, 'info', 'Data Reset');
  };

  const value = {
    appRole,
    portalMode,
    setPortalMode,
    deviceMode,
    setDeviceMode,
    theme,
    setTheme,
    authUser,
    loginStudent,
    loginAdmin,
    logout,
    backendConnected,
    currentStudentId,
    setCurrentStudentId,
    currentStudent,

    // Domain data
    students,
    rooms,
    feeTransactions,
    messMenu,
    laundryOrders,
    complaints,
    notices,
    parcels,
    outpasses,
    staffList,
    messInventory,
    incidents,
    visitors,
    hostelSettings,
    skippedMeals,

    // Toast
    toasts,
    addToast,
    removeToast,

    // Actions
    recordStudentPayment,
    addComplaint,
    updateComplaint,
    rateComplaint,
    bookLaundry,
    advanceLaundryStatus,
    requestOutpass,
    updateOutpassStatus,
    addNotice,
    deleteNotice,
    addParcel,
    markParcelPickedUp,
    addStudent,
    updateStudent,
    allocateBed,
    vacateBed,
    updateDayMenu,
    toggleSkipMeal,
    updateInventoryStock,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addIncident,
    addVisitor,
    checkOutVisitor,
    updateSettings,
    resetDemoData
  };

  return (
    <HostelContext.Provider value={value}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};
