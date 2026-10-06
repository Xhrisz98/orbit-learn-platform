import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, SendHorizontal, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultCandidateId?: string;
  defaultQuizId?: string;
}

export const AssignQuizModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultCandidateId,
  defaultQuizId,
}) => {
  const { candidates, quizzes, assignQuiz, t } = useApp();

  const [candidateId, setCandidateId] = useState(defaultCandidateId || candidates[0]?.id || '');
  const [quizId, setQuizId] = useState(defaultQuizId || quizzes[0]?.id || '');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId || !quizId) return;

    assignQuiz(candidateId, quizId);
    setAssignedSuccess(true);
    setTimeout(() => {
      setAssignedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
        {assignedSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Assessment Assigned!
            </h3>
            <p className="text-xs text-slate-500">
              The candidate can now access and solve this test from their portal.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.recruiter.assignModal.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.recruiter.assignModal.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t.recruiter.assignModal.selectCandidate}
                </label>
                <select
                  value={candidateId}
                  onChange={e => setCandidateId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.roleApplied}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t.recruiter.assignModal.selectQuiz}
                </label>
                <select
                  value={quizId}
                  onChange={e => setQuizId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.title} ({q.questions.length} questions)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold bg-[#4F46E5] text-white rounded-xl hover:bg-[#4338CA] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>{t.recruiter.assignModal.confirmBtn}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
