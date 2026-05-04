// ============================================
// FILE: src/pages/public/Login.jsx
// PURPOSE: Login page - EXACT match to Flutter LoginPage
// DESIGN: Split layout, left panel branding, right panel role selection
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Facebook, Camera, MessageCircle, Users, School } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ============================================
  // HEADER
  // ============================================
  const Header = () => (
    <header className="bg-white px-10 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src="/capstonelogo.png" alt="DPNHS Logo" style={{ width: '50px', height: '50px' }} />
          <h1 className="font-work font-bold text-lg" style={{ color: '#1a2b4a' }}>
            Dela Paz National High School
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate('/')} className="hover:opacity-70">
            <NavItem label="HOME" isActive={true} />
          </button>
          <button onClick={() => navigate('/news')} className="hover:opacity-70">
            <NavItem label="NEWS" isActive={false} />
          </button>
          <button onClick={() => navigate('/calendar')} className="hover:opacity-70">
            <NavItem label="CALENDAR" isActive={false} />
          </button>
          <div className="w-6" />
          <button className="p-2 hover:opacity-70">
            <Search size={22} color="#4a5568" />
          </button>
          <div className="w-4" />
          <button 
            onClick={() => navigate('/login')}
            className="text-white font-semibold text-sm px-6 py-3.5 rounded-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0d2b5c' }}
          >
            Portal Login
          </button>
        </div>
      </div>
    </header>
  );

  const NavItem = ({ label, isActive }) => (
    <div className="flex flex-col items-center">
      <span 
        className="text-sm font-semibold tracking-wide"
        style={{ 
          color: isActive ? '#1a2b4a' : '#4a5568',
          fontWeight: isActive ? 700 : 600
        }}
      >
        {label}
      </span>
      {isActive && (
        <div className="w-6 h-0.5 rounded-sm mt-1" style={{ backgroundColor: '#d4a843' }} />
      )}
    </div>
  );

  // ============================================
  // LEFT PANEL
  // ============================================
  const LeftPanel = () => (
    <div 
      className="relative flex flex-col justify-between p-10 text-white"
      style={{
        backgroundImage: 'url(/capstonebackground.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '700px'
      }}
    >
      {/* Dark overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <School size={30} color="#1a5276" />
          </div>
          <div>
            <p className="font-semibold text-base">Dela Paz</p>
            <p className="font-normal text-sm">National High School</p>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <h2 className="text-5xl font-bold leading-tight mb-4">
          Welcome Back.
        </h2>
        <p className="text-base leading-relaxed text-white/70">
          Access your academic progress, resources,<br />
          and campus news through the unified student<br />
          portal.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <SocialIcon icon={<Facebook size={16} />} />
        <SocialIcon icon={<Camera size={16} />} />
        <SocialIcon icon={<MessageCircle size={16} />} />
        <div className="w-4" />
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20">
          <Users size={16} />
          <span className="text-xs font-medium">JOIN 5,550+ ACTIVE STUDENTS</span>
        </div>
      </div>
    </div>
  );

  const SocialIcon = ({ icon }) => (
    <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
      {icon}
    </div>
  );

  // ============================================
  // RIGHT PANEL
  // ============================================
  const RightPanel = () => (
    <div className="flex flex-col items-center justify-center px-15 py-10" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div 
            className="w-25 h-25 rounded-full border-2 bg-cover bg-center mb-6"
            style={{ 
              width: '100px',
              height: '100px',
              borderColor: '#D1D5DB',
              backgroundImage: 'url(/capstonelogo.png)'
            }}
          />
          <h2 className="text-3xl font-bold mb-3" style={{ color: '#2c3e50' }}>
            Hi, DPNHSian!
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="text-sm" style={{ color: '#6B7280' }}>↓</span>
            <span className="text-sm" style={{ color: '#6B7280' }}>
              Please click or tap your destination.
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 mt-10">
          <button
            onClick={() => navigate('/student-login')}
            className="w-full h-13 rounded font-medium text-lg text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#007bff' }}
          >
            Student
          </button>

          <button
            onClick={() => navigate('/faculty-login')}
            className="w-full h-13 rounded font-medium text-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'rgb(246, 242, 14)', color: '#2c3e50' }}
          >
            Faculty
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-xs leading-relaxed mt-8" style={{ color: '#6B7280' }}>
          By using this service, you understood and agree to the Dela Paz Online Services{' '}
          <span className="font-medium" style={{ color: '#007bff' }}>Terms of Use</span>
          {' '}and{' '}
          <span className="font-medium" style={{ color: '#007bff' }}>Privacy Statement</span>
        </p>
      </div>
    </div>
  );

  // ============================================
  // FOOTER
  // ============================================
  const Footer = () => (
    <footer className="px-15 py-10" style={{ backgroundColor: '#edf2f7' }}>
      <div className="flex flex-wrap justify-between gap-8 mb-8">
        <FooterColumn 
          title="Dela Paz National High School"
          items={['Dedicated to excellence in education\nand community empowerment since its\nfounding.']}
          isDescription={true}
        />
        <FooterColumn 
          title="RESOURCES"
          items={['Faculty Portal', 'Alumni', 'Careers']}
          isLink={true}
        />
        <FooterColumn 
          title="SUPPORT"
          items={['Privacy Policy', 'Terms of Service']}
          isLink={true}
        />
        <FooterColumn 
          title="CONTACT"
          items={['R. Dela Paz St., Pasig City', '(02) 8641-XXXX', 'info@delapaz.edu.ph']}
        />
      </div>

      <div className="border-t pt-5" style={{ borderColor: '#dee2e6' }}>
        <p className="text-xs text-center" style={{ color: '#adb5bd' }}>
          © 2024 Dela Paz National High School. All rights reserved.
        </p>
      </div>
    </footer>
  );

  const FooterColumn = ({ title, items, isLink, isDescription }) => (
    <div style={{ width: '200px' }}>
      <h4 
        className="text-xs font-bold tracking-wide mb-3 leading-relaxed"
        style={{ 
          color: isDescription ? '#2c3e50' : '#6B7280',
          letterSpacing: '0.5px'
        }}
      >
        {title}
      </h4>
      {items.map((item, i) => (
        <p 
          key={i} 
          className="text-xs mb-1.5 leading-relaxed"
          style={{ 
            color: '#6c757d',
            textDecoration: isLink ? 'underline' : 'none',
            textDecorationColor: '#adb5bd',
            lineHeight: isDescription ? '1.6' : '1.5'
          }}
        >
          {item.split('\n').map((line, j) => (
            <React.Fragment key={j}>
              {line}
              {j < item.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {isDesktop ? (
          <div className="flex">
            <div className="flex-1">
              <LeftPanel />
            </div>
            <div className="flex-1">
              <RightPanel />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <LeftPanel />
            <RightPanel />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Login;