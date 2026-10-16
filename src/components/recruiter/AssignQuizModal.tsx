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
  Briefcase,
  Check,
  Mars,
  Venus,
  Filter,
  Clock,
  Shield,
  Zap,
  Award,
  Info,
  Sparkles,
} from 'lucide-react';

import { getLocalizedArea } from '../../utils/areaLocalization';
import { resolveCandidateGender, getCandidateInitials } from '../../utils/genderHelper';

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
  const { candidates, quizzes, assignCustomQuiz, t, language } = useApp();

  // Top Demand Filters
  const [filterArea, setFilterArea] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');

  // Selections
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [showAllBanks, setShowAllBanks] = useState(false);

  // Duration preset: 5, 15, or 30 mins
  const [durationPreset, setDurationPreset] = useState<5 | 15 | 30>(15);
  const [trimNotice, setTrimNotice] = useState<string | null>(null);

  const [questionSearch, setQuestionSearch] = useState('');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  // Available filters from candidate pool
  const candidateAreas = Array.from(
    new Set(candidates.map(c => c.area).filter(Boolean))
  ) as string[];
  const candidateRoles = Array.from(
    new Set(candidates.map(c => c.roleApplied).filter(Boolean))
  ) as string[];

  // Filtered candidate list based on Demand Filters
  const filteredCandidates = candidates.filter(c => {
    if (filterArea) {
      const inPrimary = c.area === filterArea;
      const inSecondary = c.secondaryAreas?.includes(filterArea);
      if (!inPrimary && !inSecondary) return false;
    }
    if (filterRole && c.roleApplied !== filterRole) return false;
    return true;
  });

  // Calculate max allowed questions based on duration preset
  const maxAllowedQuestions =
    durationPreset === 5 ? 5 : durationPreset === 15 ? 10 : Infinity;

  // Initialize defaults on open
  useEffect(() => {
    if (isOpen) {
      setFilterArea('');
      setFilterRole('');
      setShowAllBanks(false);
      setDurationPreset(15);
      setTrimNotice(null);

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
        // Preset 15 mins has max 10 questions
        const maxInitial = 10;
        setSelectedQuestionIds(chosenQuiz.questions.slice(0, maxInitial).map(q => q.id));
      }
      setAssignedSuccess(false);
    }
  }, [isOpen, defaultCandidateId, defaultQuizId, candidates, quizzes]);

  // Handle duration change with reactive auto-trimming
  const handleDurationPresetChange = (newPreset: 5 | 15 | 30) => {
    setDurationPreset(newPreset);
    const newMax = newPreset === 5 ? 5 : newPreset === 15 ? 10 : Infinity;
    if (selectedQuestionIds.length > newMax) {
      setSelectedQuestionIds(prev => prev.slice(0, newMax));
      setTrimNotice(
        t.recruiter.assignModal.capAutoTrimmed.replace('{max}', String(newMax))
      );
      setTimeout(() => setTrimNotice(null), 4000);
    }
  };

  // When quiz changes, select its questions up to maxAllowedQuestions
  const handleQuizChange = (qId: string) => {
    setSelectedQuizId(qId);
    const chosenQuiz = quizzes.find(q => q.id === qId);
    if (chosenQuiz) {
      if (chosenQuiz.questions.length > maxAllowedQuestions) {
        setSelectedQuestionIds(
          chosenQuiz.questions.slice(0, maxAllowedQuestions).map(q => q.id)
        );
      } else {
        setSelectedQuestionIds(chosenQuiz.questions.map(q => q.id));
      }
    } else {
      setSelectedQuestionIds([]);
    }
  };

  if (!isOpen) return null;

  // Single candidate detection and suggested question banks
  const isSingleCandidate = selectedCandidateIds.length === 1;
  const singleCandidate = isSingleCandidate
    ? candidates.find(c => c.id === selectedCandidateIds[0])
    : null;

  const candidateAssociatedAreas: string[] = singleCandidate
    ? [singleCandidate.area, ...(singleCandidate.secondaryAreas || [])].filter(Boolean) as string[]
    : [];

  const suggestedQuizzes = quizzes.filter(q => {
    if (!singleCandidate) return true;
    const catMatch = candidateAssociatedAreas.some(
      a => a.toLowerCase().trim() === q.category.toLowerCase().trim()
    );
    const roleMatch = singleCandidate.roleApplied
      ? q.supportedClassifications?.some(
          r => r.toLowerCase().trim() === singleCandidate.roleApplied.toLowerCase().trim()
        )
      : false;
    return catMatch || roleMatch;
  });

  const hasSuggested = isSingleCandidate && suggestedQuizzes.length > 0;
  const displayedQuizzes =
    hasSuggested && !showAllBanks ? suggestedQuizzes : quizzes;

  const currentQuiz =
    quizzes.find(q => q.id === selectedQuizId) || displayedQuizzes[0];

  // Candidate selection toggle
  const toggleCandidate = (cId: string) => {
    if (selectedCandidateIds.includes(cId)) {
      setSelectedCandidateIds(selectedCandidateIds.filter(id => id !== cId));
    } else {
      setSelectedCandidateIds([...selectedCandidateIds, cId]);
    }
  };

  const selectAllCandidates = () => {
    setSelectedCandidateIds(filteredCandidates.map(c => c.id));
  };

  const deselectAllCandidates = () => {
    setSelectedCandidateIds([]);
  };

  // Question selection toggle with strict reactive cap enforcement
  const toggleQuestion = (qId: string) => {
    if (selectedQuestionIds.includes(qId)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== qId));
    } else {
      if (selectedQuestionIds.length >= maxAllowedQuestions) {
        return; // Block adding past cap
      }
      setSelectedQuestionIds([...selectedQuestionIds, qId]);
    }
  };

  const selectAllQuestions = () => {
    if (currentQuiz) {
      const allIds = currentQuiz.questions.map(q => q.id);
      if (allIds.length > maxAllowedQuestions) {
        setSelectedQuestionIds(allIds.slice(0, maxAllowedQuestions));
        setTrimNotice(
          t.recruiter.assignModal.capAutoTrimmed.replace(
            '{max}',
            String(maxAllowedQuestions)
          )
        );
        setTimeout(() => setTrimNotice(null), 4000);
      } else {
        setSelectedQuestionIds(allIds);
      }
    }
  };

  const deselectAllQuestions = () => {
    setSelectedQuestionIds([]);
  };

  // Filter questions by search within the selected bank
  const filteredQuestions =
    currentQuiz?.questions.filter(q => {
      if (!questionSearch.trim()) return true;
      const term = questionSearch.toLowerCase();
      return (
        q.text.toLowerCase().includes(term) ||
        (q.categoryTag && q.categoryTag.toLowerCase().includes(term))
      );
    }) || [];

  const isCapReached = selectedQuestionIds.length >= maxAllowedQuestions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidateIds.length === 0) {
      alert(t.recruiter.assignModal.noCandidatesSelected);
      return;
    }
    if (selectedQuestionIds.length === 0) {
      alert(t.recruiter.assignModal.noQuestionsSelected);
      return;
    }

    await assignCustomQuiz(
      selectedCandidateIds,
      currentQuiz?.id || selectedQuizId,
      selectedQuestionIds,
      durationPreset
    );
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
              {t.recruiter.assignModal.successTitle}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t.recruiter.assignModal.successDesc
                .replace('{questions}', String(selectedQuestionIds.length))
                .replace('{candidates}', String(selectedCandidateIds.length))}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 shrink-0">
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
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-5 flex-1">
              {/* Top Demand Filter Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#2368f5]" />
                    <span>{t.recruiter.assignModal.filterDemandTitle}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {t.recruiter.assignModal.candidatesFound.replace(
                      '{count}',
                      String(filteredCandidates.length)
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {t.recruiter.assignModal.filterDemandAreaLabel}
                    </label>
                    <select
                      value={filterArea}
                      onChange={e => setFilterArea(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                    >
                      <option value="">{t.recruiter.assignModal.allAreasOption}</option>
                      {candidateAreas.map(area => (
                        <option key={area} value={area}>
                          {getLocalizedArea(area, language)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {t.recruiter.assignModal.filterDemandRoleLabel}
                    </label>
                    <select
                      value={filterRole}
                      onChange={e => setFilterRole(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                    >
                      <option value="">{t.recruiter.assignModal.allRolesOption}</option>
                      {candidateRoles.map(role => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 1: Select Candidates */}
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
                  {filteredCandidates.length === 0 ? (
                    <div className="col-span-full py-4 text-center text-xs text-slate-400 italic">
                      {language === 'es'
                        ? 'No hay candidatos que coincidan con los filtros de demanda seleccionados.'
                        : 'No candidates match the selected demand criteria.'}
                    </div>
                  ) : (
                    filteredCandidates.map(cand => {
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
                          <div className="relative shrink-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs border ${
                                cand.gender === 'female' ||
                                resolveCandidateGender(cand) === 'female'
                                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                                  : 'bg-blue-50 border-blue-200 text-blue-700'
                              }`}
                            >
                              <span>{getCandidateInitials(cand.name)}</span>
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center border shadow-2xs ${
                                cand.gender === 'female' ||
                                resolveCandidateGender(cand) === 'female'
                                  ? 'bg-purple-100 text-purple-700 border-purple-300'
                                  : 'bg-blue-100 text-blue-700 border-blue-300'
                              }`}
                            >
                              {cand.gender === 'female' ||
                              resolveCandidateGender(cand) === 'female' ? (
                                <Venus className="w-2.5 h-2.5" />
                              ) : (
                                <Mars className="w-2.5 h-2.5" />
                              )}
                            </div>
                          </div>
                          <div className="truncate">
                            <p className="truncate font-semibold">{cand.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {cand.roleApplied}
                              {cand.area
                                ? ` • ${getLocalizedArea(cand.area, language)}`
                                : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Step 2: Select Question Bank */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#2368f5]" />
                    <span>{t.recruiter.assignModal.step2Label}</span>
                  </label>
                  {hasSuggested && (
                    <button
                      type="button"
                      onClick={() => setShowAllBanks(!showAllBanks)}
                      className="text-[11px] font-semibold text-[#2368f5] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#2368f5]" />
                      <span>
                        {showAllBanks
                          ? t.recruiter.assignModal.showSuggestedBanksBtn
                          : t.recruiter.assignModal.showAllBanksBtn.replace(
                              '{count}',
                              String(quizzes.length)
                            )}
                      </span>
                    </button>
                  )}
                </div>

                <select
                  value={currentQuiz?.id || selectedQuizId}
                  onChange={e => handleQuizChange(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                >
                  {displayedQuizzes.map(q => (
                    <option key={q.id} value={q.id}>
                      {getLocalizedArea(q.title, language)} ({q.questions.length}{' '}
                      {t.recruiter.assignModal.questionsInBank}) •{' '}
                      {getLocalizedArea(q.category, language)}
                    </option>
                  ))}
                </select>

                {/* Question Bank Metadata Badge Bar */}
                {currentQuiz && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {/* Difficulty Badge */}
                    {currentQuiz.difficulty === 1 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.recruiter.createQuizModal.diffLevel1}</span>
                      </span>
                    ) : currentQuiz.difficulty === 3 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
                        <Award className="w-3.5 h-3.5 text-purple-600" />
                        <span>{t.recruiter.createQuizModal.diffLevel3}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-[#2368f5] border border-blue-200">
                        <Zap className="w-3.5 h-3.5 text-[#2368f5]" />
                        <span>{t.recruiter.createQuizModal.diffLevel2}</span>
                      </span>
                    )}

                    {/* Standard Time Limit */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{currentQuiz.timeLimitMinutes || 60} min</span>
                    </span>

                    {/* Suggested Indicator */}
                    {hasSuggested && !showAllBanks && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{t.recruiter.assignModal.suggestedForCandidate}</span>
                      </span>
                    )}
                  </div>
                )}

                {currentQuiz?.supportedClassifications &&
                  currentQuiz.supportedClassifications.length > 0 && (
                    <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#2368f5]" />
                        <span>
                          {language === 'es'
                            ? 'Puestos y Clasificaciones Compatibles (County of Orange):'
                            : 'Supported Positions & Classifications (County of Orange):'}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                        {currentQuiz.supportedClassifications.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Duration Presets & Reactive Question Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2368f5]" />
                  <span>{t.recruiter.assignModal.stepDurationTitle}</span>
                </label>

                {/* 3 Duration Preset Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDurationPresetChange(5)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      durationPreset === 5
                        ? 'bg-blue-50 border-[#2368f5] text-[#2368f5] ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.recruiter.assignModal.preset5Min}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDurationPresetChange(15)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      durationPreset === 15
                        ? 'bg-blue-50 border-[#2368f5] text-[#2368f5] ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.recruiter.assignModal.preset15Min}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDurationPresetChange(30)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      durationPreset === 30
                        ? 'bg-blue-50 border-[#2368f5] text-[#2368f5] ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.recruiter.assignModal.preset30Min}</span>
                  </button>
                </div>

                {/* Dynamic Trim Notification */}
                {trimNotice && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{trimNotice}</span>
                  </div>
                )}

                {/* Cap Reached Alert */}
                {isCapReached && maxAllowedQuestions !== Infinity && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#2368f5] shrink-0" />
                    <span>
                      {t.recruiter.assignModal.capReachedNotice
                        .replace('{minutes}', String(durationPreset))
                        .replace('{max}', String(maxAllowedQuestions))}
                    </span>
                  </div>
                )}
              </div>

              {/* Step 3: Manual Questions Selector */}
              {currentQuiz && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-900">
                        {t.recruiter.assignModal.step3Label}
                      </label>
                      <div className="text-[11px] font-bold text-[#2368f5] mt-0.5 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {selectedQuestionIds.length} /{' '}
                          {maxAllowedQuestions === Infinity
                            ? currentQuiz.questions.length
                            : `${maxAllowedQuestions} max`}{' '}
                          {t.recruiter.assignModal.selectedCounter}
                        </span>
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
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {filteredQuestions.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        {t.recruiter.assignModal.noQuestionsMatch}
                      </p>
                    ) : (
                      filteredQuestions.map((q, idx) => {
                        const isChecked = selectedQuestionIds.includes(q.id);
                        const isDisabled = !isChecked && isCapReached;

                        return (
                          <div
                            key={q.id}
                            onClick={() => {
                              if (!isDisabled) toggleQuestion(q.id);
                            }}
                            className={`p-3 rounded-xl border flex items-start gap-3 text-xs transition-all ${
                              isChecked
                                ? 'bg-blue-50/50 border-[#2368f5] text-[#10243e] font-medium shadow-2xs cursor-pointer'
                                : isDisabled
                                ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 cursor-pointer'
                            }`}
                          >
                            <div className="pt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-[#2368f5]" />
                              ) : (
                                <Square
                                  className={`w-4 h-4 ${
                                    isDisabled ? 'text-slate-200' : 'text-slate-300'
                                  }`}
                                />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900">
                                  #{idx + 1}
                                </span>
                                {q.categoryTag && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                                    {getLocalizedArea(q.categoryTag, language)}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">
                                  ({q.options.length}{' '}
                                  {t.recruiter.assignModal.optionsLabel})
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
                  disabled={
                    selectedCandidateIds.length === 0 ||
                    selectedQuestionIds.length === 0
                  }
                  className="flex-1 py-2.5 text-xs font-bold bg-[#2368f5] text-white rounded-xl hover:bg-[#144cc0] disabled:opacity-40 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>
                    {t.recruiter.assignModal.confirmBtn} (
                    {selectedQuestionIds.length} Qs • {durationPreset}m)
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
