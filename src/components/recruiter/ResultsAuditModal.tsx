import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AssessmentAssignment } from '../../types';
import { X, CheckCircle2, XCircle, Award, FileDown, Info } from 'lucide-react';
import { getLocalizedArea } from '../../utils/areaLocalization';
import { exportScorecardToPdf } from '../../utils/pdfExport';

interface Props {
  assignment: AssessmentAssignment | null;
  onClose: () => void;
}

export const ResultsAuditModal: React.FC<Props> = ({ assignment, onClose }) => {
  const { quizzes, t, language } = useApp();

  if (!assignment) return null;

  const quiz = quizzes.find(q => q.id === assignment.quizId);

  // Filter only questions that were assigned for this test
  const questionsToAudit = quiz
    ? assignment.selectedQuestionIds && assignment.selectedQuestionIds.length > 0
      ? quiz.questions.filter(q => assignment.selectedQuestionIds!.includes(q.id))
      : quiz.questions
    : [];

  const handleExportPdf = () => {
    exportScorecardToPdf(assignment, quiz, language);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 border border-[#dfe7f1] shadow-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#dfe7f1] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#10243e] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2368f5]" />
              <span>{t.recruiter.auditModal.title}</span>
            </h2>
            <p className="text-xs text-[#60738a] mt-0.5">
              {assignment.candidateName} • {getLocalizedArea(assignment.quizTitle, language)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#2368f5] hover:bg-blue-100 text-xs font-bold cursor-pointer transition-colors border border-blue-200"
              title={t.recruiter.auditModal.exportPdfBtn}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.recruiter.auditModal.exportPdfBtn}</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Score Banner */}
        <div className="py-4 px-5 rounded-2xl bg-[#f5f8fc] border border-[#dfe7f1] mt-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-[#60738a] uppercase tracking-wider">
              {t.common.score}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-3xl font-black ${
                (assignment.score ?? 0) >= 75 ? 'text-[#22a06b]' : 'text-amber-600'
              }`}>
                {assignment.score}%
              </span>
              <span className="text-xs text-[#10243e] font-semibold">
                ({assignment.correctAnswersCount} / {assignment.totalQuestions} {t.common.correct.toLowerCase()})
              </span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                (assignment.score ?? 0) >= 75
                  ? 'bg-emerald-100 text-[#22a06b]'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {(assignment.score ?? 0) >= 75 ? t.common.qualified : t.common.notQualified}
            </span>
            <p className="text-[10px] text-[#60738a] mt-1">
              {t.recruiter.auditModal.completedOn} {assignment.completedAt || 'N/A'}
            </p>
          </div>
        </div>

        {/* Question by Question Breakdown */}
        <div className="overflow-y-auto space-y-4 py-4 pr-1 flex-1">
          <h3 className="text-xs font-bold text-[#10243e] uppercase tracking-wider">
            {t.recruiter.auditModal.breakdownLabel} ({questionsToAudit.length} {t.recruiter.auditModal.questionsCount})
          </h3>

          {!quiz ? (
            <p className="text-xs text-[#60738a]">{t.recruiter.auditModal.detailsUnavailable}</p>
          ) : (
            questionsToAudit.map((q, idx) => {
              const userSelectedIds: string[] = (assignment.answers && assignment.answers[q.id]) || [];
              const correctIds = q.correctOptionIds;

              // Check if user answer is an exact match
              const isCorrect =
                userSelectedIds.length === correctIds.length &&
                userSelectedIds.slice().sort().every((val: string, index: number) => val === correctIds.slice().sort()[index]);

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
                    <div>
                      <p className="font-bold text-[#10243e]">
                        #{idx + 1}. {q.text.replace(/!\[.*?\]\((.*?)\)/g, '').trim()}
                      </p>
                      {(q.imageUrl || q.text.match(/!\[.*?\]\((.*?)\)/)?.[1]) && (
                        <div className="mt-2 p-1.5 bg-white border border-slate-200 rounded-xl inline-block max-h-40 overflow-hidden">
                          <img
                            src={q.imageUrl || q.text.match(/!\[.*?\]\((.*?)\)/)?.[1]}
                            alt="Diagram"
                            className="max-h-36 object-contain rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-[#22a06b] text-white'
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
                              : 'bg-white text-[#60738a] border border-[#dfe7f1]'
                          }`}
                        >
                          <span>{opt.text}</span>
                          <span className="text-[10px] uppercase font-bold shrink-0 ml-2">
                            {wasSelected && isOptionKey && t.recruiter.auditModal.selectedCorrect}
                            {wasSelected && !isOptionKey && t.recruiter.auditModal.selectedWrong}
                            {!wasSelected && isOptionKey && t.recruiter.auditModal.expectedKey}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#60738a] pt-1 border-t border-slate-200/60">
                      <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <p>
                        <span className="font-semibold text-slate-700">
                          {language === 'es' ? 'Fundamento Técnico:' : 'Technical Rationale:'}
                        </span>{' '}
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#dfe7f1] shrink-0 flex items-center justify-between gap-2">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#2368f5] text-white rounded-xl hover:bg-[#144cc0] transition-colors shadow-xs cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>{t.recruiter.auditModal.exportPdfBtn}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
