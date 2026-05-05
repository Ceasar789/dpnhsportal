// ============================================
// FILE: src/pages/dashboards/TeacherDashboard.jsx
// PURPOSE: Teacher Dashboard — Sidebar + Top Header Design
// ROLE: teacher only
// FEATURES: Overview, Students, Lesson Plans, Worksheets, Assignments, Grades, Attendance, Announcements
// DESIGN: White sidebar (like Admin Portal) + compact top header
// ============================================

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Users, BookOpen, FileText, GraduationCap,
  CalendarCheck, Megaphone, Search, Trash2, X, Check,
  Plus, Upload, Moon, Sun, LogOut, Menu,
  LayoutDashboard, ClipboardList, ChevronRight, Bell
} from 'lucide-react';

// ============================================
// THEME CONTEXT
// ============================================
const ThemeContext = createContext({ dark: false, toggleDark: () => {} });
const useTheme = () => useContext(ThemeContext);

// ============================================
// MAIN TEACHER DASHBOARD
// ============================================
const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { isTeacher } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!isTeacher()) {
      navigate('/', { replace: true });
    }
  }, [isTeacher, navigate]);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark(d => !d) }}>
      <TeacherLayout>
        <Routes>
          <Route path="/" element={<TeacherOverviewTab />} />
          <Route path="/students" element={<StudentsTab />} />
          <Route path="/lesson-plans" element={<LessonPlansTab />} />
          <Route path="/worksheets" element={<WorksheetsTab />} />
          <Route path="/assignments" element={<AssignmentsTab />} />
          <Route path="/grades" element={<GradesTab />} />
          <Route path="/attendance" element={<TeacherAttendanceTab />} />
          <Route path="/announcements" element={<TeacherAnnouncementsTab />} />
        </Routes>
      </TeacherLayout>
    </ThemeContext.Provider>
  );
};

