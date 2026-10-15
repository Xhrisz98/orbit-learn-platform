import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AssessmentAssignment } from '../../types';
import { TakeAssessmentModal } from './TakeAssessmentModal';
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  Briefcase,
  Mars,
  Venus,
} from 'lucide-react';
import { getLocalizedArea } from '../../utils/areaLocalization';
import { resolveCandidateGender, getCandidateInitials } from '../../utils/genderHelper';

export const CandidatePortal: React.FC = () => {
  const {
    activeCandidateId,
    setActiveCandidateId,
    candidates,
    assignments,
    quizzes,
    t,
    language,
  } = useApp();

  const [activeTestAssignment, setActiveTestAssignment] = useState<AssessmentAssignment | null>(null);

  const currentCandidate = candidates.find(c => c.id === activeCandidateId) || candidates[0];

  // Get assignments for current candidate
  const candidateAssignments = assignments.filter(a => a.candidateId === currentCandidate?.id);

  const isFemale = currentCandidate ? resolveCandidateGender(currentCandidate) === 'female' : false;
  const initial = currentCandidate ? getCandidateInitials(currentCandidate.name) : 'C';

  return (
    <div className="space-y-6">
      {/* Candidate Profile Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-xs border ${
                isFemale
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              <span>{initial}</span>
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border shadow-xs ${
                isFemale
                  ? 'bg-purple-100 text-purple-700 border-purple-300'
                  : 'bg-blue-100 text-blue-700 border-blue-300'
              }`}
              title={isFemale ? (language === 'es' ? 'Femenino' : 'Female') : (language === 'es' ? 'Masculino' : 'Male')}
            >
              {isFemale ? <Venus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Mars className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#2368f5]">
                {t.candidate.portalBadge}
              </span>
              {currentCandidate?.area && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <Briefcase className="w-2.5 h-2.5 text-[#2368f5]" />
                  <span>{getLocalizedArea(currentCandidate.area, language)}</span>
                </span>
              )}
              <span className="text-xs text-[#60738a]">• Candidate ID: {currentCandidate?.id ? currentCandidate.id.substring(0, 8) : ''}...</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#10243e] tracking-tight">
              {currentCandidate?.name}
            </h1>
            <p className="text-xs text-[#2368f5] font-semibold mt-0.5">
              {currentCandidate?.roleApplied} • <span className="text-[#60738a] font-normal">{currentCandidate?.email}</span>
            </p>
          </div>
        </div>

        {/* Quick Candidate Switcher for Demo */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {t.candidate.switchCandidateLabel}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {candidates.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCandidateId(c.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  c.id === currentCandidate.id
                    ? 'bg-[#2368f5] text-white shadow-xs font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tests Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            {t.candidate.myTestsTitle} ({candidateAssignments.length})
          </h2>
          <p className="text-xs text-slate-500">
            {t.candidate.myTestsSubtitle}
          </p>
        </div>

        {candidateAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            {t.candidate.noTests}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidateAssignments.map(assignment => {
              const quiz = quizzes.find(q => q.id === assignment.quizId);
              const isCompleted = assignment.status === 'completed';

              return (
                <div
                  key={assignment.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                    isCompleted
                      ? 'border-[#dfe7f1]'
                      : 'border-[#2368f5] ring-2 ring-[#2368f5]/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f5f8fc] text-[#2368f5] border border-[#dfe7f1]">
                        {getLocalizedArea(quiz?.category || 'Assessment', language)}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#2368f5]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t.candidate.completedBadge}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700">
                          <Clock className="w-3 h-3" />
                          <span>{t.common.pending}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-[#10243e]">
                      {getLocalizedArea(assignment.quizTitle, language)}
                    </h3>

                    {quiz?.description && (
                      <p className="text-xs text-[#60738a] mt-1 line-clamp-2 leading-relaxed">
                        {quiz.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-3 text-xs text-[#60738a] font-semibold">
                      <span>{assignment.totalQuestions} {t.common.questions.toLowerCase()}</span>
                      <span>•</span>
                      <span>{quiz?.timeLimitMinutes || 20} {t.recruiter.quizzes.cardTime}</span>
                    </div>
                  </div>

                  {/* Bottom Action / Score */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    {isCompleted ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-[#60738a] block">{t.candidate.scoreBadge}</span>
                          <span className="text-xl font-black text-[#10243e]">
                            {assignment.score}%{' '}
                            <span className="text-xs font-normal text-[#60738a]">
                              ({assignment.correctAnswersCount}/{assignment.totalQuestions})
                            </span>
                          </span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            (assignment.score ?? 0) >= 75
                              ? 'bg-emerald-100 text-[#22a06b]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {(assignment.score ?? 0) >= 75 ? t.common.qualified : t.common.notQualified}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveTestAssignment(assignment)}
                        className="w-full py-2.5 bg-[#2368f5] text-white rounded-xl text-xs font-bold hover:bg-[#144cc0] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>{t.candidate.startTestBtn}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Test Execution Modal */}
      <TakeAssessmentModal
        assignment={activeTestAssignment}
        onClose={() => setActiveTestAssignment(null)}
      />
    </div>
  );
};
