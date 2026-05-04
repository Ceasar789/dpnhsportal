// ============================================
// FILE: src/pages/dashboards/StudentDashboard.jsx
// PURPOSE: Student Dashboard
// ROLE: student only
// FEATURES: Overview, Assignments, Quizzes, Attendance, Announcements
// DESIGN: Clean cards, progress bars, list views
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  ClipboardList, FileText, CalendarCheck, Megaphone,
  Clock, CheckCircle, AlertTriangle, BookOpen
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { isStudent } = useAuth();

  useEffect(() => {
    if (!isStudent()) {
      navigate('/', { replace: true });
    }
  }, [isStudent, navigate]);

  return (
    <DashboardLayout role="student">
      <Routes>
        <Route path="/" element={<StudentOverviewTab />} />
        <Route path="/assignments" element={<AssignmentsTab />} />
        <Route path="/quizzes" element={<QuizzesTab />} />
        <Route path="/attendance" element={<StudentAttendanceTab />} />
        <Route path="/announcements" element={<StudentAnnouncementsTab />} />
      </Routes>
    </DashboardLayout>
  );
};

// ============================================
// STUDENT OVERVIEW TAB
// ============================================
const StudentOverviewTab = () => {
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
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="font-work font-bold text-2xl text-[#1a2b4a]">
          Welcome back, {studentInfo.name}!
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Grade {studentInfo.grade}-{studentInfo.section} | ID: {studentInfo.studentId}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <span className="text-sm text-[#64748B]">Average Grade</span>
          </div>
          <p className="text-3xl font-bold text-[#1a2b4a]">{studentInfo.avgGrade}%</p>
        </div>

        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CalendarCheck size={20} className="text-green-600" />
            </div>
            <span className="text-sm text-[#64748B]">Attendance</span>
          </div>
          <p className="text-3xl font-bold text-[#1a2b4a]">{studentInfo.attendanceRate}%</p>
        </div>

        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <ClipboardList size={20} className="text-yellow-600" />
            </div>
            <span className="text-sm text-[#64748B]">Pending Tasks</span>
          </div>
          <p className="text-3xl font-bold text-[#1a2b4a]">3</p>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E8F0' }}>
        <h2 className="font-work font-bold text-lg text-[#1a2b4a] mb-4">Upcoming Tasks</h2>
        <div className="space-y-3">
          {upcoming.map((task, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                task.type === 'assignment' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                {task.type === 'assignment' ? (
                  <ClipboardList size={20} className="text-blue-600" />
                ) : (
                  <FileText size={20} className="text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#1a2b4a]">{task.title}</p>
                <p className="text-xs text-[#64748B]">{task.subject}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
                  <Clock size={14} />
                  Due {task.due}
                </div>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// ASSIGNMENTS TAB
// ============================================
const AssignmentsTab = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <h1 className="font-work font-bold text-2xl text-[#1a2b4a] mb-6">My Assignments</h1>
    <div className="space-y-4">
      {[
        { title: 'Math Problem Set #3', subject: 'Mathematics', due: 'Apr 30, 2024', status: 'pending', progress: 60 },
        { title: 'English Essay', subject: 'English', due: 'May 5, 2024', status: 'pending', progress: 30 },
        { title: 'Science Lab Report', subject: 'Science', due: 'May 10, 2024', status: 'submitted', progress: 100 },
      ].map((assignment, i) => (
        <div key={i} className="bg-white rounded-lg border p-5" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-[#1a2b4a]">{assignment.title}</h3>
              <p className="text-xs text-[#64748B]">{assignment.subject}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              assignment.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {assignment.status}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${assignment.progress}%`,
                  backgroundColor: assignment.status === 'submitted' ? '#059669' : '#FEB300'
                }}
              />
            </div>
            <span className="text-xs text-[#64748B]">{assignment.progress}%</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
            <Clock size={14} />
            Due {assignment.due}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// QUIZZES TAB
// ============================================
const QuizzesTab = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <h1 className="font-work font-bold text-2xl text-[#1a2b4a] mb-6">My Quizzes</h1>
    <div className="space-y-4">
      {[
        { title: 'Science Quiz: Biology', subject: 'Science', date: 'May 2, 2024', score: null, total: 50 },
        { title: 'Math Quiz: Algebra', subject: 'Mathematics', date: 'Apr 20, 2024', score: 42, total: 50 },
        { title: 'History Quiz: WWII', subject: 'Araling Panlipunan', date: 'Apr 15, 2024', score: 38, total: 40 },
      ].map((quiz, i) => (
        <div key={i} className="bg-white rounded-lg border p-5" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-[#1a2b4a]">{quiz.title}</h3>
              <p className="text-xs text-[#64748B]">{quiz.subject}</p>
              <p className="text-xs text-[#94A3B8] mt-1">{quiz.date}</p>
            </div>
            {quiz.score !== null ? (
              <div className="text-right">
                <p className="text-2xl font-bold text-[#1a2b4a]">{quiz.score}/{quiz.total}</p>
                <p className="text-xs text-[#64748B]">{((quiz.score/quiz.total)*100).toFixed(0)}%</p>
              </div>
            ) : (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                Upcoming
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// ATTENDANCE TAB
// ============================================
const StudentAttendanceTab = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <h1 className="font-work font-bold text-2xl text-[#1a2b4a] mb-6">My Attendance</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg border p-6 text-center" style={{ borderColor: '#E2E8F0' }}>
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <CheckCircle size={24} className="text-green-600" />
        </div>
        <p className="text-3xl font-bold text-[#1a2b4a]">45</p>
        <p className="text-sm text-[#64748B]">Present</p>
      </div>
      <div className="bg-white rounded-lg border p-6 text-center" style={{ borderColor: '#E2E8F0' }}>
        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
          <Clock size={24} className="text-yellow-600" />
        </div>
        <p className="text-3xl font-bold text-[#1a2b4a]">2</p>
        <p className="text-sm text-[#64748B]">Late</p>
      </div>
      <div className="bg-white rounded-lg border p-6 text-center" style={{ borderColor: '#E2E8F0' }}>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={24} className="text-red-600" />
        </div>
        <p className="text-3xl font-bold text-[#1a2b4a]">1</p>
        <p className="text-sm text-[#64748B]">Absent</p>
      </div>
    </div>
  </div>
);

// ============================================
// ANNOUNCEMENTS TAB
// ============================================
const StudentAnnouncementsTab = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <h1 className="font-work font-bold text-2xl text-[#1a2b4a] mb-6">Announcements</h1>
    <div className="space-y-4">
      {[
        { title: 'Quiz on Monday', content: 'Prepare for Math quiz on Chapter 5', date: 'Apr 25, 2024', from: 'Mr. Santos' },
        { title: 'Project Deadline Extended', content: 'Science project now due May 10', date: 'Apr 24, 2024', from: 'Ms. Cruz' },
        { title: 'Field Trip Permission Slip', content: 'Please submit signed forms by Friday', date: 'Apr 23, 2024', from: 'Principal' },
      ].map((announcement, i) => (
        <div key={i} className="bg-white rounded-lg border p-5" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#FEB300] text-[#6A4800]">NEW</span>
            <span className="text-xs text-[#94A3B8]">{announcement.date}</span>
          </div>
          <h3 className="font-semibold text-[#1a2b4a] mb-1">{announcement.title}</h3>
          <p className="text-sm text-[#64748B] mb-2">{announcement.content}</p>
          <p className="text-xs text-[#94A3B8]">From: {announcement.from}</p>
        </div>
      ))}
    </div>
  </div>
);

export default StudentDashboard;