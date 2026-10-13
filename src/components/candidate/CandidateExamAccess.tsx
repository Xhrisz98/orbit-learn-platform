import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TakeAssessmentModal } from './TakeAssessmentModal';
import type { AssessmentAssignment } from '../../types';
import { getLocalizedArea } from '../../utils/areaLocalization';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  Briefcase,
  Lock,
} from 'lucide-react';

interface Props {
  onSwitchToAdmin?: () => void;
}

export const CandidateExamAccess: React.FC<Props> = ({ onSwitchToAdmin }) => {
  const { assignments, quizzes, setActiveRole, t, language } = useApp();

  const [examCode, setExamCode] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [activeAssignment, setActiveAssignment] = useState<AssessmentAssignment | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Check URL query param (?code=... or ?test=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code') || params.get('test');
    if (codeParam) {
      setExamCode(codeParam.trim());
      const matched = assignments.find(a => a.id.toLowerCase() === codeParam.trim().toLowerCase());
      if (matched) {
        setActiveAssignment(matched);
      }
    }
  }, [assignments]);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const code = examCode.trim().toLowerCase();
    const matched = assignments.find(a => a.id.toLowerCase() === code);

    if (!matched) {
      setErrorMessage(t.candidateAccess.screenCode.codeNotFound);
      return;
    }

    setActiveAssignment(matched);
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!activeAssignment) return;

    const email = candidateEmail.trim().toLowerCase();
    const expected = (activeAssignment.candidateEmail || '').trim().toLowerCase();

    if (email !== expected) {
      setErrorMessage(t.candidateAccess.screenEmail.emailMismatch);
      return;
    }

    setIsEmailVerified(true);
  };

  const currentQuiz = activeAssignment ? quizzes.find(q => q.id === activeAssignment.quizId) : null;
  const isCompleted = activeAssignment?.status === 'completed';

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2368f5] to-[#2bc5d9] text-white shadow-md mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#10243e] tracking-tight">
          {t.candidateAccess.brandTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#60738a] mt-1">
          {t.candidateAccess.brandSubtitle}
        </p>
      </div>

      {/* Screen 1: Request Exam Code if not in URL */}
      {!activeAssignment && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2368f5] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#10243e]">
                {t.candidateAccess.screenCode.headerTitle}
              </h2>
              <p className="text-xs text-[#60738a]">
                {t.candidateAccess.screenCode.headerSubtitle}
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                {t.candidateAccess.screenCode.codeLabel}
              </label>
              <input
                type="text"
                required
                placeholder={t.candidateAccess.screenCode.codePlaceholder}
                value={examCode}
                onChange={e => setExamCode(e.target.value)}
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2368f5]/20 focus:border-[#2368f5]"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#2368f5] hover:bg-[#144cc0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.candidateAccess.screenCode.searchBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {onSwitchToAdmin && (
            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setActiveRole('recruiter');
                  onSwitchToAdmin();
                }}
                className="text-xs text-[#2368f5] hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t.candidateAccess.screenCode.recruiterLink}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Screen 2: Identity Verification with Candidate Email */}
      {activeAssignment && !isEmailVerified && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#2368f5] border border-blue-100">
                {t.candidateAccess.screenEmail.invitationConfirmed}
              </span>
              <h2 className="font-extrabold text-lg sm:text-xl text-[#10243e] mt-2">
                {getLocalizedArea(activeAssignment.quizTitle, language)}
              </h2>
              <p className="text-xs text-[#60738a] mt-0.5">
                {t.candidateAccess.screenEmail.registeredCandidate}{' '}
                <span className="font-bold text-slate-800">{activeAssignment.candidateName}</span>
              </p>
            </div>
          </div>

          {isCompleted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-[#22a06b] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-[#10243e]">
                {t.candidateAccess.screenEmail.completedTitle}
              </h3>
              <p className="text-xs text-[#60738a] max-w-sm mx-auto">
                {t.candidateAccess.screenEmail.completedDesc.replace(
                  '{date}',
                  activeAssignment.completedAt || t.candidateAccess.screenEmail.recently
                )}
              </p>
              <div className="pt-4">
                <span className="text-2xl font-black text-[#10243e]">{activeAssignment.score}%</span>
                <span className="text-xs text-[#60738a] block mt-1">
                  {t.candidateAccess.screenEmail.scoreObtained}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-[#60738a] space-y-1">
                <p className="font-semibold text-slate-800">
                  {t.candidateAccess.screenEmail.verifyIdentityTitle}
                </p>
                <p>
                  {t.candidateAccess.screenEmail.verifyIdentityDesc}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t.candidateAccess.screenEmail.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  placeholder={t.candidateAccess.screenEmail.emailPlaceholder}
                  value={candidateEmail}
                  onChange={e => setCandidateEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2368f5]/20 focus:border-[#2368f5]"
                  autoFocus
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#2368f5] hover:bg-[#144cc0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.candidateAccess.screenEmail.unlockBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Screen 3: Test Lobby & Start */}
      {activeAssignment && isEmailVerified && !isCompleted && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t.candidateAccess.screenLobby.identityVerified}
              </span>
              <h2 className="font-black text-xl text-[#10243e] mt-2">
                {getLocalizedArea(activeAssignment.quizTitle, language)}
              </h2>
              <p className="text-xs text-[#60738a] mt-0.5">
                {t.candidateAccess.screenLobby.welcome}{' '}
                <span className="font-bold text-slate-900">{activeAssignment.candidateName}</span> ({activeAssignment.candidateEmail})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="p-4 rounded-2xl bg-[#f5f8fc] border border-slate-200 text-center">
              <span className="text-xs text-[#60738a] block mb-1">
                {t.candidateAccess.screenLobby.assignedQuestions}
              </span>
              <span className="text-2xl font-black text-[#10243e]">{activeAssignment.totalQuestions}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#f5f8fc] border border-slate-200 text-center">
              <span className="text-xs text-[#60738a] block mb-1">
                {t.candidateAccess.screenLobby.timeLimit}
              </span>
              <span className="text-2xl font-black text-[#10243e]">{currentQuiz?.timeLimitMinutes || 20} min</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5 leading-relaxed">
            <p className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>{t.candidateAccess.screenLobby.instructionsTitle}</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-amber-800 pl-1">
              <li>{t.candidateAccess.screenLobby.rule1}</li>
              <li>{t.candidateAccess.screenLobby.rule2}</li>
              <li>{t.candidateAccess.screenLobby.rule3}</li>
            </ul>
          </div>

          <button
            onClick={() => setIsTestModalOpen(true)}
            className="w-full py-3.5 bg-[#2368f5] hover:bg-[#144cc0] text-white text-sm font-bold rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.candidateAccess.screenLobby.startBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Assessment Taking Modal */}
      {isTestModalOpen && (
        <TakeAssessmentModal
          assignment={activeAssignment}
          onClose={() => {
            setIsTestModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
