import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Role } from '../../types';
import {
  RotateCw,
  Users,
  GraduationCap,
  School,
  Sparkles,
  BookOpen,
  FileCheck2,
  MessageSquare,
  Globe,
  LayoutDashboard,
  Menu,
  X,
  Languages,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    activeRole,
    setActiveRole,
    currentView,
    setCurrentView,
    isSyncing,
    lastSyncedText,
    syncWithLMS,
    permissionSlips,
    threads,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingSlipsCount = permissionSlips.filter(s => s.status === 'pending').length;
  const unreadMsgCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  const rolesConfig: { id: Role; label: string; icon: React.ReactNode }[] = [
    { id: 'parent', label: t.roles.parent, icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'student', label: t.roles.student, icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'teacher', label: t.roles.teacher, icon: <School className="w-3.5 h-3.5" /> },
    { id: 'tutor', label: t.roles.tutor, icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const handleNavClick = (view: 'dashboard' | 'marketplace' | 'compliance' | 'messages' | 'landing') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E4DF] shadow-xs">
      {/* Top Banner: Multi-Role Switcher & Language Switcher */}
      <div className="bg-[#1A2332] text-xs text-white py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Active Role Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></span>
            <span className="text-gray-300 hidden sm:inline">{t.demoMode}:</span>
            <span className="font-semibold text-white tracking-wide uppercase text-[11px] sm:text-xs">
              {t.currentRole}: {rolesConfig.find(r => r.id === activeRole)?.label}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick role switch buttons */}
            <div className="flex items-center gap-1">
              <span className="text-gray-400 mr-1 hidden lg:inline text-[11px]">{t.quickSwitchRole}</span>
              {rolesConfig.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRole(r.id);
                    if (currentView === 'landing') setCurrentView('dashboard');
                  }}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                    activeRole === r.id
                      ? 'bg-[#0D8B8B] text-white shadow-xs font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  title={r.label}
                >
                  {r.icon}
                  <span className="hidden sm:inline">{r.label}</span>
                </button>
              ))}
            </div>

            {/* Language Selector: EN | ES */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5 border border-white/20 pl-1.5">
              <Languages className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#FF6B54] text-white shadow-xs'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'es'
                    ? 'bg-[#FF6B54] text-white shadow-xs'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-6 xl:gap-8">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0D8B8B] to-[#15A9A9] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl font-mono">O</span>
              </div>
              <div>
                <span className="font-bold text-xl text-[#0D8B8B] tracking-tight font-sans">{t.appName}</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold bg-[#FFE4DC] text-[#FF6B54] px-1.5 py-0.5 rounded-sm">
                  MVP v1.1
                </span>
              </div>
            </button>

            {/* Desktop Nav Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>
                  {t.nav.dashboard} ({rolesConfig.find(r => r.id === activeRole)?.label})
                </span>
              </button>

              <button
                onClick={() => handleNavClick('marketplace')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'marketplace'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.nav.marketplace}</span>
              </button>

              <button
                onClick={() => handleNavClick('compliance')}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'compliance'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{t.nav.compliance}</span>
                {pendingSlipsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FF6B54] text-white text-[10px] flex items-center justify-center font-bold">
                    {pendingSlipsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('messages')}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'messages'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.nav.messages}</span>
                {unreadMsgCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#0D8B8B] text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadMsgCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('landing')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'landing'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>{t.nav.landing}</span>
              </button>
            </nav>
          </div>

          {/* Right Actions: Sync Button, Profile & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={syncWithLMS}
              disabled={isSyncing}
              title={lastSyncedText}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F8F6F3] border border-[#E8E4DF] text-[#1A2332] hover:bg-[#E8E4DF] transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#0D8B8B] ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">
                {isSyncing ? t.nav.syncing : t.nav.syncLms}
              </span>
            </button>

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E8E4DF]">
              <img
                src={
                  activeRole === 'parent'
                    ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
                    : activeRole === 'student'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    : activeRole === 'teacher'
                    ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0D8B8B]/20"
              />
              <div className="hidden xl:block text-left text-xs leading-tight">
                <p className="font-semibold text-[#1A2332]">
                  {activeRole === 'parent'
                    ? 'Miller Family'
                    : activeRole === 'student'
                    ? 'Alex Miller'
                    : activeRole === 'teacher'
                    ? 'Prof. Vance'
                    : 'Dr. Elena Rostova'}
                </p>
                <p className="text-[#52697C] text-[11px] capitalize">{rolesConfig.find(r => r.id === activeRole)?.label}</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#52697C] hover:text-[#1A2332] rounded-xl hover:bg-gray-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E4DF] py-3 px-2 space-y-1 bg-white animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                currentView === 'dashboard' ? 'bg-[#0D8B8B] text-white' : 'text-[#1A2332] hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.nav.dashboard} ({rolesConfig.find(r => r.id === activeRole)?.label})</span>
              </span>
            </button>

            <button
              onClick={() => handleNavClick('marketplace')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                currentView === 'marketplace' ? 'bg-[#0D8B8B] text-white' : 'text-[#1A2332] hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{t.nav.marketplace}</span>
              </span>
            </button>

            <button
              onClick={() => handleNavClick('compliance')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                currentView === 'compliance' ? 'bg-[#0D8B8B] text-white' : 'text-[#1A2332] hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4" />
                <span>{t.nav.compliance}</span>
              </span>
              {pendingSlipsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#FF6B54] text-white text-[10px]">
                  {pendingSlipsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('messages')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                currentView === 'messages' ? 'bg-[#0D8B8B] text-white' : 'text-[#1A2332] hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{t.nav.messages}</span>
              </span>
              {unreadMsgCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#0D8B8B] text-white text-[10px]">
                  {unreadMsgCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('landing')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                currentView === 'landing' ? 'bg-[#0D8B8B] text-white' : 'text-[#1A2332] hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{t.nav.landing}</span>
              </span>
            </button>
          </div>
        )}

        {/* Mobile persistent bottom/quick tabs */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-[#E8E4DF] text-xs">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`py-1 px-2 font-medium transition-colors ${currentView === 'dashboard' ? 'text-[#0D8B8B] font-bold' : 'text-[#52697C]'}`}
          >
            {t.nav.dashboard}
          </button>
          <button
            onClick={() => handleNavClick('marketplace')}
            className={`py-1 px-2 font-medium transition-colors ${currentView === 'marketplace' ? 'text-[#0D8B8B] font-bold' : 'text-[#52697C]'}`}
          >
            {t.nav.marketplace}
          </button>
          <button
            onClick={() => handleNavClick('compliance')}
            className={`py-1 px-2 font-medium transition-colors ${currentView === 'compliance' ? 'text-[#0D8B8B] font-bold' : 'text-[#52697C]'}`}
          >
            {t.nav.compliance} ({pendingSlipsCount})
          </button>
          <button
            onClick={() => handleNavClick('messages')}
            className={`py-1 px-2 font-medium transition-colors ${currentView === 'messages' ? 'text-[#0D8B8B] font-bold' : 'text-[#52697C]'}`}
          >
            {t.nav.messages}
          </button>
        </div>
      </div>
    </header>
  );
};
