// ============================================================
//  Amdox ERP – Central In-Memory Mock Data Store
// ============================================================

// ── Users / Auth ──────────────────────────────────────────
const bcrypt = require("bcryptjs");

const USERS = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "admin@erp.com",
    password: bcrypt.hashSync("1234", 10),
    role: "admin",
    department: "Management",
    phone: "+1 (555) 001-0001",
    status: "Active",
    lastLogin: "Just now",
    avatar: "JD",
  },
  {
    id: "USR-002",
    name: "Sarah Jenkins",
    email: "hr@erp.com",
    password: bcrypt.hashSync("1234", 10),
    role: "hr",
    department: "Human Resources",
    phone: "+1 (555) 001-0002",
    status: "Active",
    lastLogin: "1 hour ago",
    avatar: "SJ",
  },
  {
    id: "USR-003",
    name: "Michael Brown",
    email: "finance@erp.com",
    password: bcrypt.hashSync("1234", 10),
    role: "finance",
    department: "Finance",
    phone: "+1 (555) 001-0003",
    status: "Active",
    lastLogin: "3 hours ago",
    avatar: "MB",
  },
  {
    id: "USR-004",
    name: "Emily Ross",
    email: "emily@amdox.com",
    password: bcrypt.hashSync("1234", 10),
    role: "employee",
    department: "Engineering",
    phone: "+1 (555) 001-0004",
    status: "Inactive",
    lastLogin: "5 days ago",
    avatar: "ER",
  },
  {
    id: "USR-005",
    name: "David Chen",
    email: "david@amdox.com",
    password: bcrypt.hashSync("1234", 10),
    role: "it",
    department: "IT",
    phone: "+1 (555) 001-0005",
    status: "Active",
    lastLogin: "10 mins ago",
    avatar: "DC",
  },
];

// ── Employees ─────────────────────────────────────────────
const EMPLOYEES = [
  { id: "EMP-001", name: "Alice Johnson",   email: "alice@amdox.com",   role: "Senior Developer",     department: "Engineering", status: "Active",   salary: 95000,  joinDate: "2022-03-15", phone: "+1 555-0101", avatar: "AJ", type: "Permanent"  },
  { id: "EMP-002", name: "Bob Martinez",    email: "bob@amdox.com",     role: "Marketing Lead",       department: "Marketing",   status: "Active",   salary: 78000,  joinDate: "2021-07-20", phone: "+1 555-0102", avatar: "BM", type: "Permanent"  },
  { id: "EMP-003", name: "Carol White",     email: "carol@amdox.com",   role: "Finance Analyst",      department: "Finance",     status: "On Leave", salary: 82000,  joinDate: "2020-11-10", phone: "+1 555-0103", avatar: "CW", type: "Permanent"  },
  { id: "EMP-004", name: "Daniel Lee",      email: "daniel@amdox.com",  role: "HR Specialist",        department: "HR",          status: "Active",   salary: 65000,  joinDate: "2023-01-08", phone: "+1 555-0104", avatar: "DL", type: "Probation"  },
  { id: "EMP-005", name: "Eva Green",       email: "eva@amdox.com",     role: "Product Manager",      department: "Engineering", status: "Active",   salary: 105000, joinDate: "2021-04-22", phone: "+1 555-0105", avatar: "EG", type: "Permanent"  },
  { id: "EMP-006", name: "Frank Adams",     email: "frank@amdox.com",   role: "DevOps Engineer",      department: "Engineering", status: "Active",   salary: 92000,  joinDate: "2022-09-14", phone: "+1 555-0106", avatar: "FA", type: "Contract"   },
  { id: "EMP-007", name: "Grace Kim",       email: "grace@amdox.com",   role: "UX Designer",          department: "Design",      status: "Active",   salary: 80000,  joinDate: "2023-02-28", phone: "+1 555-0107", avatar: "GK", type: "Permanent"  },
  { id: "EMP-008", name: "Henry Park",      email: "henry@amdox.com",   role: "Sales Manager",        department: "Sales",       status: "Active",   salary: 88000,  joinDate: "2020-06-01", phone: "+1 555-0108", avatar: "HP", type: "Permanent"  },
  { id: "EMP-009", name: "Iris Thompson",   email: "iris@amdox.com",    role: "Data Scientist",       department: "Analytics",   status: "Active",   salary: 110000, joinDate: "2022-12-05", phone: "+1 555-0109", avatar: "IT", type: "Permanent"  },
  { id: "EMP-010", name: "James Wilson",    email: "james@amdox.com",   role: "Junior Developer",     department: "Engineering", status: "Active",   salary: 55000,  joinDate: "2024-01-15", phone: "+1 555-0110", avatar: "JW", type: "Trainee"    },
  { id: "EMP-011", name: "Karen Davis",     email: "karen@amdox.com",   role: "Accountant",           department: "Finance",     status: "Active",   salary: 70000,  joinDate: "2021-03-10", phone: "+1 555-0111", avatar: "KD", type: "Permanent"  },
  { id: "EMP-012", name: "Liam Scott",      email: "liam@amdox.com",    role: "Operations Lead",      department: "Operations",  status: "On Leave", salary: 85000,  joinDate: "2020-08-20", phone: "+1 555-0112", avatar: "LS", type: "Permanent"  },
];

