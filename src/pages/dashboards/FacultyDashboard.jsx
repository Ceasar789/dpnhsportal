// ============================================
// FILE: src/pages/dashboards/FacultyDashboard.jsx
// PURPOSE: Faculty Dashboard — TeacherDashboard design applied
// ROLE: faculty only
// FEATURES: Overview, Pre-Enrollment (document checklist)
// ============================================

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, CheckSquare, Search, FileCheck, X, Check, AlertCircle,
  Plus, Eye, Filter, Moon, Sun, LogOut, Menu, ChevronRight
} from 'lucide-react';

// ============================================
// THEME CONTEXT
// ============================================
const ThemeContext = createContext({ dark: false, toggleDark: () => {} });
const useTheme = () => useContext(ThemeContext);

// ============================================
// MAIN FACULTY DASHBOARD
// ============================================
const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { isFaculty } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!isFaculty()) {
      navigate('/', { replace: true });
    }
  }, [isFaculty, navigate]);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark(d => !d) }}>
      <FacultyLayout>
        <Routes>
          <Route path="/" element={<FacultyOverviewTab />} />
          <Route path="/pre-enrollment" element={<FacultyPreEnrollmentTab />} />
        </Routes>
      </FacultyLayout>
    </ThemeContext.Provider>
  );
};

