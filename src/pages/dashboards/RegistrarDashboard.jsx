// ============================================
// FILE: src/pages/dashboards/RegistrarDashboard.jsx
// PURPOSE: Registrar Dashboard — 100% match to all 3 illustrations
// ROLE: registrar only
// SCREENS: Dashboard, Overview, Pre-Enrollment
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Search, Check, Users, ClipboardList, LayoutDashboard,
  Calendar, FileText, BarChart2, Settings, HelpCircle,
  MoreHorizontal, MessageSquare, RotateCcw,
} from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  navy:       '#1B2A4A',
  navyDark:   '#152035',
  navyMid:    '#243C6B',
  gold:       '#C9A84C',
  bg:         '#F0F2F5',
  surface:    '#FFFFFF',
  border:     '#E2E8F0',
  muted:      '#64748B',
  mutedLight: '#94A3B8',
  green:      '#16A34A',
  greenBg:    '#DCFCE7',
  greenText:  '#15803D',
  amber:      '#D97706',
  amberBg:    '#FEF3C7',
  amberText:  '#92400E',
  red:        '#DC2626',
  redBg:      '#FEE2E2',
  redText:    '#991B1B',
  blue:       '#2563EB',
  purple:     '#7C3AED',
};

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
const SIDEBAR_NAV = [
  { label: 'Dashboard',       icon: LayoutDashboard, path: '/registrar-dashboard',                badge: null },
  { label: 'Student Records', icon: Users,            path: '/registrar-dashboard/students',       badge: null },
  { label: 'Pre-Enrollment',  icon: ClipboardList,    path: '/registrar-dashboard/pre-enrollment', badge: 12   },
  { label: 'Scheduling',      icon: Calendar,         path: '/registrar-dashboard/scheduling',     badge: null },
  { label: 'Documents',       icon: FileText,         path: '/registrar-dashboard/documents',      badge: null },
  { label: 'Analytics',       icon: BarChart2,        path: '/registrar-dashboard/analytics',      badge: null },
];
const SIDEBAR_BOTTOM = [
  { label: 'Settings',       icon: Settings,   path: '/registrar-dashboard/settings' },
  { label: 'Help & Support', icon: HelpCircle, path: '/registrar-dashboard/help' },
];

// Content tabs shown across the top header area
const CONTENT_TABS = [
  { label: 'Overview',       path: '/registrar-dashboard/overview' },
  { label: 'Pre-Enrollment', path: '/registrar-dashboard/pre-enrollment' },
  { label: 'Enrollment',     path: '/registrar-dashboard/enrollment' },
  { label: 'Clearances',     path: '/registrar-dashboard/clearances' },
  { label: 'Grade Reports',  path: '/registrar-dashboard/grade-reports' },
  { label: 'Archives',       path: '/registrar-dashboard/archives' },
];