// ── Departments ───────────────────────────────────────────
const DEPARTMENTS = [
  { id: "DEP-001", name: "Engineering",     head: "Eva Green",      employees: 85, budget: 2500000, location: "HQ – Floor 4", status: "Active" },
  { id: "DEP-002", name: "Marketing",       head: "Bob Martinez",   employees: 32, budget: 800000,  location: "HQ – Floor 3", status: "Active" },
  { id: "DEP-003", name: "Finance",         head: "Carol White",    employees: 28, budget: 600000,  location: "HQ – Floor 2", status: "Active" },
  { id: "DEP-004", name: "Human Resources", head: "Daniel Lee",     employees: 20, budget: 400000,  location: "HQ – Floor 1", status: "Active" },
  { id: "DEP-005", name: "Sales",           head: "Henry Park",     employees: 45, budget: 1200000, location: "Branch – East", status: "Active" },
  { id: "DEP-006", name: "Operations",      head: "Liam Scott",     employees: 30, budget: 750000,  location: "HQ – Floor 2", status: "Active" },
  { id: "DEP-007", name: "Design",          head: "Grace Kim",      employees: 18, budget: 350000,  location: "HQ – Floor 3", status: "Active" },
  { id: "DEP-008", name: "Analytics",       head: "Iris Thompson",  employees: 12, budget: 500000,  location: "HQ – Floor 4", status: "Active" },
  { id: "DEP-009", name: "IT",              head: "David Chen",     employees: 22, budget: 900000,  location: "HQ – Floor 5", status: "Active" },
];

// ── Designations ──────────────────────────────────────────
const DESIGNATIONS = [
  { id: "DES-001", title: "Chief Executive Officer",  level: "C-Suite",  department: "Management",  minSalary: 200000, maxSalary: 500000 },
  { id: "DES-002", title: "Chief Technology Officer", level: "C-Suite",  department: "Engineering", minSalary: 180000, maxSalary: 420000 },
  { id: "DES-003", title: "Senior Developer",         level: "L3",       department: "Engineering", minSalary: 90000,  maxSalary: 130000 },
  { id: "DES-004", title: "Junior Developer",         level: "L1",       department: "Engineering", minSalary: 45000,  maxSalary: 70000  },
  { id: "DES-005", title: "Product Manager",          level: "L4",       department: "Engineering", minSalary: 95000,  maxSalary: 150000 },
  { id: "DES-006", title: "HR Manager",               level: "L3",       department: "HR",          minSalary: 70000,  maxSalary: 100000 },
  { id: "DES-007", title: "Finance Analyst",          level: "L2",       department: "Finance",     minSalary: 65000,  maxSalary: 95000  },
  { id: "DES-008", title: "Marketing Lead",           level: "L3",       department: "Marketing",   minSalary: 70000,  maxSalary: 105000 },
  { id: "DES-009", title: "Sales Manager",            level: "L3",       department: "Sales",       minSalary: 75000,  maxSalary: 115000 },
  { id: "DES-010", title: "DevOps Engineer",          level: "L3",       department: "Engineering", minSalary: 85000,  maxSalary: 125000 },
];

// ── Attendance ────────────────────────────────────────────
const ATTENDANCE = [
  { id: "ATT-001", employeeId: "EMP-001", name: "Alice Johnson",   date: "2024-05-20", checkIn: "09:05", checkOut: "18:10", hours: "9h 05m", status: "Present" },
  { id: "ATT-002", employeeId: "EMP-002", name: "Bob Martinez",    date: "2024-05-20", checkIn: "08:50", checkOut: "17:55", hours: "9h 05m", status: "Present" },
  { id: "ATT-003", employeeId: "EMP-003", name: "Carol White",     date: "2024-05-20", checkIn: "—",     checkOut: "—",     hours: "—",      status: "On Leave" },
  { id: "ATT-004", employeeId: "EMP-004", name: "Daniel Lee",      date: "2024-05-20", checkIn: "10:15", checkOut: "19:30", hours: "9h 15m", status: "Late"    },
  { id: "ATT-005", employeeId: "EMP-005", name: "Eva Green",       date: "2024-05-20", checkIn: "09:00", checkOut: "18:00", hours: "9h 00m", status: "Present" },
  { id: "ATT-006", employeeId: "EMP-006", name: "Frank Adams",     date: "2024-05-20", checkIn: "—",     checkOut: "—",     hours: "—",      status: "Absent"  },
  { id: "ATT-007", employeeId: "EMP-007", name: "Grace Kim",       date: "2024-05-20", checkIn: "08:45", checkOut: "17:50", hours: "9h 05m", status: "Present" },
  { id: "ATT-008", employeeId: "EMP-008", name: "Henry Park",      date: "2024-05-20", checkIn: "09:10", checkOut: "18:15", hours: "9h 05m", status: "Present" },
];

