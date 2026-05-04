// ============================================
// FILE: src/pages/dashboards/TeacherDashboard.jsx
// PURPOSE: Teacher Dashboard — Dark Theme Edition
// ROLE: teacher only
// FEATURES: Overview, Students, Lesson Plans, Worksheets, Assignments, Grades, Attendance, Announcements
// DESIGN: Dark sidebar, data tables, cards, tabs — matches screenshots 100%
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Users, UserPlus, BookOpen, FileText, GraduationCap, 
  CalendarCheck, Megaphone, Search, Trash2, Edit, X, Check,
  AlertCircle, Plus, Download, Upload, MoreHorizontal, ChevronDown,
  FileUp, Eye, Save, RefreshCw, Clock, Calendar, Mail, Activity
} from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { isTeacher } = useAuth();

  useEffect(() => {
    if (!isTeacher()) {
      navigate('/', { replace: true });
    }
  }, [isTeacher, navigate]);

  return (
    <DashboardLayout role="teacher">
      <div className="min-h-screen" style={{ backgroundColor: '#121212' }}>
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
      </div>
    </DashboardLayout>
  );
};

// ============================================
// TEACHER OVERVIEW TAB
// ============================================
const TeacherOverviewTab = () => {
  const stats = [
    { label: 'STUDENTS', value: '38', sub: 'Grade 9 — Section A', icon: Users },
    { label: 'ASSIGNMENTS', value: '12', sub: '4 pending review', icon: FileText, subColor: '#4ade80' },
    { label: 'ATTENDANCE', value: '94%', sub: 'This week', icon: CalendarCheck },
    { label: 'AVG. GRADE', value: '87.4', sub: '+2.1 vs last month', icon: GraduationCap, subColor: '#4ade80' },
  ];

  const activeAssignments = [
    { title: 'Essay: Romeo & Juliet', date: 'May 3', status: 'Due Today', statusColor: '#ef4444', statusBg: 'rgba(239,68,68,0.15)' },
    { title: 'Math Problem Set 7', date: 'May 6', status: 'Open', statusColor: '#fbbf24', statusBg: 'rgba(251,191,36,0.15)' },
    { title: 'Science Lab Report', date: 'Apr 30', status: 'Graded', statusColor: '#4ade80', statusBg: 'rgba(74,222,128,0.15)' },
    { title: 'History Timeline', date: 'May 9', status: 'Open', statusColor: '#fbbf24', statusBg: 'rgba(251,191,36,0.15)' },
  ];

  const recentActivity = [
    { text: 'Juan dela Cruz submitted Essay draft', time: '2 min ago', color: '#3b82f6' },
    { text: 'Lesson Plan generated from PDF upload', time: '18 min ago', color: '#10b981' },
    { text: 'Maria Santos marked absent', time: '1 hr ago', color: '#ef4444' },
    { text: 'New announcement posted', time: '2 hrs ago', color: '#f59e0b' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-xl p-5" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <p className="text-xs font-semibold tracking-wider text-gray-400 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs" style={{ color: stat.subColor || '#9ca3af' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-5" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
          <h2 className="text-sm font-semibold tracking-wider text-gray-400 mb-4">ACTIVE ASSIGNMENTS</h2>
          <div className="space-y-3">
            {activeAssignments.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: item.statusBg, color: item.statusColor }}>{item.status}</span>
                  <span className="text-sm text-white font-medium">{item.title}</span>
                </div>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
          <h2 className="text-sm font-semibold tracking-wider text-gray-400 mb-4">RECENT ACTIVITY</h2>
          <div className="space-y-4">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-sm text-gray-200">{item.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STUDENTS TAB (CRUD)
// ============================================
const StudentsTab = () => {
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
    const newStudent = { id: Date.now(), ...formData };
    setStudentList([...studentList, newStudent]);
    setFormData({ lrn: '', name: '', email: '', status: 'Active' });
    setShowAddModal(false);
  };

  const handleDelete = (id) => setStudentList(studentList.filter(s => s.id !== id));

  const filtered = studentList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.lrn.includes(searchQuery)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-bold text-white">Students — Grade 9A</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90" style={{ backgroundColor: '#1e3a5f', border: '1px solid #2a4a6f' }}>
          <Plus size={18} /> Add student
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}
        />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#252525' }}>
              {['#', 'NAME', 'LRN', 'EMAIL', 'STATUS', 'ACTIONS'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#2a2a2a' }}>
            {filtered.map((s, i) => (
              <tr key={s.id} className="hover:bg-[#1e1e1e]/5 transition-colors">
                <td className="px-5 py-3.5 text-sm text-gray-400">{i + 1}</td>
                <td className="px-5 py-3.5 text-sm text-white font-medium">{s.name}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{s.lrn}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{s.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    s.status === 'Active' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                  }`}>{s.status}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
                    <span className="text-gray-600">·</span>
                    <button onClick={() => handleDelete(s.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="rounded-xl w-full max-w-md" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#2a2a2a' }}>
              <h2 className="text-lg font-bold text-white">Add New Student</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStudent} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">LRN</label>
                <input type="text" required value={formData.lrn} onChange={e => setFormData({...formData, lrn: e.target.value})} className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500" style={{ backgroundColor: '#252525', border: '1px solid #333' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">FULL NAME</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500" style={{ backgroundColor: '#252525', border: '1px solid #333' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">EMAIL</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500" style={{ backgroundColor: '#252525', border: '1px solid #333' }} />
              </div>
              <button type="submit" className="w-full h-10 rounded-lg text-white text-sm font-semibold hover:opacity-90 mt-1" style={{ backgroundColor: '#1e3a5f' }}>Add Student</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// LESSON PLANS TAB
// ============================================
const LessonPlansTab = () => {
  const [previousPlans] = useState([
    { title: 'Photosynthesis & Cell Energy', date: 'Apr 28', ai: true },
    { title: 'The Philippine Revolution', date: 'Apr 21', ai: false },
    { title: 'Linear Equations & Graphing', date: 'Apr 14', ai: true },
    { title: 'Figurative Language in Poetry', date: 'Apr 7', ai: false },
    { title: 'Plate Tectonics', date: 'Mar 31', ai: true },
  ]);

  const [generatedPlan] = useState({
    title: 'The Human Respiratory System',
    subject: 'Science 9',
    duration: '60 minutes',
    date: 'May 6, 2026',
    strategy: 'Cooperative Learning',
    objectives: [
      'Identify the parts of the respiratory system',
      'Explain how gas exchange occurs in the lungs',
      'Relate respiratory function to overall body health'
    ]
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-white">Lesson Plans</h1>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> AI-Powered Generation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: '#1e1e1e', border: '1px dashed #3a3a3a' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#252525' }}>
              <Upload size={24} className="text-blue-400" />
            </div>
            <p className="text-white font-semibold mb-1">Upload curriculum PDF</p>
            <p className="text-xs text-gray-400 mb-4">Drop your syllabus, textbook chapter, or curriculum guide — AI will auto-generate a structured lesson plan</p>
            <button className="px-5 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#333', border: '1px solid #444' }}>Choose PDF file</button>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{generatedPlan.title}</h3>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-500/15 text-blue-400">AI Generated</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><p className="text-xs text-gray-500 uppercase mb-1">Subject</p><p className="text-sm text-white">{generatedPlan.subject}</p></div>
              <div><p className="text-xs text-gray-500 uppercase mb-1">Duration</p><p className="text-sm text-white">{generatedPlan.duration}</p></div>
              <div><p className="text-xs text-gray-500 uppercase mb-1">Date</p><p className="text-sm text-white">{generatedPlan.date}</p></div>
              <div><p className="text-xs text-gray-500 uppercase mb-1">Strategy</p><p className="text-sm text-white">{generatedPlan.strategy}</p></div>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase mb-2">Learning Objectives</p>
              <div className="space-y-2">
                {generatedPlan.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{obj}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#333', border: '1px solid #444' }}>Save plan</button>
              <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#333', border: '1px solid #444' }}>Edit</button>
              <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#333', border: '1px solid #444' }}>Regenerate</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
          <h2 className="text-sm font-semibold tracking-wider text-gray-400 mb-4">PREVIOUS LESSON PLANS</h2>
          <div className="space-y-3">
            {previousPlans.map((plan, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1e1e1e]/5 transition-colors cursor-pointer">
                <div className="w-8 h-10 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-red-400">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{plan.title}</p>
                  <p className="text-xs text-gray-500">{plan.date}</p>
                </div>
                {plan.ai && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/15 text-green-400">AI</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// WORKSHEETS TAB
// ============================================
const WorksheetsTab = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'English', 'Math', 'Science', 'Filipino', 'Araling Panlipunan'];

  const stats = [
    { label: 'TOTAL WORKSHEETS', value: '24' },
    { label: 'DISTRIBUTED', value: '18', color: '#4ade80' },
    { label: 'DRAFTS', value: '6', color: '#fbbf24' },
  ];

  const worksheetList = [
    { title: 'Parts of Speech — Nouns & Verbs', subject: 'English', pages: '2 pages', items: '20 items', status: 'Distributed', statusColor: '#4ade80' },
    { title: 'Photosynthesis Fill-in-the-Blank', subject: 'Science', pages: '1 page', items: '15 items', status: 'Distributed', statusColor: '#4ade80' },
    { title: 'Linear Equations Practice Set', subject: 'Math', pages: '3 pages', items: '30 items', status: 'Draft', statusColor: '#fbbf24' },
    { title: 'Tayutay at Idyoma — Pagsasanay', subject: 'Filipino', pages: '2 pages', items: '25 items', status: 'Distributed', statusColor: '#4ade80' },
    { title: 'Rebolusyong Pilipino — Timeline', subject: 'AP', pages: '2 pages', items: '18 items', status: 'Distributed', statusColor: '#4ade80' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-bold text-white">Worksheets</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#1e3a5f', border: '1px solid #2a4a6f' }}>
            <Plus size={16} /> Create worksheet
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#2563eb' }}>
            <Upload size={16} /> Upload file
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-xl p-4" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color || '#fff' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: activeFilter === f ? '#333' : 'transparent', border: '1px solid #444', color: activeFilter === f ? '#fff' : '#9ca3af' }}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {worksheetList.map((ws, idx) => (
          <div key={idx} className="rounded-xl p-4" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-16 rounded bg-[#1e1e1e] flex items-center justify-center">
                <div className="w-8 h-1 rounded-full mb-1" style={{ backgroundColor: idx % 2 === 0 ? '#3b82f6' : '#10b981' }} />
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#1e1e1e]/10 text-gray-300">{ws.subject}</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{ws.title}</h3>
            <p className="text-xs text-gray-500 mb-3">{ws.pages} · {ws.items} <span style={{ color: ws.statusColor }}>{ws.status}</span></p>
            <div className="flex gap-2">
              <button className="flex-1 h-9 rounded-lg text-xs font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#333', border: '1px solid #444' }}>Distribute</button>
              <button className="flex-1 h-9 rounded-lg text-xs font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#333', border: '1px solid #444' }}>Preview</button>
            </div>
          </div>
        ))}
        <div className="rounded-xl p-4 flex flex-col items-center justify-center text-center" style={{ backgroundColor: '#1e1e1e', border: '1px dashed #3a3a3a' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#252525' }}>
            <Plus size={20} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-400 mb-3">New worksheet</p>
          <p className="text-xs text-gray-500 mb-3">Create from scratch or upload a file</p>
          <div className="flex gap-2 w-full">
            <button className="flex-1 h-9 rounded-lg text-xs font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#333', border: '1px solid #444' }}><Plus size={14} className="inline mr-1" />Create</button>
            <button className="flex-1 h-9 rounded-lg text-xs font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#333', border: '1px solid #444' }}>Upload</button>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5 flex items-center justify-between" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#252525' }}>
            <Upload size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-white font-medium">Drag & drop worksheet files here</p>
            <p className="text-xs text-gray-500">Supports PDF, DOCX, PNG, JPG — auto-tagged by subject on upload</p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#333', border: '1px solid #444' }}>Browse files</button>
      </div>
    </div>
  );
};

// ============================================
// ASSIGNMENTS TAB
// ============================================
const AssignmentsTab = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Open', 'Due today', 'Graded', 'Draft'];

  const assignmentList = [
    { title: 'Essay: Romeo & Juliet', subject: 'English 9', dueDate: 'May 3, 2026', submitted: '30/38', status: 'Due Today', statusColor: '#ef4444', statusBg: 'rgba(239,68,68,0.15)', action: 'Review' },
    { title: 'Math Problem Set 7', subject: 'Mathematics', dueDate: 'May 6, 2026', submitted: '17/38', status: 'Open', statusColor: '#fbbf24', statusBg: 'rgba(251,191,36,0.15)', action: 'View' },
    { title: 'Science Lab Report', subject: 'Science 9', dueDate: 'Apr 30, 2026', submitted: '38/38', status: 'Graded', statusColor: '#4ade80', statusBg: 'rgba(74,222,128,0.15)', action: 'Results' },
    { title: 'History Timeline Activity', subject: 'Araling Panlipunan', dueDate: 'May 9, 2026', submitted: '3/38', status: 'Open', statusColor: '#fbbf24', statusBg: 'rgba(251,191,36,0.15)', action: 'View' },
    { title: 'Filipino Tula (Draft)', subject: 'Filipino 9', dueDate: 'May 14, 2026', submitted: '0/38', status: 'Draft', statusColor: '#9ca3af', statusBg: 'rgba(156,163,175,0.15)', action: 'Edit' },
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
        <h1 className="text-xl font-bold text-white">Assignments</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#1e3a5f', border: '1px solid #2a4a6f' }}>
          <Plus size={16} /> New assignment
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: activeFilter === f ? '#333' : 'transparent', border: '1px solid #444', color: activeFilter === f ? '#fff' : '#9ca3af' }}>{f}</button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#252525' }}>
              {['TITLE', 'SUBJECT', 'DUE DATE', 'SUBMITTED', 'STATUS', 'ACTIONS'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#2a2a2a' }}>
            {assignmentList.map((a, i) => (
              <tr key={i} className="hover:bg-[#1e1e1e]/5 transition-colors">
                <td className="px-5 py-3.5 text-sm text-white font-medium">{a.title}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{a.subject}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: a.status === 'Due Today' ? '#ef4444' : '#9ca3af' }}>{a.dueDate}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${(parseInt(a.submitted) / 38) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{a.submitted}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: a.statusBg, color: a.statusColor }}>{a.status}</span>
                </td>
                <td className="px-5 py-3.5">
                  <button className="text-xs text-blue-400 hover:text-blue-300">{a.action}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
        <h2 className="text-sm font-semibold tracking-wider text-gray-400 mb-4">RECENT SUBMISSIONS — ESSAY: ROMEO & JULIET</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {submissionList.map((sub, idx) => (
            <div key={idx} className="rounded-lg p-3" style={{ backgroundColor: '#252525' }}>
              <p className="text-sm text-white font-medium mb-0.5">{sub.name}</p>
              <p className="text-xs text-blue-400 mb-1">{sub.file}</p>
              <p className="text-xs text-gray-500">{sub.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// GRADES TAB
// ============================================
const GradesTab = () => {
  const [gradeList] = useState([
    { name: 'Juan dela Cruz', english: 92, math: 88, science: 91, filipino: 89, gwa: 90.0, remarks: 'Passed' },
    { name: 'Maria Santos', english: 85, math: 79, science: 83, filipino: 88, gwa: 83.8, remarks: 'Passed' },
    { name: 'Jose Reyes', english: 72, math: 68, science: 75, filipino: 74, gwa: 72.3, remarks: 'Needs Improvement' },
    { name: 'Ana Lim', english: 95, math: 94, science: 97, filipino: 93, gwa: 94.8, remarks: 'Passed' },
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Grades — Q3 Report</h1>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#1e3a5f', border: '1px solid #2a4a6f' }}>Grades tab</button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#252525' }}>
              {['STUDENT', 'ENGLISH', 'MATH', 'SCIENCE', 'FILIPINO', 'GWA', 'REMARKS'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#2a2a2a' }}>
            {gradeList.map((g, i) => (
              <tr key={i} className="hover:bg-[#1e1e1e]/5 transition-colors">
                <td className="px-5 py-3.5 text-sm text-white font-medium">{g.name}</td>
                <td className="px-5 py-3.5 text-sm text-gray-300">{g.english}</td>
                <td className="px-5 py-3.5 text-sm text-gray-300">{g.math}</td>
                <td className="px-5 py-3.5 text-sm text-gray-300">{g.science}</td>
                <td className="px-5 py-3.5 text-sm text-gray-300">{g.filipino}</td>
                <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: g.gwa >= 75 ? '#4ade80' : '#ef4444' }}>{g.gwa.toFixed(1)}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${g.remarks === 'Passed' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>{g.remarks}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// ATTENDANCE TAB
// ============================================
const TeacherAttendanceTab = () => {
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
      const current = row[field];
      const nextIdx = (order.indexOf(current) + 1) % order.length;
      return { ...row, [field]: order[nextIdx] };
    }));
  };

  const getBadgeStyle = (status) => {
    if (status === 'P') return { bg: 'rgba(74,222,128,0.15)', color: '#4ade80' };
    if (status === 'A') return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' };
    return { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Attendance — May 3, 2026</h1>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#1e3a5f', border: '1px solid #2a4a6f' }}>Save records</button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#252525' }}>
              {['STUDENT', 'APR 29', 'APR 30', 'MAY 2', 'MAY 3 (TODAY)', 'RATE'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#2a2a2a' }}>
            {attendanceData.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#1e1e1e]/5 transition-colors">
                <td className="px-5 py-3.5 text-sm text-white font-medium">{row.name}</td>
                {['apr29', 'apr30', 'may2', 'may3'].map(field => {
                  const style = getBadgeStyle(row[field]);
                  return (
                    <td key={field} className="px-5 py-3.5">
                      <button onClick={() => toggleStatus(idx, field)} className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors" style={{ backgroundColor: style.bg, color: style.color }}>{row[field]}</button>
                    </td>
                  );
                })}
                <td className="px-5 py-3.5 text-sm font-semibold text-white">{row.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// ANNOUNCEMENTS TAB (CRUD)
// ============================================
const TeacherAnnouncementsTab = () => {
  const [announcementList, setAnnouncementList] = useState([
    { id: 1, title: 'No classes on May 12 — Independence Day', content: 'School is suspended on May 12, 2026 in observance of Philippine Independence Day. All pending submissions have been extended by one day.', date: 'May 3', tag: 'Holiday', tagColor: '#3b82f6', tagBg: 'rgba(59,130,246,0.15)' },
    { id: 2, title: 'Essay deadline reminder — Romeo & Juliet', content: 'Please submit your essays via the portal by 11:59 PM today. Late submissions will receive point deductions.', date: 'May 2', tag: 'Urgent', tagColor: '#ef4444', tagBg: 'rgba(239,68,68,0.15)' },
    { id: 3, title: 'Quarter 4 parent-teacher conference schedule', content: "PTC is scheduled for May 17, 2026. Please inform your parents to confirm attendance via the school's SMS system.", date: 'Apr 28', tag: 'Event', tagColor: '#4ade80', tagBg: 'rgba(74,222,128,0.15)' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', tag: 'Event' });

  const handleAdd = (e) => {
    e.preventDefault();
    const colors = {
      'Holiday': { tagColor: '#3b82f6', tagBg: 'rgba(59,130,246,0.15)' },
      'Urgent': { tagColor: '#ef4444', tagBg: 'rgba(239,68,68,0.15)' },
      'Event': { tagColor: '#4ade80', tagBg: 'rgba(74,222,128,0.15)' },
    };
    const newAnnouncement = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...colors[formData.tag]
    };
    setAnnouncementList([newAnnouncement, ...announcementList]);
    setFormData({ title: '', content: '', tag: 'Event' });
    setShowAddModal(false);
  };

  const handleDelete = (id) => setAnnouncementList(announcementList.filter(a => a.id !== id));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Announcements</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: '#1e3a5f', border: '1px solid #2a4a6f' }}>
          <Plus size={16} /> Post announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcementList.map(a => (
          <div key={a.id} className="rounded-xl p-5" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: a.tagBg, color: a.tagColor }}>{a.tag}</span>
                  <span className="text-xs text-gray-500">{a.date}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{a.title}</h3>
                <p className="text-sm text-gray-400">{a.content}</p>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="rounded-xl w-full max-w-lg" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#2a2a2a' }}>
              <h2 className="text-lg font-bold text-white">Post Announcement</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">TITLE</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500" style={{ backgroundColor: '#252525', border: '1px solid #333' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">CONTENT</label>
                <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" style={{ backgroundColor: '#252525', border: '1px solid #333' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">TAG</label>
                <select value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500" style={{ backgroundColor: '#252525', border: '1px solid #333' }}>
                  <option value="Holiday">Holiday</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <button type="submit" className="w-full h-10 rounded-lg text-white text-sm font-semibold hover:opacity-90 mt-1" style={{ backgroundColor: '#1e3a5f' }}>Post Announcement</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;