import React from 'react';
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
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
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

  const pendingSlipsCount = permissionSlips.filter(s => s.status === 'pending').length;
  const unreadMsgCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  const rolesConfig: { id: Role; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'parent', label: 'Padre', icon: <Users className="w-4 h-4" />, color: 'bg-teal-700 text-white' },
    { id: 'student', label: 'Estudiante', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-indigo-600 text-white' },
    { id: 'teacher', label: 'Profesor', icon: <School className="w-4 h-4" />, color: 'bg-emerald-600 text-white' },
    { id: 'tutor', label: 'Tutor / Proveedor', icon: <Sparkles className="w-4 h-4" />, color: 'bg-amber-600 text-white' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E4DF] shadow-xs">
      {/* Top Banner: Multi-Role Switcher Indicator */}
      <div className="bg-[#1A2332] text-xs text-white py-1.5 px-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></span>
          <span className="text-gray-300">Modo Demo Activo:</span>
          <span className="font-semibold text-white tracking-wide uppercase">
            Rol actual: {rolesConfig.find(r => r.id === activeRole)?.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 mr-1 hidden sm:inline">Cambiar vista rápidamente:</span>
          {rolesConfig.map(r => (
            <button
              key={r.id}
              onClick={() => {
                setActiveRole(r.id);
                if (currentView === 'landing') setCurrentView('dashboard');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                activeRole === r.id
                  ? 'bg-[#0D8B8B] text-white shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0D8B8B] to-[#15A9A9] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl font-mono">O</span>
              </div>
              <div>
                <span className="font-bold text-xl text-[#0D8B8B] tracking-tight font-sans">OrbitLearn</span>
                <span className="hidden md:inline-block ml-2 text-[10px] font-semibold bg-[#FFE4DC] text-[#FF6B54] px-1.5 py-0.5 rounded-sm">
                  MVP v1.0
                </span>
              </div>
            </button>

            {/* Nav Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Panel {activeRole === 'parent' ? 'Familiar' : activeRole === 'student' ? 'Estudiante' : activeRole === 'teacher' ? 'Docente' : 'Tutor'}</span>
              </button>

              <button
                onClick={() => setCurrentView('marketplace')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'marketplace'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Marketplace Tutores</span>
              </button>

              <button
                onClick={() => setCurrentView('compliance')}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'compliance'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Permisos & E-Sign</span>
                {pendingSlipsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FF6B54] text-white text-[10px] flex items-center justify-center font-bold">
                    {pendingSlipsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('messages')}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'messages'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mensajes</span>
                {unreadMsgCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#0D8B8B] text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadMsgCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('landing')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'landing'
                    ? 'bg-[#0D8B8B]/10 text-[#0D8B8B] font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332] hover:bg-gray-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Landing Page</span>
              </button>
            </nav>
          </div>

          {/* Right Actions: Sync Button & Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={syncWithLMS}
              disabled={isSyncing}
              title={lastSyncedText}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F8F6F3] border border-[#E8E4DF] text-[#1A2332] hover:bg-[#E8E4DF] transition-all disabled:opacity-50 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#0D8B8B] ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Sincronizando...' : 'Sincronizar LMS'}
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
              <div className="hidden md:block text-left text-xs leading-tight">
                <p className="font-semibold text-[#1A2332]">
                  {activeRole === 'parent'
                    ? 'Familia Miller'
                    : activeRole === 'student'
                    ? 'Alex Miller'
                    : activeRole === 'teacher'
                    ? 'Prof. Vance'
                    : 'Dra. Elena Rostova'}
                </p>
                <p className="text-[#52697C] text-[11px] capitalize">{activeRole}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-[#E8E4DF] text-xs">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`py-1 px-2 font-medium ${currentView === 'dashboard' ? 'text-[#0D8B8B] font-bold' : 'text-[#52697C]'}`}
          >
            Panel
          </button>
          <button
            onClick={() => setCurrentView('marketplace')}
            className={`py-1 px-2 font-medium ${currentView === 'marketplace' ? 'text-[#0D8B8B] font-bold' : 'text-[#52697C]'}`}
          >
            Tutores
          </button>
          <button
            onClick={() => setCurrentView('compliance')}
            className={`py-1 px-2 font-medium ${currentView === 'compliance' ? 'text-[#0D8B8B] font-bold' : 'text-[#52697C]'}`}
          >
            Firmas ({pendingSlipsCount})
          </button>
          <button
            onClick={() => setCurrentView('messages')}
            className={`py-1 px-2 font-medium ${currentView === 'messages' ? 'text-[#0D8B8B] font-bold' : 'text-[#52697C]'}`}
          >
            Mensajes
          </button>
          <button
            onClick={() => setCurrentView('landing')}
            className={`py-1 px-2 font-medium ${currentView === 'landing' ? 'text-[#0D8B8B] font-bold' : 'text-[#52697C]'}`}
          >
            Landing
          </button>
        </div>
      </div>
    </header>
  );
};