// ── Leaves ────────────────────────────────────────────────
const LEAVES = [
  { id: "LEA-001", employeeId: "EMP-003", name: "Carol White",   type: "Sick Leave",    from: "2024-05-18", to: "2024-05-22", days: 5, reason: "Medical treatment",        status: "Approved",  appliedOn: "2024-05-16" },
  { id: "LEA-002", employeeId: "EMP-012", name: "Liam Scott",    type: "Annual Leave",  from: "2024-05-20", to: "2024-05-24", days: 5, reason: "Family vacation",          status: "Approved",  appliedOn: "2024-05-10" },
  { id: "LEA-003", employeeId: "EMP-004", name: "Daniel Lee",    type: "Personal Leave",from: "2024-05-25", to: "2024-05-25", days: 1, reason: "Personal work",            status: "Pending",   appliedOn: "2024-05-20" },
  { id: "LEA-004", employeeId: "EMP-007", name: "Grace Kim",     type: "Annual Leave",  from: "2024-06-01", to: "2024-06-05", days: 5, reason: "Planned holidays",         status: "Pending",   appliedOn: "2024-05-19" },
  { id: "LEA-005", employeeId: "EMP-010", name: "James Wilson",  type: "Sick Leave",    from: "2024-05-14", to: "2024-05-15", days: 2, reason: "Fever",                    status: "Rejected",  appliedOn: "2024-05-13" },
  { id: "LEA-006", employeeId: "EMP-002", name: "Bob Martinez",  type: "Casual Leave",  from: "2024-05-10", to: "2024-05-10", days: 1, reason: "Personal errand",          status: "Approved",  appliedOn: "2024-05-09" },
];

// ── Payroll ───────────────────────────────────────────────
const PAYROLL = [
  { id: "PAY-001", employeeId: "EMP-001", name: "Alice Johnson",   month: "May 2024",   basicSalary: 95000,  hra: 38000, allowances: 5000,  deductions: 12000, netPay: 126000, status: "Processed" },
  { id: "PAY-002", employeeId: "EMP-002", name: "Bob Martinez",    month: "May 2024",   basicSalary: 78000,  hra: 31200, allowances: 4000,  deductions: 9800,  netPay: 103400, status: "Processed" },
  { id: "PAY-003", employeeId: "EMP-003", name: "Carol White",     month: "May 2024",   basicSalary: 82000,  hra: 32800, allowances: 4500,  deductions: 10500, netPay: 108800, status: "Pending"   },
  { id: "PAY-004", employeeId: "EMP-004", name: "Daniel Lee",      month: "May 2024",   basicSalary: 65000,  hra: 26000, allowances: 3000,  deductions: 8200,  netPay: 85800,  status: "Processed" },
  { id: "PAY-005", employeeId: "EMP-005", name: "Eva Green",       month: "May 2024",   basicSalary: 105000, hra: 42000, allowances: 6000,  deductions: 14500, netPay: 138500, status: "Processed" },
];

