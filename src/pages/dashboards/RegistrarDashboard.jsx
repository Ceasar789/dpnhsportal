// ============================================
// FILE: src/pages/dashboards/RegistrarDashboard.jsx
// PURPOSE: Registrar Dashboard — TeacherDashboard design applied
// ROLE: registrar only
// SCREENS: Overview, Pre-Enrollment, Students, Scheduling, Documents, Analytics
// ============================================

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, ClipboardList, Calendar, FileText, BarChart2,
  Search, Moon, Sun, LogOut, Menu, ChevronRight, Check, X, Plus,
  Settings, HelpCircle, MoreHorizontal, MessageSquare, RotateCcw
} from 'lucide-react';

// ============================================
// THEME CONTEXT
// ============================================
const ThemeContext = createContext({ dark: false, toggleDark: () => {} });
const useTheme = () => useContext(ThemeContext);

// ============================================
// MAIN REGISTRAR DASHBOARD
// ============================================
const RegistrarDashboard = () => {
  const navigate = useNavigate();
  const { isRegistrar } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!isRegistrar()) {
      navigate('/', { replace: true });
    }
  }, [isRegistrar, navigate]);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark(d => !d) }}>
      <RegistrarLayout>
        <Routes>
          <Route path="/" element={<RegistrarOverviewTab />} />
          <Route path="/students" element={<RegistrarStudentsTab />} />
          <Route path="/pre-enrollment" element={<RegistrarPreEnrollmentTab />} />
          <Route path="/scheduling" element={<RegistrarSchedulingTab />} />
          <Route path="/documents" element={<RegistrarDocumentsTab />} />
          <Route path="/analytics" element={<RegistrarAnalyticsTab />} />
        </Routes>
      </RegistrarLayout>
    </ThemeContext.Provider>
  );
};

