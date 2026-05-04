// ============================================
// FILE: src/pages/public/Calendar.jsx
// PURPOSE: Calendar page - EXACT match to Flutter CalendarPage
// DESIGN: Monthly calendar, events, sidebar milestones, footer
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const Calendar = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1100);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ============================================
  // TOP NAVIGATION BAR
  // ============================================
  const TopNavBar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b" style={{ borderColor: '#E2E8F0', height: '80px' }}>
      <div className="h-full flex items-center justify-between" style={{ paddingLeft: isMobile ? '20px' : '60px', paddingRight: isMobile ? '20px' : '60px' }}>
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img src="/capstonelogo.png" alt="DPNHS Logo" style={{ height: '40px' }} />
          {!isMobile && (
            <>
              <div className="w-3" />
              <h1 className="font-work font-extrabold text-xl" style={{ color: '#1E3A8A' }}>
                Dela Paz National High School
              </h1>
            </>
          )}
        </div>

        {/* Desktop Nav */}
        {!isMobile ? (
          <div className="flex items-center gap-2">
            <NavLink title="HOME" route="/" isActive={false} />
            <NavLink title="NEWS" route="/news" isActive={false} />
            <NavLink title="CALENDAR" route="/calendar" isActive={true} />
            <div className="w-2.5" />
            <Search size={20} color="#475569" />
            <div className="w-5" />
            <button
              onClick={() => navigate('/login')}
              className="font-work font-semibold text-white px-5 py-4.5 rounded hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#003178' }}
            >
              Portal Login
            </button>
          </div>
        ) : (
          <button className="p-2">
            <Menu size={28} color="#1E3A8A" />
          </button>
        )}
      </div>
    </nav>
  );

  const NavLink = ({ title, route, isActive }) => (
    <button
      onClick={() => navigate(route)}
      className="px-4 py-2 flex flex-col items-center"
    >
      <span 
        className="font-work text-sm"
        style={{ 
          fontWeight: isActive ? 700 : 500,
          color: isActive ? '#1E3A8A' : '#64748B'
        }}
      >
        {title}
      </span>
      {isActive && (
        <div className="mt-1 h-0.5 w-5" style={{ backgroundColor: '#FEB300' }} />
      )}
    </button>
  );

  // ============================================
  // TITLE SECTION
  // ============================================
  const TitleSection = () => (
    <div 
      className="w-full py-8"
      style={{ paddingLeft: isMobile ? '20px' : '100px', paddingRight: isMobile ? '20px' : '100px' }}
    >
      {isMobile ? (
        <div className="flex flex-col">
          <TitleText />
          <div className="h-5" />
          <MonthNavigation />
        </div>
      ) : (
        <div className="flex items-start">
          <div className="flex-[7]">
            <TitleText />
          </div>
          <div className="flex-[3] flex justify-end">
            <MonthNavigation />
          </div>
        </div>
      )}
    </div>
  );

  const TitleText = () => (
    <div>
      <p className="font-work font-semibold text-xs tracking-widest mb-2" style={{ color: '#B8860B' }}>
        THE INSTITUTIONAL RECORD
      </p>
      <h2 
        className="font-work font-extrabold leading-tight mb-3"
        style={{ 
          color: '#1B3A6B',
          fontSize: '36px',
          letterSpacing: '-0.5px',
          lineHeight: '1.1'
        }}
      >
        Academic Year<br />2024—2025
      </h2>
      <p className="font-public text-sm leading-relaxed" style={{ color: '#64748B' }}>
        Navigating the milestones of excellence. Our comprehensive calendar outlines examination periods, cultural festivals, and key administrative deadlines.
      </p>
    </div>
  );

  const MonthNavigation = () => (
    <div className="flex items-center gap-3">
      <button className="p-2 rounded border bg-white" style={{ borderColor: '#E2E8F0' }}>
        <ChevronLeft size={16} color="#9CA3AF" />
      </button>
      <span className="font-work font-bold text-lg" style={{ color: '#1B3A6B' }}>
        October 2024
      </span>
      <button className="p-2 rounded border bg-white" style={{ borderColor: '#E2E8F0' }}>
        <ChevronRight size={16} color="#9CA3AF" />
      </button>
    </div>
  );

  // ============================================
  // CALENDAR SECTION
  // ============================================
  const CalendarSection = () => (
    <div className="flex flex-col">
      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7" style={{ backgroundColor: '#0D2240' }}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="py-3 text-center">
              <span className="text-white text-xs font-semibold">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Rows */}
        <CalendarRow 
          days={[
            { day: '29', prevMonth: true },
            { day: '30', prevMonth: true },
            { day: '1' },
            { day: '2' },
            { day: '3' },
            { day: '4', event: { title: "TEACHERS' DAY\nCELEBRATION", bg: '#B8860B', text: 'white' } },
            { day: '5' },
          ]}
        />
        <CalendarRow 
          days={[
            { day: '6' },
            { day: '7' },
            { day: '8' },
            { day: '9' },
            { day: '10' },
            { day: '11', event: { title: 'MID-TERM\nASSESSMENT', bg: '#1B3A6B', text: 'white' } },
            { day: '12', event: { title: '', bg: '#1B3A6B', text: 'white' } },
          ]}
        />
        <CalendarRow 
          days={[
            { day: '13' },
            { day: '14', event: { title: '', bg: '#1B3A6B', text: 'white' } },
            { day: '15', event: { title: '', bg: '#1B3A6B', text: 'white' } },
            { day: '16' },
            { day: '17' },
            { day: '18', event: { title: 'DISTRICT\nSPORTS MEET', bg: '#8B4513', text: 'white' } },
            { day: '19' },
          ]}
        />
        <CalendarRow 
          days={[
            { day: '20' },
            { day: '21' },
            { day: '22' },
            { day: '23' },
            { day: '24', special: { label: 'UN DAY', color: '#FFA000' } },
            { day: '25' },
            { day: '26' },
          ]}
          isLast={true}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-5">
        <LegendItem color="#1B3A6B" label="ACADEMICS" />
        <LegendItem color="#FFA000" label="HOLIDAY / OBSERVANCE" />
        <LegendItem color="#8B4513" label="SPORTS & CULTURE" />
        <LegendItem color="#9CA3AF" label="ADMINISTRATIVE" />
      </div>
    </div>
  );

  const CalendarRow = ({ days, isLast }) => (
    <div 
      className="grid grid-cols-7"
      style={{ borderBottom: isLast ? 'none' : '1px solid #EEEEEE' }}
    >
      {days.map((d, i) => (
        <DayCell key={i} {...d} />
      ))}
    </div>
  );

  const DayCell = ({ day, prevMonth, event, special }) => (
    <div 
      className="relative h-20 p-2"
      style={{ 
        backgroundColor: event && event.title ? `${event.bg}10` : 'transparent',
        border: event && !event.title ? `2px solid ${event.bg}` : 'none'
      }}
    >
      <span 
        className="text-sm font-medium"
        style={{ color: prevMonth ? '#9CA3AF' : '#1B3A6B' }}
      >
        {day}
      </span>
      
      {event && event.title && (
        <div 
          className="absolute top-7 left-1 right-1 px-1.5 py-1 rounded text-center"
          style={{ backgroundColor: event.bg }}
        >
          <span className="text-xs font-semibold leading-tight" style={{ color: event.text, fontSize: '8px', lineHeight: '1.3' }}>
            {event.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < event.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        </div>
      )}

      {special && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <span 
            className="px-2 py-0.5 rounded text-xs font-semibold bg-white border"
            style={{ color: special.color, borderColor: special.color }}
          >
            {special.label}
          </span>
        </div>
      )}
    </div>
  );

  const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs font-semibold" style={{ color: '#4B5563' }}>{label}</span>
    </div>
  );

  // ============================================
  // SIDEBAR
  // ============================================
  const Sidebar = () => (
    <div className="flex flex-col gap-5">
      {/* Upcoming Milestones */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <p className="font-work font-extrabold text-xs tracking-widest mb-4" style={{ color: '#B8860B' }}>
          UPCOMING<br />MILESTONES
        </p>
        
        <div className="mb-5">
          <span className="text-4xl font-bold" style={{ color: '#1B3A6B' }}>04</span>
          <p className="text-xs font-semibold mt-1" style={{ color: '#6B7280', letterSpacing: '0.5px' }}>
            DAYS UNTIL MID-TERMS
          </p>
        </div>

        <div>
          <span className="text-4xl font-bold" style={{ color: '#1B3A6B' }}>12</span>
          <p className="text-xs font-semibold mt-1" style={{ color: '#6B7280', letterSpacing: '0.5px' }}>
            PLANNED FACULTY<br />REVIEWS
          </p>
        </div>
      </div>

      {/* Background Image Card */}
      <div 
        className="relative h-45 rounded-lg overflow-hidden"
        style={{ 
          backgroundImage: 'url(/capstonebackground.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '180px'
        }}
      >
        <div 
          className="absolute inset-0 flex items-end p-4"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(27,58,107,0.9))'
          }}
        >
          <p className="font-work font-semibold text-sm text-white leading-snug">
            Preserving our<br />history, crafting your<br />future.
          </p>
        </div>
      </div>

      {/* Institutional Events */}
      <div>
        <p className="font-work font-extrabold text-xs tracking-widest mb-4" style={{ color: '#1B3A6B' }}>
          INSTITUTIONAL EVENTS
        </p>

        <EventItem month="OCT" day="24" title="United Nations Day\nObservance" description="Multi-cultural parade and auditorium assembly at 8:00 AM." />
        <div className="h-4" />
        <EventItem month="NOV" day="02" title="Parent-Teacher\nConference" description="First Quarter performance reviews. Registration required." />
        <div className="h-4" />
        <EventItem month="NOV" day="15" title="Science & Tech Fair\n2024" description="Showcasing student-led research and engineering prototypes." />
      </div>

      {/* Download Button */}
      <button 
        className="w-full py-3.5 rounded border flex items-center justify-center gap-2 bg-white"
        style={{ borderColor: '#E2E8F0' }}
      >
        <span className="text-xs font-semibold text-center" style={{ color: '#4B5563' }}>
          DOWNLOAD ACADEMIC<br />PLANNER (PDF)
        </span>
        <Download size={14} color="#4B5563" />
      </button>
    </div>
  );

  const EventItem = ({ month, day, title, description }) => (
    <div className="flex gap-3">
      <div className="w-10 text-center">
        <p className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>{month}</p>
        <p className="text-xl font-bold" style={{ color: '#1B3A6B' }}>{day}</p>
      </div>
      <div>
        <p className="text-sm font-semibold leading-snug" style={{ color: '#1B3A6B' }}>
          {title.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < title.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6B7280' }}>
          {description}
        </p>
      </div>
    </div>
  );

  // ============================================
  // FOOTER
  // ============================================
  const Footer = () => (
    <footer className="bg-white py-8 px-24">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-work font-bold text-xs tracking-widest mb-2" style={{ color: '#1B3A6B' }}>
            DELA PAZ NATIONAL HIGH SCHOOL
          </p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            © 2024 Dela Paz National High School. Office of the Registrar.
          </p>
        </div>
        <div className="flex gap-6">
          {['Academic Regulations', 'Campus Directory', 'Portal Privacy', 'Accessibility'].map(link => (
            <span key={link} className="text-xs" style={{ color: '#6B7280' }}>{link}</span>
          ))}
        </div>
      </div>
    </footer>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <TopNavBar />
      
      <main className="pt-20">
        <div className="h-6" /> {/* Spacer */}
        <TitleSection />
        
        {/* Main Content */}
        <div 
          className="py-5"
          style={{ 
            paddingLeft: isMobile ? '20px' : '100px', 
            paddingRight: isMobile ? '20px' : '100px' 
          }}
        >
          {isMobile ? (
            <div className="flex flex-col gap-8">
              <CalendarSection />
              <Sidebar />
            </div>
          ) : (
            <div className="flex gap-8">
              <div className="flex-[7]">
                <CalendarSection />
              </div>
              <div className="flex-[3]">
                <Sidebar />
              </div>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Calendar;