// ── Inventory ─────────────────────────────────────────────
const INVENTORY = [
  { id: "PRD-001", name: "Laptop Dell XPS 15",    category: "Electronics",    sku: "ELC-DXP-015", stock: 25,  unitPrice: 1200,  totalValue: 30000, supplier: "Dell Inc.",       reorderLevel: 5,  status: "In Stock"     },
  { id: "PRD-002", name: "iPhone 15 Pro",          category: "Electronics",    sku: "ELC-IPH-015", stock: 18,  unitPrice: 999,   totalValue: 17982, supplier: "Apple Inc.",      reorderLevel: 5,  status: "In Stock"     },
  { id: "PRD-003", name: "Office Chair",           category: "Furniture",      sku: "FUR-CHR-001", stock: 8,   unitPrice: 150,   totalValue: 1200,  supplier: "Herman Miller",   reorderLevel: 10, status: "Low Stock"    },
  { id: "PRD-004", name: "Wireless Keyboard",      category: "Accessories",    sku: "ACC-KBD-001", stock: 0,   unitPrice: 45,    totalValue: 0,     supplier: "Logitech",        reorderLevel: 15, status: "Out of Stock" },
  { id: "PRD-005", name: "Monitor 24 inch",        category: "Electronics",    sku: "ELC-MON-024", stock: 15,  unitPrice: 180,   totalValue: 2700,  supplier: "Samsung",         reorderLevel: 5,  status: "In Stock"     },
  { id: "PRD-006", name: "Standing Desk",          category: "Furniture",      sku: "FUR-DSK-001", stock: 12,  unitPrice: 450,   totalValue: 5400,  supplier: "Flexispot",       reorderLevel: 3,  status: "In Stock"     },
  { id: "PRD-007", name: "USB-C Hub",              category: "Accessories",    sku: "ACC-USB-001", stock: 3,   unitPrice: 55,    totalValue: 165,   supplier: "Anker",           reorderLevel: 10, status: "Low Stock"    },
  { id: "PRD-008", name: "Printer HP LaserJet",   category: "Electronics",    sku: "ELC-PRT-001", stock: 7,   unitPrice: 320,   totalValue: 2240,  supplier: "HP Inc.",         reorderLevel: 3,  status: "In Stock"     },
  { id: "PRD-009", name: "Whiteboard 4x6",         category: "Office Supplies",sku: "OFF-WBD-001", stock: 20,  unitPrice: 80,    totalValue: 1600,  supplier: "Quartet",         reorderLevel: 5,  status: "In Stock"     },
  { id: "PRD-010", name: "Noise Canceling Headset",category: "Accessories",    sku: "ACC-HDS-001", stock: 0,   unitPrice: 250,   totalValue: 0,     supplier: "Bose",            reorderLevel: 5,  status: "Out of Stock" },
];

// ── Finance / Transactions ────────────────────────────────
const TRANSACTIONS = [
  { id: "TXN-001", label: "Invoice #INV-1245", party: "ABC Pvt Ltd",         amount: 12500,  type: "income",  category: "Sales",        date: "2024-05-18", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: "TXN-002", label: "Payment #PAY-8852", party: "Tech Solutions",       amount: -8750,  type: "expense", category: "Operating",    date: "2024-05-18", status: "Completed", paymentMethod: "Online"        },
  { id: "TXN-003", label: "Invoice #INV-1244", party: "Global Enterprises",   amount: 9800,   type: "income",  category: "Services",     date: "2024-05-17", status: "Completed", paymentMethod: "Cheque"        },
  { id: "TXN-004", label: "Bill #BILL-5543",   party: "Office Supplies Co.",  amount: -2350,  type: "expense", category: "Supplies",     date: "2024-05-17", status: "Completed", paymentMethod: "Cash"          },
  { id: "TXN-005", label: "Invoice #INV-1243", party: "XYZ Corporation",      amount: 15600,  type: "income",  category: "Sales",        date: "2024-05-16", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: "TXN-006", label: "Payroll #MAY-2024", party: "Internal – Payroll",   amount: -185000,type: "expense", category: "Payroll",      date: "2024-05-15", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: "TXN-007", label: "Invoice #INV-1242", party: "Alpha Corp",           amount: 22400,  type: "income",  category: "Sales",        date: "2024-05-14", status: "Pending",   paymentMethod: "Online"        },
  { id: "TXN-008", label: "Rent #MAY-2024",    party: "City Properties Ltd",  amount: -18000, type: "expense", category: "Rent",         date: "2024-05-01", status: "Completed", paymentMethod: "Bank Transfer" },
];

// ── Invoices ──────────────────────────────────────────────
const INVOICES = [
  { id: "INV-1245", client: "ABC Pvt Ltd",       issue: "2024-05-15", due: "2024-05-25", amount: 12500, tax: 1250,  total: 13750, status: "Paid",     items: [{ desc: "Software License", qty: 5, rate: 2500 }] },
  { id: "INV-1244", client: "Global Enterprises", issue: "2024-05-14", due: "2024-05-24", amount: 9800,  tax: 980,   total: 10780, status: "Paid",     items: [{ desc: "Consulting Services", qty: 1, rate: 9800 }] },
  { id: "INV-1243", client: "XYZ Corporation",    issue: "2024-05-10", due: "2024-05-20", amount: 15600, tax: 1560,  total: 17160, status: "Paid",     items: [{ desc: "Product Supply", qty: 12, rate: 1300 }] },
  { id: "INV-1242", client: "Alpha Corp",          issue: "2024-05-08", due: "2024-05-18", amount: 22400, tax: 2240,  total: 24640, status: "Overdue",  items: [{ desc: "Enterprise Package", qty: 1, rate: 22400 }] },
  { id: "INV-1241", client: "Beta Solutions",      issue: "2024-04-30", due: "2024-05-30", amount: 7800,  tax: 780,   total: 8580,  status: "Pending",  items: [{ desc: "Monthly Retainer", qty: 1, rate: 7800 }] },
];