// ============================================
// FACULTY LAYOUT (Sidebar + Top Header)
// ============================================
const FacultyLayout = ({ children }) => {
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
    { path: '/faculty-dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/faculty-dashboard/pre-enrollment', icon: CheckSquare, label: 'Pre-Enrollment' },
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
            <p className="text-gray-400 text-[10px]">Faculty Portal</p>
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
              title={userData?.name || 'Faculty'}
            >
              {(userData?.name || 'F')[0].toUpperCase()}
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
      <div className="rounded-xl w-full max-w-lg shadow-2xl"
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
// FACULTY OVERVIEW TAB
// ============================================
const FacultyOverviewTab = () => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [stats] = useState({
    pendingChecklists: 12,
    completedToday: 5,
    totalProcessed: 156,
    documentsMissing: 8
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Faculty Overview</h2>
        <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Academic Year 2025–2026 · Last updated: today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Checklists" value={stats.pendingChecklists} icon={AlertCircle} subColor="#dc2626" />
        <StatCard label="Completed Today" value={stats.completedToday} icon={Check} subColor="#16a34a" />
        <StatCard label="Total Processed" value={stats.totalProcessed} icon={FileCheck} />
        <StatCard label="Missing Documents" value={stats.documentsMissing} icon={AlertCircle} subColor="#d97706" />
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Btn onClick={() => navigate('/faculty-dashboard/pre-enrollment')}><Plus size={16} /> Check Pre-Enrollment</Btn>
          <Btn variant="outline"><Filter size={16} /> Filter by Status</Btn>
        </div>
      </Card>
    </div>
  );
};

// ============================================
// PRE-ENROLLMENT TAB (Document Checklist)
// ============================================
const FacultyPreEnrollmentTab = () => {
  const { dark } = useTheme();
  const [enrollments, setEnrollments] = useState([
    { 
      id: 1, 
      studentName: 'Juan Dela Cruz', 
      parentName: 'Maria Dela Cruz', 
      gradeLevel: '7', 
      status: 'pending',
      documents: {
        birthCertificate: false,
        reportCard: false,
        goodMoral: false,
        idPictures: false,
        certificateCompletion: false
      },
      submittedAt: '2024-04-25'
    },
    { 
      id: 2, 
      studentName: 'Maria Santos', 
      parentName: 'Pedro Santos', 
      gradeLevel: '8', 
      status: 'pending',
      documents: {
        birthCertificate: true,
        reportCard: true,
        goodMoral: false,
        idPictures: true,
        certificateCompletion: true
      },
      submittedAt: '2024-04-24'
    },
    { 
      id: 3, 
      studentName: 'Pedro Reyes', 
      parentName: 'Ana Reyes', 
      gradeLevel: '7', 
      status: 'approved',
      documents: {
        birthCertificate: true,
        reportCard: true,
        goodMoral: true,
        idPictures: true,
        certificateCompletion: true
      },
      submittedAt: '2024-04-23'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleCheckDocument = (enrollmentId, docKey) => {
    setEnrollments(enrollments.map(e => {
      if (e.id === enrollmentId) {
        const newDocs = { ...e.documents, [docKey]: !e.documents[docKey] };
        const allComplete = Object.values(newDocs).every(v => v);
        return { 
          ...e, 
          documents: newDocs,
          status: allComplete ? 'approved' : 'pending'
        };
      }
      return e;
    }));
  };

  const filteredEnrollments = enrollments.filter(e => {
    const matchesSearch = e.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const documentLabels = {
    birthCertificate: 'PSA Birth Certificate',
    reportCard: 'Form 138 (Report Card)',
    goodMoral: 'Certificate of Good Moral',
    idPictures: '2x2 ID Pictures (2 copies)',
    certificateCompletion: 'Certificate of Completion'
  };

  const statusColors = {
    pending: { color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
    approved: { color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
    rejected: { color: '#dc2626', bg: 'rgba(220,38,38,0.12)' }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>Pre-Enrollment Checklist</h1>
          <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Verify student documents</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            backgroundColor: dark ? '#0f172a' : '#f8fafc', 
            border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
            color: dark ? '#f1f5f9' : '#1a2b4a'
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Enrollments Table */}
      <Card>
        <Table headers={['Student', 'Parent', 'Grade', 'Documents', 'Status', 'Actions']}>
          {filteredEnrollments.map((enrollment) => {
            const completedDocs = Object.values(enrollment.documents).filter(Boolean).length;
            const totalDocs = Object.keys(enrollment.documents).length;
            const s = statusColors[enrollment.status];

            return (
              <TR key={enrollment.id}>
                <TD>
                  <span className="font-medium" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{enrollment.studentName}</span>
                  <p className="text-xs mt-0.5" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Submitted {enrollment.submittedAt}</p>
                </TD>
                <TD>{enrollment.parentName}</TD>
                <TD>Grade {enrollment.gradeLevel}</TD>
                <TD>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: dark ? '#334155' : '#e2e8f0' }}>
                      <div className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${(completedDocs/totalDocs)*100}%` }} />
                    </div>
                    <span className="text-xs">{completedDocs}/{totalDocs}</span>
                  </div>
                </TD>
                <TD>
                  <Badge color={s.color} bg={s.bg}>{enrollment.status}</Badge>
                </TD>
                <TD>
                  <button 
                    onClick={() => {
                      setSelectedEnrollment(enrollment);
                      setShowDetailModal(true);
                    }}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={18} className="text-blue-500" />
                  </button>
                </TD>
              </TR>
            );
          })}
        </Table>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedEnrollment && (
        <Modal title="Document Checklist" onClose={() => setShowDetailModal(false)}>
          <div className="mb-4">
            <p className="text-sm font-semibold" style={{ color: dark ? '#f1f5f9' : '#1a2b4a' }}>{selectedEnrollment.studentName}</p>
            <p className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Grade {selectedEnrollment.gradeLevel}</p>
          </div>
          <div className="space-y-2">
            {Object.entries(documentLabels).map(([key, label]) => (
              <div 
                key={key}
                onClick={() => handleCheckDocument(selectedEnrollment.id, key)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                style={{
                  backgroundColor: selectedEnrollment.documents[key] ? (dark ? '#064e3b' : '#f0fdf4') : (dark ? '#0f172a' : '#f9fafb'),
                  border: `1px solid ${selectedEnrollment.documents[key] ? (dark ? '#059669' : '#a7f3d0') : (dark ? '#334155' : '#e2e8f0')}`
                }}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                  selectedEnrollment.documents[key] ? 'bg-green-500' : (dark ? 'bg-gray-600' : 'bg-gray-300')
                }`}>
                  {selectedEnrollment.documents[key] && <Check size={14} className="text-white" />}
                </div>
                <span className={`text-sm font-medium ${
                  selectedEnrollment.documents[key] ? 'text-green-700' : (dark ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: dark ? '#1e3a5f' : '#eff6ff', border: `1px solid ${dark ? '#334155' : '#bfdbfe'}` }}>
            <p className="text-xs" style={{ color: dark ? '#93c5fd' : '#1e40af' }}>
              <span className="font-semibold">Tip:</span> Click on each document to mark it as received. All documents must be checked to approve the enrollment.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FacultyDashboard;