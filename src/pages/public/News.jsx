// ============================================
// FILE: src/pages/public/News.jsx
// PURPOSE: News page - EXACT match to Flutter NewsPage
// DESIGN: Hero article, latest news grid, newsletter, footer
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, ArrowRight, ExternalLink, Facebook, Globe, Mail } from 'lucide-react';

const News = () => {
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
            <NavLink title="NEWS" route="/news" isActive={true} />
            <NavLink title="CALENDAR" route="/calendar" isActive={false} />
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
  // HERO SECTION
  // ============================================
  const HeroSection = () => (
    <div 
      className="w-full pt-10 pb-10"
      style={{ paddingLeft: isMobile ? '20px' : '100px', paddingRight: isMobile ? '20px' : '100px' }}
    >
      {isMobile ? (
        <div className="flex flex-col">
          <HeroText />
          <div className="h-8" />
          <HeroImage />
        </div>
      ) : (
        <div className="flex gap-10">
          <div className="flex-[3]">
            <HeroText />
          </div>
          <div className="flex-[2]">
            <HeroImage />
          </div>
        </div>
      )}
    </div>
  );

  const HeroText = () => (
    <div>
      {/* Category Badge */}
      <div 
        className="inline-block px-3 py-1 rounded-sm mb-4"
        style={{ backgroundColor: 'rgba(254,179,0,0.15)' }}
      >
        <span className="font-work font-bold text-xs tracking-widest" style={{ color: '#7E5700' }}>
          CAMPUS LIFE
        </span>
      </div>

      {/* Date */}
      <p className="font-public text-sm mb-4" style={{ color: '#64748B' }}>
        May 24, 2024
      </p>

      {/* Headline */}
      <h2 
        className="font-work font-extrabold leading-tight mb-5"
        style={{ 
          color: '#1E3A8A',
          fontSize: isMobile ? '32px' : '48px',
          letterSpacing: '-1.5px'
        }}
      >
        Celebrating Academic Excellence: The 45th Annual Commencement Exercises
      </h2>

      {/* Description */}
      <p 
        className="font-public text-base leading-relaxed mb-8"
        style={{ color: '#64748B', maxWidth: '500px' }}
      >
        In a momentous ceremony held at the Main Pavilion, DPNHS honored over 400 graduates who displayed exceptional resilience and scholarly achievement throughout their high school journey.
      </p>

      {/* Read More Button */}
      <button 
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded font-work font-bold text-sm"
        style={{ backgroundColor: '#FEB300', color: '#6A4800' }}
      >
        Read the full Story
        <ArrowRight size={16} />
      </button>
    </div>
  );

  const HeroImage = () => (
    <img 
      src="/capstoneimage1.jpg" 
      alt="Commencement" 
      className="w-full object-cover rounded-lg"
      style={{ height: isMobile ? '250px' : '400px' }}
    />
  );

  // ============================================
  // LATEST NEWS SECTION
  // ============================================
  const LatestNewsSection = () => (
    <div 
      className="w-full py-15"
      style={{ 
        paddingLeft: isMobile ? '20px' : '100px', 
        paddingRight: isMobile ? '20px' : '100px',
        paddingTop: '60px',
        paddingBottom: '60px'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="w-10 h-1 mb-4" style={{ backgroundColor: '#FEB300' }} />
          <h3 className="font-work font-extrabold text-3xl tracking-tight" style={{ color: '#1E3A8A' }}>
            Latest News
          </h3>
        </div>
        <button className="flex items-center gap-1.5 font-work font-bold text-xs tracking-widest" style={{ color: '#64748B' }}>
          BROWSE ALL ARTICLES
          <ExternalLink size={14} />
        </button>
      </div>

      {/* News Grid */}
      {isMobile ? (
        <div className="flex flex-col gap-6">
          <NewsCard 
            image="/capstoneimage1.jpg"
            category="ACADEMIC"
            date="May 16, 2024"
            title="Mathinking"
            description="Brainsik bakbakchegchegkwakwakkwakchegkwakwakwak"
          />
          <NewsCard 
            image="/capstoneimage2.jpg"
            category="SPORTS"
            date="May 15, 2024"
            title="Sport and E Sport"
            description="Sports focus on physical strength, while esports focus on mental skills—both offer entertainment, competition, and growth opportunities."
          />
          <NewsCard 
            image="/capstoneimage3.jpg"
            category="HERITAGE"
            date="May 10, 2024"
            title="The Digital Archive: Preserving School History"
            description="DPNHS launches its first comprehensive digital library, cataloging over five decades of photographs, records, and student achievements for future..."
          />
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="flex-1">
            <NewsCard 
              image="/capstoneimage1.jpg"
              category="ACADEMIC"
              date="May 16, 2024"
              title="Mathinking"
              description="Brainsik bakbakchegchegkwakwakkwakchegkwakwakwak"
            />
          </div>
          <div className="flex-1">
            <NewsCard 
              image="/capstoneimage2.jpg"
              category="SPORTS"
              date="May 15, 2024"
              title="Sport and E Sport"
              description="Sports focus on physical strength, while esports focus on mental skills—both offer entertainment, competition, and growth opportunities."
            />
          </div>
          <div className="flex-1">
            <NewsCard 
              image="/capstoneimage3.jpg"
              category="HERITAGE"
              date="May 10, 2024"
              title="The Digital Archive: Preserving School History"
              description="DPNHS launches its first comprehensive digital library, cataloging over five decades of photographs, records, and student achievements for future..."
            />
          </div>
        </div>
      )}
    </div>
  );

  const NewsCard = ({ image, category, date, title, description }) => (
    <div className="flex flex-col">
      <img 
        src={image} 
        alt={title} 
        className="w-full object-cover rounded-lg mb-4"
        style={{ height: '200px' }}
      />
      <div className="flex items-center gap-3 mb-3">
        <span className="font-work font-bold text-xs tracking-widest" style={{ color: '#FEB300' }}>
          {category}
        </span>
        <span className="font-public text-xs" style={{ color: '#94A3B8' }}>
          {date}
        </span>
      </div>
      <h4 className="font-work font-bold text-lg leading-snug mb-2" style={{ color: '#1E3A8A' }}>
        {title}
      </h4>
      <p className="font-public text-sm leading-relaxed" style={{ color: '#64748B' }}>
        {description}
      </p>
    </div>
  );

  // ============================================
  // STAY CONNECTED SECTION
  // ============================================
  const StayConnectedSection = () => (
    <div 
      className="mx-auto mb-16 rounded-lg p-12"
      style={{ 
        marginLeft: isMobile ? '20px' : '100px',
        marginRight: isMobile ? '20px' : '100px',
        backgroundColor: '#001D4E'
      }}
    >
      {isMobile ? (
        <div className="flex flex-col">
          <StayConnectedText />
          <div className="h-8" />
          <NewsletterForm />
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex-[2]">
            <StayConnectedText />
          </div>
          <div className="flex-[3]">
            <NewsletterForm />
          </div>
        </div>
      )}
    </div>
  );

  const StayConnectedText = () => (
    <div>
      <h3 className="font-work font-extrabold text-2xl tracking-tight text-white mb-4">
        STAY CONNECTED.
      </h3>
      <p className="font-public text-sm leading-relaxed" style={{ color: '#94A3B8', maxWidth: '350px' }}>
        Subscribe to our weekly editorial digest to receive the latest academic journals, campus events, and administrative updates directly in your inbox.
      </p>
    </div>
  );

  const NewsletterForm = () => (
    <div className="flex gap-3">
      <div 
        className="flex-1 h-12 px-4 rounded flex items-center"
        style={{ 
          backgroundColor: '#0F2D5E',
          border: '1px solid #1E3A8A'
        }}
      >
        <input 
          type="email" 
          placeholder="Enter your academic email"
          className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-500"
        />
      </div>
      <button 
        className="px-6 py-3.5 rounded font-work font-bold text-sm"
        style={{ backgroundColor: '#FEB300', color: '#6A4800' }}
      >
        Join Circular
      </button>
    </div>
  );

  // ============================================
  // FOOTER
  // ============================================
  const Footer = () => (
    <footer className="w-full bg-white" style={{ padding: '60px 100px 32px' }}>
      {isMobile ? (
        <div className="flex flex-col gap-8 mb-10">
          <FooterBrand />
          <FooterLinks title="Quick Links" links={['Campus Map', 'Accessibility', 'Careers', 'Transparency Seal']} />
          <FooterLinks title="Support" links={['Contact Us', 'Privacy Policy', 'Terms of Service', 'Data Privacy']} />
          <FooterAddress />
        </div>
      ) : (
        <div className="flex justify-between mb-10">
          <FooterBrand />
          <FooterLinks title="Quick Links" links={['Campus Map', 'Accessibility', 'Careers', 'Transparency Seal']} />
          <FooterLinks title="Support" links={['Contact Us', 'Privacy Policy', 'Terms of Service', 'Data Privacy']} />
          <FooterAddress />
        </div>
      )}

      <div className="border-t pt-6" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex justify-between items-center">
          <p className="font-public text-xs" style={{ color: '#94A3B8' }}>
            © 2024 Dela Paz National High School. Empowering excellence through heritage and innovation.
          </p>
          <div className="flex gap-6">
            <span className="font-work font-bold text-xs tracking-widest" style={{ color: '#94A3B8' }}>
              REPUBLIC OF THE PHILIPPINES
            </span>
            <span className="font-work font-bold text-xs tracking-widest" style={{ color: '#94A3B8' }}>
              DEPARTMENT OF EDUCATION
            </span>
          </div>
        </div>
      </div>
    </footer>
  );

  const FooterBrand = () => (
    <div style={{ width: '260px' }}>
      <h4 className="font-work font-extrabold text-base mb-4" style={{ color: '#1E3A8A' }}>
        Dela Paz National High School
      </h4>
      <p className="font-public text-sm leading-relaxed mb-6" style={{ color: '#64748B' }}>
        A tradition of excellence, a legacy of service. Dedicated to the holistic development of the Filipino learner.
      </p>
      <div className="flex gap-4">
        <Facebook size={18} color="#94A3B8" />
        <Globe size={18} color="#94A3B8" />
        <Mail size={18} color="#94A3B8" />
      </div>
    </div>
  );

  const FooterLinks = ({ title, links }) => (
    <div style={{ width: '180px' }}>
      <h5 className="font-work font-bold text-sm mb-5" style={{ color: '#1E3A8A' }}>
        {title}
      </h5>
      {links.map(link => (
        <p key={link} className="font-public text-sm mb-3 leading-relaxed" style={{ color: '#64748B' }}>
          {link}
        </p>
      ))}
    </div>
  );

  const FooterAddress = () => (
    <div style={{ width: '180px' }}>
      <h5 className="font-work font-bold text-sm mb-5" style={{ color: '#1E3A8A' }}>
        Office Address
      </h5>
      <p className="font-public text-sm mb-3 leading-relaxed" style={{ color: '#64748B' }}>
        Dela Paz, Antipolo City
      </p>
      <p className="font-public text-sm mb-3 leading-relaxed" style={{ color: '#64748B' }}>
        Rizal, Philippines 1870
      </p>
      <p className="font-public text-sm mb-3 leading-relaxed" style={{ color: '#64748B' }}>
        ☎ +63 2 8123 4567
      </p>
      <p className="font-public text-sm leading-relaxed" style={{ color: '#64748B' }}>
        ✉ info@delapaznhs.edu.ph
      </p>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <TopNavBar />
      
      <main className="pt-20">
        <HeroSection />
        <LatestNewsSection />
        <StayConnectedSection />
        <Footer />
      </main>
    </div>
  );
};

export default News;