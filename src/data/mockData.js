// Initial mock database for Joy Stay Hostel Management System
// Persistent through localStorage

export const initialStudents = [
  {
    id: "STU-001",
    rollNo: "JS-2024-042",
    name: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256",
    gender: "Male",
    block: "Block B - Emerald",
    room: "B-304",
    bed: "Bed 1",
    roomType: "Double Sharing (AC)",
    course: "B.Tech Computer Science",
    year: "3rd Year",
    email: "aarav.sharma@campus.edu",
    phone: "+91 98765 43210",
    bloodGroup: "O+",
    dob: "2003-08-14",
    admissionDate: "2023-08-01",
    guardianName: "Rajesh Sharma",
    guardianRelation: "Father",
    guardianPhone: "+91 98765 11111",
    secondaryContact: "+91 98765 22222 (Mother - Sunita)",
    address: "Flat 402, Green Meadows, Pune, Maharashtra",
    kycStatus: "Verified",
    status: "Active",
    monthlyFee: 14000,
    feeStatus: "Paid", // 'Paid' | 'Due' | 'Overdue'
    dueAmount: 0,
    lastPaidDate: "2026-10-05"
  },
  {
    id: "STU-002",
    rollNo: "JS-2024-019",
    name: "Jacqueline Roy",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    gender: "Female",
    block: "Block A - Phoenix",
    room: "A-201",
    bed: "Bed 1",
    roomType: "Single Premium (AC)",
    course: "MBA International Business",
    year: "2nd Year",
    email: "jacqueline.roy@campus.edu",
    phone: "+91 98234 56789",
    bloodGroup: "A+",
    dob: "2002-11-20",
    admissionDate: "2023-08-10",
    guardianName: "David Roy",
    guardianRelation: "Father",
    guardianPhone: "+91 98234 00001",
    secondaryContact: "+91 98234 00002 (Mother)",
    address: "B-12 Hill View Heights, Bandra West, Mumbai",
    kycStatus: "Verified",
    status: "Active",
    monthlyFee: 18000,
    feeStatus: "Due",
    dueAmount: 18000,
    lastPaidDate: "2026-09-08"
  },
  {
    id: "STU-003",
    rollNo: "JS-2024-088",
    name: "Rohan Gupta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    gender: "Male",
    block: "Block B - Emerald",
    room: "B-304",
    bed: "Bed 2",
    roomType: "Double Sharing (AC)",
    course: "B.Tech Mechanical",
    year: "3rd Year",
    email: "rohan.gupta@campus.edu",
    phone: "+91 97654 32109",
    bloodGroup: "B+",
    dob: "2003-05-19",
    admissionDate: "2023-08-01",
    guardianName: "Mahesh Gupta",
    guardianRelation: "Father",
    guardianPhone: "+91 97654 11223",
    secondaryContact: "+91 97654 99887",
    address: "C-44 Sector 15, Noida, Uttar Pradesh",
    kycStatus: "Verified",
    status: "Active",
    monthlyFee: 14000,
    feeStatus: "Paid",
    dueAmount: 0,
    lastPaidDate: "2026-10-04"
  },
  {
    id: "STU-004",
    rollNo: "JS-2024-105",
    name: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    gender: "Female",
    block: "Block A - Phoenix",
    room: "A-102",
    bed: "Bed 2",
    roomType: "Double Sharing (Non-AC)",
    course: "B.Des Interior Design",
    year: "1st Year",
    email: "priya.patel@campus.edu",
    phone: "+91 96543 21098",
    bloodGroup: "AB+",
    dob: "2005-02-11",
    admissionDate: "2024-07-20",
    guardianName: "Nitin Patel",
    guardianRelation: "Father",
    guardianPhone: "+91 96543 99911",
    secondaryContact: "+91 96543 88822",
    address: "Plot 89, Drive-in Road, Ahmedabad, Gujarat",
    kycStatus: "Verified",
    status: "Active",
    monthlyFee: 12000,
    feeStatus: "Paid",
    dueAmount: 0,
    lastPaidDate: "2026-10-02"
  },
  {
    id: "STU-005",
    rollNo: "JS-2024-061",
    name: "Vikram Verma",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    gender: "Male",
    block: "Block B - Emerald",
    room: "B-105",
    bed: "Bed 1",
    roomType: "Triple Sharing (AC)",
    course: "B.Sc Data Science",
    year: "2nd Year",
    email: "vikram.verma@campus.edu",
    phone: "+91 95432 10987",
    bloodGroup: "O-",
    dob: "2004-09-02",
    admissionDate: "2024-08-05",
    guardianName: "Sunil Verma",
    guardianRelation: "Father",
    guardianPhone: "+91 95432 55566",
    secondaryContact: "+91 95432 44433",
    address: "H.No 120, Civil Lines, Jaipur, Rajasthan",
    kycStatus: "Verified",
    status: "Active",
    monthlyFee: 11000,
    feeStatus: "Overdue",
    dueAmount: 22000,
    lastPaidDate: "2026-08-30"
  },
  {
    id: "STU-006",
    rollNo: "JS-2024-033",
    name: "Ananya Deshmukh",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256",
    gender: "Female",
    block: "Block A - Phoenix",
    room: "A-301",
    bed: "Bed 1",
    roomType: "Double Sharing (AC)",
    course: "B.Tech AI & Robotics",
    year: "2nd Year",
    email: "ananya.d@campus.edu",
    phone: "+91 94321 09876",
    bloodGroup: "B-",
    dob: "2004-06-25",
    admissionDate: "2023-08-15",
    guardianName: "Ashok Deshmukh",
    guardianRelation: "Father",
    guardianPhone: "+91 94321 77711",
    secondaryContact: "+91 94321 88833",
    address: "704 Prabhat Road, Shivaji Nagar, Pune",
    kycStatus: "Verified",
    status: "Active",
    monthlyFee: 14000,
    feeStatus: "Paid",
    dueAmount: 0,
    lastPaidDate: "2026-10-07"
  }
];