// ── Expenses ──────────────────────────────────────────────
const EXPENSES = [
  { id: "EXP-001", description: "Office Rent – May",       category: "Rent",          amount: 18000, date: "2024-05-01", approvedBy: "John Doe",     status: "Approved",  receipt: true  },
  { id: "EXP-002", description: "Cloud Server – AWS",      category: "Technology",    amount: 4200,  date: "2024-05-05", approvedBy: "John Doe",     status: "Approved",  receipt: true  },
  { id: "EXP-003", description: "Team Lunch",              category: "Meals",         amount: 850,   date: "2024-05-12", approvedBy: "Sarah Jenkins",status: "Approved",  receipt: false },
  { id: "EXP-004", description: "Marketing Campaign",      category: "Marketing",     amount: 12500, date: "2024-05-14", approvedBy: null,           status: "Pending",   receipt: true  },
  { id: "EXP-005", description: "Training Materials",      category: "Training",      amount: 3500,  date: "2024-05-15", approvedBy: "Sarah Jenkins",status: "Approved",  receipt: true  },
  { id: "EXP-006", description: "Office Supplies Q2",      category: "Supplies",      amount: 2350,  date: "2024-05-17", approvedBy: null,           status: "Pending",   receipt: false },
  { id: "EXP-007", description: "Travel – Client Visit",   category: "Travel",        amount: 1800,  date: "2024-05-18", approvedBy: "John Doe",     status: "Approved",  receipt: true  },
];

// ── Income ────────────────────────────────────────────────
const INCOME = [
  { id: "INC-001", source: "ABC Pvt Ltd",        category: "Product Sales",    amount: 45680, date: "2024-05-18", month: "May", status: "Received"  },
  { id: "INC-002", source: "Global Enterprises", category: "Consulting",       amount: 38750, date: "2024-05-16", month: "May", status: "Received"  },
  { id: "INC-003", source: "XYZ Corporation",    category: "Product Sales",    amount: 28450, date: "2024-05-14", month: "May", status: "Received"  },
  { id: "INC-004", source: "Alpha Corp",         category: "License Fees",     amount: 22400, date: "2024-05-10", month: "May", status: "Pending"   },
  { id: "INC-005", source: "Beta Solutions",     category: "Service Retainer", amount: 15600, date: "2024-05-08", month: "May", status: "Received"  },
  { id: "INC-006", source: "Gamma Industries",   category: "Product Sales",    amount: 19800, date: "2024-04-25", month: "Apr", status: "Received"  },
];

// ── Accounts ──────────────────────────────────────────────
const ACCOUNTS = [
  { id: "ACC-001", name: "Operating Account", bank: "First National Bank", accNo: "**** 4567", balance: 125680, type: "Current",  status: "Active" },
  { id: "ACC-002", name: "Savings Account",   bank: "City Bank",           accNo: "**** 6789", balance: 85430,  type: "Savings",  status: "Active" },
  { id: "ACC-003", name: "Payroll Account",   bank: "Chase Bank",          accNo: "**** 7890", balance: 25350,  type: "Current",  status: "Active" },
  { id: "ACC-004", name: "Tax Account",       bank: "US Treasury",         accNo: "**** 8901", balance: 18250,  type: "Escrow",   status: "Active" },
  { id: "ACC-005", name: "Investment Account",bank: "Goldman Sachs",       accNo: "**** 9012", balance: 250000, type: "Investment",status: "Active" },
];

// ── Payments / Bills ──────────────────────────────────────
const PAYMENTS = [
  { id: "PAY-001", vendor: "Tech Solutions",    description: "Software Subscription",  amount: 8750,  dueDate: "2024-05-25", paidDate: "2024-05-18", status: "Paid",     method: "Bank Transfer" },
  { id: "PAY-002", vendor: "Office Supplies Co",description: "Q2 Stationery",         amount: 2350,  dueDate: "2024-05-30", paidDate: "2024-05-17", status: "Paid",     method: "Cash"          },
  { id: "PAY-003", vendor: "City Properties",   description: "May Office Rent",        amount: 18000, dueDate: "2024-05-01", paidDate: "2024-05-01", status: "Paid",     method: "Bank Transfer" },
  { id: "PAY-004", vendor: "AWS",               description: "Cloud Services – May",   amount: 4200,  dueDate: "2024-05-31", paidDate: null,         status: "Pending",  method: null            },
  { id: "PAY-005", vendor: "Bose Inc.",         description: "Headset Order",           amount: 1500,  dueDate: "2024-05-20", paidDate: null,         status: "Overdue",  method: null            },
];