// ============================================
// REGISTRAR LAYOUT (Sidebar + Top Header)
// ============================================
const RegistrarLayout = ({ children }) => {
  const { dark, toggleDark } = useTheme();
  const { logout, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/registrar-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/registrar-dashboard/students', icon: Users, label: 'Student Records' },
    { path: '/registrar-dashboard/pre-enrollment', icon: ClipboardList, label: 'Pre-Enrollment' },
    { path: '/registrar-dashboard/scheduling', icon: Calendar, label: 'Scheduling' },
    { path: '/registrar-dashboard/documents', icon: FileText, label: 'Documents' },
    { path: '/registrar-dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  ];

  const mainBg = dark ? '#0f172a' : '#f1f5f9';
  const headerBorder = dark ? '#334155' : '#e2e8f0';
  const textPrimary = dark ? '#f1f5f9' : '#1a2b4a';
  const textMuted = dark ? '#94a3b8' : '#64748b';

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col bg-white
          transform transition-transform duration-300 ease-in-out shadow-sm
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo + School Name */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img 
              src="/capstonelogo.png" 
              alt="School Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="font-bold text-[#1e3a5f] text-lg">D</span>';
              }}
            />
          </div>
          <div>
            <p className="text-[#1a2b4a] font-bold text-sm leading-tight">Dela Paz National High School</p>
            <p className="text-gray-400 text-[10px]">Registrar Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname === item.path + '/';
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all mb-0.5
                  ${isActive
                    ? 'bg-blue-50 text-[#1e3a5f] font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#1a2b4a]'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-[#1e3a5f]" />}
              </Link>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="p-5 border-t border-gray-100">
          <div className="flex items-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-xs text-gray-400">All systems online</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER */}
        <header
          className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0 bg-white"
          style={{ borderColor: headerBorder }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors text-gray-400 hover:text-[#1a2b4a]"
            >
              <Menu size={20} />
            </button>

            {/* Page title */}
            <div className="hidden sm:block">
              <h1 className="text-base font-bold" style={{ color: textPrimary }}>
                {navItems.find(n => location.pathname === n.path || location.pathname === n.path + '/')?.label || 'Dashboard'}
              </h1>
              <p className="text-xs" style={{ color: textMuted }}>
                Academic Year 2025–2026 · Last updated: today
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full transition-colors hover:bg-gray-100 text-gray-400"
            >
              <Search size={18} />
            </button>

            <button
              onClick={toggleDark}
              className="p-2 rounded-full transition-colors hover:bg-gray-100 text-gray-400"
              title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold cursor-default"
              style={{ backgroundColor: '#1e3a5f', color: '#FEB300' }}
              title={userData?.name || 'Registrar'}
            >
              {(userData?.name || 'R')[0].toUpperCase()}
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-gray-500 hover:bg-gray-50 border border-gray-200"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: mainBg }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

// ============================================
// SHARED COMPONENTS
// ============================================
const Card = ({ children, className = '', style = {} }) => {
  const { dark } = useTheme();
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        backgroundColor: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

const Input = ({ className = '', ...props }) => {
  const { dark } = useTheme();
  return (
    <input
      className={`w-full h-10 px-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      style={{
        backgroundColor: dark ? '#0f172a' : '#f8fafc',
        border: `1px solid ${dark ? '#334155' : '#cbd5e1'}`,
        color: dark ? '#f1f5f9' : '#1a2b4a',
      }}
      {...props}
    />
  );
};

const Table = ({ headers, children }) => {
  const { dark } = useTheme();
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc' }}>
            {headers.map(h => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                style={{ color: dark ? '#64748b' : '#94a3b8' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ borderTop: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>
          {children}
        </tbody>
      </table>
    </div>
  );
};

const TR = ({ children }) => {
  const { dark } = useTheme();
  return (
    <tr
      className="transition-colors"
      style={{ borderBottom: `1px solid ${dark ? '#334155' : '#f1f5f9'}` }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = dark ? '#0f172a' : '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {children}
    </tr>
  );
};

const TD = ({ children, className = '' }) => {
  const { dark } = useTheme();
  return (
    <td className={`px-5 py-3.5 text-sm ${className}`} style={{ color: dark ? '#cbd5e1' : '#475569' }}>
      {children}
    </td>
  );
};

const Modal = ({ title, onClose, children }) => {
  const { dark } = useTheme();
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="rounded-xl w-full max-w-md shadow-2xl"
        style={{ backgroundColor: dark ? '#1e293b' : '#ffffff', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: dark ? '#334155' : '#e2e8f0' }}>
          <h2 className="text-lg font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, subColor, icon: Icon }) => {
  const { dark } = useTheme();
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: dark ? '#0f172a' : '#eff6ff' }}>
            <Icon size={16} style={{ color: '#3b82f6' }} />
          </div>
        )}
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{value}</p>
      <p className="text-xs" style={{ color: subColor || (dark ? '#64748b' : '#94a3b8') }}>
        {sub}
      </p>
    </Card>
  );
};

const Badge = ({ children, color, bg }) => (
  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
    style={{ backgroundColor: bg, color }}>
    {children}
  </span>
);

const Btn = ({ children, onClick, className = '', variant = 'default' }) => {
  const variants = {
    default: { backgroundColor: '#1e3a5f', color: '#ffffff' },
    outline: { backgroundColor: 'transparent', color: '#64748b', border: '1px solid #e2e8f0' },
    primary: { backgroundColor: '#2563eb', color: '#ffffff' },
    danger: { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 ${className}`}
      style={variants[variant]}
    >
      {children}
    </button>
  );
};

// ============================================
// REGISTRAR OVERVIEW TAB
// ============================================
const RegistrarOverviewTab = () => {
  const { dark } = useTheme();
  const stats = [
    { label: 'Total Students', value: '4,821', sub: '▲ 3.2% from last sem', icon: Users, subColor: '#16a34a' },
    { label: 'Pending Pre-Enroll', value: '247', sub: 'Needs attention', icon: ClipboardList, subColor: '#d97706' },
    { label: 'Enrolled This Sem', value: '3,590', sub: '74.5% enrollment rate', icon: Check, subColor: '#16a34a' },
    { label: 'Docs for Review', value: '89', sub: '12 urgent', icon: FileText, subColor: '#d97706' },
  ];

  const bars = [
    { dept: 'BSCS', prev: 68, curr: 55 },
    { dept: 'BSBA', prev: 55, curr: 82 },
    { dept: 'BSED', prev: 80, curr: 50 },
    { dept: 'BSN', prev: 45, curr: 74 },
  ];

  const activity = [
    { dot: '#FEB300', action: 'Pre-enroll approved', who: 'Juan D.', when: '2 min ago' },
    { dot: '#16a34a', action: 'Document verified', who: 'Maria S.', when: '8 min ago' },
    { dot: '#dc2626', action: 'Clearance flagged', who: 'Pedro R.', when: '15 min ago' },
    { dot: '#1a2b4a', action: 'New enrollment form', who: 'Ana L.', when: '22 min ago' },
  ];

  const announcements = [
    { text: 'Enrollment deadline: May 15, 2026', gold: true },
    { text: 'Grade submission extended to May 20' },
    { text: 'Faculty load review ongoing' },
    { text: 'New clearance workflow deployed' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Registrar Dashboard</h2>
        <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Academic Year 2025–2026 · Last updated: today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
              Enrollment Trend by Department
            </h2>
            <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Academic Year 2025–2026</span>
          </div>
          <div className="flex items-end gap-6 h-36">
            {bars.map(d => (
              <div key={d.dept} className="flex-1 flex flex-col items-center">
                <div className="w-full flex gap-2 items-end h-28">
                  <div className="flex-1 rounded-t" style={{ backgroundColor: '#1a2b4a', height: `${d.prev * 1.3}px` }} />
                  <div className="flex-1 rounded-t" style={{ backgroundColor: '#FEB300', height: `${d.curr * 1.3}px` }} />
                </div>
                <span className="text-xs mt-2" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{d.dept}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1a2b4a' }} />
              <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>2024–2025</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#FEB300' }} />
              <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>2025–2026</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {activity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: a.dot }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{a.action}</p>
                  <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{a.who} · {a.when}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5" style={{ backgroundColor: '#1a2b4a', border: 'none' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">Announcements</h2>
          {announcements.map((a, i) => (
            <div key={i} className="flex gap-2 items-start mb-3">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: a.gold ? '#FEB300' : '#3D5A82' }} />
              <span className="text-sm" style={{ color: a.gold ? '#FEB300' : '#C5D8EE', fontWeight: a.gold ? 600 : 400 }}>
                {a.text}
              </span>
            </div>
          ))}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Btn>+ Enroll Student</Btn>
            <Btn variant="outline">Generate Report</Btn>
            <Btn variant="outline">Review Documents</Btn>
            <Btn style={{ backgroundColor: '#FEB300', color: '#1a2b4a' }}>Process Clearance</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================
// REGISTRAR STUDENTS TAB
// ============================================
const RegistrarStudentsTab = () => {
  const { dark } = useTheme();
  const [studentList, setStudentList] = useState([
    { id: 1, studentNo: '2024-00821', name: 'Dela Cruz, Juan M.', course: 'BSCS', year: '2nd', status: 'Enrolled', date: 'May 2' },
    { id: 2, studentNo: '2025-00134', name: 'Santos, Maria C.', course: 'BSN', year: '1st', status: 'Enrolled', date: 'May 2' },
    { id: 3, studentNo: '2025-00215', name: 'Reyes, Pedro L.', course: 'BSBA', year: '1st', status: 'Pending', date: 'May 1' },
    { id: 4, studentNo: '2025-00301', name: 'Lim, Ana B.', course: 'BSED', year: '1st', status: 'Enrolled', date: 'Apr 30' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = studentList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentNo.includes(searchQuery)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Student Records</h1>
        <Btn><Plus size={16} /> Add Student</Btn>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
        <Input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <Table headers={['Student No.', 'Name', 'Course', 'Year', 'Status', 'Date']}>
          {filtered.map((s) => (
            <TR key={s.id}>
              <TD>{s.studentNo}</TD>
              <TD><span className="font-medium" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{s.name}</span></TD>
              <TD>{s.course}</TD>
              <TD>{s.year}</TD>
              <TD>
                <Badge
                  color={s.status === 'Enrolled' ? '#16a34a' : '#d97706'}
                  bg={s.status === 'Enrolled' ? 'rgba(22,163,74,0.12)' : 'rgba(217,119,6,0.12)'}
                >
                  {s.status}
                </Badge>
              </TD>
              <TD>{s.date}</TD>
            </TR>
          ))}
        </Table>
      </Card>
    </div>
  );
};

// ============================================
// REGISTRAR PRE-ENROLLMENT TAB
// ============================================
const RegistrarPreEnrollmentTab = () => {
  const { dark } = useTheme();
  const [enrollments, setEnrollments] = useState([
    {
      id: 1, initials: 'JD', avatarBg: '#1B2A4A',
      studentName: 'Dela Cruz, Juan M.', studentNo: '2024-00821',
      course: 'BSCS', year: '2nd', status: 'pending',
      submittedAt: 'May 1, 2026',
      email: 'j.delacruz@student.edu.ph', contact: '+63 917 555 0821', address: 'Quezon City',
      documents: {
        reportCard: { label: 'Form 138 (Report Card)', done: true },
        birthCert: { label: 'PSA Birth Certificate', done: true },
        goodMoral: { label: 'Good Moral Certificate', done: true },
        idPhoto: { label: '2x2 ID Photo', done: false },
        medicalCert: { label: 'Medical Certificate', done: false },
        certEnroll: { label: 'Certificate of Enrollment', done: true },
      },
    },
    {
      id: 2, initials: 'MS', avatarBg: '#2D6A4F',
      studentName: 'Santos, Maria C.', studentNo: '2025-00134',
      course: 'BSN', year: '1st', status: 'approved',
      submittedAt: 'Apr 30, 2026',
      email: 'm.santos@student.edu.ph', contact: '+63 998 765 4321', address: 'Makati City',
      documents: {
        reportCard: { label: 'Form 138 (Report Card)', done: true },
        birthCert: { label: 'PSA Birth Certificate', done: true },
        goodMoral: { label: 'Good Moral Certificate', done: true },
        idPhoto: { label: '2x2 ID Photo', done: true },
        medicalCert: { label: 'Medical Certificate', done: true },
        certEnroll: { label: 'Certificate of Enrollment', done: true },
      },
    },
    {
      id: 3, initials: 'PR', avatarBg: '#7A3A3A',
      studentName: 'Reyes, Pedro L.', studentNo: '2025-00215',
      course: 'BSBA', year: '1st', status: 'incomplete',
      submittedAt: 'Apr 29, 2026',
      email: 'p.reyes@student.edu.ph', contact: '+63 911 222 3344', address: 'Pasig City',
      documents: {
        reportCard: { label: 'Form 138 (Report Card)', done: true },
        birthCert: { label: 'PSA Birth Certificate', done: false },
        goodMoral: { label: 'Good Moral Certificate', done: false },
        idPhoto: { label: '2x2 ID Photo', done: true },
        medicalCert: { label: 'Medical Certificate', done: false },
        certEnroll: { label: 'Certificate of Enrollment', done: true },
      },
    },
  ]);

  const [selected, setSelected] = useState(enrollments[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const STATUS_MAP = {
    pending: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
    approved: { bg: '#DCFCE7', color: '#15803D', label: 'Approved' },
    incomplete: { bg: '#FEF9C3', color: '#854D0E', label: 'Incomplete' },
  };

  const filtered = enrollments.filter(e => {
    const q = searchQuery.toLowerCase();
    return (
      (!q || e.studentName.toLowerCase().includes(q) || e.studentNo.includes(q)) &&
      (filterStatus === 'all' || e.status === filterStatus)
    );
  });

  const toggleDoc = (docKey) => {
    setEnrollments(prev => prev.map(e => {
      if (e.id !== selected.id) return e;
      return { ...e, documents: { ...e.documents, [docKey]: { ...e.documents[docKey], done: !e.documents[docKey].done } } };
    }));
  };

  const handleApprove = () => {
    const allDone = Object.values(selected.documents).every(d => d.done);
    if (!allDone) { alert('Please mark all documents as submitted before approving.'); return; }
    setEnrollments(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'approved' } : e));
  };

  const selDocs = selected ? Object.entries(selected.documents) : [];
  const doneCount = selDocs.filter(([, d]) => d.done).length;
  const totalDocs = selDocs.length;
  const pct = totalDocs > 0 ? Math.round((doneCount / totalDocs) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Pre-Enrollment</h1>
        <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Manage student pre-enrollment submissions and document requirements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Applicants', value: '247', sub: 'this semester', topColor: '#1a2b4a', valColor: '#1a2b4a' },
          { label: 'Pending Review', value: '87', sub: 'needs action', topColor: '#dc2626', valColor: '#dc2626' },
          { label: 'Approved', value: '142', sub: 'ready to enroll', topColor: '#16a34a', valColor: '#16a34a' },
          { label: 'Incomplete Docs', value: '18', sub: 'awaiting docs', topColor: '#d97706', valColor: '#d97706' },
        ].map(c => (
          <Card key={c.label} className="p-4" style={{ borderTop: `3px solid ${c.topColor}` }}>
            <p className="text-xs mb-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{c.label}</p>
            <p className="text-2xl font-bold mb-1" style={{ color: c.valColor }}>{c.value}</p>
            <p className="text-xs font-semibold" style={{ color: c.valColor }}>{c.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Application Queue */}
        <Card className="overflow-hidden">
          <div className="p-4">
            <h2 className="text-sm font-bold mb-3" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Application Queue</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {[{ val: 'all', label: `All (${enrollments.length})` }, { val: 'pending', label: 'Pending' }, { val: 'approved', label: 'Approved' }, { val: 'incomplete', label: 'Incomplete' }].map(f => (
                <button key={f.val} onClick={() => setFilterStatus(f.val)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: filterStatus === f.val ? '#1e3a5f' : (dark ? '#1e293b' : '#f1f5f9'),
                    color: filterStatus === f.val ? '#fff' : (dark ? '#94a3b8' : '#64748b')
                  }}>{f.label}</button>
              ))}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`, color: dark ? '#f1f5f9' : '#1a2b4a' }} />
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filtered.map(e => {
              const isActive = selected?.id === e.id;
              const s = STATUS_MAP[e.status];
              return (
                <div key={e.id} onClick={() => setSelected(e)}
                  className="px-4 py-3 cursor-pointer transition-colors border-t"
                  style={{
                    backgroundColor: isActive ? (dark ? '#0f172a' : '#eff6ff') : 'transparent',
                    borderColor: dark ? '#334155' : '#f1f5f9'
                  }}>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: e.avatarBg }}>{e.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold truncate" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{e.studentName}</p>
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: s.color }}>{s.label}</span>
                      </div>
                      <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{e.studentNo} · {e.course} {e.year} yr</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* RIGHT: Detail Panel */}
        {selected ? (
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="p-5 flex items-center justify-between" style={{ backgroundColor: '#1a2b4a' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border-2" style={{ backgroundColor: selected.avatarBg, borderColor: '#FEB300' }}>{selected.initials}</div>
                <div>
                  <p className="text-white font-bold text-sm">{selected.studentName}</p>
                  <p className="text-xs" style={{ color: '#8FA8C8' }}>{selected.studentNo} · {selected.course} – {selected.year} Year</p>
                </div>
              </div>
              <Badge color="#fff" bg={selected.status === 'pending' ? '#E8811A' : selected.status === 'approved' ? '#16a34a' : '#d97706'}>
                {selected.status.toUpperCase()}
              </Badge>
            </div>

            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Personal Information</p>
              <div className="grid grid-cols-[80px_1fr] gap-y-2 mb-5">
                {[['Email', selected.email], ['Contact', selected.contact], ['Address', selected.address]].map(([k, v]) => (
                  <React.Fragment key={k}>
                    <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{k}</span>
                    <span className="text-sm font-medium" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{v}</span>
                  </React.Fragment>
                ))}
              </div>

              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Document Checklist</p>
              <div className="space-y-2 mb-4">
                {selDocs.map(([key, doc]) => (
                  <div key={key} onClick={() => toggleDoc(key)}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors"
                    style={{ backgroundColor: doc.done ? (dark ? '#064e3b' : '#f0fdf4') : (dark ? '#0f172a' : '#f9fafb'), border: `1px solid ${doc.done ? (dark ? '#059669' : '#a7f3d0') : (dark ? '#334155' : '#e2e8f0')}` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: doc.done ? '#16a34a' : (dark ? '#334155' : '#cbd5e1') }}>
                        {doc.done && <Check size={12} color="#fff" strokeWidth={3} />}
                      </div>
                      <span className="text-sm font-medium" style={{ color: doc.done ? '#15803d' : (dark ? '#94a3b8' : '#64748b') }}>{doc.label}</span>
                    </div>
                    <Badge color={doc.done ? '#16a34a' : '#d97706'} bg={doc.done ? 'rgba(22,163,74,0.12)' : 'rgba(217,119,6,0.12)'}>
                      {doc.done ? 'Submitted' : 'Missing'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Completion: {doneCount} of {totalDocs} documents</span>
                  <span className="text-xs font-bold" style={{ color: pct === 100 ? '#16a34a' : '#d97706' }}>{pct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: dark ? '#334155' : '#e2e8f0' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#16a34a' : '#FEB300' }} />
                </div>
              </div>

              <div className="flex gap-3">
                <Btn onClick={handleApprove} className="flex-1 justify-center"><Check size={15} strokeWidth={3} /> Approve</Btn>
                <Btn variant="outline" className="flex-1 justify-center" onClick={() => setEnrollments(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'incomplete' } : e))}>
                  <RotateCcw size={15} /> Return
                </Btn>
                <Btn variant="outline" className="flex-1 justify-center"><MessageSquare size={15} /> Message</Btn>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="lg:col-span-2 flex items-center justify-center min-h-[400px]">
            <p style={{ color: dark ? '#64748b' : '#94a3b8' }}>Select an application to review</p>
          </Card>
        )}
      </div>
    </div>
  );
};

// ============================================
// PLACEHOLDER TABS
// ============================================
const RegistrarSchedulingTab = () => {
  const { dark } = useTheme();
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Scheduling</h1>
      <Card className="p-8 text-center">
        <Calendar size={48} className="mx-auto mb-4" style={{ color: '#94a3b8' }} />
        <p className="text-lg font-semibold mb-2" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Scheduling Module</p>
        <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Class and exam scheduling management coming soon.</p>
      </Card>
    </div>
  );
};

const RegistrarDocumentsTab = () => {
  const { dark } = useTheme();
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Documents</h1>
      <Card className="p-8 text-center">
        <FileText size={48} className="mx-auto mb-4" style={{ color: '#94a3b8' }} />
        <p className="text-lg font-semibold mb-2" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Document Management</p>
        <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Student document repository and verification.</p>
      </Card>
    </div>
  );
};

const RegistrarAnalyticsTab = () => {
  const { dark } = useTheme();
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Analytics</h1>
      <Card className="p-8 text-center">
        <BarChart2 size={48} className="mx-auto mb-4" style={{ color: '#94a3b8' }} />
        <p className="text-lg font-semibold mb-2" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Enrollment Analytics</p>
        <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Detailed reports and data visualization.</p>
      </Card>
    </div>
  );
};

export default RegistrarDashboard;