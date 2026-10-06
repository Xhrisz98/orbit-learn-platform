import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AssessmentAssignment } from '../../types';
import {
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
} from 'lucide-react';


interface Props {
  assignment: AssessmentAssignment | null;
  onClose: () => void;
}

export const TakeAssessmentModal: React.FC<Props> = ({ assignment, onClose }) => {
  const { quizzes, submitAssessment, t } = useApp();

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

  const currentQ = quiz.questions[currentQuestionIndex];
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

  const progressPercent = Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl my-8 max-h-[90vh] flex flex-col justify-between">
        {/* Results Screen */}
        {isSubmitted && submitResult ? (
          <div className="text-center py-6 sm:py-8 space-y-4 my-auto">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
              submitResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {submitResult.passed ? <Award className="w-9 h-9" /> : <CheckCircle2 className="w-9 h-9" />}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {t.candidate.resultModal.title}
              </h2>
              <p className="text-xs text-slate-500">
                {t.candidate.resultModal.subtitle}
              </p>
            </div>

            {/* Score Showcase */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.candidate.resultModal.yourScore}
              </p>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-indigo-600">
                {submitResult.score}%
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {t.candidate.resultModal.hitsSummary} {submitResult.correctCount} / {submitResult.totalQuestions}
              </p>
              <div className="pt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  submitResult.passed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {submitResult.passed ? t.common.qualified : t.common.notQualified}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {submitResult.passed
                ? t.candidate.resultModal.statusQualified
                : t.candidate.resultModal.statusReview}
            </p>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              {t.candidate.resultModal.closeBtn}
            </button>
          </div>
        ) : (
          <>
            {/* Active Exam Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {quiz.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{quiz.timeLimitMinutes} min timer</span>
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    {quiz.title}
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>
                    {t.candidate.assessmentModal.questionOf} {currentQuestionIndex + 1} {t.candidate.assessmentModal.of} {quiz.questions.length}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Body */}
            <div className="py-6 space-y-5 overflow-y-auto">
              <div>
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  {isMultipleChoice ? t.candidate.assessmentModal.multipleHint : t.candidate.assessmentModal.singleHint}
                </p>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {currentQ.text}
                </h3>
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
                          ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-semibold shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {isChecked ? '✓' : String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
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