export const initialRooms = [
  {
    roomNumber: "B-304",
    block: "Block B - Emerald",
    floor: "3rd Floor",
    type: "Double Sharing (AC)",
    ratePerMonth: 14000,
    amenities: ["High-speed Wi-Fi (1 Gbps)", "Daikin Inverter AC", "Attached Bathroom with Geyser", "Ergonomic Study Desks", "Spacious Balcony", "Biometric Lock"],
    totalBeds: 2,
    beds: [
      { bedId: "Bed 1", status: "Occupied", studentId: "STU-001", studentName: "Aarav Sharma" },
      { bedId: "Bed 2", status: "Occupied", studentId: "STU-003", studentName: "Rohan Gupta" }
    ],
    cleaningSchedule: "Mon, Wed, Fri (10:30 AM)",
    lastCleaned: "2026-10-28 11:15 AM",
    condition: "Excellent"
  },
  {
    roomNumber: "A-201",
    block: "Block A - Phoenix",
    floor: "2nd Floor",
    type: "Single Premium (AC)",
    ratePerMonth: 18000,
    amenities: ["Private Balcony", "Air Conditioning", "Ensuite Bath with Bathtub", "Smart TV", "Mini Fridge", "Study Table"],
    totalBeds: 1,
    beds: [
      { bedId: "Bed 1", status: "Occupied", studentId: "STU-002", studentName: "Jacqueline Roy" }
    ],
    cleaningSchedule: "Daily (09:30 AM)",
    lastCleaned: "2026-10-29 09:45 AM",
    condition: "Immaculate"
  },
  {
    roomNumber: "A-102",
    block: "Block A - Phoenix",
    floor: "1st Floor",
    type: "Double Sharing (Non-AC)",
    ratePerMonth: 12000,
    amenities: ["High-speed Wi-Fi", "Ceiling Fan", "Attached Bathroom", "Wardrobes", "Study Table"],
    totalBeds: 2,
    beds: [
      { bedId: "Bed 1", status: "Vacant", studentId: null, studentName: null },
      { bedId: "Bed 2", status: "Occupied", studentId: "STU-004", studentName: "Priya Patel" }
    ],
    cleaningSchedule: "Tue, Thu, Sat",
    lastCleaned: "2026-10-27 10:00 AM",
    condition: "Good"
  },
  {
    roomNumber: "B-105",
    block: "Block B - Emerald",
    floor: "1st Floor",
    type: "Triple Sharing (AC)",
    ratePerMonth: 11000,
    amenities: ["Air Conditioning", "Individual Lockers", "Shared Ensuite Bath", "Study Lamps"],
    totalBeds: 3,
    beds: [
      { bedId: "Bed 1", status: "Occupied", studentId: "STU-005", studentName: "Vikram Verma" },
      { bedId: "Bed 2", status: "Vacant", studentId: null, studentName: null },
      { bedId: "Bed 3", status: "Under Maintenance", studentId: null, studentName: null }
    ],
    cleaningSchedule: "Mon, Wed, Fri",
    lastCleaned: "2026-10-28 02:00 PM",
    condition: "Needs minor paint touchup"
  },
  {
    roomNumber: "A-301",
    block: "Block A - Phoenix",
    floor: "3rd Floor",
    type: "Double Sharing (AC)",
    ratePerMonth: 14000,
    amenities: ["High-speed Wi-Fi", "AC", "Attached Bath", "Wardrobes", "Balcony"],
    totalBeds: 2,
    beds: [
      { bedId: "Bed 1", status: "Occupied", studentId: "STU-006", studentName: "Ananya Deshmukh" },
      { bedId: "Bed 2", status: "Vacant", studentId: null, studentName: null }
    ],
    cleaningSchedule: "Mon, Wed, Fri",
    lastCleaned: "2026-10-28 10:00 AM",
    condition: "Good"
  },
  {
    roomNumber: "B-202",
    block: "Block B - Emerald",
    floor: "2nd Floor",
    type: "Double Sharing (AC)",
    ratePerMonth: 14000,
    amenities: ["High-speed Wi-Fi", "AC", "Attached Bath", "Study Desks"],
    totalBeds: 2,
    beds: [
      { bedId: "Bed 1", status: "Vacant", studentId: null, studentName: null },
      { bedId: "Bed 2", status: "Vacant", studentId: null, studentName: null }
    ],
    cleaningSchedule: "Daily Inspection",
    lastCleaned: "2026-10-26 03:00 PM",
    condition: "Ready for move-in"
  }
];

