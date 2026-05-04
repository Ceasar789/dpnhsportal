// ============================================
// FILE: src/pages/public/Home.jsx
// PURPOSE: Home/Landing page - EXACT match to Flutter HomePage
// DESIGN: Hero carousel, vision card, auto-slide, footer
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, School, Facebook, BookOpen, Globe, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const pageControllerRef = useRef(null);
  const autoSlideRef = useRef(null);

  const carouselImages = [
    '/capstonebackground.jpg',
    '/capstoneimage1.jpg',
    '/capstoneimage2.jpg',
    '/capstoneimage3.jpg',
  ];

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1100);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto slide carousel
  useEffect(() => {
    const startAutoSlide = () => {
      autoSlideRef.current = setTimeout(() => {
        setCurrentPage((prev) => {
          const next = (prev + 1) % carouselImages.length;
          if (pageControllerRef.current) {
            pageControllerRef.current.scrollTo({
              left: next * pageControllerRef.current.offsetWidth,
              behavior: 'smooth'
            });
          }
          return next;
        });
        startAutoSlide();
      }, 4000);
    };

    startAutoSlide();
    return () => clearTimeout(autoSlideRef.current);
  }, [carouselImages.length]);

  // ============================================
  // TOP NAVIGATION BAR
  // ============================================
  const TopNavBar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" style={{ height: '106px' }}>
      <div className="h-full flex items-center justify-between px-8 lg:px-8" style={{ paddingLeft: isMobile ? '16px' : '32px', paddingRight: isMobile ? '16px' : '32px' }}>
        {/* Logo + School Name */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src="/capstonelogo.png" 
            alt="DPNHS Logo" 
            style={{ height: isMobile ? '50px' : '74px' }} 
          />
          {!isMobile && (
            <>
              <div className="w-4" />
              <h1 className="font-work font-bold text-xl tracking-tight" style={{ color: '#172554' }}>
                Dela Paz National High School
              </h1>
            </>
          )}
        </div>

        {/* Desktop Nav */}
        {!isMobile ? (
          <div className="flex items-center gap-2 overflow-x-auto">
            <NavLink title="HOME" isActive={true} route="/" />
            <NavLink title="NEWS" isActive={false} route="/news" />
            <NavLink title="CALENDAR" isActive={false} route="/calendar" />
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

  // ============================================
  // NAV LINK COMPONENT
  // ============================================
  const NavLink = ({ title, isActive, route }) => (
    <button
      onClick={() => navigate(route)}
      className="px-3 py-2 flex flex-col items-center"
    >
      <span 
        className="font-work text-sm"
        style={{ 
          fontWeight: isActive ? 700 : 500,
          color: isActive ? '#1E3A8A' : '#475569'
        }}
      >
        {title}
      </span>
      {isActive && (
        <div className="mt-0.5 h-0.5 w-5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
      )}
    </button>
  );

  // ============================================
  // HERO SECTION
  // ============================================
  const HeroSection = () => (
    <div className="relative w-full overflow-hidden" style={{ height: '870px' }}>
      {/* Carousel Images */}
      <div 
        ref={pageControllerRef}
        className="absolute inset-0 flex overflow-hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
        {carouselImages.map((img, index) => (
          <div 
            key={index}
            className="w-full h-full flex-shrink-0"
            style={{ 
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(0,29,78,0.9) 0%, rgba(0,29,78,0.4) 50%, transparent 100%)'
        }}
      />

      {/* Hero Content */}
      <div 
        className="relative z-10 flex flex-col justify-center h-full"
        style={{ paddingLeft: isMobile ? '20px' : '60px', paddingRight: isMobile ? '20px' : '60px' }}
      >
        {/* Badge */}
        <div 
          className="inline-block px-4 py-1.5 rounded-sm mb-8"
          style={{ backgroundColor: '#FEB300' }}
        >
          <span className="font-work font-bold text-xs tracking-widest" style={{ color: '#6A4800' }}>
            EST. 2003 • ACADEMIC EXCELLENCE
          </span>
        </div>

        {/* Headline */}
        <h2 
          className="font-work font-bold text-white leading-none tracking-tight"
          style={{ fontSize: isMobile ? '48px' : '72px', letterSpacing: '-3.6px' }}
        >
          Academic<br />Toward<br />Excellence
        </h2>

        {/* Spacer */}
        <div className="h-19" style={{ height: '76px' }} />

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/admission')}
            className="font-work font-bold text-sm tracking-widest px-8 py-4 rounded hover:opacity-90 transition-opacity"
            style={{ 
              backgroundColor: '#FEB300', 
              color: '#6A4800',
              width: '250px',
              height: '58px',
              boxShadow: '0 20px 25px rgba(126,87,0,0.2)'
            }}
          >
            APPLY FOR ADMISSION
          </button>

          <button
            onClick={() => navigate('/academics')}
            className="flex items-center gap-2 px-5 py-4 rounded border-2 border-white text-white font-work font-bold tracking-widest hover:bg-white/10 transition-colors"
            style={{ height: '58px' }}
          >
            LEARN MORE
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div 
        className="absolute bottom-30 flex gap-2"
        style={{ left: isMobile ? '20px' : '60px', bottom: '120px' }}
      >
        {carouselImages.map((_, index) => (
          <div
            key={index}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: currentPage === index ? '24px' : '8px',
              backgroundColor: currentPage === index ? '#FEB300' : 'rgba(255,255,255,0.5)'
            }}
          />
        ))}
      </div>

      {/* Vision Card (Desktop only) */}
      {!isMobile && <VisionCard />}
    </div>
  );

  // ============================================
  // VISION CARD (Desktop only)
  // ============================================
  const VisionCard = () => (
    <div 
      className="absolute right-0 bottom-0 bg-white p-10"
      style={{ width: '447px', height: '438px' }}
    >
      <h3 className="font-work font-bold text-xs tracking-widest mb-8" style={{ color: '#7E5700' }}>
        OUR VISION
      </h3>
      
      <div className="flex gap-2.5">
        <span className="font-work font-black text-2xl" style={{ color: '#001D4E' }}>II</span>
        <p className="font-lato text-lg leading-relaxed" style={{ color: '#505050' }}>
          We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.
          <br /><br />
          As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.
        </p>
      </div>

      <div className="absolute bottom-10 left-10 w-12 h-1" style={{ backgroundColor: '#FEB300' }} />
    </div>
  );

  // ============================================
  // FOOTER
  // ============================================
  const Footer = () => (
    <footer className="w-full" style={{ backgroundColor: '#F1F5F9', padding: '65px 48px 32px' }}>
      <div className="flex flex-wrap justify-center gap-24 mb-15">
        {/* Brand */}
        <div style={{ width: '260px' }}>
          <School size={40} color="#64748B" />
          <h4 className="font-work font-bold text-lg mt-4 mb-4" style={{ color: '#172554' }}>
            DELA PAZ NHS
          </h4>
          <p className="font-public text-sm leading-relaxed" style={{ color: '#64748B' }}>
            Inspiring excellence and shaping futures through quality secondary education in a nurturing environment.
          </p>
        </div>

        {/* Navigation */}
        <div style={{ width: '150px' }}>
          <h5 className="font-work font-bold text-xs tracking-widest mb-6" style={{ color: '#1E3A8A' }}>
            NAVIGATION
          </h5>
          {['Home', 'News', 'Calendar'].map(link => (
            <p key={link} className="font-public text-sm mb-4" style={{ color: '#64748B' }}>
              {link}
            </p>
          ))}
        </div>

        {/* Resources */}
        <div style={{ width: '150px' }}>
          <h5 className="font-work font-bold text-xs tracking-widest mb-6" style={{ color: '#1E3A8A' }}>
            RESOURCES
          </h5>
          {['Faculty Portal', 'Alumni', 'Privacy Policy', 'Terms of Service'].map(link => (
            <p key={link} className="font-public text-sm mb-4" style={{ color: '#64748B' }}>
              {link}
            </p>
          ))}
        </div>

        {/* Contact */}
        <div style={{ width: '260px' }}>
          <h5 className="font-work font-bold text-xs tracking-widest mb-6" style={{ color: '#1E3A8A' }}>
            CONTACT US
          </h5>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: '#64748B' }}>📍</span>
            <span className="font-public text-sm" style={{ color: '#64748B' }}>Brgy. Dela Paz, Binan City</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: '#64748B' }}>✉</span>
            <span className="font-public text-sm" style={{ color: '#64748B' }}>admissions@delapaznhs.edu.ph</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: '#64748B' }}>📞</span>
            <span className="font-public text-sm" style={{ color: '#64748B' }}>(02) 8642-1234</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t mb-8" style={{ borderColor: 'rgba(100,116,139,0.1)' }} />

      {/* Bottom */}
      <div className="flex justify-between items-center">
        <p className="font-public text-xs" style={{ color: '#64748B' }}>
          © 2024 Dela Paz National High School. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Facebook size={18} color="#64748B" />
          <BookOpen size={18} color="#64748B" />
          <Globe size={18} color="#64748B" />
          <Users size={18} color="#64748B" />
        </div>
      </div>
    </footer>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8FF' }}>
      <TopNavBar />
      
      <main className="pt-[106px]">
        <HeroSection />
        <Footer />
      </main>
    </div>
  );
};

export default Home;