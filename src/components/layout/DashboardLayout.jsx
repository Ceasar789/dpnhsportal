// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Newspaper, Calendar, FileText, Settings,
  BookOpen, GraduationCap, ClipboardList, CalendarCheck, Megaphone,
  CheckSquare, LogOut, Menu, ChevronRight
} from 'lucide-react';

const DashboardLayout = ({ role, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userData } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const items = {
      main_admin: [
        { path: '/admin-dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/admin-dashboard/users', icon: Users, label: 'User Management' },
        { path: '/admin-dashboard/news', icon: Newspaper, label: 'News' },
        { path: '/admin-dashboard/calendar', icon: Calendar, label: 'Calendar' },
        { path: '/admin-dashboard/memos', icon: FileText, label: 'Memos' },
        { path: '/admin-dashboard/settings', icon: Settings, label: 'Settings' },
      ],
      teacher: [
        { path: '/teacher-dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/teacher-dashboard/students', icon: Users, label: 'Students' },
        { path: '/teacher-dashboard/lesson-plans', icon: BookOpen, label: 'Lesson Plans' },
        { path: '/teacher-dashboard/worksheets', icon: ClipboardList, label: 'Worksheets' },
        { path: '/teacher-dashboard/grades', icon: GraduationCap, label: 'Grades' },
        { path: '/teacher-dashboard/attendance', icon: CalendarCheck, label: 'Attendance' },
        { path: '/teacher-dashboard/announcements', icon: Megaphone, label: 'Announcements' },
      ],
      student: [
        { path: '/student-dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/student-dashboard/assignments', icon: ClipboardList, label: 'Assignments' },
        { path: '/student-dashboard/quizzes', icon: FileText, label: 'Quizzes' },
        { path: '/student-dashboard/attendance', icon: CalendarCheck, label: 'Attendance' },
        { path: '/student-dashboard/announcements', icon: Megaphone, label: 'Announcements' },
      ],
      faculty: [
        { path: '/faculty-dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/faculty-dashboard/pre-enrollment', icon: CheckSquare, label: 'Pre-Enrollment' },
      ],
      registrar: [
        { path: '/registrar-dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/registrar-dashboard/pre-enrollment', icon: CheckSquare, label: 'Pre-Enrollment' },
      ],
    };
    return items[role] || [];
  };

  const navItems = getNavItems();
  const roleLabels = {
    main_admin: 'Administrator',
    teacher: 'Teacher',
    student: 'Student',
    faculty: 'Faculty',
    registrar: 'Registrar'
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d2b5c] text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FEB300] flex items-center justify-center">
              <span className="font-work font-bold text-[#0d2b5c] text-lg">D</span>
            </div>
            <div>
              <h1 className="font-work font-bold text-sm leading-tight">Dela Paz NHS</h1>
              <p className="text-[10px] text-white/60">SmartEdu Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="px-3 text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1
                  ${isActive 
                    ? 'bg-[#FEB300] text-[#0d2b5c]' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Users size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userData?.name || 'User'}
              </p>
              <p className="text-[10px] text-white/50">
                {roleLabels[role] || role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-[#1a2b4a]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0d2b5c] flex items-center justify-center">
              <span className="font-work font-bold text-[#FEB300] text-sm">D</span>
            </div>
            <span className="font-work font-bold text-[#1a2b4a] text-sm">DPNHS Portal</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;