export const initialFeeTransactions = [
  {
    id: "TXN-202610-01",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    month: "October 2026",
    totalAmount: 14000,
    breakdown: {
      roomRent: 8500,
      messCharges: 4000,
      electricityWater: 1000,
      maintenance: 500
    },
    paymentDate: "2026-10-05",
    paymentMode: "UPI / PhonePe",
    transactionRef: "UPI/3901928374/OKICICI",
    status: "Success",
    receiptUrl: "#receipt-001"
  },
  {
    id: "TXN-202609-01",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    month: "September 2026",
    totalAmount: 14000,
    breakdown: {
      roomRent: 8500,
      messCharges: 4000,
      electricityWater: 1000,
      maintenance: 500
    },
    paymentDate: "2026-09-04",
    paymentMode: "Net Banking (HDFC)",
    transactionRef: "HDFC9982410294",
    status: "Success",
    receiptUrl: "#receipt-002"
  },
  {
    id: "TXN-202610-02",
    studentId: "STU-003",
    studentName: "Rohan Gupta",
    room: "B-304",
    month: "October 2026",
    totalAmount: 14000,
    breakdown: {
      roomRent: 8500,
      messCharges: 4000,
      electricityWater: 1000,
      maintenance: 500
    },
    paymentDate: "2026-10-04",
    paymentMode: "Google Pay",
    transactionRef: "GPAY/77182910/SBI",
    status: "Success",
    receiptUrl: "#receipt-003"
  },
  {
    id: "TXN-202610-03",
    studentId: "STU-004",
    studentName: "Priya Patel",
    room: "A-102",
    month: "October 2026",
    totalAmount: 12000,
    breakdown: {
      roomRent: 7000,
      messCharges: 4000,
      electricityWater: 600,
      maintenance: 400
    },
    paymentDate: "2026-10-02",
    paymentMode: "Offline Cash at Warden Desk",
    transactionRef: "CASH-REC-OCT-09",
    status: "Success",
    receiptUrl: "#receipt-004"
  }
];