// ─── SVG Donut Chart ─────────────────────────────────────────────────────────
const DonutChart = ({ slices, total }) => {
  const cx = 80, cy = 80, r = 58, sw = 22;
  const circ = 2 * Math.PI * r;
  let cumulative = 0;
  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {slices.map((s, i) => {
        const dash   = (s.pct / 100) * circ;
        const gap    = circ - dash;
        const rotate = (cumulative / 100) * 360 - 90;
        cumulative  += s.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${dash} ${gap}`}
            style={{ transform: `rotate(${rotate}deg)`, transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
      <text x={cx} y={cy - 7} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.navy}>
        {total.toLocaleString()}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize={11} fill={C.muted}>students</text>
    </svg>
  );
};

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_MAP = {
  pending:    { bg: '#FEF3C7', color: '#92400E', label: 'Pending'    },
  approved:   { bg: '#DCFCE7', color: '#15803D', label: 'Approved'   },
  incomplete: { bg: '#FEF9C3', color: '#854D0E', label: 'Incomplete' },
  rejected:   { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected'   },
};
const StatusPill = ({ status, size = 11 }) => {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: size,
      fontWeight: 700, padding: '3px 10px', borderRadius: 20,
    }}>{s.label}</span>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT SHELL
// ══════════════════════════════════════════════════════════════════════════════
const RegistrarDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRegistrar, currentUser } = useAuth();

  useEffect(() => {
    if (!isRegistrar()) navigate('/', { replace: true });
  }, [isRegistrar, navigate]);

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AR';

  // Sidebar active: exact match for root, startsWith for all others
  const isSidebarActive = (path) =>
    path === '/registrar-dashboard'
      ? location.pathname === '/registrar-dashboard' || location.pathname === '/registrar-dashboard/'
      : location.pathname.startsWith(path);

  // Tab active: exact match for all content tabs (they all have sub-paths)
  const isTabActive = (path) => location.pathname === path || location.pathname === path + '/';

  return (
    <DashboardLayout role="registrar">
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* ══ SIDEBAR ══ */}
        <aside style={{
          width: 195, background: C.navy, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
        }}>
          {/* Logo */}
          <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: C.gold, flexShrink: 0, overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.navy, fontWeight: 800, fontSize: 15,
              }}>
                <img src="/capstonelogo.png" alt="Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: 11.5, fontWeight: 700, fontFamily: 'Georgia,serif', lineHeight: 1.3 }}>
                  University Registrar
                </p>
                <p style={{ color: '#7A9ABF', fontSize: 9, lineHeight: 1.2 }}>Academic Records System</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
            {SIDEBAR_NAV.map(item => {
              const active = isSidebarActive(item.path);
              return (
                <button key={item.path} onClick={() => navigate(item.path)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  marginBottom: 2, textAlign: 'left',
                  background: active ? 'rgba(201,168,76,0.13)' : 'transparent',
                  color: active ? C.gold : '#8FA8C8',
                  fontWeight: active ? 600 : 400, fontSize: 13,
                  borderLeft: active ? `3px solid ${C.gold}` : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#8FA8C8'; }}
                >
                  <item.icon size={15} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      background: '#E8811A', color: '#fff', fontSize: 10,
                      fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                    }}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom nav */}
          <div style={{ padding: '6px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {SIDEBAR_BOTTOM.map(item => (
              <button key={item.path} onClick={() => navigate(item.path)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                background: 'transparent', color: '#6B88B0', fontSize: 12,
                marginBottom: 2, textAlign: 'left', transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B88B0'}
              >
                <item.icon size={14} style={{ flexShrink: 0 }} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Semester */}
          <div style={{ padding: '12px 14px 18px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: '#6B88B0', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
              Current Semester
            </p>
            <p style={{ color: C.gold, fontSize: 13.5, fontWeight: 700, fontFamily: 'Georgia,serif', lineHeight: 1.2 }}>
              AY 2025–2026
            </p>
            <p style={{ color: '#fff', fontSize: 11.5, marginTop: 1 }}>2nd Semester</p>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <div style={{ marginLeft: 195, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Header */}
          <header style={{
            background: C.surface, borderBottom: `1px solid ${C.border}`,
            height: 52, display: 'flex', alignItems: 'center',
            padding: '0 22px', justifyContent: 'space-between',
            flexShrink: 0, zIndex: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: C.navy, fontSize: 13.5, fontWeight: 700 }}>University Registrar</span>
              <span style={{ color: C.mutedLight, fontSize: 12 }}>·</span>
              <span style={{ color: C.muted, fontSize: 12 }}>Academic Records System</span>
            </div>
            <nav style={{ display: 'flex' }}>
              {CONTENT_TABS.map(tab => {
                const active = isTabActive(tab.path);
                return (
                  <button key={tab.path} onClick={() => navigate(tab.path)} style={{
                    padding: '0 14px', height: 52, border: 'none', cursor: 'pointer',
                    background: 'transparent', fontSize: 13,
                    color: active ? C.navy : C.mutedLight, fontWeight: active ? 700 : 400,
                    borderBottom: active ? `2px solid ${C.navy}` : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}>{tab.label}</button>
                );
              })}
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>
                {currentUser?.displayName || 'Admin Registrar'}
              </span>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: C.navy,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 12,
              }}>{initials}</div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>
                <MoreHorizontal size={17} />
              </button>
            </div>
          </header>

          {/* Pages */}
          <main style={{ flex: 1, overflowY: 'auto', background: C.bg }}>
            <Routes>
              <Route path="/"               element={<DashboardTab />} />
              <Route path="/overview"       element={<OverviewTab />} />
              <Route path="/pre-enrollment" element={<PreEnrollmentTab />} />
              <Route path="*"               element={<DashboardTab />} />
            </Routes>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREENSHOT 1 — Dashboard Tab
// ══════════════════════════════════════════════════════════════════════════════
const DashboardTab = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const kpis = [
    { label: 'Total Students',    value: '4,821', sub: '▲ 3.2% from last sem',    subColor: C.green,  topColor: C.navy   },
    { label: 'Pending Pre-Enroll',value: '247',   sub: '△ Needs attention',        subColor: C.amber,  topColor: C.amber  },
    { label: 'Enrolled This Sem', value: '3,590', sub: '● 74.5% enrollment rate',  subColor: C.green,  topColor: C.green  },
    { label: 'Docs for Review',   value: '89',    sub: '△ 12 urgent',              subColor: C.amber,  topColor: C.purple },
  ];

  const bars = [
    { dept: 'BSCS', prev: 68, curr: 55 },
    { dept: 'BSBA', prev: 55, curr: 82 },
    { dept: 'BSED', prev: 80, curr: 50 },
    { dept: 'BSN',  prev: 45, curr: 74 },
  ];

  const activity = [
    { dot: C.gold,  action: 'Pre-enroll approved', who: 'Juan D.',  when: '2 min ago'  },
    { dot: C.green, action: 'Document verified',   who: 'Maria S.', when: '8 min ago'  },
    { dot: C.red,   action: 'Clearance flagged',   who: 'Pedro R.', when: '15 min ago' },
    { dot: C.navy,  action: 'New enrollment form', who: 'Ana L.',   when: '22 min ago' },
  ];

  const announcements = [
    { text: 'Enrollment deadline: May 15, 2026', gold: true },
    { text: 'Grade submission extended to May 20' },
    { text: 'Faculty load review ongoing' },
    { text: 'New clearance workflow deployed' },
  ];

  const quickActions = [
    { label: '+ Enroll Student',  bg: C.navy,  color: '#fff',   border: 'none',                  path: '/registrar-dashboard/enrollment' },
    { label: 'Generate Report',   bg: '#fff',  color: C.navy,   border: `1px solid ${C.border}`, path: null },
    { label: 'Review Documents',  bg: '#fff',  color: C.navy,   border: `1px solid ${C.border}`, path: '/registrar-dashboard/documents'  },
    { label: 'Process Clearance', bg: C.gold,  color: C.navy,   border: 'none',                  path: '/registrar-dashboard/clearances' },
  ];

  return (
    <div style={{ padding: '24px 26px' }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ color: C.navy, fontSize: 21, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 2 }}>
          Registrar Dashboard
        </h1>
        <p style={{ color: C.muted, fontSize: 12.5 }}>
          Welcome back, {currentUser?.displayName || 'Admin Registrar'} · {new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        {kpis.map(c => (
          <div key={c.label} style={{
            background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
            borderTop: `4px solid ${c.topColor}`, padding: '16px 18px',
          }}>
            <p style={{ fontSize: 11.5, color: C.muted, marginBottom: 4 }}>{c.label}</p>
            <p style={{ fontSize: 30, fontWeight: 700, color: C.navy, fontFamily: 'Georgia,serif', lineHeight: 1, marginBottom: 4 }}>
              {c.value}
            </p>
            <p style={{ fontSize: 11, color: c.subColor }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 255px', gap: 14, marginBottom: 14 }}>
        {/* Bar chart */}
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: '18px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ color: C.navy, fontSize: 14.5, fontWeight: 700, fontFamily: 'Georgia,serif' }}>
              Enrollment Trend by Department
            </h2>
            <span style={{ color: C.muted, fontSize: 11.5 }}>Academic Year 2025–2026</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, height: 140 }}>
            {bars.map(d => (
              <div key={d.dept} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', display: 'flex', gap: 5, alignItems: 'flex-end', height: 130 }}>
                  <div style={{ flex: 1, background: C.navy, borderRadius: '3px 3px 0 0', height: `${d.prev * 1.3}px` }} />
                  <div style={{ flex: 1, background: C.gold, borderRadius: '3px 3px 0 0', height: `${d.curr * 1.3}px` }} />
                </div>
                <span style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{d.dept}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 12, paddingLeft: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 11, height: 11, background: C.navy, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: C.muted }}>2024–2025</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 11, height: 11, background: C.gold, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: C.muted }}>2025–2026</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: '18px 18px' }}>
          <h2 style={{ color: C.navy, fontSize: 14.5, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 16 }}>
            Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.dot, flexShrink: 0, marginTop: 3 }} />
                <div>
                  <p style={{ fontSize: 13, color: C.navy, fontWeight: 500, lineHeight: 1.3 }}>{a.action}</p>
                  <p style={{ fontSize: 11, color: C.muted }}>{a.who} · {a.when}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: C.navy, borderRadius: 12, padding: '18px 22px' }}>
          <h2 style={{ color: '#fff', fontSize: 14.5, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 14 }}>
            Announcements
          </h2>
          {announcements.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: a.gold ? C.gold : '#3D5A82' }} />
              <span style={{ fontSize: 13, color: a.gold ? C.gold : '#C5D8EE', fontWeight: a.gold ? 600 : 400 }}>
                {a.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: '18px 22px' }}>
          <h2 style={{ color: C.navy, fontSize: 14.5, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 14 }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickActions.map(btn => (
              <button key={btn.label} onClick={() => btn.path && navigate(btn.path)} style={{
                padding: '13px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                fontWeight: 600, background: btn.bg, color: btn.color, border: btn.border,
                transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.84'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >{btn.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREENSHOT 2 — Overview Tab
// ══════════════════════════════════════════════════════════════════════════════
const OverviewTab = () => {
  const navigate = useNavigate();

  const colleges = [
    { name: 'College of Arts & Sciences', count: 945, color: C.navy,    pct: 100 },
    { name: 'College of Engineering',     count: 810, color: C.navy,    pct: 85  },
    { name: 'College of Nursing',         count: 638, color: C.gold,    pct: 67  },
    { name: 'College of Business Admin',  count: 557, color: C.gold,    pct: 59  },
    { name: 'College of Education',       count: 423, color: C.navy,    pct: 45  },
    { name: 'CICT',                       count: 215, color: '#9B2226', pct: 23  },
  ];

  const donutSlices = [
    { pct: 32, color: C.navy,    label: '1st Year 32%' },
    { pct: 28, color: '#2D6A4F', label: '2nd Year 28%' },
    { pct: 22, color: '#9B2226', label: '3rd Year 22%' },
    { pct: 18, color: C.gold,    label: '4th Year 18%' },
  ];

  const semSteps = [
    { label: 'Pre-enrollment', sub: 'Completed',   status: 'done'    },
    { label: 'Registration',   sub: 'Completed',   status: 'done'    },
    { label: 'Enrollment',     sub: 'In Progress', status: 'active'  },
    { label: 'Midterms',       sub: 'Upcoming',    status: 'upcoming'},
    { label: 'Finals',         sub: 'Upcoming',    status: 'upcoming'},
    { label: 'Graduation',     sub: 'Upcoming',    status: 'upcoming'},
  ];

  const recent = [
    { no: '2024-00821', name: 'Dela Cruz, Juan M.', course: 'BSCS', year: '2nd', status: 'Enrolled', date: 'May 2' },
    { no: '2025-00134', name: 'Santos, Maria C.',   course: 'BSN',  year: '1st', status: 'Enrolled', date: 'May 2' },
    { no: '2025-00215', name: 'Reyes, Pedro L.',    course: 'BSBA', year: '1st', status: 'Pending',  date: 'May 1' },
  ];

  const kpis = [
    { label: 'Enrolled',     value: '3,590', sub: '▲ 3.2%',  subColor: C.green },
    { label: 'Irregular',    value: '412',   sub: '11.5%',   subColor: C.muted },
    { label: 'New Students', value: '821',   sub: 'freshmen',subColor: C.muted },
    { label: 'Transferees',  value: '134',   sub: 'this sem',subColor: C.gold  },
    { label: 'Graduating',   value: '298',   sub: 'May 2026',subColor: C.gold  },
  ];

  return (
    <div style={{ padding: '24px 26px' }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ color: C.navy, fontSize: 21, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 2 }}>
          Overview
        </h1>
        <p style={{ color: C.muted, fontSize: 12.5 }}>Semester at a glance · 2nd Semester 2025–2026</p>
      </div>

      {/* Top KPI strip */}
      <div style={{
        background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
        padding: '16px 0', marginBottom: 16,
        display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
      }}>
        {kpis.map((k, i) => (
          <div key={k.label} style={{
            padding: '0 22px',
            borderRight: i < 4 ? `1px solid ${C.border}` : 'none',
          }}>
            <p style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{k.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: C.navy, fontFamily: 'Georgia,serif', lineHeight: 1, marginBottom: 3 }}>
              {k.value}
            </p>
            <p style={{ fontSize: 11, color: k.subColor }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Middle 3-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 210px 180px', gap: 14, marginBottom: 16 }}>

        {/* College bars */}
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: '18px 22px' }}>
          <h2 style={{ color: C.navy, fontSize: 14.5, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 16 }}>
            Enrollment by College
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {colleges.map(c => (
              <div key={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: C.navy }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{c.count}</span>
                </div>
                <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: c.color, borderRadius: 4, width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: '18px 16px' }}>
          <h2 style={{ color: C.navy, fontSize: 14.5, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 10 }}>
            Year Level
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <DonutChart slices={donutSlices} total={3590} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {donutSlices.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: C.muted }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sem Progress */}
        <div style={{ background: C.navy, borderRadius: 12, padding: '18px 18px' }}>
          <h2 style={{ color: '#fff', fontSize: 14.5, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 14 }}>
            Sem Progress
          </h2>
          {semSteps.map((s, i) => (
            <div key={s.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                  background: s.status === 'done' ? C.green : s.status === 'active' ? C.gold : '#2A4A7A',
                  border: s.status === 'upcoming' ? '1px solid #3A5A8A' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {s.status === 'done' && <Check size={8} color="#fff" strokeWidth={3} />}
                </div>
                {i < semSteps.length - 1 && (
                  <div style={{ width: 1, height: 10, background: s.status === 'done' ? '#2D5A3A' : '#2A4A7A', marginTop: 2 }} />
                )}
              </div>
              <div>
                <p style={{
                  fontSize: 12.5, lineHeight: 1.2,
                  color: s.status === 'done' ? '#fff' : s.status === 'active' ? C.gold : '#4A6A9A',
                  fontWeight: s.status === 'active' ? 700 : 400,
                }}>{s.label}</p>
                <p style={{
                  fontSize: 10.5,
                  color: s.status === 'done' ? '#4A7A9A' : s.status === 'active' ? '#B8942A' : '#3A5A7A',
                }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Enrollees */}
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{
          padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h2 style={{ color: C.navy, fontSize: 14.5, fontWeight: 700, fontFamily: 'Georgia,serif' }}>
            Recent Enrollees
          </h2>
          <button
            onClick={() => navigate('/registrar-dashboard/students')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.blue, fontWeight: 600 }}
          >
            View All →
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FA' }}>
              {['STUDENT NO.', 'NAME', 'COURSE', 'YEAR', 'STATUS', 'DATE'].map(h => (
                <th key={h} style={{
                  padding: '9px 20px', textAlign: 'left', fontSize: 10.5,
                  fontWeight: 700, color: C.mutedLight,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map(r => (
              <tr key={r.no}
                style={{ borderTop: `1px solid ${C.border}`, transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 20px', fontSize: 12.5, color: C.muted }}>{r.no}</td>
                <td style={{ padding: '12px 20px', fontSize: 13, color: C.navy, fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: '12px 20px', fontSize: 12.5, color: C.muted }}>{r.course}</td>
                <td style={{ padding: '12px 20px', fontSize: 12.5, color: C.muted }}>{r.year}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                    background: r.status === 'Enrolled' ? C.greenBg : C.amberBg,
                    color: r.status === 'Enrolled' ? C.greenText : C.amberText,
                  }}>{r.status}</span>
                </td>
                <td style={{ padding: '12px 20px', fontSize: 12.5, color: C.muted }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREENSHOT 3 — Pre-Enrollment Tab
// ══════════════════════════════════════════════════════════════════════════════
const PreEnrollmentTab = () => {
  const [enrollments, setEnrollments] = useState([
    {
      id: 1, initials: 'JD', avatarBg: '#1B2A4A',
      studentName: 'Dela Cruz, Juan M.', studentNo: '2024-00821',
      course: 'BSCS', year: '2nd', status: 'pending',
      submittedAt: 'May 1, 2026',
      email: 'j.delacruz@student.edu.ph',
      contact: '+63 917 555 0821',
      address: 'Quezon City, Metro Manila',
      documents: {
        reportCard:  { label: 'Form 138 (Report Card)',    done: true  },
        birthCert:   { label: 'PSA Birth Certificate',     done: true  },
        goodMoral:   { label: 'Good Moral Certificate',    done: true  },
        idPhoto:     { label: '2x2 ID Photo',              done: false },
        medicalCert: { label: 'Medical Certificate',       done: false },
        certEnroll:  { label: 'Certificate of Enrollment', done: true  },
      },
    },
    {
      id: 2, initials: 'MS', avatarBg: '#2D6A4F',
      studentName: 'Santos, Maria C.', studentNo: '2025-00134',
      course: 'BSN', year: '1st', status: 'approved',
      submittedAt: 'Apr 30, 2026',
      email: 'm.santos@student.edu.ph',
      contact: '+63 998 765 4321',
      address: 'Makati City, Metro Manila',
      documents: {
        reportCard:  { label: 'Form 138 (Report Card)',    done: true },
        birthCert:   { label: 'PSA Birth Certificate',     done: true },
        goodMoral:   { label: 'Good Moral Certificate',    done: true },
        idPhoto:     { label: '2x2 ID Photo',              done: true },
        medicalCert: { label: 'Medical Certificate',       done: true },
        certEnroll:  { label: 'Certificate of Enrollment', done: true },
      },
    },
    {
      id: 3, initials: 'PR', avatarBg: '#7A3A3A',
      studentName: 'Reyes, Pedro L.', studentNo: '2025-00215',
      course: 'BSBA', year: '1st', status: 'incomplete',
      submittedAt: 'Apr 29, 2026',
      email: 'p.reyes@student.edu.ph',
      contact: '+63 911 222 3344',
      address: 'Pasig City, Metro Manila',
      documents: {
        reportCard:  { label: 'Form 138 (Report Card)',    done: true  },
        birthCert:   { label: 'PSA Birth Certificate',     done: false },
        goodMoral:   { label: 'Good Moral Certificate',    done: false },
        idPhoto:     { label: '2x2 ID Photo',              done: true  },
        medicalCert: { label: 'Medical Certificate',       done: false },
        certEnroll:  { label: 'Certificate of Enrollment', done: true  },
      },
    },
    {
      id: 4, initials: 'AL', avatarBg: '#3A5A7A',
      studentName: 'Lim, Ana B.', studentNo: '2025-00301',
      course: 'BSED', year: '1st', status: 'approved',
      submittedAt: 'Apr 28, 2026',
      email: 'a.lim@student.edu.ph',
      contact: '+63 922 333 4455',
      address: 'Taguig City, Metro Manila',
      documents: {
        reportCard:  { label: 'Form 138 (Report Card)',    done: true },
        birthCert:   { label: 'PSA Birth Certificate',     done: true },
        goodMoral:   { label: 'Good Moral Certificate',    done: true },
        idPhoto:     { label: '2x2 ID Photo',              done: true },
        medicalCert: { label: 'Medical Certificate',       done: true },
        certEnroll:  { label: 'Certificate of Enrollment', done: true },
      },
    },
    {
      id: 5, initials: 'RG', avatarBg: '#6A6A3A',
      studentName: 'Garcia, Ramon T.', studentNo: '2024-00990',
      course: 'BSCS', year: '3rd', status: 'pending',
      submittedAt: 'Apr 28, 2026',
      email: 'r.garcia@student.edu.ph',
      contact: '+63 933 444 5566',
      address: 'Mandaluyong, Metro Manila',
      documents: {
        reportCard:  { label: 'Form 138 (Report Card)',    done: false },
        birthCert:   { label: 'PSA Birth Certificate',     done: true  },
        goodMoral:   { label: 'Good Moral Certificate',    done: false },
        idPhoto:     { label: '2x2 ID Photo',              done: false },
        medicalCert: { label: 'Medical Certificate',       done: true  },
        certEnroll:  { label: 'Certificate of Enrollment', done: false },
      },
    },
  ]);

  const [selected,     setSelected]     = useState(enrollments[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [noteText,     setNoteText]     = useState('');

  // Keep selected in sync after state update
  useEffect(() => {
    if (selected) {
      const fresh = enrollments.find(e => e.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }, [enrollments]);

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

  const handleReturn = () => {
    setEnrollments(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'incomplete' } : e));
  };

  const selDocs   = selected ? Object.entries(selected.documents) : [];
  const doneCount = selDocs.filter(([, d]) => d.done).length;
  const totalDocs = selDocs.length;
  const pct       = totalDocs > 0 ? Math.round((doneCount / totalDocs) * 100) : 0;

  const ss = (status) => STATUS_MAP[status] || STATUS_MAP.pending;

  return (
    <div style={{ padding: '24px 26px' }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ color: C.navy, fontSize: 21, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 2 }}>
          Pre-Enrollment
        </h1>
        <p style={{ color: C.muted, fontSize: 12.5 }}>
          Manage student pre-enrollment submissions and document requirements
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        {[
          { label: 'Total Applicants', value: 247,  sub: 'this semester',   topColor: C.navy,  valColor: C.navy  },
          { label: 'Pending Review',   value: 87,   sub: 'needs action',    topColor: C.red,   valColor: C.red   },
          { label: 'Approved',         value: 142,  sub: 'ready to enroll', topColor: C.green, valColor: C.green },
          { label: 'Incomplete Docs',  value: 18,   sub: 'awaiting docs',   topColor: C.amber, valColor: C.amber },
        ].map(c => (
          <div key={c.label} style={{
            background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
            borderTop: `3px solid ${c.topColor}`, padding: '14px 18px',
          }}>
            <p style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{c.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.valColor, fontFamily: 'Georgia,serif', lineHeight: 1, marginBottom: 2 }}>
              {c.value}
            </p>
            <p style={{ fontSize: 11, color: c.valColor, fontWeight: 600 }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Split: Queue | Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 14, alignItems: 'flex-start' }}>

        {/* ── LEFT: Application Queue ── */}
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 14px 10px' }}>
            <h2 style={{ color: C.navy, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Application Queue</h2>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {[
                { val: 'all',        label: `All (${enrollments.length})` },
                { val: 'pending',    label: 'Pending'    },
                { val: 'approved',   label: 'Approved'   },
                { val: 'incomplete', label: 'Incomplete' },
              ].map(f => {
                const active = filterStatus === f.val;
                return (
                  <button key={f.val} onClick={() => setFilterStatus(f.val)} style={{
                    padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    fontSize: 11.5, background: active ? C.navy : '#F1F5F9',
                    color: active ? '#fff' : C.muted, fontWeight: active ? 700 : 400,
                    transition: 'all 0.15s',
                  }}>{f.label}</button>
                );
              })}
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.mutedLight }} />
              <input type="text" placeholder="Search student name or ID..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', height: 34, paddingLeft: 30, paddingRight: 10,
                  borderRadius: 7, border: `1px solid ${C.border}`, background: '#F8F9FA',
                  fontSize: 12, outline: 'none', color: C.navy, boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: 460, overflowY: 'auto' }}>
            {filtered.map(e => {
              const isActive = selected?.id === e.id;
              const s = ss(e.status);
              return (
                <div key={e.id} onClick={() => setSelected(e)} style={{
                  padding: '11px 14px', borderTop: `1px solid ${C.border}`, cursor: 'pointer',
                  borderLeft: isActive ? `3px solid ${C.navy}` : '3px solid transparent',
                  background: isActive ? '#EEF2FF' : 'transparent',
                  transition: 'background 0.12s',
                }}
                  onMouseEnter={ev => { if (!isActive) ev.currentTarget.style.background = '#F8F9FA'; }}
                  onMouseLeave={ev => { if (!isActive) ev.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: e.avatarBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 12,
                    }}>{e.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                        <p style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, lineHeight: 1.3 }}>{e.studentName}</p>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.label}</span>
                      </div>
                      <p style={{ fontSize: 11, color: C.muted }}>{e.studentNo} · {e.course} {e.year} yr</p>
                      <p style={{ fontSize: 10.5, color: C.mutedLight }}>Submitted: {e.submittedAt}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: C.mutedLight, fontSize: 13 }}>
                No applications found.
              </div>
            )}
          </div>

          <div style={{
            padding: '8px 14px', borderTop: `1px solid ${C.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 11, color: C.muted }}>
              Showing {filtered.length} of 247 · Page 1 of 50
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['‹','›'].map(a => (
                <button key={a} style={{
                  padding: '2px 8px', borderRadius: 4, border: `1px solid ${C.border}`,
                  background: '#fff', fontSize: 11, cursor: 'pointer', color: C.muted,
                }}>{a}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Detail Panel ── */}
        {selected ? (
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            {/* Dark header */}
            <div style={{
              background: C.navy, padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: selected.avatarBg, border: `2px solid ${C.gold}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 14,
                }}>{selected.initials}</div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 15.5, fontFamily: 'Georgia,serif' }}>
                    {selected.studentName}
                  </p>
                  <p style={{ color: '#8FA8C8', fontSize: 11.5 }}>
                    {selected.studentNo} · {selected.course} – {selected.year} Year
                  </p>
                </div>
              </div>
              <span style={{
                background: selected.status === 'pending'    ? '#E8811A'
                          : selected.status === 'approved'   ? C.green
                          : selected.status === 'incomplete' ? C.amber
                          : C.red,
                color: '#fff', fontSize: 11, fontWeight: 700,
                padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {selected.status.toUpperCase()}
              </span>
            </div>

            <div style={{ padding: '18px 20px' }}>
              {/* Personal info */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                  Personal Information
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', rowGap: 6 }}>
                  {[['Email', selected.email], ['Contact', selected.contact], ['Address', selected.address]].map(([k, v]) => (
                    <React.Fragment key={k}>
                      <span style={{ fontSize: 12, color: C.muted }}>{k}</span>
                      <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 500 }}>{v}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Document checklist */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                  Document Checklist
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {selDocs.map(([key, doc]) => (
                    <div key={key} onClick={() => toggleDoc(key)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${doc.done ? '#A7F3D0' : C.border}`,
                      background: doc.done ? '#F0FDF4' : '#F9FAFB',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                          background: doc.done ? C.green : '#CBD5E1',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.15s',
                        }}>
                          {doc.done && <Check size={12} color="#fff" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: 13, color: doc.done ? C.greenText : C.muted, fontWeight: 500 }}>
                          {doc.label}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 10,
                        color: doc.done ? C.green : C.amber,
                        background: doc.done ? C.greenBg : C.amberBg,
                      }}>
                        {doc.done ? 'Submitted' : 'Missing'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11.5, color: C.muted }}>
                      Completion: {doneCount} of {totalDocs} documents
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? C.green : C.amber }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#E2E8F0', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4, transition: 'width 0.3s',
                      background: pct === 100 ? C.green : C.gold,
                      width: `${pct}%`,
                    }} />
                  </div>
                </div>
              </div>

              {/* Note textarea */}
              <textarea
                value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note for the student..."
                rows={2}
                style={{
                  width: '100%', borderRadius: 8, border: `1px solid ${C.border}`,
                  padding: '9px 13px', fontSize: 13, color: C.navy, background: '#F9FAFB',
                  resize: 'none', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit', marginBottom: 12,
                }}
              />

              {/* Approve / Return / Message */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleApprove} style={{
                  flex: 1, height: 42, borderRadius: 8, border: 'none',
                  background: C.navy, color: '#fff', fontSize: 13.5, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'opacity 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Check size={15} strokeWidth={3} /> ✓ Approve
                </button>
                <button onClick={handleReturn} style={{
                  flex: 1, height: 42, borderRadius: 8,
                  border: `1px solid ${C.border}`, background: '#fff',
                  color: C.navy, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >Return</button>
                <button style={{
                  flex: 1, height: 42, borderRadius: 8,
                  border: `1px solid ${C.border}`, background: '#fff',
                  color: C.navy, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >Message</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
            minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.mutedLight, fontSize: 14,
          }}>
            Select an application to review
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrarDashboard;