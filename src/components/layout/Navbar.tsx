import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  GraduationCap,
  Languages,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    activeRole,
    setActiveRole,
    activeCandidateId,
    setActiveCandidateId,
    candidates,
    assignments,
  } = useApp();

  const completedCount = assignments.filter(a => a.status === 'completed').length;
  const pendingCount = assignments.filter(a => a.status === 'pending').length;

  const activeCandidate = candidates.find(c => c.id === activeCandidateId) || candidates[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#dfe7f1] shadow-xs">
      {/* Top Banner: Demo Mode & Role Switcher */}
      <div className="bg-[#10243e] text-xs text-white py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Active Mode Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22a06b] animate-pulse"></span>
            <span className="text-slate-300 hidden sm:inline">{t.demoModeBadge}:</span>
            <span className="font-semibold text-white tracking-wide uppercase text-[11px] sm:text-xs">
              {t.activeRoleLabel} {activeRole === 'recruiter' ? t.roles.recruiter : t.roles.candidate}
            </span>
            <span className="hidden md:inline text-slate-400">
              • {completedCount} {t.common.completed.toLowerCase()} / {pendingCount} {t.common.pending.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher Buttons */}
            <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full border border-white/20">
              <button
                onClick={() => setActiveRole('recruiter')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeRole === 'recruiter'
                    ? 'bg-[#2368f5] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t.roles.recruiter}</span>
              </button>

              <button
                onClick={() => setActiveRole('candidate')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeRole === 'candidate'
                    ? 'bg-[#2368f5] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t.roles.candidate}</span>
              </button>
            </div>

            {/* Language Selector: EN | ES */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5 border border-white/20 pl-1.5">
              <Languages className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#2368f5] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'es'
                    ? 'bg-[#2368f5] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2368f5] to-[#2bc5d9] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-[#10243e] tracking-tight font-sans">
                  {t.brand}
                </span>
                <span className="hidden lg:inline-block ml-2 text-[10px] font-bold bg-[#f5f8fc] text-[#2368f5] px-2 py-0.5 rounded-full border border-[#dfe7f1]">
                  Skills Verification Platform
                </span>
              </div>
            </div>
          </div>

          {/* Role specific profile indicator */}
          <div className="flex items-center gap-3">
            {activeRole === 'recruiter' ? (
              <div className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2368f5] flex items-center justify-center font-bold text-xs ring-2 ring-blue-100">
                  SP
                </div>
                <div className="text-left text-xs leading-tight hidden sm:block">
                  <p className="font-bold text-[#10243e]">Hiring Manager & Recruiter</p>
                  <p className="text-[#60738a] text-[11px]">SkillProof Enterprise</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#60738a] hidden md:inline">
                  {language === 'en' ? 'Testing Candidate:' : 'Candidato en prueba:'}
                </span>
                <select
                  value={activeCandidateId}
                  onChange={e => setActiveCandidateId(e.target.value)}
                  className="text-xs font-semibold bg-[#f5f8fc] border border-[#dfe7f1] rounded-xl px-2.5 py-1.5 text-[#10243e] focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.roleApplied.split(' ')[0]})
                    </option>
                  ))}
                </select>
                {activeCandidate && (
                  <img
                    src={activeCandidate.avatar}
                    alt={activeCandidate.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-200"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
