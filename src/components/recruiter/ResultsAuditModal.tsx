import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AssessmentAssignment } from '../../types';
import { X, CheckCircle2, XCircle, Award } from 'lucide-react';

interface Props {
  assignment: AssessmentAssignment | null;
  onClose: () => void;
}

export const ResultsAuditModal: React.FC<Props> = ({ assignment, onClose }) => {
  const { quizzes, t } = useApp();

  if (!assignment) return null;

  const quiz = quizzes.find(q => q.id === assignment.quizId);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 border border-slate-200 shadow-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>{t.recruiter.auditModal.title}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {assignment.candidateName} • {assignment.quizTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Banner */}
        <div className="py-4 px-5 rounded-2xl bg-slate-50 border border-slate-200 mt-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {t.common.score}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-black ${
                (assignment.score ?? 0) >= 75 ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {assignment.score}%
              </span>
              <span className="text-xs text-slate-600">
                ({assignment.correctAnswersCount} / {assignment.totalQuestions} {t.common.correct.toLowerCase()})
              </span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                (assignment.score ?? 0) >= 75
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {(assignment.score ?? 0) >= 75 ? t.common.qualified : t.common.notQualified}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              Completed: {assignment.completedAt || 'N/A'}
            </p>
          </div>
        </div>

        {/* Question by Question Breakdown */}
        <div className="overflow-y-auto space-y-4 py-4 pr-1 flex-1">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {t.recruiter.auditModal.breakdownLabel}
          </h3>

          {!quiz ? (
            <p className="text-xs text-slate-500">Quiz details unavailable.</p>
          ) : (
            quiz.questions.map((q, idx) => {
              const userSelectedIds = (assignment.answers && assignment.answers[q.id]) || [];
              const correctIds = q.correctOptionIds;

              // Check if user answer is an exact match
              const isCorrect =
                userSelectedIds.length === correctIds.length &&
                userSelectedIds.slice().sort().every((val, index) => val === correctIds.slice().sort()[index]);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                    isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-red-50/40 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-900">
                      {idx + 1}. {q.text}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{isCorrect ? t.recruiter.auditModal.legendCorrect : t.recruiter.auditModal.legendWrong}</span>
                    </span>
                  </div>

                  {/* Options status */}
                  <div className="space-y-1.5 pl-2">
                    {q.options.map(opt => {
                      const wasSelected = userSelectedIds.includes(opt.id);
                      const isOptionKey = correctIds.includes(opt.id);

                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg flex items-center justify-between text-[11px] ${
                            isOptionKey && wasSelected
                              ? 'bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300'
                              : isOptionKey && !wasSelected
                              ? 'bg-amber-100/70 text-amber-900 border border-amber-300'
                              : wasSelected && !isOptionKey
                              ? 'bg-red-100 text-red-900 font-semibold border border-red-300'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span>{opt.text}</span>
                          <span className="text-[10px] uppercase font-bold shrink-0 ml-2">
                            {wasSelected && isOptionKey && '✓ Selected Correct'}
                            {wasSelected && !isOptionKey && '✗ Selected Wrong'}
                            {!wasSelected && isOptionKey && 'Expected Key'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 shrink-0 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
