import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Sun, Moon, Search, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();

  // ==================== FIREBASE AUTH REDIRECT ====================
  useEffect(() => {
    if (userData?.role !== 'main_admin') {
      navigate('/', { replace: true });
    }
  }, [userData?.role, navigate]);


  // ==================== STATE ====================
  const [activePage, setActivePage] = useState('overview');
  const [activeSettingsSub, setActiveSettingsSub] = useState('sec-general');
  const [activeModal, setActiveModal] = useState(null);
  const [logoError, setLogoError] = useState(false);

  // Users
  const [users, setUsers] = useState([
    { id: 1, name: 'Maria Reyes', dept: 'IT Dept', email: 'm.reyes@portal.edu', role: 'Student', status: 'Active', initials: 'MR', color: '#3b82f6' },
    { id: 2, name: 'Jose Padilla', dept: 'Sciences', email: 'j.padilla@portal.edu', role: 'Faculty', status: 'Active', initials: 'JP', color: '#22c55e' },
    { id: 3, name: 'Ana Cruz', dept: 'Registrar', email: 'a.cruz@portal.edu', role: 'Staff', status: 'Active', initials: 'AC', color: '#f59e0b' },
    { id: 4, name: 'Ben Lim', dept: 'Engineering', email: 'b.lim@portal.edu', role: 'Student', status: 'Inactive', initials: 'BL', color: '#6b7280' },
    { id: 5, name: 'Rosa Garcia', dept: 'Super', email: 'r.garcia@portal.edu', role: 'Admin', status: 'Active', initials: 'RG', color: '#a78bfa' },
  ]);
  const [nextUserId, setNextUserId] = useState(6);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDept, setNewUserDept] = useState('');
  const [newUserRole, setNewUserRole] = useState('Student');

  // News
  const [newsItems, setNewsItems] = useState([
    { id: 1, status: 'Published', cat: 'Academics', title: 'Enrollment Period Opens May 5', author: "Registrar's Office", date: 'Apr 28', content: '' },
    { id: 2, status: 'Draft', cat: 'Events', title: 'Science Fair 2025 Registration Guide', author: "Dean's Office", date: 'May 1', content: '' },
    { id: 3, status: 'Published', cat: 'Scholarships', title: 'CHED Scholarship Deadline Extended', author: 'Student Affairs', date: 'Apr 30', content: '' },
    { id: 4, status: 'Archived', cat: 'Academics', title: 'Q1 Academic Calendar 2024', author: 'Admin', date: 'Jan 10', content: '' },
  ]);
  const [nextNewsId, setNextNewsId] = useState(5);
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCatFilter, setNewsCatFilter] = useState('');
  const [newsStatusFilter, setNewsStatusFilter] = useState('');
  const [editingNewsId, setEditingNewsId] = useState(null);

  // News Form
  const [postTitle, setPostTitle] = useState('');
  const [postCat, setPostCat] = useState('Academics');
  const [postAuthor, setPostAuthor] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postStatus, setPostStatus] = useState('Draft');

  // Calendar
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(4);
  const [calFilterType, setCalFilterType] = useState('');
  const [calEvents, setCalEvents] = useState([
    { title: 'Faculty Mtg', date: '2026-05-01', type: 'Meetings' },
    { title: 'Enrollment Period Opens', date: '2026-05-05', endDate: '2026-05-07', type: 'Enrollment' },
    { title: 'Midterm Examinations', date: '2026-05-12', endDate: '2026-05-16', type: 'Exams' },
    { title: 'University Day', date: '2026-05-20', type: 'Holiday' },
  ]);

  // Event Form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventType, setEventType] = useState('Enrollment');

  // Memos
  const [memos, setMemos] = useState([
    { id: 1, title: 'Re: Class Schedule Update', to: 'All Faculty', date: 'May 2, 2026', status: 'Sent', snippet: 'Reminder about updated...', from: 'Office of the Dean', body: 'Dear Faculty,\n\nThis is a reminder regarding the updated class schedule for the remaining weeks of the semester. Please review the changes and adjust your syllabi accordingly.\n\nRegards,\nDean R. Santos\nOffice of the Dean · AcademicPortal' },
    { id: 2, title: 'Library Hours Extension', to: 'All Students', date: 'Apr 30', status: 'Sent', snippet: 'Library will be open until...', from: 'Library Services', body: 'Dear Students,\n\nThe library will extend its hours until 10:00 PM starting next week to support your midterm preparations.\n\nThank you.' },
    { id: 3, title: 'Graduation Requirements', to: 'Seniors', date: 'Apr 28', status: 'Draft', snippet: 'As you approach your final...', from: "Registrar's Office", body: 'Dear Seniors,\n\nAs you approach your final semester, please ensure all graduation requirements are submitted.\n\nRegards,\nRegistrar' },
    { id: 4, title: 'Scholarship Reminders', to: 'All Students', date: 'Apr 25', status: 'Sent', snippet: 'Please note deadlines for...', from: 'Student Affairs', body: 'Dear Students,\n\nPlease note the upcoming scholarship deadlines. Ensure all documents are submitted on time.' },
    { id: 5, title: 'Holiday Notice: Eid al-Adha', to: 'All', date: 'Apr 22', status: 'Sent', snippet: 'Classes suspended on...', from: 'Office of the President', body: 'Dear All,\n\nClasses and work are suspended in observance of Eid al-Adha. Regular schedules resume the following day.' },
  ]);
  const [nextMemoId, setNextMemoId] = useState(6);
  const [selectedMemoId, setSelectedMemoId] = useState(1);
  const [editingMemoId, setEditingMemoId] = useState(null);

  // Memo Form
  const [memoFrom, setMemoFrom] = useState('');
  const [memoTo, setMemoTo] = useState('All Faculty Members');
  const [memoSubj, setMemoSubj] = useState('');
  const [memoBody, setMemoBody] = useState('');

  // Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30 min');
  const [loginAttemptLimit, setLoginAttemptLimit] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [lmsIntegration, setLmsIntegration] = useState(false);
  const [smsGateway, setSmsGateway] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [activityLogs, setActivityLogs] = useState('90 days');
  const [theme, setTheme] = useState('Dark');
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('English');
  const [portalName, setPortalName] = useState('AcademicPortal');
  const [academicYear, setAcademicYear] = useState('2025–2026');
  const [semesterType, setSemesterType] = useState('Semester');
  const [semesterNum, setSemesterNum] = useState('2nd');

  // ==================== HELPERS ====================
  const switchPage = (page) => setActivePage(page);

  const scrollToSection = (id) => {
    setActiveSettingsSub(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = (id) => setActiveModal(id);
  const closeModal = (id) => setActiveModal(null);
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setActiveModal(null);
  };

  const roleBadgeClass = (role) => {
    return { Student: 'badge-blue', Faculty: 'badge-green', Staff: 'badge-yellow', Admin: 'badge-purple', 'Super Admin': 'badge-red' }[role] || 'badge-blue';
  };

  const typeClass = (type) => {
    return { Enrollment: 'ev-blue', Exams: 'ev-yellow', Holiday: 'ev-green', Meetings: 'ev-purple' }[type] || 'ev-blue';
  };

  const typeColor = (type) => {
    return { Enrollment: 'var(--accent)', Exams: 'var(--yellow)', Holiday: 'var(--green)', Meetings: 'var(--purple)' }[type] || 'var(--accent)';
  };

  // ==================== USERS ====================
  const filteredUsers = useMemo(() => {
    const s = userSearch.toLowerCase();
    return users.filter(u => {
      const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, userSearch, roleFilter]);

  const openCreateUser = () => {
    setEditingUserId(null);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserDept('');
    setNewUserRole('Student');
    openModal('modal-create-user');
  };

  const editUser = (id) => {
    const u = users.find(x => x.id === id);
    if (!u) return;
    setEditingUserId(id);
    setNewUserName(u.name);
    setNewUserEmail(u.email);
    setNewUserDept(u.dept);
    setNewUserRole(u.role);
    openModal('modal-create-user');
  };

  const saveUser = () => {
    const name = newUserName.trim();
    const email = newUserEmail.trim();
    const dept = newUserDept.trim();
    const role = newUserRole;
    if (!name || !email) { alert('Name and Email are required.'); return; }
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#a78bfa', '#ef4444', '#2dd4bf'];
    if (editingUserId) {
      setUsers(prev => prev.map(u => u.id === editingUserId ? {
        ...u, name, email, dept, role,
        initials: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      } : u));
    } else {
      const newUser = {
        id: nextUserId, name, email, dept, role, status: 'Active',
        initials: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
        color: colors[users.length % colors.length]
      };
      setUsers(prev => [...prev, newUser]);
      setNextUserId(prev => prev + 1);
    }
    closeModal('modal-create-user');
  };

  const deleteUser = (id) => {
    if (!confirm('Delete this user?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // ==================== NEWS ====================
  const filteredNews = useMemo(() => {
    const s = newsSearch.toLowerCase();
    return newsItems.filter(n =>
      (!s || n.title.toLowerCase().includes(s)) &&
      (!newsCatFilter || n.cat === newsCatFilter) &&
      (!newsStatusFilter || n.status === newsStatusFilter)
    );
  }, [newsItems, newsSearch, newsCatFilter, newsStatusFilter]);

  const archiveNews = (id) => {
    setNewsItems(prev => prev.map(n => n.id === id ? { ...n, status: 'Archived' } : n));
  };
  const publishNews = (id) => {
    setNewsItems(prev => prev.map(n => n.id === id ? { ...n, status: 'Published' } : n));
  };
  const restoreNews = (id) => {
    setNewsItems(prev => prev.map(n => n.id === id ? { ...n, status: 'Published' } : n));
  };
  const deleteNews = (id) => {
    if (!confirm('Delete this post?')) return;
    setNewsItems(prev => prev.filter(n => n.id !== id));
  };
  const openNewPost = () => {
    setEditingNewsId(null);
    setPostTitle('');
    setPostCat('Academics');
    setPostAuthor('');
    setPostContent('');
    setPostStatus('Draft');
    openModal('modal-new-post');
  };
  const editNews = (id) => {
    const n = newsItems.find(x => x.id === id);
    if (!n) return;
    setEditingNewsId(id);
    setPostTitle(n.title);
    setPostCat(n.cat);
    setPostAuthor(n.author);
    setPostContent(n.content || '');
    setPostStatus(n.status);
    openModal('modal-new-post');
  };
  const savePost = () => {
    const title = postTitle.trim();
    if (!title) { alert('Title required'); return; }
    const today = new Date();
    const dateStr = today.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    if (editingNewsId) {
      setNewsItems(prev => prev.map(n => n.id === editingNewsId ? {
        ...n, title, cat: postCat, author: postAuthor, content: postContent, status: postStatus
      } : n));
    } else {
      setNewsItems(prev => [{
        id: nextNewsId, status: postStatus, cat: postCat, title, author: postAuthor, date: dateStr, content: postContent
      }, ...prev]);
      setNextNewsId(prev => prev + 1);
    }
    closeModal('modal-new-post');
  };

  // ==================== CALENDAR ====================
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const renderCalendarGrid = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrev = new Date(calYear, calMonth, 0).getDate();
    const today = new Date();
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: daysInPrev - firstDay + i + 1, cur: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, cur: true });
    }
    let idx = 1;
    while (cells.length % 7 !== 0) {
      cells.push({ day: idx++, cur: false });
    }

    return cells.map((cell, i) => {
      const isToday = cell.cur && cell.day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
      const eventsForDay = calEvents.filter(e => {
        if (calFilterType && e.type !== calFilterType) return false;
        if (!cell.cur) return false;
        if (e.endDate) return dateStr >= e.date && dateStr <= e.endDate;
        return e.date === dateStr;
      });
      return (
        <div key={i} className={`cal-cell ${isToday ? 'today' : ''} ${!cell.cur ? 'other-month' : ''}`}>
          <div className="cal-day">{cell.day}</div>
          {eventsForDay.map((e, j) => (
            <div key={j} className={`cal-event ${typeClass(e.type)}`}>{e.title}</div>
          ))}
        </div>
      );
    });
  };

  const upcomingEvents = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return calEvents.filter(e => e.date >= todayStr).sort((a, b) => a.date > b.date ? 1 : -1).slice(0, 4);
  }, [calEvents]);

  const prevMonth = () => {
    setCalMonth(prev => { if (prev === 0) { setCalYear(y => y - 1); return 11; } return prev - 1; });
  };
  const nextMonth = () => {
    setCalMonth(prev => { if (prev === 11) { setCalYear(y => y + 1); return 0; } return prev + 1; });
  };

  const openAddEvent = () => {
    setEventTitle('');
    setEventDate('');
    setEventEndDate('');
    setEventType('Enrollment');
    openModal('modal-add-event');
  };
  const saveEvent = () => {
    const title = eventTitle.trim();
    const date = eventDate;
    if (!title || !date) { alert('Title and date required'); return; }
    const ev = { title, date, type: eventType };
    if (eventEndDate) ev.endDate = eventEndDate;
    setCalEvents(prev => [...prev, ev]);
    closeModal('modal-add-event');
  };

  // ==================== MEMOS ====================
  const selectedMemo = memos.find(m => m.id === selectedMemoId);

  const selectMemo = (id) => setSelectedMemoId(id);

  const resendMemo = (id) => alert('Memo resent successfully!');

  const editMemo = (id) => {
    const m = memos.find(x => x.id === id);
    if (!m) return;
    setEditingMemoId(id);
    setMemoFrom(m.from);
    setMemoTo(m.to);
    setMemoSubj(m.title);
    setMemoBody(m.body);
    openModal('modal-compose-memo');
  };

  const deleteMemo = (id) => {
    if (!confirm('Delete this memo?')) return;
    setMemos(prev => {
      const updated = prev.filter(x => x.id !== id);
      if (selectedMemoId === id) setSelectedMemoId(updated.length ? updated[0].id : null);
      return updated;
    });
  };

  const openComposeMemo = () => {
    setEditingMemoId(null);
    setMemoFrom('');
    setMemoTo('All Faculty Members');
    setMemoSubj('');
    setMemoBody('');
    openModal('modal-compose-memo');
  };

  const sendMemo = () => {
    const from = memoFrom.trim();
    const to = memoTo;
    const subj = memoSubj.trim();
    const body = memoBody.trim();
    if (!from || !subj) { alert('From and Subject required'); return; }
    const today = new Date();
    const dateStr = today.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    if (editingMemoId) {
      setMemos(prev => prev.map(m => m.id === editingMemoId ? {
        ...m, from, to, title: subj, body, date: dateStr
      } : m));
    } else {
      const snippet = body.split('\n')[2] || body.slice(0, 30) + '...';
      const newMemo = { id: nextMemoId, title: subj, to, date: dateStr, status: 'Sent', snippet, from, body };
      setMemos(prev => [newMemo, ...prev]);
      setNextMemoId(prev => prev + 1);
      setSelectedMemoId(nextMemoId);
    }
    closeModal('modal-compose-memo');
  };

  // ==================== SETTINGS ====================
  const saveSettings = () => alert('Settings saved successfully!');

  // ==================== RENDER ====================
  return (
    <>
      <style>{`
        /* ── DARK MODE (default) ── */
        :root {
          --bg: #1a1d23;
          --sidebar-bg: #1e2128;
          --card-bg: #23272f;
          --card2: #2a2f3a;
          --border: #2e3340;
          --text: #e8eaf0;
          --text-muted: #8b92a5;
          --text-dim: #5a6070;
          --accent: #3b82f6;
          --accent-hover: #2563eb;
          --green: #22c55e;
          --yellow: #f59e0b;
          --red: #ef4444;
          --purple: #a78bfa;
          --teal: #2dd4bf;
          --nav-bg: #ffffff;
          --nav-border: #e2e8f0;
          --nav-text: #1a2b4a;
          --nav-text-muted: #4a5568;
          --nav-link-active-color: #1a2b4a;
          --nav-link-hover-bg: #f1f5f9;
          --nav-shadow: 0 1px 3px rgba(0,0,0,0.08);
          --toggle-bg: #e2e8f0;
          --toggle-icon: #4a5568;
        }
        /* ── LIGHT MODE ── */
        :root.light {
          --bg: #f4f6fb;
          --sidebar-bg: #f8fafc;
          --card-bg: #ffffff;
          --card2: #f1f5f9;
          --border: #e2e8f0;
          --text: #1a2b4a;
          --text-muted: #4a5568;
          --text-dim: #94a3b8;
          --accent: #2563eb;
          --accent-hover: #1d4ed8;
          --green: #16a34a;
          --yellow: #d97706;
          --red: #dc2626;
          --purple: #7c3aed;
          --teal: #0d9488;
          --nav-bg: #ffffff;
          --nav-border: #e2e8f0;
          --nav-text: #1a2b4a;
          --nav-text-muted: #4a5568;
          --nav-link-active-color: #1a2b4a;
          --nav-link-hover-bg: #f1f5f9;
          --nav-shadow: 0 1px 3px rgba(0,0,0,0.08);
          --toggle-bg: #1a2b4a;
          --toggle-icon: #ffffff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; font-size: 14px; }

        /* ── TOP NAV (DPNHS style) ── */
        nav {
          background: var(--nav-bg);
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 28px;
          gap: 0;
          border-bottom: 1px solid var(--nav-border);
          box-shadow: var(--nav-shadow);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 32px;
        }
        .nav-logo img {
          width: 42px; height: 42px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 2px solid #e2e8f0;
        }
        .nav-logo-icon {
          width: 42px; height: 42px;
          background: #0d2b5c;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 900;
          color: #FEB300; flex-shrink: 0;
        }
        .nav-logo-text { display: flex; flex-direction: column; line-height: 1.2; }
        .nav-logo-text span:first-child { font-weight: 700; font-size: 14px; color: var(--nav-text); }
        .nav-logo-text span:last-child { font-size: 10px; color: var(--nav-text-muted); font-weight: 400; }

        .nav-links { display: flex; gap: 2px; flex: 1; }
        .nav-link {
          padding: 6px 14px;
          cursor: pointer;
          color: var(--nav-text-muted);
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.03em;
          transition: all .15s;
          border: none; background: none;
          border-radius: 6px;
          position: relative;
        }
        .nav-link:hover { color: var(--nav-text); background: var(--nav-link-hover-bg); }
        .nav-link.active { color: var(--nav-link-active-color); }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -6px; left: 50%;
          transform: translateX(-50%);
          width: 20px; height: 2px;
          background: #d4a843;
          border-radius: 2px;
        }

        .nav-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .nav-search-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: none; background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--nav-text-muted); transition: background .15s;
        }
        .nav-search-btn:hover { background: var(--nav-link-hover-bg); }
        .nav-toggle-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: none; background: var(--toggle-bg); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--toggle-icon); transition: all .2s;
        }
        .nav-toggle-btn:hover { opacity: 0.8; }
        .nav-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: #0d2b5c;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #FEB300;
          cursor: pointer; border: 2px solid #e2e8f0;
          flex-shrink: 0;
        }
        .nav-logout-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 7px;
          border: 1px solid var(--nav-border);
          background: transparent; cursor: pointer;
          color: var(--nav-text-muted); font-size: 13px; font-weight: 600;
          transition: all .15s;
        }
        .nav-logout-btn:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

        .layout { display: flex; flex: 1; min-height: calc(100vh - 48px); }
        .sidebar { width: 200px; background: var(--sidebar-bg); border-right: 1px solid var(--border); padding: 16px 0; flex-shrink: 0; }
        .sidebar-item { padding: 9px 20px; cursor: pointer; color: var(--text-muted); font-size: 13px; transition: all .15s; display: flex; align-items: center; gap: 8px; border-left: 3px solid transparent; }
        .sidebar-item:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .sidebar-item.active { color: var(--text); background: rgba(59,130,246,0.1); border-left-color: var(--accent); }
        .sidebar-section { padding: 16px 20px 6px; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--text-dim); }
        .sidebar-sub { padding: 7px 20px 7px 28px; cursor: pointer; color: var(--text-dim); font-size: 12px; transition: all .15s; }
        .sidebar-sub:hover { color: var(--text-muted); }
        .sidebar-sub.active { color: var(--accent); }
        .main { flex: 1; padding: 28px 32px; overflow-y: auto; }
        .page { display: none; }
        .page.active { display: block; }

        .page-title { font-size: 22px; font-weight: 700; color: var(--text); }
        .page-sub { color: var(--text-muted); font-size: 13px; margin-top: 3px; margin-bottom: 20px; }
        .btn { padding: 8px 16px; border-radius: 7px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all .15s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary { background: var(--accent); color: #fff; }
        .btn-primary:hover { background: var(--accent-hover); }
        .btn-ghost { background: transparent; color: var(--accent); border: 1px solid var(--border); }
        .btn-danger { background: transparent; color: var(--red); }
        .btn-sm { padding: 4px 10px; font-size: 12px; }
        input, select, textarea { background: var(--card-bg); border: 1px solid var(--border); color: var(--text); border-radius: 7px; padding: 8px 12px; font-size: 13px; outline: none; }
        input:focus, select:focus, textarea:focus { border-color: var(--accent); }
        select { appearance: none; cursor: pointer; }
        .flex { display: flex; }
        .flex-center { display: flex; align-items: center; }
        .gap-2 { gap: 8px; }
        .gap-3 { gap: 12px; }
        .flex-1 { flex: 1; }
        .ml-auto { margin-left: auto; }
        .badge { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid; }
        .badge-blue { color: #60a5fa; border-color: #1d4ed8; background: rgba(59,130,246,0.1); }
        .badge-green { color: #4ade80; border-color: #15803d; background: rgba(34,197,94,0.1); }
        .badge-yellow { color: #fbbf24; border-color: #b45309; background: rgba(245,158,11,0.1); }
        .badge-purple { color: #c4b5fd; border-color: #6d28d9; background: rgba(167,139,250,0.1); }
        .badge-red { color: #f87171; border-color: #b91c1c; background: rgba(239,68,68,0.1); }
        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .dot-green { background: var(--green); }
        .dot-gray { background: #4b5563; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 10px 14px; font-size: 12px; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border); }
        td { padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: 13px; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; }
        .avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }

        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
        .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; }
        .stat-label { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
        .stat-value { font-size: 28px; font-weight: 700; color: var(--text); }
        .stat-change { font-size: 12px; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
        .stat-change.up { color: var(--green); }
        .stat-change.down { color: var(--red); }
        .overview-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
        .chart-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
        .chart-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .chart-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }
        .bars { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
        .bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
        .bar { background: var(--accent); border-radius: 4px 4px 0 0; width: 100%; transition: opacity .15s; }
        .bar:hover { opacity: .8; }
        .bar-label { font-size: 11px; color: var(--text-dim); }
        .recent-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); }
        .recent-item:last-child { border-bottom: none; }
        .recent-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .recent-info { flex: 1; }
        .recent-title { font-size: 13px; color: var(--text); }
        .recent-time { font-size: 11px; color: var(--text-dim); }
        .role-bar { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
        .role-row { display: flex; align-items: center; gap: 10px; }
        .role-track { flex: 1; height: 10px; background: var(--border); border-radius: 10px; overflow: hidden; }
        .role-fill { height: 100%; border-radius: 10px; }
        .role-label { font-size: 12px; color: var(--text-muted); width: 90px; flex-shrink: 0; }
        .portal-status { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-top: 16px; }

        .toolbar { display: flex; gap: 10px; margin-bottom: 18px; align-items: center; }
        .toolbar input { flex: 1; max-width: 280px; }
        .table-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
        .pagination { display: flex; align-items: center; gap: 6px; padding: 14px 16px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-muted); }
        .page-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: var(--card-bg); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; }
        .page-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
        .assign-bar { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-top: 14px; display: flex; align-items: center; justify-content: space-between; }
        .assign-label { font-size: 13px; font-weight: 600; }
        .assign-hint { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        .news-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .news-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
        .news-card-top { height: 4px; }
        .news-card-top.pub { background: var(--accent); }
        .news-card-top.draft { background: var(--yellow); }
        .news-card-top.arch { background: var(--text-dim); }
        .news-card-body { padding: 14px 16px; }
        .news-meta { display: flex; gap: 6px; margin-bottom: 8px; }
        .news-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
        .news-author { font-size: 12px; color: var(--text-muted); }
        .news-actions { padding: 10px 16px; border-top: 1px solid var(--border); display: flex; gap: 14px; align-items: center; }
        .news-action { background: none; border: none; cursor: pointer; font-size: 12px; color: var(--text-muted); }
        .news-action:hover { color: var(--text); }
        .news-action.red { color: var(--red); }
        .news-action.green { color: var(--green); }
        .news-action.blue { color: var(--accent); }
        .news-footer { font-size: 12px; color: var(--text-muted); margin-top: 16px; }

        .cal-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .cal-title { font-size: 16px; font-weight: 600; }
        .cal-nav { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 16px; padding: 4px 8px; border-radius: 5px; }
        .cal-nav:hover { background: rgba(255,255,255,0.06); color: var(--text); }
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
        .cal-head { background: var(--card-bg); padding: 10px; text-align: center; font-size: 12px; font-weight: 600; color: var(--text-muted); }
        .cal-cell { background: var(--card-bg); min-height: 80px; padding: 8px; position: relative; }
        .cal-cell:hover { background: var(--card2); }
        .cal-day { font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
        .cal-cell.today .cal-day { background: var(--accent); color: #fff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
        .cal-cell.other-month .cal-day { color: var(--text-dim); }
        .cal-event { font-size: 11px; padding: 2px 6px; border-radius: 3px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ev-blue { background: rgba(59,130,246,0.3); color: #93c5fd; }
        .ev-yellow { background: rgba(245,158,11,0.3); color: #fcd34d; }
        .ev-green { background: rgba(34,197,94,0.3); color: #86efac; }
        .ev-purple { background: rgba(167,139,250,0.3); color: #c4b5fd; }
        .cal-sidebar { width: 200px; flex-shrink: 0; }
        .upcoming-item { padding: 10px 0; border-left: 3px solid; padding-left: 10px; margin-bottom: 10px; }
        .legend { display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap; }
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
        .legend-dot { width: 12px; height: 12px; border-radius: 2px; }

        .memo-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 16px; }
        .memo-list-item { padding: 12px 16px; cursor: pointer; border-bottom: 1px solid var(--border); transition: background .1s; }
        .memo-list-item:hover { background: rgba(255,255,255,0.03); }
        .memo-list-item.active { background: rgba(59,130,246,0.08); border-left: 3px solid var(--accent); }
        .memo-title-item { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
        .memo-meta { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
        .memo-snippet { font-size: 12px; color: var(--text-dim); margin-top: 3px; }
        .memo-preview { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
        .memo-field { display: flex; gap: 8px; margin-bottom: 8px; font-size: 13px; }
        .memo-field-label { color: var(--text-muted); width: 50px; flex-shrink: 0; }
        .memo-field-val { color: var(--text); font-weight: 500; }
        .memo-body-text { margin: 16px 0; }
        .memo-body-line { height: 10px; background: var(--border); border-radius: 4px; margin-bottom: 8px; }
        .memo-actions { display: flex; gap: 10px; margin-top: 16px; }
        .memo-stats { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .memo-stat-val { font-size: 24px; font-weight: 700; }
        .memo-stat-label { font-size: 12px; color: var(--text-muted); }

        .settings-section { margin-bottom: 24px; }
        .settings-section-title { font-size: 15px; font-weight: 700; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
        .settings-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
        .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); }
        .settings-row:last-child { border-bottom: none; }
        .settings-label { font-size: 13px; font-weight: 600; }
        .settings-hint { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .settings-hint a { color: var(--accent); text-decoration: none; }
        .toggle { width: 44px; height: 24px; border-radius: 12px; position: relative; cursor: pointer; transition: background .2s; flex-shrink: 0; }
        .toggle.on { background: var(--accent); }
        .toggle.off { background: var(--text-dim); }
        .toggle-knob { width: 18px; height: 18px; border-radius: 50%; background: #fff; position: absolute; top: 3px; transition: left .2s; }
        .toggle.on .toggle-knob { left: 23px; }
        .toggle.off .toggle-knob { left: 3px; }
        .settings-input-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
        .settings-input-row:last-child { border-bottom: none; }
        .settings-input-label { font-size: 13px; color: var(--text-muted); width: 120px; flex-shrink: 0; }
        .settings-input { flex: 1; }
        .settings-save { display: flex; justify-content: flex-end; margin-top: 16px; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 1000; display: none; }
        .modal-overlay.open { display: flex; }
        .modal { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 24px; width: 420px; }
        .modal-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
        .form-row { margin-bottom: 14px; }
        .form-label { font-size: 12px; color: var(--text-muted); margin-bottom: 5px; display: block; }
        .form-input { width: 100%; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
      `}</style>

      {/* ==================== NAV ==================== */}
      <nav className={darkMode ? '' : 'light'} style={{ background: 'var(--nav-bg)' }}>

        {/* Logo */}
        <a className="nav-logo" href="#">
          {!logoError ? (
            <img src="/capstonelogo.png" alt="DPNHS Logo" onError={() => setLogoError(true)} />
          ) : (
            <div className="nav-logo-icon">DP</div>
          )}
          <div className="nav-logo-text">
            <span>Dela Paz National High School</span>
            <span>Admin Portal</span>
          </div>
        </a>

        {/* Nav Links */}
        <div className="nav-links">
          <button className={`nav-link ${activePage === 'overview'  ? 'active' : ''}`} onClick={() => switchPage('overview')}>OVERVIEW</button>
          <button className={`nav-link ${activePage === 'users'     ? 'active' : ''}`} onClick={() => switchPage('users')}>USERS</button>
          <button className={`nav-link ${activePage === 'news'      ? 'active' : ''}`} onClick={() => switchPage('news')}>NEWS</button>
          <button className={`nav-link ${activePage === 'calendar'  ? 'active' : ''}`} onClick={() => switchPage('calendar')}>CALENDAR</button>
          <button className={`nav-link ${activePage === 'memos'     ? 'active' : ''}`} onClick={() => switchPage('memos')}>MEMOS</button>
          <button className={`nav-link ${activePage === 'settings'  ? 'active' : ''}`} onClick={() => switchPage('settings')}>SETTINGS</button>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          <button className="nav-search-btn" title="Search">
            <Search size={17} />
          </button>
          <button
            className="nav-toggle-btn"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onClick={() => {
              setDarkMode(!darkMode);
              document.documentElement.classList.toggle('light', darkMode);
            }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="nav-avatar" title={userData?.name || 'Admin'}>
            {(userData?.name || 'AD').slice(0, 2).toUpperCase()}
          </div>
          <button
            className="nav-logout-btn"
            onClick={() => { logout(); navigate('/login'); }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </nav>

      {/* ==================== LAYOUT ==================== */}
      <div className="layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className={`sidebar-item ${activePage === 'overview' ? 'active' : ''}`} onClick={() => switchPage('overview')}>Overview</div>
          <div className={`sidebar-item ${activePage === 'users' ? 'active' : ''}`} onClick={() => switchPage('users')}>User Management</div>
          <div className={`sidebar-item ${activePage === 'news' ? 'active' : ''}`} onClick={() => switchPage('news')}>News Management</div>
          <div className={`sidebar-item ${activePage === 'calendar' ? 'active' : ''}`} onClick={() => switchPage('calendar')}>Calendar</div>
          <div className={`sidebar-item ${activePage === 'memos' ? 'active' : ''}`} onClick={() => switchPage('memos')}>Memos</div>
          <div className={`sidebar-item ${activePage === 'settings' ? 'active' : ''}`} onClick={() => switchPage('settings')}>System Settings</div>

          {activePage === 'settings' && (
            <div id="settings-subs">
              <div className="sidebar-section">Sections</div>
              <div className={`sidebar-sub ${activeSettingsSub === 'sec-general' ? 'active' : ''}`} onClick={() => scrollToSection('sec-general')}>General</div>
              <div className={`sidebar-sub ${activeSettingsSub === 'sec-security' ? 'active' : ''}`} onClick={() => scrollToSection('sec-security')}>Security</div>
              <div className={`sidebar-sub ${activeSettingsSub === 'sec-notifications' ? 'active' : ''}`} onClick={() => scrollToSection('sec-notifications')}>Notifications</div>
              <div className={`sidebar-sub ${activeSettingsSub === 'sec-integrations' ? 'active' : ''}`} onClick={() => scrollToSection('sec-integrations')}>Integrations</div>
              <div className={`sidebar-sub ${activeSettingsSub === 'sec-backup' ? 'active' : ''}`} onClick={() => scrollToSection('sec-backup')}>Backup &amp; Logs</div>
              <div className={`sidebar-sub ${activeSettingsSub === 'sec-appearance' ? 'active' : ''}`} onClick={() => scrollToSection('sec-appearance')}>Appearance</div>
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '12px 20px', fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="dot dot-green"></span> All systems online
          </div>
        </div>

        {/* MAIN */}
        <div className="main">

          {/* ==================== OVERVIEW ==================== */}
          <div className={`page ${activePage === 'overview' ? 'active' : ''}`}>
            <div className="page-title">Dashboard Overview</div>
            <div className="page-sub">Academic Year 2025–2026 · Last updated: today</div>
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">3,284</div>
                <div className="stat-change up">▲ 12% this month</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active News</div>
                <div className="stat-value">47</div>
                <div className="stat-change up">▲ 5 new posts</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Events This Month</div>
                <div className="stat-value">18</div>
                <div className="stat-change" style={{ color: 'var(--text-muted)' }}>3 upcoming</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Memos Sent</div>
                <div className="stat-value">126</div>
                <div className="stat-change down">▼ 2% vs last wk</div>
              </div>
            </div>
            <div className="overview-grid">
              <div className="chart-card">
                <div className="chart-title">User Activity</div>
                <div className="chart-sub">Logins per week</div>
                <div className="bars">
                  {[18, 30, 45, 62, 80, 95, 75, 88, 100].map((v, i) => (
                    <div key={i} className="bar-wrap">
                      <div className="bar" style={{ height: `${v}%` }} title={`Week ${i + 1}: ${v} logins`}></div>
                      <span className="bar-label">W{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-title">Recent Activity</div>
                <div style={{ marginTop: '12px' }}>
                  {[
                    { title: 'New user registered', time: '2 minutes ago', color: '#3b82f6' },
                    { title: 'News post published', time: '14 minutes ago', color: '#22c55e' },
                    { title: 'Memo distributed', time: '1 hour ago', color: '#f59e0b' },
                    { title: 'Calendar updated', time: '2 hours ago', color: '#6b7280' },
                  ].map((item, i) => (
                    <div key={i} className="recent-item">
                      <span className="recent-dot" style={{ background: item.color }}></span>
                      <div className="recent-info">
                        <div className="recent-title">{item.title}</div>
                        <div className="recent-time">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="chart-card" style={{ marginTop: '16px' }}>
              <div className="chart-title">Role distribution</div>
              <div className="role-bar">
                <div className="role-row"><span className="role-label">Students · 2,140</span><div className="role-track"><div className="role-fill" style={{ width: '65%', background: '#3b82f6' }}></div></div></div>
                <div className="role-row"><span className="role-label">Staff · 280</span><div className="role-track"><div className="role-fill" style={{ width: '20%', background: '#f59e0b' }}></div></div></div>
                <div className="role-row"><span className="role-label">Faculty · 820</span><div className="role-track"><div className="role-fill" style={{ width: '25%', background: '#2dd4bf' }}></div></div></div>
                <div className="role-row"><span className="role-label">Admins · 44</span><div className="role-track"><div className="role-fill" style={{ width: '5%', background: '#ef4444' }}></div></div></div>
              </div>
            </div>
          </div>

          {/* ==================== USERS ==================== */}
          <div className={`page ${activePage === 'users' ? 'active' : ''}`}>
            <div className="page-title">User Management</div>
            <div className="page-sub">Create accounts and assign roles across the portal</div>
            <div className="toolbar">
              <input type="text" placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} style={{ flex: 1, maxWidth: '280px' }} />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">Role: All</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
              <button className="btn btn-primary" onClick={openCreateUser}>+ Create User</button>
            </div>
            <div className="table-card">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar" style={{ background: u.color }}>{u.initials}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.role} · {u.dept}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td><span className={`badge ${roleBadgeClass(u.role)}`}>{u.role}</span></td>
                      <td><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className={`dot ${u.status === 'Active' ? 'dot-green' : 'dot-gray'}`}></span>{u.status}</span></td>
                      <td>
                        <button className="btn btn-sm" style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => editUser(u.id)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <span>Showing 1–{filteredUsers.length} of 3,284 users</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                  <button className="page-btn">‹</button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">›</button>
                </div>
              </div>
            </div>
            <div className="assign-bar">
              <div>
                <div className="assign-label">Assign Role on Create</div>
                <div className="assign-hint">Choose from: Student · Faculty · Staff · Admin · Super Admin</div>
              </div>
              <button className="btn btn-primary" onClick={() => alert('Role assignment ready')}>Assign</button>
            </div>
          </div>

          {/* ==================== NEWS ==================== */}
          <div className={`page ${activePage === 'news' ? 'active' : ''}`}>
            <div className="page-title">News Management</div>
            <div className="page-sub">Create, edit, archive, and publish portal announcements</div>
            <div className="toolbar">
              <input type="text" placeholder="Search articles..." value={newsSearch} onChange={(e) => setNewsSearch(e.target.value)} style={{ flex: 1, maxWidth: '260px' }} />
              <select value={newsCatFilter} onChange={(e) => setNewsCatFilter(e.target.value)}>
                <option value="">Category</option>
                <option value="Academics">Academics</option>
                <option value="Events">Events</option>
                <option value="Scholarships">Scholarships</option>
              </select>
              <select value={newsStatusFilter} onChange={(e) => setNewsStatusFilter(e.target.value)}>
                <option value="">Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
              <button className="btn btn-primary" onClick={openNewPost}>+ New Post</button>
            </div>
            <div className="news-grid">
              {filteredNews.map(n => {
                const topCls = n.status === 'Published' ? 'pub' : n.status === 'Draft' ? 'draft' : 'arch';
                const statusBadge = n.status === 'Published' ? 'badge-green' : n.status === 'Draft' ? 'badge-yellow' : 'badge-red';
                return (
                  <div key={n.id} className="news-card">
                    <div className={`news-card-top ${topCls}`}></div>
                    <div className="news-card-body">
                      <div className="news-meta"><span className={`badge ${statusBadge}`}>{n.status}</span><span className="badge badge-purple">{n.cat}</span></div>
                      <div className="news-title">{n.title}</div>
                      <div className="news-author">{n.author} · {n.date}</div>
                    </div>
                    <div className="news-actions">
                      {n.status === 'Published' && (
                        <>
                          <button className="news-action" onClick={() => editNews(n.id)}>Edit</button>
                          <button className="news-action" onClick={() => archiveNews(n.id)}>Archive</button>
                          <button className="news-action red" onClick={() => deleteNews(n.id)}>Delete</button>
                          <button className="news-action blue" style={{ marginLeft: 'auto' }}>↗ View</button>
                        </>
                      )}
                      {n.status === 'Draft' && (
                        <>
                          <button className="news-action" onClick={() => editNews(n.id)}>Edit</button>
                          <button className="news-action green" onClick={() => publishNews(n.id)}>Publish</button>
                          <button className="news-action red" onClick={() => deleteNews(n.id)}>Delete</button>
                          <button className="news-action blue" style={{ marginLeft: 'auto' }}>Preview</button>
                        </>
                      )}
                      {n.status === 'Archived' && (
                        <>
                          <button className="news-action green" onClick={() => restoreNews(n.id)}>Restore</button>
                          <button className="news-action red" onClick={() => deleteNews(n.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="news-footer">
              {newsItems.length} total posts · {newsItems.filter(x => x.status === 'Published').length} published · {newsItems.filter(x => x.status === 'Draft').length} drafts · {newsItems.filter(x => x.status === 'Archived').length} archived
            </div>
          </div>

          {/* ==================== CALENDAR ==================== */}
          <div className={`page ${activePage === 'calendar' ? 'active' : ''}`}>
            <div className="page-title">Calendar Management</div>
            <div className="page-sub">Manage academic events, deadlines, and announcements</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div className="cal-toolbar">
                  <button className="cal-nav" onClick={prevMonth}>‹</button>
                  <span className="cal-title">{MONTHS[calMonth]} {calYear}</span>
                  <button className="cal-nav" onClick={nextMonth}>›</button>
                  <select style={{ marginLeft: '8px' }}><option>Month</option><option>Week</option></select>
                  <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={openAddEvent}>+ Add Event</button>
                  <select value={calFilterType} onChange={(e) => setCalFilterType(e.target.value)}>
                    <option value="">Filter type</option>
                    <option value="Enrollment">Enrollment</option>
                    <option value="Exams">Exams</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Meetings">Meetings</option>
                  </select>
                </div>
                <div className="cal-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="cal-head">{d}</div>)}
                  {renderCalendarGrid()}
                </div>
                <div className="legend">
                  <div className="legend-item"><div className="legend-dot" style={{ background: '#3b82f6' }}></div>Enrollment</div>
                  <div className="legend-item"><div className="legend-dot" style={{ background: '#f59e0b' }}></div>Exams</div>
                  <div className="legend-item"><div className="legend-dot" style={{ background: '#22c55e' }}></div>Holiday</div>
                  <div className="legend-item"><div className="legend-dot" style={{ background: '#a78bfa' }}></div>Meetings</div>
                </div>
              </div>
              <div className="cal-sidebar">
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-muted)' }}>Upcoming</div>
                {upcomingEvents.map((e, i) => {
                  const d = new Date(e.date);
                  const label = d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                  return (
                    <div key={i} className="upcoming-item" style={{ borderColor: typeColor(e.type) }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{e.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ==================== MEMOS ==================== */}
          <div className={`page ${activePage === 'memos' ? 'active' : ''}`}>
            <div className="page-title">Memo Management</div>
            <div className="page-sub">Compose and distribute official memos to departments or all users</div>
            <div className="toolbar">
              <input type="text" placeholder="Search memos..." style={{ flex: 1, maxWidth: '240px' }} />
              <select><option>Recipient</option><option>All Faculty</option><option>All Students</option><option>All</option><option>Seniors</option></select>
              <select><option>Status</option><option>Sent</option><option>Draft</option></select>
              <button className="btn btn-primary" onClick={openComposeMemo}>+ Compose</button>
            </div>
            <div className="memo-layout">
              <div className="card">
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Recent Memos</span>
                </div>
                <div>
                  {memos.map(m => (
                    <div key={m.id} className={`memo-list-item ${m.id === selectedMemoId ? 'active' : ''}`} onClick={() => selectMemo(m.id)}>
                      <div className="memo-title-item">{m.title}</div>
                      <div className="memo-meta">
                        <span>To: {m.to}</span> · <span>{m.date}</span>
                        {m.status === 'Sent' ? <span className="badge badge-green" style={{ marginLeft: '4px' }}>Sent</span> : <span className="badge badge-yellow" style={{ marginLeft: '4px' }}>Draft</span>}
                      </div>
                      <div className="memo-snippet">{m.snippet}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
                  <div className="memo-stats"><div className="memo-stat-val">14</div><div className="memo-stat-label">memos sent this week</div></div>
                  <div className="memo-stats"><div className="memo-stat-val">3,140</div><div className="memo-stat-label">recipients reached</div></div>
                  <div className="memo-stats"><div className="memo-stat-val" style={{ color: 'var(--green)' }}>96%</div><div className="memo-stat-label">read rate</div></div>
                </div>
              </div>
              <div className="memo-preview">
                {!selectedMemo ? (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>Select a memo to preview</div>
                ) : (
                  <>
                    <div className="memo-field"><span className="memo-field-label">From:</span><span className="memo-field-val">{selectedMemo.from}</span></div>
                    <div className="memo-field"><span className="memo-field-label">To:</span><span className="memo-field-val">{selectedMemo.to}</span></div>
                    <div className="memo-field"><span className="memo-field-label">Date:</span><span className="memo-field-val">{selectedMemo.date}</span></div>
                    <div className="memo-field"><span className="memo-field-label">Re:</span><span className="memo-field-val">{selectedMemo.title.replace('Re: ', '')}</span></div>
                    <div className="memo-body-text" style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-muted)', whiteSpace: 'pre-line', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>{selectedMemo.body}</div>
                    <div className="memo-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => resendMemo(selectedMemo.id)}>Resend</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => editMemo(selectedMemo.id)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteMemo(selectedMemo.id)}>Delete</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>Print</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ==================== SETTINGS ==================== */}
          <div className={`page ${activePage === 'settings' ? 'active' : ''}`}>
            <div className="page-title">System Settings</div>
            <div className="page-sub">Configure portal-wide preferences and administrative controls</div>

            <div id="sec-general" className="settings-section">
              <div className="settings-section-title">General</div>
              <div className="settings-card">
                <div className="settings-input-row">
                  <span className="settings-input-label">Portal name</span>
                  <input type="text" className="settings-input form-input" value={portalName} onChange={(e) => setPortalName(e.target.value)} />
                </div>
                <div className="settings-input-row">
                  <span className="settings-input-label">Academic year</span>
                  <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                    <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} style={{ flex: 1 }} />
                    <select value={semesterType} onChange={(e) => setSemesterType(e.target.value)}><option>Semester</option><option>Quarter</option></select>
                    <input type="text" value={semesterNum} onChange={(e) => setSemesterNum(e.target.value)} style={{ width: '50px' }} />
                  </div>
                </div>
              </div>
            </div>

            <div id="sec-security" className="settings-section">
              <div className="settings-section-title">Security</div>
              <div className="settings-card">
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Two-factor authentication</div>
                    <div className="settings-hint">Require 2FA for all Admin accounts</div>
                  </div>
                  <div className={`toggle ${twoFactorAuth ? 'on' : 'off'}`} onClick={() => setTwoFactorAuth(!twoFactorAuth)}><div className="toggle-knob"></div></div>
                </div>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Session timeout</div>
                    <div className="settings-hint">Auto-logout after inactivity</div>
                  </div>
                  <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)}><option>30 min</option><option>15 min</option><option>60 min</option></select>
                </div>
                <div className="settings-row">
                  <div><div className="settings-label">Login attempt limit</div></div>
                  <div className={`toggle ${loginAttemptLimit ? 'on' : 'off'}`} onClick={() => setLoginAttemptLimit(!loginAttemptLimit)}><div className="toggle-knob"></div></div>
                </div>
              </div>
            </div>

            <div id="sec-notifications" className="settings-section">
              <div className="settings-section-title">Notifications</div>
              <div className="settings-card">
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Email notifications</div>
                    <div className="settings-hint">Send system alerts and memo copies to admin email admin@portal.edu <a href="#">Change →</a></div>
                  </div>
                  <div className={`toggle ${emailNotifications ? 'on' : 'off'}`} onClick={() => setEmailNotifications(!emailNotifications)}><div className="toggle-knob"></div></div>
                </div>
              </div>
            </div>

            <div id="sec-integrations" className="settings-section">
              <div className="settings-section-title">Integrations</div>
              <div className="settings-card">
                <div className="settings-row">
                  <div><div className="settings-label">LMS Integration</div><div className="settings-hint">Connect to external learning management system</div></div>
                  <div className={`toggle ${lmsIntegration ? 'on' : 'off'}`} onClick={() => setLmsIntegration(!lmsIntegration)}><div className="toggle-knob"></div></div>
                </div>
                <div className="settings-row">
                  <div><div className="settings-label">SMS Gateway</div><div className="settings-hint">Send SMS notifications for urgent memos</div></div>
                  <div className={`toggle ${smsGateway ? 'on' : 'off'}`} onClick={() => setSmsGateway(!smsGateway)}><div className="toggle-knob"></div></div>
                </div>
              </div>
            </div>

            <div id="sec-backup" className="settings-section">
              <div className="settings-section-title">Backup &amp; Logs</div>
              <div className="settings-card">
                <div className="settings-row">
                  <div><div className="settings-label">Automatic backup</div><div className="settings-hint">Daily backup at 2:00 AM</div></div>
                  <div className={`toggle ${autoBackup ? 'on' : 'off'}`} onClick={() => setAutoBackup(!autoBackup)}><div className="toggle-knob"></div></div>
                </div>
                <div className="settings-row">
                  <div><div className="settings-label">Activity logs</div><div className="settings-hint">Keep logs for 90 days</div></div>
                  <select value={activityLogs} onChange={(e) => setActivityLogs(e.target.value)}><option>90 days</option><option>30 days</option><option>180 days</option></select>
                </div>
              </div>
            </div>

            <div id="sec-appearance" className="settings-section">
              <div className="settings-section-title">Appearance</div>
              <div className="settings-card">
                <div className="settings-row">
                  <div><div className="settings-label">Theme</div></div>
                  <select value={theme} onChange={(e) => setTheme(e.target.value)}><option>Dark</option><option>Light</option></select>
                </div>
                <div className="settings-row">
                  <div><div className="settings-label">Language</div></div>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}><option>English</option><option>Filipino</option></select>
                </div>
              </div>
            </div>

            <div className="settings-save">
              <button className="btn btn-primary" onClick={saveSettings}>Save Changes</button>
            </div>
          </div>

        </div>
      </div>

      {/* ==================== MODALS ==================== */}
      {/* Create User */}
      <div className={`modal-overlay ${activeModal === 'modal-create-user' ? 'open' : ''}`} onClick={handleOverlayClick}>
        <div className="modal">
          <div className="modal-title">{editingUserId ? 'Edit User' : 'Create User'}</div>
          <div className="form-row"><label className="form-label">Full Name</label><input className="form-input" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="e.g. Juan dela Cruz" /></div>
          <div className="form-row"><label className="form-label">Email</label><input className="form-input" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="e.g. j.cruz@portal.edu" /></div>
          <div className="form-row"><label className="form-label">Department</label><input className="form-input" value={newUserDept} onChange={(e) => setNewUserDept(e.target.value)} placeholder="e.g. Engineering" /></div>
          <div className="form-row"><label className="form-label">Role</label>
            <select className="form-input" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
              <option>Student</option><option>Faculty</option><option>Staff</option><option>Admin</option>
            </select>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => closeModal('modal-create-user')}>Cancel</button>
            <button className="btn btn-primary" onClick={saveUser}>{editingUserId ? 'Save Changes' : 'Create User'}</button>
          </div>
        </div>
      </div>

      {/* New Post */}
      <div className={`modal-overlay ${activeModal === 'modal-new-post' ? 'open' : ''}`} onClick={handleOverlayClick}>
        <div className="modal">
          <div className="modal-title">{editingNewsId ? 'Edit Post' : 'New Post'}</div>
          <div className="form-row"><label className="form-label">Title</label><input className="form-input" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="Post title" /></div>
          <div className="form-row"><label className="form-label">Category</label>
            <select className="form-input" value={postCat} onChange={(e) => setPostCat(e.target.value)}><option>Academics</option><option>Events</option><option>Scholarships</option></select>
          </div>
          <div className="form-row"><label className="form-label">Author / Office</label><input className="form-input" value={postAuthor} onChange={(e) => setPostAuthor(e.target.value)} placeholder="e.g. Registrar's Office" /></div>
          <div className="form-row"><label className="form-label">Content</label><textarea className="form-input" rows="3" value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Write your announcement..."></textarea></div>
          <div className="form-row"><label className="form-label">Status</label>
            <select className="form-input" value={postStatus} onChange={(e) => setPostStatus(e.target.value)}><option>Draft</option><option>Published</option></select>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => closeModal('modal-new-post')}>Cancel</button>
            <button className="btn btn-primary" onClick={savePost}>Save Post</button>
          </div>
        </div>
      </div>

      {/* Add Event */}
      <div className={`modal-overlay ${activeModal === 'modal-add-event' ? 'open' : ''}`} onClick={handleOverlayClick}>
        <div className="modal">
          <div className="modal-title">Add Event</div>
          <div className="form-row"><label className="form-label">Event Title</label><input className="form-input" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Event name" /></div>
          <div className="form-row"><label className="form-label">Date</label><input type="date" className="form-input" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /></div>
          <div className="form-row"><label className="form-label">End Date (optional)</label><input type="date" className="form-input" value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} /></div>
          <div className="form-row"><label className="form-label">Type</label>
            <select className="form-input" value={eventType} onChange={(e) => setEventType(e.target.value)}><option>Enrollment</option><option>Exams</option><option>Holiday</option><option>Meetings</option></select>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => closeModal('modal-add-event')}>Cancel</button>
            <button className="btn btn-primary" onClick={saveEvent}>Add Event</button>
          </div>
        </div>
      </div>

      {/* Compose Memo */}
      <div className={`modal-overlay ${activeModal === 'modal-compose-memo' ? 'open' : ''}`} onClick={handleOverlayClick}>
        <div className="modal">
          <div className="modal-title">{editingMemoId ? 'Edit Memo' : 'Compose Memo'}</div>
          <div className="form-row"><label className="form-label">From</label><input className="form-input" value={memoFrom} onChange={(e) => setMemoFrom(e.target.value)} placeholder="e.g. Office of the Dean" /></div>
          <div className="form-row"><label className="form-label">To</label>
            <select className="form-input" value={memoTo} onChange={(e) => setMemoTo(e.target.value)}><option>All Faculty Members</option><option>All Students</option><option>All</option><option>Seniors</option></select>
          </div>
          <div className="form-row"><label className="form-label">Subject</label><input className="form-input" value={memoSubj} onChange={(e) => setMemoSubj(e.target.value)} placeholder="Re: ..." /></div>
          <div className="form-row"><label className="form-label">Body</label><textarea className="form-input" rows="4" value={memoBody} onChange={(e) => setMemoBody(e.target.value)} placeholder="Dear Faculty,..."></textarea></div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => closeModal('modal-compose-memo')}>Cancel</button>
            <button className="btn btn-primary" onClick={sendMemo}>{editingMemoId ? 'Save Changes' : 'Send Memo'}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;