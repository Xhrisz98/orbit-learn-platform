import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  SendHorizontal,
  CheckCircle2,
  CheckSquare,
  Square,
  Search,
  Users,
  BookOpen,
} from 'lucide-react';

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
  const { candidates, quizzes, assignCustomQuiz, t } = useApp();

  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  // Initialize defaults on open
  useEffect(() => {
    if (isOpen) {
      const initialCandIds = defaultCandidateId
        ? [defaultCandidateId]
        : candidates.length > 0
        ? [candidates[0].id]
        : [];
      setSelectedCandidateIds(initialCandIds);

      const initialQId = defaultQuizId || quizzes[0]?.id || '';
      setSelectedQuizId(initialQId);

      const chosenQuiz = quizzes.find(q => q.id === initialQId);
      if (chosenQuiz) {
        // By default select all questions from the quiz, user can uncheck/pick
        setSelectedQuestionIds(chosenQuiz.questions.map(q => q.id));
      }
      setAssignedSuccess(false);
    }
  }, [isOpen, defaultCandidateId, defaultQuizId, candidates, quizzes]);

  // When quiz changes, select its questions
  const handleQuizChange = (qId: string) => {
    setSelectedQuizId(qId);
    const chosenQuiz = quizzes.find(q => q.id === qId);
    if (chosenQuiz) {
      setSelectedQuestionIds(chosenQuiz.questions.map(q => q.id));
    } else {
      setSelectedQuestionIds([]);
    }
  };

  if (!isOpen) return null;

  const currentQuiz = quizzes.find(q => q.id === selectedQuizId);

  // Candidate selection toggle
  const toggleCandidate = (cId: string) => {
    if (selectedCandidateIds.includes(cId)) {
      setSelectedCandidateIds(selectedCandidateIds.filter(id => id !== cId));
    } else {
      setSelectedCandidateIds([...selectedCandidateIds, cId]);
    }
  };

  const selectAllCandidates = () => {
    setSelectedCandidateIds(candidates.map(c => c.id));
  };

  const deselectAllCandidates = () => {
    setSelectedCandidateIds([]);
  };

  // Question selection toggle
  const toggleQuestion = (qId: string) => {
    if (selectedQuestionIds.includes(qId)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== qId));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, qId]);
    }
  };

  const selectAllQuestions = () => {
    if (currentQuiz) {
      setSelectedQuestionIds(currentQuiz.questions.map(q => q.id));
    }
  };

  const deselectAllQuestions = () => {
    setSelectedQuestionIds([]);
  };

  // Filter questions by search
  const filteredQuestions = currentQuiz?.questions.filter(q => {
    if (!questionSearch.trim()) return true;
    const term = questionSearch.toLowerCase();
    return (
      q.text.toLowerCase().includes(term) ||
      (q.categoryTag && q.categoryTag.toLowerCase().includes(term))
    );
  }) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidateIds.length === 0) {
      alert(t.recruiter.assignModal.noCandidatesSelected);
      return;
    }
    if (selectedQuestionIds.length === 0) {
      alert(t.recruiter.assignModal.noQuestionsSelected);
      return;
    }

    assignCustomQuiz(selectedCandidateIds, selectedQuizId, selectedQuestionIds);
    setAssignedSuccess(true);
    setTimeout(() => {
      setAssignedSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 border border-slate-200 shadow-2xl my-6 max-h-[92vh] flex flex-col">
        {assignedSuccess ? (
          <div className="text-center py-10 space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Custom Assessment Assigned!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Assigned {selectedQuestionIds.length} customized questions to {selectedCandidateIds.length} candidate(s). The tests are ready in their portal.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {t.recruiter.assignModal.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.recruiter.assignModal.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-6 flex-1">
              {/* Step 1: Select Candidates (Multi-Candidate) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#2368f5]" />
                    <span>{t.recruiter.assignModal.step1Label}</span>
                    <span className="ml-1 text-[11px] font-semibold text-slate-500">
                      ({selectedCandidateIds.length} {t.common.selected})
                    </span>
                  </label>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={selectAllCandidates}
                      className="text-[#2368f5] font-semibold hover:underline cursor-pointer"
                    >
                      {t.common.selectAll}
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={deselectAllCandidates}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {t.common.deselectAll}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {candidates.map(cand => {
                    const isChecked = selectedCandidateIds.includes(cand.id);
                    return (
                      <div
                        key={cand.id}
                        onClick={() => toggleCandidate(cand.id)}
                        className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs transition-colors ${
                          isChecked
                            ? 'bg-blue-50/70 border-[#2368f5] text-[#10243e] font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#2368f5] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <img
                          src={cand.avatar}
                          alt={cand.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <div className="truncate">
                          <p className="truncate">{cand.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{cand.roleApplied}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Question Bank */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#2368f5]" />
                  <span>{t.recruiter.assignModal.step2Label}</span>
                </label>
                <select
                  value={selectedQuizId}
                  onChange={e => handleQuizChange(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                >
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.title} ({q.questions.length} questions in bank) • {q.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Manual Questions Selector */}
              {currentQuiz && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-900">
                        {t.recruiter.assignModal.step3Label}
                      </label>
                      <div className="text-[11px] font-bold text-[#2368f5] mt-0.5">
                        ✓ {selectedQuestionIds.length} / {currentQuiz.questions.length}{' '}
                        {t.recruiter.assignModal.selectedCounter}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={selectAllQuestions}
                        className="text-[11px] font-bold text-[#2368f5] hover:underline cursor-pointer"
                      >
                        {t.common.selectAll}
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={deselectAllQuestions}
                        className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {t.common.deselectAll}
                      </button>
                    </div>
                  </div>

                  {/* Search filter in question bank */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t.recruiter.assignModal.searchQuestionsPlaceholder}
                      value={questionSearch}
                      onChange={e => setQuestionSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                    />
                  </div>

                  {/* Question Checklist */}
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {filteredQuestions.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No questions match your search.</p>
                    ) : (
                      filteredQuestions.map((q, idx) => {
                        const isChecked = selectedQuestionIds.includes(q.id);
                        return (
                          <div
                            key={q.id}
                            onClick={() => toggleQuestion(q.id)}
                            className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer text-xs transition-all ${
                              isChecked
                                ? 'bg-blue-50/50 border-[#2368f5] text-[#10243e] font-medium shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <div className="pt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-[#2368f5]" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900">
                                  #{idx + 1}
                                </span>
                                {q.categoryTag && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                                    {q.categoryTag}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">
                                  ({q.options.length} options)
                                </span>
                              </div>
                              <p className="line-clamp-2 leading-relaxed">{q.text}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={selectedCandidateIds.length === 0 || selectedQuestionIds.length === 0}
                  className="flex-1 py-2.5 text-xs font-bold bg-[#2368f5] text-white rounded-xl hover:bg-[#144cc0] disabled:opacity-40 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>
                    {t.recruiter.assignModal.confirmBtn} ({selectedQuestionIds.length} Qs)
                  </span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