export const initialMessMenu = {
  Monday: {
    breakfast: {
      time: "07:30 AM - 09:30 AM",
      items: ["Masala Dosa with Sambar", "Coconut & Tomato Chutney", "Boiled Farm Eggs", "Bread, Butter & Jam", "Filter Coffee / Masala Chai"],
      tag: "South Indian Special",
      calories: "450 kcal"
    },
    lunch: {
      time: "12:30 PM - 02:30 PM",
      items: ["Paneer Butter Masala (Veg)", "Chicken Kadai Curry (Non-Veg)", "Yellow Dal Tadka", "Steamed Jeera Rice", "Tandoori Roti", "Cucumber Raita & Fresh Salad", "Hot Gulab Jamun"],
      tag: "Chef's Feast",
      calories: "780 kcal"
    },
    snacks: {
      time: "05:00 PM - 06:15 PM",
      items: ["Crispy Aloo Samosa (2 pcs)", "Mint Chutney", "Fresh Ginger Elaichi Chai", "Marie Biscuits"],
      tag: "Evening Refreshment",
      calories: "320 kcal"
    },
    dinner: {
      time: "07:45 PM - 09:45 PM",
      items: ["Mix Vegetable Korma", "Dal Fry Dhaba Style", "Soft Phulkas with Ghee", "Steamed Basmati Rice", "Papad & Pickles", "Vanilla Ice Cream"],
      tag: "Homestyle Comfort",
      calories: "650 kcal"
    }
  },
  Tuesday: {
    breakfast: {
      time: "07:30 AM - 09:30 AM",
      items: ["Poha with Roasted Peanuts", "Sev & Lemon", "Sprouted Moong Salad", "Fresh Fruits (Banana/Apple)", "Adrak Chai / Warm Milk"],
      tag: "Light & Nutritious",
      calories: "410 kcal"
    },
    lunch: {
      time: "12:30 PM - 02:30 PM",
      items: ["Rajma Masala (Punjabi Style)", "Aloo Gobi Adraki", "Steamed Fragrant Rice", "Chapati with Ghee", "Boondi Raita", "Green Salad"],
      tag: "North Indian Classic",
      calories: "720 kcal"
    },
    snacks: {
      time: "05:00 PM - 06:15 PM",
      items: ["Veg Cheese Grilled Sandwich", "Potato Wafers", "Filter Coffee / Tea"],
      tag: "Quick Bite",
      calories: "360 kcal"
    },
    dinner: {
      time: "07:45 PM - 09:45 PM",
      items: ["Egg Curry / Paneer Bhurji", "Dal Palak", "Steamed Rice", "Wheat Rotis", "Salad & Kheer"],
      tag: "Protein Rich",
      calories: "690 kcal"
    }
  },
  Wednesday: {
    breakfast: {
      time: "07:30 AM - 09:30 AM",
      items: ["Stuffed Aloo Paratha with Curd", "Pickle & Butter", "Omelette to order", "Tea / Coffee"],
      tag: "Hearty Breakfast",
      calories: "520 kcal"
    },
    lunch: {
      time: "12:30 PM - 02:30 PM",
      items: ["Hyderabadi Veg Biryani / Chicken Dum Biryani", "Mirchi Ka Salan", "Onion Mint Raita", "Boiled Eggs", "Moong Dal Halwa"],
      tag: "Biryani Special Day",
      calories: "850 kcal"
    },
    snacks: {
      time: "05:00 PM - 06:15 PM",
      items: ["Onion Pakoda with Sweet Tamarind & Green Chutney", "Cutting Chai"],
      tag: "Monsoon Mood",
      calories: "340 kcal"
    },
    dinner: {
      time: "07:45 PM - 09:45 PM",
      items: ["Mutter Paneer", "Dal Makhani", "Jeera Rice", "Soft Butter Naan / Rotis", "Custard with Fruits"],
      tag: "Royal Dinner",
      calories: "710 kcal"
    }
  },
  Thursday: {
    breakfast: {
      time: "07:30 AM - 09:30 AM",
      items: ["Idli & Medu Vada combo", "Hot Sambar", "Two Chutneys", "Filter Coffee"],
      tag: "Traditional South",
      calories: "430 kcal"
    },
    lunch: {
      time: "12:30 PM - 02:30 PM",
      items: ["Chole Bhature / Chole Kulche", "Pickled Green Chillies", "Pulao Rice", "Sweet Lassi"],
      tag: "Delhi Street Style",
      calories: "790 kcal"
    },
    snacks: {
      time: "05:00 PM - 06:15 PM",
      items: ["Bhel Puri / Sev Puri", "Masala Lemon Soda / Tea"],
      tag: "Chaat Time",
      calories: "280 kcal"
    },
    dinner: {
      time: "07:45 PM - 09:45 PM",
      items: ["Lauki Kofta Curry", "Panchratan Dal", "Steamed Rice", "Phulkas", "Sewaiyan Kheer"],
      tag: "Balanced Meal",
      calories: "620 kcal"
    }
  },
  Friday: {
    breakfast: {
      time: "07:30 AM - 09:30 AM",
      items: ["Pav Bhaji with Butter Pav", "Chopped Onions & Lemon", "Boiled Eggs", "Tea / Coffee"],
      tag: "Weekend Starter",
      calories: "510 kcal"
    },
    lunch: {
      time: "12:30 PM - 02:30 PM",
      items: ["Butter Chicken (Non-Veg) / Shahi Paneer (Veg)", "Dal Tadka", "Basmati Rice", "Tandoori Roti", "Kachumber Salad", "Rasgulla"],
      tag: "Grand Friday Lunch",
      calories: "820 kcal"
    },
    snacks: {
      time: "05:00 PM - 06:15 PM",
      items: ["Veg Spring Rolls with Sweet Chilli Sauce", "Cold Coffee / Hot Tea"],
      tag: "Indo-Chinese",
      calories: "350 kcal"
    },
    dinner: {
      time: "07:45 PM - 09:45 PM",
      items: ["Veg Hakka Noodles / Fried Rice", "Manchurian Gravy", "Crispy Chilly Babycorn", "Hot Chocolate Brownie"],
      tag: "Global Kitchen",
      calories: "740 kcal"
    }
  },
  Saturday: {
    breakfast: {
      time: "08:00 AM - 10:00 AM",
      items: ["Puri Bhaji with Halwa", "Sprouts Chaat", "Tea / Coffee / Juice"],
      tag: "Weekend Brunch",
      calories: "560 kcal"
    },
    lunch: {
      time: "12:30 PM - 02:30 PM",
      items: ["Kadhi Pakoda", "Khichdi & Ghee", "Aloo Jeera", "Roasted Papad", "Curd & Pickle"],
      tag: "Sattvic Comfort",
      calories: "680 kcal"
    },
    snacks: {
      time: "05:00 PM - 06:30 PM",
      items: ["Pav Wada (Mumbai Vada Pav)", "Fried Salted Chilli", "Masala Chai"],
      tag: "Street Delight",
      calories: "390 kcal"
    },
    dinner: {
      time: "07:45 PM - 10:00 PM",
      items: ["Hostel Feast BBQ / Paneer Tikka", "Dal Bukhara", "Jeera Rice", "Laccha Paratha", "Gulab Jamun with Rabdi"],
      tag: "Hostel Night Celebration",
      calories: "830 kcal"
    }
  },
  Sunday: {
    breakfast: {
      time: "08:00 AM - 10:30 AM",
      items: ["Fluffy Pancakes with Maple Syrup", "Scrambled Eggs / Hash Browns", "Cornflakes with Cold Milk", "Brewed Coffee & Orange Juice"],
      tag: "Lazy Sunday Morning",
      calories: "540 kcal"
    },
    lunch: {
      time: "12:30 PM - 03:00 PM",
      items: ["Special Mutton Curry / Malai Kofta", "Dum Rice", "Yellow Dal", "Roomali Roti", "Fruit Trifle Pudding"],
      tag: "Sunday Special Feast",
      calories: "880 kcal"
    },
    snacks: {
      time: "05:00 PM - 06:30 PM",
      items: ["Assorted Cookies & Hot Filter Coffee / Herbal Tea"],
      tag: "Evening Tea",
      calories: "220 kcal"
    },
    dinner: {
      time: "07:45 PM - 09:45 PM",
      items: ["Light Moong Dal Khichdi / Vegetable Pulao", "Kadhi", "Tomato Chutney", "Fresh Seasonal Fruit"],
      tag: "Light Sunday Dinner",
      calories: "510 kcal"
    }
  }
};