// ============================================
// TEACHER LAYOUT (Sidebar + Top Header)
// ============================================
const TeacherLayout = ({ children }) => {
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
    { path: '/teacher-dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/teacher-dashboard/students', icon: Users, label: 'Students' },
    { path: '/teacher-dashboard/lesson-plans', icon: BookOpen, label: 'Lesson Plans' },
    { path: '/teacher-dashboard/worksheets', icon: ClipboardList, label: 'Worksheets' },
    { path: '/teacher-dashboard/assignments', icon: FileText, label: 'Assignments' },
    { path: '/teacher-dashboard/grades', icon: GraduationCap, label: 'Grades' },
    { path: '/teacher-dashboard/attendance', icon: CalendarCheck, label: 'Attendance' },
    { path: '/teacher-dashboard/announcements', icon: Megaphone, label: 'Announcements' },
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
            <p className="text-gray-400 text-[10px]">Teacher Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
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
                {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
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
              title={userData?.name || 'Teacher'}
            >
              {(userData?.name || 'T')[0].toUpperCase()}
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
// SHARED CARD COMPONENT
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

// ============================================
// SHARED INPUT
// ============================================
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

// ============================================
// SHARED TABLE
// ============================================
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

// ============================================
// MODAL
// ============================================
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

// ============================================
// STAT CARD
// ============================================
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

// ============================================
// BADGE
// ============================================
const Badge = ({ children, color, bg }) => (
  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
    style={{ backgroundColor: bg, color }}>
    {children}
  </span>
);

// ============================================
// BTN
// ============================================
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
// TEACHER OVERVIEW TAB
// ============================================
const TeacherOverviewTab = () => {
  const { dark } = useTheme();
  const stats = [
    { label: 'Students', value: '38', sub: 'Grade 9 — Section A', icon: Users },
    { label: 'Assignments', value: '12', sub: '4 pending review', icon: FileText, subColor: '#16a34a' },
    { label: 'Attendance', value: '94%', sub: 'This week', icon: CalendarCheck },
    { label: 'Avg. Grade', value: '87.4', sub: '+2.1 vs last month', icon: GraduationCap, subColor: '#16a34a' },
  ];

  const activeAssignments = [
    { title: 'Essay: Romeo & Juliet', date: 'May 3', status: 'Due Today', statusColor: '#ef4444', statusBg: 'rgba(239,68,68,0.12)' },
    { title: 'Math Problem Set 7', date: 'May 6', status: 'Open', statusColor: '#d97706', statusBg: 'rgba(217,119,6,0.12)' },
    { title: 'Science Lab Report', date: 'Apr 30', status: 'Graded', statusColor: '#16a34a', statusBg: 'rgba(22,163,74,0.12)' },
    { title: 'History Timeline', date: 'May 9', status: 'Open', statusColor: '#d97706', statusBg: 'rgba(217,119,6,0.12)' },
  ];

  const recentActivity = [
    { text: 'Juan dela Cruz submitted Essay draft', time: '2 min ago', color: '#3b82f6' },
    { text: 'Lesson Plan generated from PDF upload', time: '18 min ago', color: '#10b981' },
    { text: 'Maria Santos marked absent', time: '1 hr ago', color: '#ef4444' },
    { text: 'New announcement posted', time: '2 hrs ago', color: '#f59e0b' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Dashboard Overview</h2>
        <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Academic Year 2025–2026 · Last updated: today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: dark ? '#64748b' : '#94a3b8' }}>Active Assignments</h2>
          <div className="space-y-3">
            {activeAssignments.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: dark ? '#334155' : '#f1f5f9' }}>
                <div className="flex items-center gap-3">
                  <Badge color={item.statusColor} bg={item.statusBg}>{item.status}</Badge>
                  <span className="text-sm font-medium" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{item.title}</span>
                </div>
                <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{item.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: dark ? '#64748b' : '#94a3b8' }}>Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-sm" style={{ color: dark ? '#cbd5e1' : '#374151' }}>{item.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: dark ? '#64748b' : '#94a3b8' }}>Class Progress</h2>
        {[
          { label: 'Assignments Submitted', value: 30, total: 38, color: '#3b82f6' },
          { label: 'Attendance Rate', value: 36, total: 38, color: '#10b981' },
          { label: 'Passing Grades', value: 34, total: 38, color: '#f59e0b' },
        ].map((item, idx) => (
          <div key={idx} className="mb-4 last:mb-0">
            <div className="flex justify-between mb-1">
              <span className="text-sm" style={{ color: dark ? '#cbd5e1' : '#374151' }}>{item.label}</span>
              <span className="text-sm font-semibold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{item.value}/{item.total}</span>
            </div>
            <div className="h-2 rounded-full" style={{ backgroundColor: dark ? '#334155' : '#e2e8f0' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${(item.value / item.total) * 100}%`, backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ============================================
// STUDENTS TAB
// ============================================
const StudentsTab = () => {
  const { dark } = useTheme();
  const [studentList, setStudentList] = useState([
    { id: 1, lrn: '123456789012', name: 'Juan dela Cruz', email: 'juan@school.edu', status: 'Active' },
    { id: 2, lrn: '123456789013', name: 'Maria Santos', email: 'maria@school.edu', status: 'Active' },
    { id: 3, lrn: '123456789014', name: 'Jose Reyes', email: 'jose@school.edu', status: 'Inactive' },
    { id: 4, lrn: '123456789015', name: 'Ana Lim', email: 'ana@school.edu', status: 'Active' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ lrn: '', name: '', email: '', status: 'Active' });

  const handleAddStudent = (e) => {
    e.preventDefault();
    setStudentList([...studentList, { id: Date.now(), ...formData }]);
    setFormData({ lrn: '', name: '', email: '', status: 'Active' });
    setShowAddModal(false);
  };

  const filtered = studentList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.lrn.includes(searchQuery)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Students — Grade 9A</h1>
        <Btn onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Student</Btn>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: dark ? '#1e293b' : '#ffffff',
            border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
            color: dark ? '#f1f5f9' : '#1a2b4a'
          }}
        />
      </div>

      <Card>
        <Table headers={['#', 'Name', 'LRN', 'Email', 'Status', 'Actions']}>
          {filtered.map((s, i) => (
            <TR key={s.id}>
              <TD>{i + 1}</TD>
              <TD><span className="font-medium" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{s.name}</span></TD>
              <TD>{s.lrn}</TD>
              <TD>{s.email}</TD>
              <TD>
                <Badge
                  color={s.status === 'Active' ? '#16a34a' : '#dc2626'}
                  bg={s.status === 'Active' ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)'}
                >
                  {s.status}
                </Badge>
              </TD>
              <TD>
                <div className="flex gap-3">
                  <button className="text-xs text-blue-500 hover:text-blue-700 font-medium">Edit</button>
                  <button onClick={() => setStudentList(studentList.filter(x => x.id !== s.id))}
                    className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </Card>

      {showAddModal && (
        <Modal title="Add New Student" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
            {[
              { label: 'LRN', key: 'lrn', type: 'text' },
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{label}</label>
                <Input type={type} required value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
              </div>
            ))}
            <button type="submit" className="w-full h-10 rounded-lg text-white text-sm font-semibold hover:opacity-90 mt-1"
              style={{ backgroundColor: '#1e3a5f' }}>Add Student</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ============================================
// LESSON PLANS TAB
// ============================================
const LessonPlansTab = () => {
  const { dark } = useTheme();
  const previousPlans = [
    { title: 'Photosynthesis & Cell Energy', date: 'Apr 28', ai: true },
    { title: 'The Philippine Revolution', date: 'Apr 21', ai: false },
    { title: 'Linear Equations & Graphing', date: 'Apr 14', ai: true },
    { title: 'Figurative Language in Poetry', date: 'Apr 7', ai: false },
    { title: 'Plate Tectonics', date: 'Mar 31', ai: true },
  ];

  const generatedPlan = {
    title: 'The Human Respiratory System',
    subject: 'Science 9', duration: '60 minutes',
    date: 'May 6, 2026', strategy: 'Cooperative Learning',
    objectives: [
      'Identify the parts of the respiratory system',
      'Explain how gas exchange occurs in the lungs',
      'Relate respiratory function to overall body health'
    ]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Lesson Plans</h1>
        <Badge color="#16a34a" bg="rgba(22,163,74,0.12)">AI-Powered Generation</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-8 text-center" style={{ border: `1px dashed ${dark ? '#475569' : '#cbd5e1'}` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: dark ? '#0f172a' : '#eff6ff' }}>
              <Upload size={24} className="text-blue-500" />
            </div>
            <p className="font-semibold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Upload curriculum PDF</p>
            <p className="text-xs mb-4" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
              Drop your syllabus or textbook chapter — AI will auto-generate a structured lesson plan
            </p>
            <Btn variant="outline">Choose PDF file</Btn>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{generatedPlan.title}</h3>
              <Badge color="#3b82f6" bg="rgba(59,130,246,0.12)">AI Generated</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[['Subject', generatedPlan.subject], ['Duration', generatedPlan.duration], ['Date', generatedPlan.date], ['Strategy', generatedPlan.strategy]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs uppercase mb-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{k}</p>
                  <p className="text-sm" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{v}</p>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-xs uppercase mb-2" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Learning Objectives</p>
              {generatedPlan.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm" style={{ color: dark ? '#cbd5e1' : '#374151' }}>{obj}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Btn variant="outline">Save plan</Btn>
              <Btn variant="outline">Edit</Btn>
              <Btn variant="outline">Regenerate</Btn>
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: dark ? '#64748b' : '#94a3b8' }}>Previous Plans</h2>
          <div className="space-y-3">
            {previousPlans.map((plan, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                <div className="w-8 h-10 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}>
                  <span className="text-xs font-bold text-red-500">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{plan.title}</p>
                  <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{plan.date}</p>
                </div>
                {plan.ai && <Badge color="#16a34a" bg="rgba(22,163,74,0.12)">AI</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================
// WORKSHEETS TAB
// ============================================
const WorksheetsTab = () => {
  const { dark } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'English', 'Math', 'Science', 'Filipino', 'Araling Panlipunan'];
  const stats = [
    { label: 'Total Worksheets', value: '24' },
    { label: 'Distributed', value: '18', color: '#16a34a' },
    { label: 'Drafts', value: '6', color: '#d97706' },
  ];
  const worksheetList = [
    { title: 'Parts of Speech — Nouns & Verbs', subject: 'English', pages: '2 pages', items: '20 items', status: 'Distributed', statusColor: '#16a34a', statusBg: 'rgba(22,163,74,0.12)' },
    { title: 'Photosynthesis Fill-in-the-Blank', subject: 'Science', pages: '1 page', items: '15 items', status: 'Distributed', statusColor: '#16a34a', statusBg: 'rgba(22,163,74,0.12)' },
    { title: 'Linear Equations Practice Set', subject: 'Math', pages: '3 pages', items: '30 items', status: 'Draft', statusColor: '#d97706', statusBg: 'rgba(217,119,6,0.12)' },
    { title: 'Tayutay at Idyoma — Pagsasanay', subject: 'Filipino', pages: '2 pages', items: '25 items', status: 'Distributed', statusColor: '#16a34a', statusBg: 'rgba(22,163,74,0.12)' },
    { title: 'Rebolusyong Pilipino — Timeline', subject: 'AP', pages: '2 pages', items: '18 items', status: 'Distributed', statusColor: '#16a34a', statusBg: 'rgba(22,163,74,0.12)' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Worksheets</h1>
        <div className="flex gap-3">
          <Btn><Plus size={16} /> Create</Btn>
          <Btn variant="primary"><Upload size={16} /> Upload</Btn>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-4">
            <p className="text-xs mb-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color || (dark ? '#f1f5f9' : '#1a2b4a') }}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: activeFilter === f ? '#1e3a5f' : (dark ? '#1e293b' : '#ffffff'),
              border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
              color: activeFilter === f ? '#ffffff' : (dark ? '#94a3b8' : '#64748b')
            }}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {worksheetList.map((ws, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-14 rounded flex items-center justify-center"
                style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc' }}>
                <FileText size={20} style={{ color: '#3b82f6' }} />
              </div>
              <Badge color={ws.statusColor} bg={ws.statusBg}>{ws.status}</Badge>
            </div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{ws.title}</h3>
            <p className="text-xs mb-3" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{ws.subject} · {ws.pages} · {ws.items}</p>
            <div className="flex gap-2">
              <button className="flex-1 h-8 rounded-lg text-xs font-semibold transition-colors"
                style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc', color: dark ? '#cbd5e1' : '#374151', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>
                Distribute
              </button>
              <button className="flex-1 h-8 rounded-lg text-xs font-semibold transition-colors"
                style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc', color: dark ? '#cbd5e1' : '#374151', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>
                Preview
              </button>
            </div>
          </Card>
        ))}
        <Card className="p-4 flex flex-col items-center justify-center text-center"
          style={{ border: `1px dashed ${dark ? '#475569' : '#cbd5e1'}` }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
            style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc' }}>
            <Plus size={20} style={{ color: '#94a3b8' }} />
          </div>
          <p className="text-sm mb-1" style={{ color: dark ? '#94a3b8' : '#64748b' }}>New worksheet</p>
          <p className="text-xs mb-3" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Create from scratch or upload</p>
          <div className="flex gap-2 w-full">
            <button className="flex-1 h-8 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: '#1e3a5f', color: '#ffffff' }}>Create</button>
            <button className="flex-1 h-8 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc', color: dark ? '#cbd5e1' : '#374151', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>Upload</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================
// ASSIGNMENTS TAB
// ============================================
const AssignmentsTab = () => {
  const { dark } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Open', 'Due today', 'Graded', 'Draft'];
  const assignmentList = [
    { title: 'Essay: Romeo & Juliet', subject: 'English 9', dueDate: 'May 3, 2026', submitted: '30/38', status: 'Due Today', statusColor: '#ef4444', statusBg: 'rgba(239,68,68,0.12)', action: 'Review' },
    { title: 'Math Problem Set 7', subject: 'Mathematics', dueDate: 'May 6, 2026', submitted: '17/38', status: 'Open', statusColor: '#d97706', statusBg: 'rgba(217,119,6,0.12)', action: 'View' },
    { title: 'Science Lab Report', subject: 'Science 9', dueDate: 'Apr 30, 2026', submitted: '38/38', status: 'Graded', statusColor: '#16a34a', statusBg: 'rgba(22,163,74,0.12)', action: 'Results' },
    { title: 'History Timeline Activity', subject: 'Araling Panlipunan', dueDate: 'May 9, 2026', submitted: '3/38', status: 'Open', statusColor: '#d97706', statusBg: 'rgba(217,119,6,0.12)', action: 'View' },
    { title: 'Filipino Tula (Draft)', subject: 'Filipino 9', dueDate: 'May 14, 2026', submitted: '0/38', status: 'Draft', statusColor: '#94a3b8', statusBg: 'rgba(148,163,184,0.12)', action: 'Edit' },
  ];
  const submissionList = [
    { name: 'Juan C.', file: 'essay_final.pdf', time: '2 min ago' },
    { name: 'Sofia R.', file: 'romeo_essay.docx', time: '15 min ago' },
    { name: 'Marco T.', file: 'assignment1.pdf', time: '1 hr ago' },
    { name: 'Ana P.', file: 'ana_essay.pdf', time: '2 hrs ago' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Assignments</h1>
        <Btn><Plus size={16} /> New assignment</Btn>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: activeFilter === f ? '#1e3a5f' : (dark ? '#1e293b' : '#ffffff'),
              border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
              color: activeFilter === f ? '#ffffff' : (dark ? '#94a3b8' : '#64748b')
            }}>
            {f}
          </button>
        ))}
      </div>

      <Card className="mb-6">
        <Table headers={['Title', 'Subject', 'Due Date', 'Submitted', 'Status', 'Actions']}>
          {assignmentList.map((a, i) => (
            <TR key={i}>
              <TD><span className="font-medium" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{a.title}</span></TD>
              <TD>{a.subject}</TD>
              <TD style={{ color: a.status === 'Due Today' ? '#ef4444' : undefined }}>{a.dueDate}</TD>
              <TD>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: dark ? '#334155' : '#e2e8f0' }}>
                    <div className="h-full rounded-full bg-blue-500"
                      style={{ width: `${(parseInt(a.submitted) / 38) * 100}%` }} />
                  </div>
                  <span className="text-xs">{a.submitted}</span>
                </div>
              </TD>
              <TD><Badge color={a.statusColor} bg={a.statusBg}>{a.status}</Badge></TD>
              <TD><button className="text-xs text-blue-500 hover:text-blue-700 font-medium">{a.action}</button></TD>
            </TR>
          ))}
        </Table>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: dark ? '#64748b' : '#94a3b8' }}>Recent Submissions — Essay: Romeo & Juliet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {submissionList.map((sub, idx) => (
            <div key={idx} className="rounded-lg p-3"
              style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>
              <p className="text-sm font-medium mb-0.5" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{sub.name}</p>
              <p className="text-xs text-blue-500 mb-1">{sub.file}</p>
              <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{sub.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ============================================
// GRADES TAB
// ============================================
const GradesTab = () => {
  const { dark } = useTheme();
  const gradeList = [
    { name: 'Juan dela Cruz', english: 92, math: 88, science: 91, filipino: 89, gwa: 90.0, remarks: 'Passed' },
    { name: 'Maria Santos', english: 85, math: 79, science: 83, filipino: 88, gwa: 83.8, remarks: 'Passed' },
    { name: 'Jose Reyes', english: 72, math: 68, science: 75, filipino: 74, gwa: 72.3, remarks: 'Needs Improvement' },
    { name: 'Ana Lim', english: 95, math: 94, science: 97, filipino: 93, gwa: 94.8, remarks: 'Passed' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Grades — Q3 Report</h1>
        <Btn><Download size={16} /> Export</Btn>
      </div>
      <Card>
        <Table headers={['Student', 'English', 'Math', 'Science', 'Filipino', 'GWA', 'Remarks']}>
          {gradeList.map((g, i) => (
            <TR key={i}>
              <TD><span className="font-medium" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{g.name}</span></TD>
              <TD>{g.english}</TD>
              <TD>{g.math}</TD>
              <TD>{g.science}</TD>
              <TD>{g.filipino}</TD>
              <TD>
                <span className="font-bold" style={{ color: g.gwa >= 75 ? '#16a34a' : '#dc2626' }}>
                  {g.gwa.toFixed(1)}
                </span>
              </TD>
              <TD>
                <Badge
                  color={g.remarks === 'Passed' ? '#16a34a' : '#d97706'}
                  bg={g.remarks === 'Passed' ? 'rgba(22,163,74,0.12)' : 'rgba(217,119,6,0.12)'}
                >
                  {g.remarks}
                </Badge>
              </TD>
            </TR>
          ))}
        </Table>
      </Card>
    </div>
  );
};

// missing import fix
const Download = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ============================================
// ATTENDANCE TAB
// ============================================
const TeacherAttendanceTab = () => {
  const { dark } = useTheme();
  const [attendanceData, setAttendanceData] = useState([
    { name: 'Juan dela Cruz', apr29: 'P', apr30: 'P', may2: 'P', may3: 'P', rate: '100%' },
    { name: 'Maria Santos', apr29: 'P', apr30: 'A', may2: 'P', may3: 'A', rate: '75%' },
    { name: 'Jose Reyes', apr29: 'L', apr30: 'P', may2: 'P', may3: 'P', rate: '94%' },
    { name: 'Ana Lim', apr29: 'P', apr30: 'P', may2: 'P', may3: 'P', rate: '100%' },
  ]);

  const toggleStatus = (idx, field) => {
    const order = ['P', 'A', 'L'];
    setAttendanceData(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      const nextIdx = (order.indexOf(row[field]) + 1) % order.length;
      return { ...row, [field]: order[nextIdx] };
    }));
  };

  const getBadgeStyle = (status) => {
    if (status === 'P') return { bg: 'rgba(22,163,74,0.12)', color: '#16a34a' };
    if (status === 'A') return { bg: 'rgba(220,38,38,0.12)', color: '#dc2626' };
    return { bg: 'rgba(217,119,6,0.12)', color: '#d97706' };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Attendance — May 3, 2026</h1>
        <Btn>Save records</Btn>
      </div>
      <Card>
        <Table headers={['Student', 'Apr 29', 'Apr 30', 'May 2', 'May 3 (Today)', 'Rate']}>
          {attendanceData.map((row, idx) => (
            <TR key={idx}>
              <TD><span className="font-medium" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{row.name}</span></TD>
              {['apr29', 'apr30', 'may2', 'may3'].map(field => {
                const s = getBadgeStyle(row[field]);
                return (
                  <td key={field} className="px-5 py-3.5">
                    <button onClick={() => toggleStatus(idx, field)}
                      className="w-8 h-8 rounded-full text-xs font-bold transition-colors"
                      style={{ backgroundColor: s.bg, color: s.color }}>
                      {row[field]}
                    </button>
                  </td>
                );
              })}
              <TD><span className="font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{row.rate}</span></TD>
            </TR>
          ))}
        </Table>
      </Card>
    </div>
  );
};

// ============================================
// ANNOUNCEMENTS TAB
// ============================================
const TeacherAnnouncementsTab = () => {
  const { dark } = useTheme();
  const [announcementList, setAnnouncementList] = useState([
    { id: 1, title: 'No classes on May 12 — Independence Day', content: 'School is suspended on May 12, 2026 in observance of Philippine Independence Day. All pending submissions have been extended by one day.', date: 'May 3', tag: 'Holiday', tagColor: '#3b82f6', tagBg: 'rgba(59,130,246,0.12)' },
    { id: 2, title: 'Essay deadline reminder — Romeo & Juliet', content: 'Please submit your essays via the portal by 11:59 PM today. Late submissions will receive point deductions.', date: 'May 2', tag: 'Urgent', tagColor: '#dc2626', tagBg: 'rgba(220,38,38,0.12)' },
    { id: 3, title: 'Quarter 4 parent-teacher conference schedule', content: "PTC is scheduled for May 17, 2026. Please inform your parents to confirm attendance via the school's SMS system.", date: 'Apr 28', tag: 'Event', tagColor: '#16a34a', tagBg: 'rgba(22,163,74,0.12)' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', tag: 'Event' });

  const tagColors = {
    Holiday: { tagColor: '#3b82f6', tagBg: 'rgba(59,130,246,0.12)' },
    Urgent: { tagColor: '#dc2626', tagBg: 'rgba(220,38,38,0.12)' },
    Event: { tagColor: '#16a34a', tagBg: 'rgba(22,163,74,0.12)' },
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setAnnouncementList([{
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...tagColors[formData.tag]
    }, ...announcementList]);
    setFormData({ title: '', content: '', tag: 'Event' });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Announcements</h1>
        <Btn onClick={() => setShowAddModal(true)}><Plus size={16} /> Post announcement</Btn>
      </div>

      <div className="space-y-4">
        {announcementList.map(a => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge color={a.tagColor} bg={a.tagBg}>{a.tag}</Badge>
                  <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{a.date}</span>
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{a.title}</h3>
                <p className="text-sm" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{a.content}</p>
              </div>
              <button onClick={() => setAnnouncementList(announcementList.filter(x => x.id !== a.id))}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                <Trash2 size={18} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {showAddModal && (
        <Modal title="Post Announcement" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? '#94a3b8' : '#64748b' }}>Title</label>
              <Input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? '#94a3b8' : '#64748b' }}>Content</label>
              <textarea required rows={4} value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                style={{
                  backgroundColor: dark ? '#0f172a' : '#f8fafc',
                  border: `1px solid ${dark ? '#334155' : '#cbd5e1'}`,
                  color: dark ? '#f1f5f9' : '#1a2b4a'
                }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? '#94a3b8' : '#64748b' }}>Tag</label>
              <select value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })}
                className="w-full h-10 px-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: dark ? '#0f172a' : '#f8fafc',
                  border: `1px solid ${dark ? '#334155' : '#cbd5e1'}`,
                  color: dark ? '#f1f5f9' : '#1a2b4a'
                }}>
                <option>Holiday</option>
                <option>Urgent</option>
                <option>Event</option>
              </select>
            </div>
            <button type="submit" className="w-full h-10 rounded-lg text-white text-sm font-semibold hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}>Post Announcement</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TeacherDashboard;