// ── Vendors ───────────────────────────────────────────────
const VENDORS = [
  { id: "VND-001", name: "Dell Inc.",          contact: "support@dell.com",       phone: "+1-800-999-3355", category: "Electronics",     country: "USA",   status: "Active",  rating: 5, totalOrders: 24  },
  { id: "VND-002", name: "Apple Inc.",         contact: "business@apple.com",     phone: "+1-800-275-2273", category: "Electronics",     country: "USA",   status: "Active",  rating: 5, totalOrders: 18  },
  { id: "VND-003", name: "Herman Miller",      contact: "orders@hermanmiller.com",phone: "+1-616-654-3000", category: "Furniture",       country: "USA",   status: "Active",  rating: 4, totalOrders: 8   },
  { id: "VND-004", name: "Logitech",           contact: "orders@logitech.com",    phone: "+41-21-863-5111", category: "Accessories",     country: "Swiss", status: "Active",  rating: 4, totalOrders: 45  },
  { id: "VND-005", name: "City Properties Ltd",contact: "lease@cityprops.com",    phone: "+1-312-555-0190", category: "Real Estate",     country: "USA",   status: "Active",  rating: 3, totalOrders: 60  },
  { id: "VND-006", name: "AWS",                contact: "aws-support@amazon.com", phone: "+1-206-266-1000", category: "Cloud Services",  country: "USA",   status: "Active",  rating: 5, totalOrders: 36  },
];

// ── Assets ────────────────────────────────────────────────
const ASSETS = [
  { id: "AST-001", name: "Dell Server Rack",       category: "IT Equipment",  location: "Server Room",  purchaseDate: "2022-01-15", purchaseValue: 45000, currentValue: 36000, status: "In Use",      assignedTo: "IT Dept"      },
  { id: "AST-002", name: "Company Vehicle – SUV",  category: "Vehicles",      location: "Parking B2",   purchaseDate: "2021-06-10", purchaseValue: 58000, currentValue: 40000, status: "In Use",      assignedTo: "Operations"   },
  { id: "AST-003", name: "Office Furniture Set",   category: "Furniture",     location: "Floor 3",      purchaseDate: "2020-03-20", purchaseValue: 22000, currentValue: 14000, status: "In Use",      assignedTo: "Engineering"  },
  { id: "AST-004", name: "MacBook Pro x10",        category: "IT Equipment",  location: "Floor 4",      purchaseDate: "2023-09-01", purchaseValue: 20000, currentValue: 16000, status: "In Use",      assignedTo: "Engineering"  },
  { id: "AST-005", name: "Conference Room A/V",    category: "AV Equipment",  location: "Conf Room 1",  purchaseDate: "2021-11-05", purchaseValue: 15000, currentValue: 9000,  status: "In Use",      assignedTo: "Admin"        },
  { id: "AST-006", name: "Industrial Printer",     category: "IT Equipment",  location: "Floor 2",      purchaseDate: "2019-04-15", purchaseValue: 8500,  currentValue: 2000,  status: "Maintenance", assignedTo: "Finance"      },
];

// ── Budgets ───────────────────────────────────────────────
const BUDGETS = [
  { id: "BGT-001", department: "Engineering",     fiscalYear: "FY 2024", allocated: 2500000, spent: 1850000, remaining: 650000,  status: "On Track"   },
  { id: "BGT-002", department: "Marketing",       fiscalYear: "FY 2024", allocated: 800000,  spent: 720000,  remaining: 80000,   status: "At Risk"    },
  { id: "BGT-003", department: "Finance",         fiscalYear: "FY 2024", allocated: 600000,  spent: 380000,  remaining: 220000,  status: "On Track"   },
  { id: "BGT-004", department: "HR",              fiscalYear: "FY 2024", allocated: 400000,  spent: 290000,  remaining: 110000,  status: "On Track"   },
  { id: "BGT-005", department: "Sales",           fiscalYear: "FY 2024", allocated: 1200000, spent: 1150000, remaining: 50000,   status: "Critical"   },
  { id: "BGT-006", department: "Operations",      fiscalYear: "FY 2024", allocated: 750000,  spent: 410000,  remaining: 340000,  status: "On Track"   },
  { id: "BGT-007", department: "IT",              fiscalYear: "FY 2024", allocated: 900000,  spent: 620000,  remaining: 280000,  status: "On Track"   },
];