export const initialLaundryOrders = [
  {
    id: "LND-9021",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    itemsCount: 8,
    breakdown: { shirts: 3, trousers: 2, tshirts: 2, bedsheet: 1 },
    serviceType: "Wash & Iron",
    pickupSlot: "Today, 10:00 AM",
    status: "Ironing", // 'Booked' | 'Received' | 'Washing' | 'Ironing' | 'Ready' | 'Delivered'
    currentStep: 4, // 1 to 5
    estimatedReady: "Today by 06:00 PM",
    dropOtp: "7721",
    notes: "Gentle wash for white formal shirt please."
  },
  {
    id: "LND-8940",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    itemsCount: 11,
    breakdown: { shirts: 4, trousers: 3, tshirts: 3, towel: 1 },
    serviceType: "Wash & Fold",
    pickupSlot: "2026-10-23, 11:30 AM",
    status: "Delivered",
    currentStep: 5,
    estimatedReady: "Delivered on 2026-10-24",
    dropOtp: "8832",
    notes: "Completed without issues."
  },
  {
    id: "LND-9022",
    studentId: "STU-002",
    studentName: "Jacqueline Roy",
    room: "A-201",
    itemsCount: 6,
    breakdown: { shirts: 2, trousers: 2, delicate: 2 },
    serviceType: "Dry Clean & Steam Iron",
    pickupSlot: "Today, 11:00 AM",
    status: "Washing",
    currentStep: 3,
    estimatedReady: "Tomorrow by 01:00 PM",
    dropOtp: "4509",
    notes: "Silk blouse handle with care."
  }
];

