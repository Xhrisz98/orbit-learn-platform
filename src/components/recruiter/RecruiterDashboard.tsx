import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AssessmentAssignment, Quiz } from '../../types';
import { QuizBuilderModal } from './QuizBuilderModal';
import { CandidateModal } from './CandidateModal';
import { AssignQuizModal } from './AssignQuizModal';
import { ResultsAuditModal } from './ResultsAuditModal';
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  PlusCircle,
  Search,
  BookOpen,
  SendHorizontal,
  Clock,
  Eye,
  Trash2,
  Edit3,
} from 'lucide-react';


export const RecruiterDashboard: React.FC = () => {
  const {
    candidates,
    quizzes,
    assignments,
    deleteQuiz,
    deleteCandidate,
    t,
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'pipeline' | 'quizzes' | 'candidates'>('pipeline');

  // Modals state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAuditAssignment, setSelectedAuditAssignment] = useState<AssessmentAssignment | null>(null);

  // Filter & Search state for pipeline
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | 'pending' | 'completed' | 'qualified'>('all');

  // Metrics calculation
  const totalCandidatesCount = candidates.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed');
  const completedCount = completedAssignments.length;

  const totalScore = completedAssignments.reduce((acc, a) => acc + (a.score ?? 0), 0);
  const avgScore = completedCount > 0 ? Math.round(totalScore / completedCount) : 0;

  const qualifiedCount = completedAssignments.filter(a => (a.score ?? 0) >= 75).length;
  const qualifiedRate = completedCount > 0 ? Math.round((qualifiedCount / completedCount) * 100) : 0;

  // Filtered pipeline list
  const filteredPipeline = assignments.filter(a => {
    if (stageFilter === 'pending' && a.status !== 'pending') return false;
    if (stageFilter === 'completed' && a.status !== 'completed') return false;
    if (stageFilter === 'qualified' && ((a.score ?? 0) < 75 || a.status !== 'completed')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.candidateName.toLowerCase().includes(q);
      const matchRole = a.roleApplied.toLowerCase().includes(q);
      const matchQuiz = a.quizTitle.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchQuiz) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.recruiter.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.recruiter.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setEditingQuiz(null);
              setIsQuizModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-[#2368f5] text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.recruiter.quizzes.newQuizBtn}</span>
          </button>

          <button
            onClick={() => setIsCandidateModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-[#10243e] text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.recruiter.candidates.newCandidateBtn}</span>
          </button>

          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#2368f5] text-white text-xs font-bold hover:bg-[#144cc0] transition-colors shadow-xs cursor-pointer"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>{t.recruiter.candidates.assignQuizBtn}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Candidates */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.recruiter.metrics.totalCandidates}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2368f5] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#10243e]">{totalCandidatesCount}</span>
            <span className="text-xs text-slate-400">in pool</span>
          </div>
        </div>

        {/* Completed Tests */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.recruiter.metrics.completedTests}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{completedCount}</span>
            <span className="text-xs text-slate-400">graded</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.recruiter.metrics.avgScore}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{avgScore}%</span>
            <span className="text-xs text-slate-400">across tests</span>
          </div>
        </div>

        {/* Qualified Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.recruiter.metrics.qualifiedRate}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{qualifiedRate}%</span>
            <span className="text-[11px] text-slate-400 font-medium">{t.recruiter.metrics.passingThreshold}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'pipeline'
              ? 'bg-[#2368f5] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{t.recruiter.tabs.pipeline} ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'quizzes'
              ? 'bg-[#2368f5] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t.recruiter.tabs.quizzes} ({quizzes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'candidates'
              ? 'bg-[#2368f5] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.recruiter.tabs.candidates} ({candidates.length})</span>
        </button>
      </div>

      {/* Tab 1: Pipeline & Scores Table */}
      {activeTab === 'pipeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t.recruiter.pipeline.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setStageFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  stageFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.recruiter.pipeline.filterAll}
              </button>

              <button
                onClick={() => setStageFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  stageFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.recruiter.pipeline.filterPending}
              </button>

              <button
                onClick={() => setStageFilter('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  stageFilter === 'completed'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.recruiter.pipeline.filterCompleted}
              </button>

              <button
                onClick={() => setStageFilter('qualified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  stageFilter === 'qualified'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.recruiter.pipeline.filterQualified}
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-4">{t.recruiter.pipeline.colCandidate}</th>
                  <th className="p-4">{t.recruiter.pipeline.colQuiz}</th>
                  <th className="p-4">{t.recruiter.pipeline.colStage}</th>
                  <th className="p-4">{t.recruiter.pipeline.colScore}</th>
                  <th className="p-4">{t.recruiter.pipeline.colHits}</th>
                  <th className="p-4 text-right">{t.recruiter.pipeline.colAudit}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPipeline.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      {t.recruiter.pipeline.empty}
                    </td>
                  </tr>
                ) : (
                  filteredPipeline.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{item.candidateName}</p>
                        <p className="text-[11px] text-slate-500">{item.roleApplied}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-medium text-slate-900 max-w-xs truncate">{item.quizTitle}</p>
                        <p className="text-[11px] text-slate-400">{item.assignedAt}</p>
                      </td>

                      <td className="p-4">
                        {item.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t.recruiter.pipeline.stageCompleted}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700">
                            <Clock className="w-3 h-3" />
                            <span>{t.recruiter.pipeline.stagePending}</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {item.status === 'completed' ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                                (item.score ?? 0) >= 75
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.score}%
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              {(item.score ?? 0) >= 75 ? t.common.qualified : t.common.notQualified}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">--</span>
                        )}
                      </td>

                      <td className="p-4">
                        {item.status === 'completed' ? (
                          <span className="font-semibold text-slate-700">
                            {item.correctAnswersCount} / {item.totalQuestions}
                          </span>
                        ) : (
                          <span className="text-slate-400">0 / {item.totalQuestions}</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {item.status === 'completed' ? (
                          <button
                            onClick={() => setSelectedAuditAssignment(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2368f5] font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{t.recruiter.pipeline.viewAudit}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              alert(`Reminder email re-sent to ${item.candidateEmail}`);
                            }}
                            className="text-slate-400 hover:text-slate-700 text-[11px] font-semibold cursor-pointer"
                          >
                            Send Reminder
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Questionnaires Bank */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.recruiter.quizzes.title}</h2>
              <p className="text-xs text-slate-500">{t.recruiter.quizzes.subtitle}</p>
            </div>
            <button
              onClick={() => {
                setEditingQuiz(null);
                setIsQuizModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2368f5] text-white text-xs font-bold hover:bg-[#144cc0] transition-colors cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.recruiter.quizzes.newQuizBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map(quiz => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-[#2368f5] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-[#2368f5]">
                      {quiz.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingQuiz(quiz);
                          setIsQuizModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-[#2368f5] p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        title={t.recruiter.quizzes.editBtn}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`${t.recruiter.quizzes.confirmDelete} "${quiz.title}"?`)) {
                            deleteQuiz(quiz.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete quiz"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{quiz.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-600 font-semibold">
                    <span>{quiz.questions.length} {t.recruiter.quizzes.cardQuestions}</span>
                    <span>•</span>
                    <span>{quiz.timeLimitMinutes} {t.recruiter.quizzes.cardTime}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">Created: {quiz.createdAt}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingQuiz(quiz);
                        setIsQuizModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3 text-[#2368f5]" />
                      <span>{t.recruiter.quizzes.editBtn}</span>
                    </button>
                    <button
                      onClick={() => setIsAssignModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#10243e] text-white text-xs font-bold hover:bg-[#1c3553] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <SendHorizontal className="w-3 h-3" />
                      <span>{t.recruiter.quizzes.assignBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Candidates Directory */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.recruiter.candidates.title}</h2>
              <p className="text-xs text-slate-500">{t.recruiter.candidates.subtitle}</p>
            </div>
            <button
              onClick={() => setIsCandidateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2368f5] text-white text-xs font-bold hover:bg-[#144cc0] transition-colors cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.recruiter.candidates.newCandidateBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {candidates.map(cand => {
              const candAssignments = assignments.filter(a => a.candidateId === cand.id);
              const completed = candAssignments.filter(a => a.status === 'completed');

              return (
                <div
                  key={cand.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-[#2368f5] transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200 shadow-2xs"
                      />
                      <button
                        onClick={() => deleteCandidate(cand.id)}
                        className="text-slate-300 hover:text-red-500 p-1 cursor-pointer"
                        title="Delete candidate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 mt-3">{cand.name}</h3>
                    <p className="text-xs text-[#2368f5] font-semibold">{cand.roleApplied}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{cand.email}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Tests Assigned:</span>
                        <span className="font-bold">{candAssignments.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="font-bold text-[#22a06b]">{completed.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setIsAssignModalOpen(true)}
                      className="w-full py-2 bg-blue-50 text-[#2368f5] rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <SendHorizontal className="w-3 h-3" />
                      <span>{t.recruiter.candidates.assignQuizBtn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <QuizBuilderModal
        isOpen={isQuizModalOpen}
        quizToEdit={editingQuiz}
        onClose={() => {
          setIsQuizModalOpen(false);
          setEditingQuiz(null);
        }}
      />

      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
      />

      <AssignQuizModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />

      <ResultsAuditModal
        assignment={selectedAuditAssignment}
        onClose={() => setSelectedAuditAssignment(null)}
      />
    </div>
  );
};
