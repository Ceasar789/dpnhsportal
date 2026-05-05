// ============================================
// FILE: src/pages/dashboards/StudentDashboard.jsx
// PURPOSE: Student Dashboard — TeacherDashboard design applied
// ROLE: student only
// FEATURES: Overview, Assignments, Quizzes, Attendance, Announcements
// ============================================

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, ClipboardList, FileText, CalendarCheck, Megaphone,
  Search, Moon, Sun, LogOut, Menu, ChevronRight, Clock, CheckCircle,
  AlertTriangle, BookOpen, Bell
} from 'lucide-react';

// ============================================
// THEME CONTEXT
// ============================================
const ThemeContext = createContext({ dark: false, toggleDark: () => {} });
const useTheme = () => useContext(ThemeContext);

// ============================================
// MAIN STUDENT DASHBOARD
// ============================================
const StudentDashboard = () => {
  const navigate = useNavigate();
  const { isStudent } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!isStudent()) {
      navigate('/', { replace: true });
    }
  }, [isStudent, navigate]);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark(d => !d) }}>
      <StudentLayout>
        <Routes>
          <Route path="/" element={<StudentOverviewTab />} />
          <Route path="/assignments" element={<StudentAssignmentsTab />} />
          <Route path="/quizzes" element={<StudentQuizzesTab />} />
          <Route path="/attendance" element={<StudentAttendanceTab />} />
          <Route path="/announcements" element={<StudentAnnouncementsTab />} />
        </Routes>
      </StudentLayout>
    </ThemeContext.Provider>
  );
};

// ============================================
// STUDENT LAYOUT (Sidebar + Top Header)
// ============================================
const StudentLayout = ({ children }) => {
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
    { path: '/student-dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/student-dashboard/assignments', icon: ClipboardList, label: 'Assignments' },
    { path: '/student-dashboard/quizzes', icon: FileText, label: 'Quizzes' },
    { path: '/student-dashboard/attendance', icon: CalendarCheck, label: 'Attendance' },
    { path: '/student-dashboard/announcements', icon: Megaphone, label: 'Announcements' },
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
            <p className="text-gray-400 text-[10px]">Student Portal</p>
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
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors text-gray-400 hover:text-[#1a2b4a]"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold" style={{ color: textPrimary }}>
                {navItems.find(n => location.pathname === n.path || location.pathname === n.path + '/')?.label || 'Dashboard'}
              </h1>
              <p className="text-xs" style={{ color: textMuted }}>
                Academic Year 2025–2026 · Last updated: today
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full transition-colors hover:bg-gray-100 text-gray-400">
              <Search size={18} />
            </button>
            <button className="p-2 rounded-full transition-colors hover:bg-gray-100 text-gray-400 relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
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
              title={userData?.name || 'Student'}
            >
              {(userData?.name || 'S')[0].toUpperCase()}
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

        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: mainBg }}>
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