export const initialComplaints = [
  {
    id: "CMP-1042",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    category: "Plumbing",
    title: "Bathroom basin tap leaking continuously",
    description: "The hot water mixer tap in the bathroom doesn't shut off completely and drops water constantly creating noise at night.",
    urgency: "Medium",
    status: "In Progress", // 'New' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed'
    assignedStaffId: "STF-003",
    assignedStaffName: "Suresh Babu (Campus Plumber)",
    staffContact: "+91 98888 12345",
    reportedAt: "2026-10-28 09:15 AM",
    updatedAt: "2026-10-29 08:00 AM",
    technicianNotes: "Washer replaced; waiting for sealant to cure, will test pressure at 11 AM.",
    rating: null
  },
  {
    id: "CMP-1040",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    category: "Wi-Fi & Network",
    title: "High latency and frequent disconnects on 5GHz band",
    description: "Wi-Fi keeps dropping during online exams and project coding sessions since Tuesday.",
    urgency: "High",
    status: "Assigned",
    assignedStaffId: "STF-005",
    assignedStaffName: "Karan Johar (IT Network Admin)",
    staffContact: "+91 98888 54321",
    reportedAt: "2026-10-27 04:30 PM",
    updatedAt: "2026-10-28 10:00 AM",
    technicianNotes: "Access point B-300 cluster scheduled for firmware update and antenna realignment.",
    rating: null
  },
  {
    id: "CMP-1038",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    category: "Electrical",
    title: "LED ceiling panel flickering near study desk",
    description: "The 24W LED square panel keeps blinking whenever the AC compressor switches on.",
    urgency: "Low",
    status: "Resolved",
    assignedStaffId: "STF-002",
    assignedStaffName: "Rajesh Kumar (Senior Electrician)",
    staffContact: "+91 98888 67890",
    reportedAt: "2026-10-22 02:00 PM",
    updatedAt: "2026-10-23 04:15 PM",
    technicianNotes: "Replaced faulty capacitor and LED driver module. Tested on load - working fine.",
    rating: 5
  },
  {
    id: "CMP-1045",
    studentId: "STU-002",
    studentName: "Jacqueline Roy",
    room: "A-201",
    category: "Air Conditioning",
    title: "AC remote display is dead and temperature stuck at 24C",
    description: "Batteries changed but remote doesn't respond to buttons. Need cooling adjusted.",
    urgency: "Medium",
    status: "New",
    assignedStaffId: null,
    assignedStaffName: "Unassigned",
    staffContact: null,
    reportedAt: "2026-10-29 07:45 AM",
    updatedAt: "2026-10-29 07:45 AM",
    technicianNotes: "Awaiting warden review and technician dispatch.",
    rating: null
  }
];

export const initialNotices = [
  {
    id: "NOT-001",
    title: "Hostel Night Curfew & Biometric Verification Strict Reminder",
    category: "Important Notice",
    badge: "Curfew & Security",
    date: "2026-10-28",
    priority: "High",
    author: "Chief Warden Office",
    summary: "Hostel gates close promptly at 09:30 PM. Any entry post 09:45 PM requires an approved digital Outpass.",
    content: "All residents of Block A, B, C & D are reminded that the biometric turnstiles lock at 21:30 hrs. If you are delayed due to academic labs or library, ensure your Outpass or late slip is sanctioned by 08:00 PM via this app. Random room roll calls will be conducted this week."
  },
  {
    id: "NOT-002",
    title: "Overhead Water Tank Deep Cleaning & Pressure Pump Service",
    category: "Maintenance",
    badge: "Facilities",
    date: "2026-10-29",
    priority: "Medium",
    author: "Facilities Management",
    summary: "Scheduled maintenance tomorrow between 10:00 AM and 01:00 PM. Hot water supply will be paused.",
    content: "The water purification team will perform UV lamp servicing and overhead tank chlorination. Please store drinking water in your personal bottles before 10 AM. Regular water pressure will resume by 01:30 PM."
  },
  {
    id: "NOT-003",
    title: "Diwali Fest & Grand Cultural Courtyard Gala 🪔",
    category: "Events & Festivals",
    badge: "Celebration",
    date: "2026-10-31",
    priority: "Normal",
    author: "Hostel Student Council",
    summary: "Live DJ, acoustic music, traditional dinner feast and prize distribution this Saturday 7 PM!",
    content: "Join us in the Central Quadrangle for an evening of light, music, and festive cheer. Dress code: Ethnic / Festive wear. Special buffet dinner curated by the Mess Committee featuring Rajasthani Dal Baati, Paneer Tikka, Jalebi Rabdi, and Mocktails. RSVP in the app to assist with headcounts!"
  },
  {
    id: "NOT-004",
    title: "Campus Wi-Fi Core Router Upgrade & 10G Backbone",
    category: "Technology",
    badge: "IT Network",
    date: "2026-10-26",
    priority: "Normal",
    author: "IT Infrastructure Desk",
    summary: "Bandwidth upgraded from 500 Mbps to 1 Gbps symmetrical. New SSID 'JoyStay_Ultra_5G' is live.",
    content: "Students can now login using their Student Portal credentials on the new high-speed enterprise network. Seamless roaming enabled across all hostels and dining halls."
  }
];

export const initialParcels = [
  {
    id: "PKG-9821",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    courier: "Amazon India",
    trackingNo: "AMZ-IN-90821948",
    boxType: "Electronics Box (Careful Handling)",
    receivedAt: "Today, 08:30 AM",
    securityGate: "Gate 1 - North Security",
    pickupOtp: "8394",
    status: "Ready for Pickup", // 'Ready for Pickup' | 'Collected'
    receivedByGuard: "Officer Balwant Singh"
  },
  {
    id: "PKG-9815",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    courier: "BlueDart Express",
    trackingNo: "BLUEDART-882194",
    boxType: "Document Envelope (Speed Post)",
    receivedAt: "2026-10-26, 03:20 PM",
    securityGate: "Gate 1 - North Security",
    pickupOtp: "5512",
    status: "Collected",
    collectedAt: "2026-10-26, 06:10 PM",
    receivedByGuard: "Officer Rajeshwar"
  },
  {
    id: "PKG-9825",
    studentId: "STU-002",
    studentName: "Jacqueline Roy",
    room: "A-201",
    courier: "Flipkart Logistics",
    trackingNo: "FMP-4481902",
    boxType: "Apparel Package",
    receivedAt: "Today, 09:10 AM",
    securityGate: "Gate 2 - East Security",
    pickupOtp: "9102",
    status: "Ready for Pickup",
    receivedByGuard: "Officer Surender"
  }
];