// ── Tax Management ────────────────────────────────────────
const TAX_RECORDS = [
  { id: "TAX-001", type: "GST",             period: "Q1 2024", taxableAmount: 245680, rate: 18, taxAmount: 44222, paidAmount: 44222, dueDate: "2024-04-15", status: "Filed"   },
  { id: "TAX-002", type: "Corporate Tax",   period: "FY 2023", taxableAmount: 980000, rate: 25, taxAmount: 245000,paidAmount: 245000,dueDate: "2024-03-31", status: "Filed"   },
  { id: "TAX-003", type: "TDS",             period: "Mar 2024",taxableAmount: 185000, rate: 10, taxAmount: 18500, paidAmount: 18500, dueDate: "2024-04-07", status: "Filed"   },
  { id: "TAX-004", type: "GST",             period: "Q2 2024", taxableAmount: 312450, rate: 18, taxAmount: 56241, paidAmount: 0,     dueDate: "2024-07-15", status: "Pending" },
  { id: "TAX-005", type: "Professional Tax",period: "May 2024",taxableAmount: 48500,  rate: 2,  taxAmount: 970,   paidAmount: 0,     dueDate: "2024-05-31", status: "Due"     },
];

// ── Projects ──────────────────────────────────────────────
const PROJECTS = [
  { id: "PRJ-001", name: "Global Cloud Migration",   client: "Internal",          manager: "Eva Green",    team: 12, budget: 450000, spent: 285000, start: "2024-01-15", end: "2024-08-30", progress: 85, status: "Healthy",   priority: "High"   },
  { id: "PRJ-002", name: "Blockchain Integration",    client: "Alpha Corp",        manager: "Frank Adams",  team: 8,  budget: 280000, spent: 195000, start: "2024-02-01", end: "2024-07-31", progress: 45, status: "At Risk",   priority: "High"   },
  { id: "PRJ-003", name: "ERP v2.0 Rollout",         client: "Internal",          manager: "Eva Green",    team: 20, budget: 680000, spent: 580000, start: "2023-10-01", end: "2024-06-30", progress: 92, status: "Excellent", priority: "Critical"},
  { id: "PRJ-004", name: "E-commerce Platform",       client: "XYZ Corporation",  manager: "Henry Park",   team: 6,  budget: 180000, spent: 42000,  start: "2024-04-01", end: "2024-10-31", progress: 22, status: "Healthy",   priority: "Medium" },
  { id: "PRJ-005", name: "Mobile App v3",             client: "Beta Solutions",   manager: "Grace Kim",    team: 5,  budget: 120000, spent: 88000,  start: "2024-03-01", end: "2024-06-15", progress: 75, status: "At Risk",   priority: "High"   },
  { id: "PRJ-006", name: "Data Warehouse Setup",      client: "Internal",          manager: "Iris Thompson",team: 4,  budget: 200000, spent: 80000,  start: "2024-05-01", end: "2024-11-30", progress: 30, status: "Healthy",   priority: "Medium" },
];

// ── Approvals ─────────────────────────────────────────────
const APPROVALS = [
  { id: "APR-001", type: "Leave Request",    requestedBy: "Daniel Lee",   department: "HR",          amount: null,  description: "Personal leave May 25",      date: "2024-05-20", status: "Pending",  priority: "Normal" },
  { id: "APR-002", type: "Expense Claim",    requestedBy: "Bob Martinez", department: "Marketing",   amount: 12500, description: "Marketing campaign budget",   date: "2024-05-19", status: "Pending",  priority: "High"   },
  { id: "APR-003", type: "Purchase Order",   requestedBy: "David Chen",   department: "IT",          amount: 4500,  description: "New workstations (x3)",       date: "2024-05-18", status: "Approved", priority: "Normal" },
  { id: "APR-004", type: "Leave Request",    requestedBy: "Grace Kim",    department: "Design",      amount: null,  description: "Annual leave Jun 1-5",        date: "2024-05-19", status: "Pending",  priority: "Normal" },
  { id: "APR-005", type: "Budget Increase",  requestedBy: "Henry Park",   department: "Sales",       amount: 80000, description: "Q2 sales budget extension",   date: "2024-05-17", status: "Rejected", priority: "High"   },
  { id: "APR-006", type: "Expense Claim",    requestedBy: "Alice Johnson",department: "Engineering", amount: 3500,  description: "Training materials",          date: "2024-05-15", status: "Approved", priority: "Normal" },
];

