import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { AssessmentAssignment } from '../../types';
import {
  X,
  CheckCircle2,
  Check,
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { getLocalizedArea } from '../../utils/areaLocalization';

interface Props {
  assignment: AssessmentAssignment | null;
  onClose: () => void;
}

export const TakeAssessmentModal: React.FC<Props> = ({ assignment, onClose }) => {
  const { quizzes, submitAssessment, t, language } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    score: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
  } | null>(null);

  if (!assignment) return null;

  const quiz = quizzes.find(q => q.id === assignment.quizId);
  if (!quiz) return null;

  // Duration in minutes and live countdown timer
  const durationMinutes = assignment.durationMinutes || quiz.timeLimitMinutes || 20;
  const initialSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [timeExpiredAlert, setTimeExpiredAlert] = useState(false);
  const selectedAnswersRef = useRef(selectedAnswers);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  // Real-time countdown timer
  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Automatically grade and submit when timer reaches 00:00
          const result = submitAssessment(assignment.id, selectedAnswersRef.current);
          setSubmitResult(result);
          setIsSubmitted(true);
          setTimeExpiredAlert(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, assignment.id]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isCriticalTime = secondsLeft <= 60; // Less than 1 min left
  const isWarningTime = secondsLeft <= 180 && !isCriticalTime; // Less than 3 mins left

  // Filter questions to only those picked by the recruiter
  const questionsToRender =
    assignment.selectedQuestionIds && assignment.selectedQuestionIds.length > 0
      ? quiz.questions.filter(q => assignment.selectedQuestionIds!.includes(q.id))
      : quiz.questions;

  const currentQ = questionsToRender[currentQuestionIndex];
  if (!currentQ) return null;

  const isMultipleChoice = currentQ.correctOptionIds.length > 1;
  const currentSelected = selectedAnswers[currentQ.id] || [];

  const handleToggleOption = (optionId: string) => {
    if (isMultipleChoice) {
      if (currentSelected.includes(optionId)) {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQ.id]: currentSelected.filter(id => id !== optionId),
        });
      } else {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQ.id]: [...currentSelected, optionId],
        });
      }
    } else {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQ.id]: [optionId],
      });
    }
  };

  const handleSubmit = () => {
    const result = submitAssessment(assignment.id, selectedAnswers);
    setSubmitResult(result);
    setIsSubmitted(true);
  };

  const progressPercent = Math.round(((currentQuestionIndex + 1) / questionsToRender.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#dfe7f1] shadow-2xl my-8 max-h-[90vh] flex flex-col justify-between">
        {/* Results Screen */}
        {isSubmitted && submitResult ? (
          <div className="text-center py-6 sm:py-8 space-y-4 my-auto">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
              submitResult.passed ? 'bg-emerald-100 text-[#22a06b]' : 'bg-amber-100 text-amber-600'
            }`}>
              {submitResult.passed ? <Award className="w-9 h-9" /> : <CheckCircle2 className="w-9 h-9" />}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#10243e]">
                {t.candidate.resultModal.title}
              </h2>
              <p className="text-xs text-[#60738a]">
                {t.candidate.resultModal.subtitle}
              </p>
            </div>

            {/* Score Showcase */}
            <div className="p-6 rounded-2xl bg-[#f5f8fc] border border-[#dfe7f1] max-w-sm mx-auto space-y-2">
              <p className="text-xs font-bold text-[#60738a] uppercase tracking-wider">
                {t.candidate.resultModal.yourScore}
              </p>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#2368f5]">
                {submitResult.score}%
              </div>
              <p className="text-xs text-[#10243e] font-medium">
                {t.candidate.resultModal.hitsSummary} {submitResult.correctCount} / {submitResult.totalQuestions}
              </p>
              <div className="pt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  submitResult.passed
                    ? 'bg-emerald-100 text-[#22a06b]'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {submitResult.passed ? t.common.qualified : t.common.notQualified}
                </span>
              </div>
            </div>

            {/* Time Expired Alert Banner */}
            {timeExpiredAlert && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-semibold max-w-sm mx-auto flex items-center justify-center gap-2 shadow-2xs">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t.candidate.assessmentModal.timeExpired}</span>
              </div>
            )}

            <p className="text-xs text-[#60738a] max-w-md mx-auto leading-relaxed">
              {submitResult.passed
                ? t.candidate.resultModal.statusQualified
                : t.candidate.resultModal.statusReview}
            </p>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#10243e] text-white text-xs font-bold rounded-xl hover:bg-[#1c3553] transition-colors shadow-xs cursor-pointer"
            >
              {t.candidate.resultModal.closeBtn}
            </button>
          </div>
        ) : (
          <>
            {/* Active Exam Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#dfe7f1] flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-[#2368f5]">
                      {getLocalizedArea(quiz.category, language)}
                    </span>
                    <span className="text-xs text-[#60738a] font-medium">
                      {durationMinutes} {t.candidate.assessmentModal.timeLimitBadge}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#10243e] mt-1">
                    {getLocalizedArea(quiz.title, language)}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Live Countdown Timer Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs font-mono tabular-nums ${
                      isCriticalTime
                        ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse ring-2 ring-rose-500/20'
                        : isWarningTime
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-blue-50 border-blue-200 text-[#2368f5]'
                    }`}
                    title={t.candidate.assessmentModal.timeRemaining}
                  >
                    <Clock
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isCriticalTime
                          ? 'text-rose-600'
                          : isWarningTime
                          ? 'text-amber-600'
                          : 'text-[#2368f5]'
                      }`}
                    />
                    <span>{formattedTime}</span>
                  </div>

                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#60738a]">
                  <span>
                    {t.candidate.assessmentModal.questionOf} {currentQuestionIndex + 1} {t.candidate.assessmentModal.of} {questionsToRender.length}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#2368f5] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Body */}
            <div className="py-6 space-y-5 overflow-y-auto">
              <div>
                <p className="text-[11px] font-bold text-[#2368f5] uppercase tracking-wider mb-1">
                  {isMultipleChoice ? t.candidate.assessmentModal.multipleHint : t.candidate.assessmentModal.singleHint}
                </p>
                <h3 className="text-sm sm:text-base font-bold text-[#10243e] leading-snug">
                  {currentQ.text.replace(/!\[.*?\]\((.*?)\)/g, '').trim()}
                </h3>

                {(currentQ.imageUrl || currentQ.text.match(/!\[.*?\]\((.*?)\)/)?.[1]) && (
                  <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-2xl flex justify-center max-h-64 overflow-hidden">
                    <img
                      src={currentQ.imageUrl || currentQ.text.match(/!\[.*?\]\((.*?)\)/)?.[1]}
                      alt="Technical Drawing"
                      className="max-h-60 object-contain rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, oIdx) => {
                  const isChecked = currentSelected.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleToggleOption(opt.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                        isChecked
                          ? 'border-[#2368f5] bg-blue-50/50 text-[#10243e] font-semibold shadow-xs'
                          : 'border-[#dfe7f1] bg-white hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[#2368f5] text-white'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {isChecked ? <Check className="w-3.5 h-3.5" /> : String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Submit Bar */}
            <div className="pt-4 border-t border-[#dfe7f1] flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs font-bold text-[#60738a] hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.candidate.assessmentModal.prevBtn}</span>
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < questionsToRender.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-5 py-2.5 bg-[#10243e] text-white text-xs font-bold rounded-xl hover:bg-[#1c3553] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{t.candidate.assessmentModal.nextBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-[#22a06b] text-white text-xs font-bold rounded-xl hover:bg-[#1c8357] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.candidate.assessmentModal.submitAssessmentBtn}</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