export const initialOutpasses = [
  {
    id: "OUT-301",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    room: "B-304",
    type: "Weekend Home Visit",
    departureDate: "2026-10-31 06:00 PM",
    returnDate: "2026-11-02 08:30 PM",
    destination: "Home (Pune)",
    reason: "Family gathering for upcoming Diwali festival",
    parentConsentConfirmed: true,
    parentContact: "+91 98765 11111",
    wardenApproval: "Approved", // 'Pending' | 'Approved' | 'Rejected'
    wardenName: "Asst. Warden Anand Kumar",
    qrCodeToken: "JS-OUTPASS-AARAV-301-VALID",
    status: "Active Pass"
  },
  {
    id: "OUT-302",
    studentId: "STU-005",
    studentName: "Vikram Verma",
    room: "B-105",
    type: "Late Night Lab Pass",
    departureDate: "2026-10-29 09:30 PM",
    returnDate: "2026-10-30 01:00 AM",
    destination: "Robotics Core Lab, Tech Block",
    reason: "Final testing for National Hackathon prototype",
    parentConsentConfirmed: true,
    parentContact: "+91 95432 55566",
    wardenApproval: "Pending",
    wardenName: "Under Review",
    qrCodeToken: "JS-OUTPASS-VIKRAM-302-PEND",
    status: "Awaiting Sanction"
  }
];

export const initialStaff = [
  {
    id: "STF-001",
    name: "Dr. K.V. Rao",
    role: "Chief Warden",
    department: "Administration",
    phone: "+91 94444 12345",
    email: "chief.warden@joystay.edu",
    shift: "General (09:00 AM - 06:00 PM)",
    status: "On Campus",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "STF-002",
    name: "Anand Kumar",
    role: "Warden (Block B Boys)",
    department: "Student Affairs",
    phone: "+91 94444 54321",
    email: "anand.k@joystay.edu",
    shift: "Evening / Night (04:00 PM - 12:00 AM)",
    status: "On Duty",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "STF-003",
    name: "Mrs. Sunita Pillai",
    role: "Warden (Block A Girls)",
    department: "Student Affairs",
    phone: "+91 94444 98765",
    email: "sunita.p@joystay.edu",
    shift: "Full Time (Resident Warden)",
    status: "On Duty",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "STF-004",
    name: "Inspector Balwant Singh",
    role: "Head Security Supervisor",
    department: "Campus Security",
    phone: "+91 98111 22334",
    email: "security.gate1@joystay.edu",
    shift: "Day Shift (06:00 AM - 02:00 PM)",
    status: "At Main Gate",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "STF-005",
    name: "Rajesh Kumar",
    role: "Senior Campus Electrician",
    department: "Maintenance",
    phone: "+91 98888 67890",
    email: "rajesh.elec@joystay.edu",
    shift: "General (08:30 AM - 05:30 PM)",
    status: "Available",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "STF-006",
    name: "Suresh Babu",
    role: "Master Plumber",
    department: "Maintenance",
    phone: "+91 98888 12345",
    email: "suresh.plumb@joystay.edu",
    shift: "General (08:30 AM - 05:30 PM)",
    status: "Assigned (B-304)",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=256"
  }
];

export const initialMessInventory = [
  { id: "INV-01", item: "Aromatic Basmati Rice", category: "Grains & Rice", stockQty: "180 kg", minAlertQty: "80 kg", price: 16200, status: "Optimal", supplier: "Agro Foods Ltd", lastPurchased: "2026-10-24" },
  { id: "INV-02", item: "Premium Toor Dal (Lentils)", category: "Pulses", stockQty: "42 kg", minAlertQty: "50 kg", price: 5880, status: "Low Stock Alert", supplier: "Kisan Mandi", lastPurchased: "2026-10-18" },
  { id: "INV-03", item: "Sunflower Cooking Oil", category: "Oils & Ghee", stockQty: "65 Litres", minAlertQty: "40 Litres", price: 9100, status: "Optimal", supplier: "Fortune Retail", lastPurchased: "2026-10-22" },
  { id: "INV-04", item: "Farm Fresh Pasteurized Milk", category: "Dairy", stockQty: "50 Litres", minAlertQty: "30 Litres", price: 3200, status: "Daily Delivery", supplier: "Amul Direct", lastPurchased: "Today (Daily)" },
  { id: "INV-05", item: "Malai Paneer (Fresh)", category: "Dairy", stockQty: "16 kg", minAlertQty: "12 kg", price: 6400, status: "Optimal", supplier: "Heritage Dairy", lastPurchased: "2026-10-28" },
  { id: "INV-06", item: "Farm Fresh Broiler Chicken", category: "Poultry", stockQty: "28 kg", minAlertQty: "20 kg", price: 6160, status: "Optimal", supplier: "FreshToHome", lastPurchased: "2026-10-28" },
  { id: "INV-07", item: "Whole Wheat Atta (Flour)", category: "Grains & Flour", stockQty: "210 kg", minAlertQty: "100 kg", price: 9450, status: "Optimal", supplier: "Aashirvaad Mill", lastPurchased: "2026-10-20" },
  { id: "INV-08", item: "Assorted Spices & Masalas", category: "Condiments", stockQty: "35 kg", minAlertQty: "15 kg", price: 8750, status: "Optimal", supplier: "MDH & Everest", lastPurchased: "2026-10-15" }
];