// ── Audit Logs ────────────────────────────────────────────
const AUDIT_LOGS = [
  { id: "AUD-001", user: "John Doe",      action: "LOGIN",         module: "Auth",      description: "Admin login successful",               ip: "192.168.1.10", timestamp: "2024-05-20 09:05:42", severity: "Info"    },
  { id: "AUD-002", user: "Sarah Jenkins", action: "CREATE",        module: "Employees", description: "Added new employee Alice Johnson",     ip: "192.168.1.11", timestamp: "2024-05-20 09:15:20", severity: "Info"    },
  { id: "AUD-003", user: "John Doe",      action: "UPDATE",        module: "Inventory", description: "Stock updated: PRD-001 (25 → 20)",     ip: "192.168.1.10", timestamp: "2024-05-20 10:02:11", severity: "Info"    },
  { id: "AUD-004", user: "Michael Brown", action: "APPROVE",       module: "Finance",   description: "Invoice INV-1244 approved & paid",     ip: "192.168.1.12", timestamp: "2024-05-20 10:45:33", severity: "Info"    },
  { id: "AUD-005", user: "Unknown",       action: "LOGIN_FAILED",  module: "Auth",      description: "Failed login attempt – unknown@x.com", ip: "45.33.201.12", timestamp: "2024-05-20 11:12:08", severity: "Warning" },
  { id: "AUD-006", user: "John Doe",      action: "DELETE",        module: "Users",     description: "User account USR-099 deactivated",     ip: "192.168.1.10", timestamp: "2024-05-20 14:22:55", severity: "Critical"},
  { id: "AUD-007", user: "Sarah Jenkins", action: "EXPORT",        module: "Reports",   description: "HR Report exported as CSV",            ip: "192.168.1.11", timestamp: "2024-05-20 15:00:01", severity: "Info"    },
  { id: "AUD-008", user: "Michael Brown", action: "CREATE",        module: "Invoices",  description: "Invoice INV-1246 created for ABC",     ip: "192.168.1.12", timestamp: "2024-05-20 15:45:18", severity: "Info"    },
];

// ── Roles ─────────────────────────────────────────────────
const ROLES = [
  { id: "ROL-001", name: "Super Admin",     description: "Full system access with all privileges",     permissions: ["all"],                          userCount: 2  },
  { id: "ROL-002", name: "HR Manager",      description: "Manage employees, leaves, and attendance",   permissions: ["hr", "payroll", "reports"],      userCount: 4  },
  { id: "ROL-003", name: "Finance Manager", description: "Manage finances, invoices, and budgets",     permissions: ["finance", "invoices", "reports"],userCount: 3  },
  { id: "ROL-004", name: "Employee",        description: "View own profile, apply for leaves",         permissions: ["profile", "leaves"],             userCount: 220},
  { id: "ROL-005", name: "IT Support",      description: "Manage IT assets and system configuration",  permissions: ["assets", "settings"],            userCount: 5  },
  { id: "ROL-006", name: "Auditor",         description: "Read-only access to reports and audit logs", permissions: ["reports", "audit"],              userCount: 2  },
];

// ── Dashboard Summary ─────────────────────────────────────
const DASHBOARD = {
  stats: {
    totalRevenue:    { value: 428500,  trend: "up",   trendValue: 14.8 },
    netProfit:       { value: 122000,  trend: "up",   trendValue: 22.4 },
    activeProjects:  { value: 64,      trend: "up",   trendValue: 12.5 },
    satisfaction:    { value: 98,      trend: "up",   trendValue: 2.1  },
    totalEmployees:  { value: 256,     trend: "up",   trendValue: 5.0  },
    openLeaves:      { value: 16,      trend: "down", trendValue: 3.2  },
  },
  recentActivity: [
    { id: 1, user: "Sarah Miller",  action: "Completed Project Audit",       time: "5m ago",  type: "project" },
    { id: 2, user: "Alex Chen",     action: "Approved Invoice #402",          time: "12m ago", type: "finance" },
    { id: 3, user: "System",        action: "New inventory sync completed",   time: "25m ago", type: "system"  },
    { id: 4, user: "John Doe",      action: "Added 5 new employees",          time: "1h ago",  type: "hr"      },
  ],
  topProjects: [
    { name: "Global Cloud Migration", progress: 85, status: "Healthy"   },
    { name: "Blockchain Integration",  progress: 45, status: "At Risk"   },
    { name: "ERP v2.0 Rollout",        progress: 92, status: "Excellent" },
  ],
  monthlyRevenue: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    revenue: [28000,35000,42000,38000,52000,48000,55000,61000,58000,70000,65000,78000],
    expenses:[18000,22000,28000,25000,32000,30000,35000,38000,36000,42000,40000,48000],
  },
};

module.exports = {
  USERS, EMPLOYEES, DEPARTMENTS, DESIGNATIONS, ATTENDANCE,
  LEAVES, PAYROLL, INVENTORY, TRANSACTIONS, INVOICES, EXPENSES,
  INCOME, ACCOUNTS, PAYMENTS, VENDORS, ASSETS, BUDGETS,
  TAX_RECORDS, PROJECTS, APPROVALS, AUDIT_LOGS, ROLES, DASHBOARD,
};