const Badge = ({ children, color, bg }) => (
  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
    style={{ backgroundColor: bg, color }}>
    {children}
  </span>
);

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
// STUDENT OVERVIEW TAB
// ============================================
const StudentOverviewTab = () => {
  const { dark } = useTheme();
  const [studentInfo] = useState({
    name: 'Juan Dela Cruz',
    studentId: '2024-001',
    grade: '10',
    section: 'A',
    avgGrade: 88.5,
    attendanceRate: 95
  });

  const [upcoming] = useState([
    { type: 'assignment', title: 'Math Problem Set #3', subject: 'Mathematics', due: 'Apr 30, 2024', status: 'pending' },
    { type: 'quiz', title: 'Science Quiz: Biology', subject: 'Science', due: 'May 2, 2024', status: 'upcoming' },
    { type: 'assignment', title: 'English Essay', subject: 'English', due: 'May 5, 2024', status: 'pending' },
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>
          Welcome back, {studentInfo.name}!
        </h2>
        <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
          Grade {studentInfo.grade}-{studentInfo.section} · ID: {studentInfo.studentId}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Average Grade" value={`${studentInfo.avgGrade}%`} icon={BookOpen} />
        <StatCard label="Attendance" value={`${studentInfo.attendanceRate}%`} icon={CalendarCheck} />
        <StatCard label="Pending Tasks" value="3" icon={ClipboardList} subColor="#d97706" />
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
          Upcoming Tasks
        </h2>
        <div className="space-y-3">
          {upcoming.map((task, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg transition-colors"
              style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: task.type === 'assignment' ? (dark ? '#1e3a5f' : '#eff6ff') : (dark ? '#312e81' : '#f5f3ff') }}>
                {task.type === 'assignment' ? (
                  <ClipboardList size={20} style={{ color: '#3b82f6' }} />
                ) : (
                  <FileText size={20} style={{ color: '#7c3aed' }} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{task.title}</p>
                <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{task.subject}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
                  <Clock size={14} />
                  Due {task.due}
                </div>
                <Badge 
                  color={task.status === 'pending' ? '#d97706' : '#2563eb'}
                  bg={task.status === 'pending' ? 'rgba(217,119,6,0.12)' : 'rgba(37,99,235,0.12)'}
                >
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ============================================
// ASSIGNMENTS TAB
// ============================================
const StudentAssignmentsTab = () => {
  const { dark } = useTheme();
  const assignments = [
    { title: 'Math Problem Set #3', subject: 'Mathematics', due: 'Apr 30, 2024', status: 'pending', progress: 60 },
    { title: 'English Essay', subject: 'English', due: 'May 5, 2024', status: 'pending', progress: 30 },
    { title: 'Science Lab Report', subject: 'Science', due: 'May 10, 2024', status: 'submitted', progress: 100 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>My Assignments</h1>
      <div className="space-y-4">
        {assignments.map((assignment, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{assignment.title}</h3>
                <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{assignment.subject}</p>
              </div>
              <Badge 
                color={assignment.status === 'submitted' ? '#16a34a' : '#d97706'}
                bg={assignment.status === 'submitted' ? 'rgba(22,163,74,0.12)' : 'rgba(217,119,6,0.12)'}
              >
                {assignment.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: dark ? '#334155' : '#e2e8f0' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${assignment.progress}%`, backgroundColor: assignment.status === 'submitted' ? '#16a34a' : '#FEB300' }} />
              </div>
              <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{assignment.progress}%</span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
              <Clock size={14} />
              Due {assignment.due}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================
// QUIZZES TAB
// ============================================
const StudentQuizzesTab = () => {
  const { dark } = useTheme();
  const quizzes = [
    { title: 'Science Quiz: Biology', subject: 'Science', date: 'May 2, 2024', score: null, total: 50 },
    { title: 'Math Quiz: Algebra', subject: 'Mathematics', date: 'Apr 20, 2024', score: 42, total: 50 },
    { title: 'History Quiz: WWII', subject: 'Araling Panlipunan', date: 'Apr 15, 2024', score: 38, total: 40 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>My Quizzes</h1>
      <div className="space-y-4">
        {quizzes.map((quiz, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{quiz.title}</h3>
                <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{quiz.subject}</p>
                <p className="text-xs mt-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{quiz.date}</p>
              </div>
              {quiz.score !== null ? (
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{quiz.score}/{quiz.total}</p>
                  <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{((quiz.score/quiz.total)*100).toFixed(0)}%</p>
                </div>
              ) : (
                <Badge color="#2563eb" bg="rgba(37,99,235,0.12)">Upcoming</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================
// ATTENDANCE TAB
// ============================================
const StudentAttendanceTab = () => {
  const { dark } = useTheme();
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>My Attendance</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: dark ? '#064e3b' : '#dcfce7' }}>
            <CheckCircle size={24} style={{ color: '#16a34a' }} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>45</p>
          <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Present</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: dark ? '#713f12' : '#fef3c7' }}>
            <Clock size={24} style={{ color: '#d97706' }} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>2</p>
          <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Late</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: dark ? '#450a0a' : '#fee2e2' }}>
            <AlertTriangle size={24} style={{ color: '#dc2626' }} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>1</p>
          <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Absent</p>
        </Card>
      </div>
    </div>
  );
};

// ============================================
// ANNOUNCEMENTS TAB
// ============================================
const StudentAnnouncementsTab = () => {
  const { dark } = useTheme();
  const announcements = [
    { title: 'Quiz on Monday', content: 'Prepare for Math quiz on Chapter 5', date: 'Apr 25, 2024', from: 'Mr. Santos' },
    { title: 'Project Deadline Extended', content: 'Science project now due May 10', date: 'Apr 24, 2024', from: 'Ms. Cruz' },
    { title: 'Field Trip Permission Slip', content: 'Please submit signed forms by Friday', date: 'Apr 23, 2024', from: 'Principal' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Announcements</h1>
      <div className="space-y-4">
        {announcements.map((announcement, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge color="#6A4800" bg="#FEB300">NEW</Badge>
              <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{announcement.date}</span>
            </div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{announcement.title}</h3>
            <p className="text-sm mb-2" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{announcement.content}</p>
            <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>From: {announcement.from}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;