export const initialIncidents = [
  {
    id: "INC-881",
    date: "2026-10-25 10:45 PM",
    category: "Curfew Violation",
    severity: "Low",
    involvedStudent: "Vikram Verma (STU-005)",
    room: "B-105",
    reportedBy: "Security Guard Balwant Singh",
    description: "Student attempted entry past 09:30 PM curfew without pre-approved Outpass or lab endorsement.",
    actionTaken: "Gate log recorded. Verbal advisory given by Asst. Warden Anand. First warning letter documented.",
    status: "Resolved"
  },
  {
    id: "INC-882",
    date: "2026-10-27 11:30 PM",
    category: "Noise & Quiet Hours Disturbance",
    severity: "Medium",
    involvedStudent: "Floor 2 Residents (Room B-204 & B-206)",
    room: "Block B, 2nd Floor Corridor",
    reportedBy: "Resident Warden Anand Kumar",
    description: "High-decibel bluetooth speakers and loud gaming tournament during quiet study hours before semester midterms.",
    actionTaken: "Speakers temporarily confiscated for 48 hours. Formal warning email sent to floor residents.",
    status: "Closed"
  },
  {
    id: "INC-883",
    date: "2026-10-20 04:15 PM",
    category: "Property Damage",
    severity: "Minor",
    involvedStudent: "Unknown / Corridor CCTV",
    room: "Block A - 1st Floor Common Area",
    reportedBy: "Housekeeping Staff Rama",
    description: "Table tennis paddle cracked and net post loosened in recreation hall.",
    actionTaken: "Recreation sports inventory updated; paddle replaced from student welfare fund.",
    status: "Resolved"
  }
];

export const initialVisitors = [
  {
    id: "VIS-101",
    visitorName: "Rajesh Sharma",
    relation: "Father",
    studentName: "Aarav Sharma",
    studentRoom: "B-304",
    phone: "+91 98765 11111",
    idProof: "Aadhaar verified at Gate",
    checkInTime: "2026-10-26 11:00 AM",
    checkOutTime: "2026-10-26 03:30 PM",
    status: "Checked Out",
    purpose: "Family visit and delivered winter clothes"
  },
  {
    id: "VIS-102",
    visitorName: "Kavita Roy",
    relation: "Mother",
    studentName: "Jacqueline Roy",
    studentRoom: "A-201",
    phone: "+91 98234 00002",
    idProof: "Driving License",
    checkInTime: "Today, 10:15 AM",
    checkOutTime: "Ongoing",
    status: "Currently on Campus (Visitor Lounge)",
    purpose: "Birthday lunch with daughter"
  }
];

export const initialHostelSettings = {
  hostelName: "Joy Stay Hostel & Residences",
  tagline: "Smart Student Living & Community Spaces",
  address: "Campus Rd, Knowledge Park III, Silicon City, Metro 560048",
  contactPhone: "+91 94444 00000",
  contactEmail: "admin@joystayhostel.com",
  emergencySOS: "+91 94444 00000 (24/7 Security Control)",
  curfewTime: "21:30",
  gracePeriodMinutes: 15,
  quietHours: "11:00 PM - 06:00 AM",
  lateEntryFinePerIncident: 200,
  laundryQuotaPerMonth: 30,
  blocksCount: 4,
  blocks: [
    { name: "Block A - Phoenix", type: "Girls Wing", totalRooms: 45, occupiedRooms: 42 },
    { name: "Block B - Emerald", type: "Boys Wing", totalRooms: 50, occupiedRooms: 46 },
    { name: "Block C - Sapphire", type: "Executive PG", totalRooms: 20, occupiedRooms: 18 },
    { name: "Block D - Ruby", type: "Postgraduate & Research", totalRooms: 25, occupiedRooms: 22 }
  ]
};
