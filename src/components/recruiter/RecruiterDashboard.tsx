import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AssessmentAssignment, Quiz, Candidate } from '../../types';
import { QuizBuilderModal } from './QuizBuilderModal';
import { CandidateModal } from './CandidateModal';
import { AssignQuizModal } from './AssignQuizModal';
import { ResultsAuditModal } from './ResultsAuditModal';
import { CandidateProfileModal } from './CandidateProfileModal';
import {
  Users,
  User,
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
  Copy,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  RotateCcw,
  Briefcase,
} from 'lucide-react';

import { getLocalizedArea } from '../../utils/areaLocalization';
import { resolveCandidateGender, getCandidateInitials } from '../../utils/genderHelper';

export const RecruiterDashboard: React.FC = () => {
  const {
    candidates,
    quizzes,
    assignments,
    deleteQuiz,
    deleteCandidate,
    updateAssignmentReviewStatus,
    t,
    language,
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'pipeline' | 'quizzes' | 'candidates'>('pipeline');

  // Modals state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAuditAssignment, setSelectedAuditAssignment] = useState<AssessmentAssignment | null>(null);
  const [selectedProfileCandidate, setSelectedProfileCandidate] = useState<Candidate | null>(null);

  // Filters state for pipeline
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_completed' | 'stand_by' | 'approved' | 'rejected'>('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'top' | 'passing' | 'low'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Pagination state for pipeline (5, 10 default, 15, 20, 50)
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Pagination state for candidates directory (5, 10 default, 15, 20, 50)
  const [candPageSize, setCandPageSize] = useState<number>(10);
  const [candCurrentPage, setCandCurrentPage] = useState<number>(1);

  // Filter & Pagination state for question banks (5, 10 default, 15, 20, 50)
  const [quizSearchQuery, setQuizSearchQuery] = useState('');
  const [quizCategoryFilter, setQuizCategoryFilter] = useState('all');
  const [quizPageSize, setQuizPageSize] = useState<number>(10);
  const [currentQuizPage, setCurrentQuizPage] = useState<number>(1);
  const [assigningQuizId, setAssigningQuizId] = useState<string | undefined>(undefined);
  const [expandedQuizIds, setExpandedQuizIds] = useState<Record<string, boolean>>({});

  const toggleQuizExpanded = (quizId: string) => {
    setExpandedQuizIds(prev => ({ ...prev, [quizId]: !prev[quizId] }));
  };

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
    // Review / Completion Status Filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'not_completed') {
        if (a.status === 'completed') return false;
      } else {
        if (a.status !== 'completed') return false;
        const effectiveStatus = a.reviewStatus || ((a.score ?? 0) >= 50 ? 'stand_by' : 'rejected');
        if (effectiveStatus !== statusFilter) return false;
      }
    }

    // Score Filter
    if (scoreFilter !== 'all') {
      if (a.status !== 'completed') return false;
      const score = a.score ?? 0;
      if (scoreFilter === 'top' && score < 75) return false;
      if (scoreFilter === 'passing' && (score < 50 || score >= 75)) return false;
      if (scoreFilter === 'low' && score >= 50) return false;
    }

    // Date Range Filter
    if (dateFrom) {
      const itemDate = (a.completedAt || a.assignedAt || '').substring(0, 10);
      if (itemDate && itemDate < dateFrom) return false;
    }
    if (dateTo) {
      const itemDate = (a.completedAt || a.assignedAt || '').substring(0, 10);
      if (itemDate && itemDate > dateTo) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.candidateName.toLowerCase().includes(q);
      const matchRole = a.roleApplied.toLowerCase().includes(q);
      const matchQuiz = a.quizTitle.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchQuiz) return false;
    }

    return true;
  });

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    scoreFilter !== 'all' ||
    dateFrom !== '' ||
    dateTo !== '';

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setScoreFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  // Pipeline Pagination Calculations
  const totalPipelineItems = filteredPipeline.length;
  const totalPipelinePages = Math.max(1, Math.ceil(totalPipelineItems / pageSize));
  const currentPipelinePage = Math.min(currentPage, totalPipelinePages);
  const pipelineStartIndex = (currentPipelinePage - 1) * pageSize;
  const paginatedPipeline = filteredPipeline.slice(pipelineStartIndex, pipelineStartIndex + pageSize);

  // Candidates Directory Pagination Calculations
  const totalCandItems = candidates.length;
  const totalCandPages = Math.max(1, Math.ceil(totalCandItems / candPageSize));
  const currentCandPage = Math.min(candCurrentPage, totalCandPages);
  const candStartIndex = (currentCandPage - 1) * candPageSize;
  const paginatedCandidates = candidates.slice(candStartIndex, candStartIndex + candPageSize);

  // Filtered Question Banks
  const filteredQuizzes = quizzes.filter(q => {
    if (quizCategoryFilter !== 'all' && q.category !== quizCategoryFilter) {
      return false;
    }
    if (quizSearchQuery.trim()) {
      const term = quizSearchQuery.toLowerCase().trim();
      const matchTitle = (q.title || '').toLowerCase().includes(term);
      const matchCat = (q.category || '').toLowerCase().includes(term);
      const matchDesc = (q.description || '').toLowerCase().includes(term);
      const matchClass = (q.supportedClassifications || []).some(c =>
        c.toLowerCase().includes(term)
      );
      if (!matchTitle && !matchCat && !matchDesc && !matchClass) return false;
    }
    return true;
  });

  // Question Banks Pagination Calculations
  const totalQuizItems = filteredQuizzes.length;
  const totalQuizPages = Math.max(1, Math.ceil(totalQuizItems / quizPageSize));
  const validQuizCurrentPage = Math.min(currentQuizPage, totalQuizPages);
  const quizStartIndex = (validQuizCurrentPage - 1) * quizPageSize;
  const paginatedQuizzes = filteredQuizzes.slice(quizStartIndex, quizStartIndex + quizPageSize);

  // Unique categories for quiz filter dropdown
  const uniqueQuizCategories = Array.from(new Set(quizzes.map(q => q.category))).filter(Boolean);

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
          {/* Advanced Filter Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3 bg-slate-50/50">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.recruiter.pipeline.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                />
              </div>

              {/* Status and Score Selectors */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={e => {
                      setStatusFilter(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2368f5] cursor-pointer"
                  >
                    <option value="all">{t.recruiter.pipeline.filterStatusAll}</option>
                    <option value="not_completed">{t.recruiter.pipeline.filterStatusNotCompleted}</option>
                    <option value="stand_by">{t.recruiter.pipeline.filterStatusStandBy}</option>
                    <option value="approved">{t.recruiter.pipeline.filterStatusApproved}</option>
                    <option value="rejected">{t.recruiter.pipeline.filterStatusRejected}</option>
                  </select>
                </div>

                {/* Score Filter */}
                <select
                  value={scoreFilter}
                  onChange={e => {
                    setScoreFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2368f5] cursor-pointer"
                >
                  <option value="all">{t.recruiter.pipeline.filterScoreAll}</option>
                  <option value="top">{t.recruiter.pipeline.filterScoreTop}</option>
                  <option value="passing">{t.recruiter.pipeline.filterScorePassing}</option>
                  <option value="low">{t.recruiter.pipeline.filterScoreLow}</option>
                </select>

                {/* Date Range Inputs */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2 py-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="date"
                    title={t.recruiter.pipeline.filterDateFrom}
                    value={dateFrom}
                    onChange={e => {
                      setDateFrom(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="text-xs text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  />
                  <span className="text-slate-300">-</span>
                  <input
                    type="date"
                    title={t.recruiter.pipeline.filterDateTo}
                    value={dateTo}
                    onChange={e => {
                      setDateTo(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="text-xs text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
                    title={t.recruiter.pipeline.clearFilters}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.recruiter.pipeline.clearFilters}</span>
                  </button>
                )}
              </div>
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
                {paginatedPipeline.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      {t.recruiter.pipeline.empty}
                    </td>
                  </tr>
                ) : (
                  paginatedPipeline.map(item => {
                    const effectiveStatus = item.reviewStatus || ((item.score ?? 0) >= 50 ? 'stand_by' : 'rejected');

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* 1. Candidate Column: Clickable to open Profile Card */}
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => {
                              const found = candidates.find(
                                c => c.id === item.candidateId || c.email === item.candidateEmail
                              );
                              if (found) {
                                setSelectedProfileCandidate(found);
                              } else {
                                setSelectedProfileCandidate({
                                  id: item.candidateId,
                                  name: item.candidateName,
                                  email: item.candidateEmail,
                                  roleApplied: item.roleApplied,
                                  avatar: 'gender:male',
                                  registeredAt: item.assignedAt,
                                });
                              }
                            }}
                            className="text-left group cursor-pointer block"
                            title={t.recruiter.pipeline.viewCandidateProfile}
                          >
                            <p className="font-bold text-slate-900 group-hover:text-[#2368f5] group-hover:underline flex items-center gap-1 transition-colors">
                              <span>{item.candidateName}</span>
                              <span className="text-[10px] text-slate-400 group-hover:text-[#2368f5]">↗</span>
                            </p>
                            <p className="text-[11px] text-slate-500">{item.roleApplied}</p>
                          </button>
                        </td>

                        {/* 2. Quiz Column */}
                        <td className="p-4">
                          <p className="font-medium text-slate-900 max-w-xs truncate">
                            {getLocalizedArea(item.quizTitle, language)}
                          </p>
                          <p className="text-[11px] text-slate-400">{item.assignedAt}</p>
                        </td>

                        {/* 3. Testing Stage / Status Column */}
                        <td className="p-4">
                          {item.status === 'completed' ? (
                            <div className="relative inline-block">
                              <select
                                value={effectiveStatus}
                                onChange={e => {
                                  const newStatus = e.target.value as 'stand_by' | 'approved' | 'rejected';
                                  updateAssignmentReviewStatus(item.id, newStatus);
                                }}
                                aria-label={t.recruiter.pipeline.statusDropdownTitle}
                                title={t.recruiter.pipeline.statusDropdownTitle}
                                className={`appearance-none text-[11px] font-bold py-1 pl-2.5 pr-6 rounded-full border cursor-pointer transition-colors focus:outline-none focus:ring-1 ${
                                  effectiveStatus === 'approved'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-500'
                                    : effectiveStatus === 'rejected'
                                    ? 'bg-rose-50 text-rose-800 border-rose-300 focus:ring-rose-500'
                                    : 'bg-amber-50 text-amber-800 border-amber-300 focus:ring-amber-500'
                                }`}
                              >
                                <option value="stand_by">{t.recruiter.pipeline.statusStandBy}</option>
                                <option value="approved">{t.recruiter.pipeline.statusApproved}</option>
                                <option value="rejected">{t.recruiter.pipeline.statusRejected}</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500">
                                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{t.recruiter.pipeline.statusNotCompleted}</span>
                            </span>
                          )}
                        </td>

                        {/* 4. Overall Score Column: Percentage only, text removed */}
                        <td className="p-4">
                          {item.status === 'completed' ? (
                            <span
                              className={`inline-block text-xs font-black px-2.5 py-1 rounded-lg ${
                                (item.score ?? 0) >= 75
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : (item.score ?? 0) >= 50
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.score}%
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-xs">--</span>
                          )}
                        </td>

                        {/* 5. Hits Column */}
                        <td className="p-4">
                          {item.status === 'completed' ? (
                            <span className="font-semibold text-slate-700">
                              {item.correctAnswersCount} / {item.totalQuestions}
                            </span>
                          ) : (
                            <span className="text-slate-400">0 / {item.totalQuestions}</span>
                          )}
                        </td>

                        {/* 6. Audit & Actions Column */}
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
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  const link = `${window.location.origin}?code=${item.id}`;
                                  navigator.clipboard.writeText(link);
                                  alert(
                                    t.recruiter.pipeline.linkCopiedAlert
                                      .replace('{name}', item.candidateName)
                                      .replace('{email}', item.candidateEmail) + `\n\n${link}`
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors cursor-pointer text-xs border border-emerald-200"
                                title={t.recruiter.pipeline.copyLinkBtn}
                              >
                                <Copy className="w-3 h-3" />
                                <span>{t.recruiter.pipeline.copyLinkBtn}</span>
                              </button>
                              <button
                                onClick={() => {
                                  alert(t.recruiter.pipeline.reminderSentAlert.replace('{email}', item.candidateEmail));
                                }}
                                className="text-slate-400 hover:text-slate-700 text-[11px] font-semibold cursor-pointer"
                              >
                                {t.recruiter.pipeline.remindBtn}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                {t.recruiter.pipeline.showingPage
                  .replace('{from}', totalPipelineItems === 0 ? '0' : String(pipelineStartIndex + 1))
                  .replace('{to}', String(Math.min(pipelineStartIndex + pageSize, totalPipelineItems)))
                  .replace('{total}', String(totalPipelineItems))}
              </span>

              {/* Page Size Selector: 5, 10 default, 15, 20, 50 */}
              <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                <span className="text-xs text-slate-400">{t.recruiter.pipeline.pageSizeLabel}</span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                >
                  {[5, 10, 15, 20, 50].map(size => (
                    <option key={size} value={size}>
                      {size} {t.recruiter.pipeline.perPage}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Page Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPipelinePage <= 1}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{t.recruiter.pipeline.prevPage}</span>
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPipelinePages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPipelinePages || Math.abs(p - currentPipelinePage) <= 1)
                  .map((page, idx, arr) => {
                    const prevPageNumber = arr[idx - 1];
                    const hasGap = prevPageNumber && page - prevPageNumber > 1;
                    return (
                      <React.Fragment key={page}>
                        {hasGap && <span className="text-xs text-slate-400 px-1">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-7 h-7 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            currentPipelinePage === page
                              ? 'bg-[#2368f5] text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPipelinePages, p + 1))}
                disabled={currentPipelinePage >= totalPipelinePages}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <span>{t.recruiter.pipeline.nextPage}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Questionnaires Bank */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.recruiter.quizzes.title}</h2>
              <p className="text-xs text-slate-500">{t.recruiter.quizzes.subtitle}</p>
            </div>
            <button
              onClick={() => {
                setEditingQuiz(null);
                setIsQuizModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2368f5] text-white text-xs font-bold hover:bg-[#144cc0] transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.recruiter.quizzes.newQuizBtn}</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.recruiter.quizzes.searchPlaceholder}
                  value={quizSearchQuery}
                  onChange={e => {
                    setQuizSearchQuery(e.target.value);
                    setCurrentQuizPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                />
              </div>

              <select
                value={quizCategoryFilter}
                onChange={e => {
                  setQuizCategoryFilter(e.target.value);
                  setCurrentQuizPage(1);
                }}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2368f5] cursor-pointer"
              >
                <option value="all">{t.recruiter.quizzes.filterAreaAll}</option>
                {uniqueQuizCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {getLocalizedArea(cat, language)}
                  </option>
                ))}
              </select>

              {(quizSearchQuery !== '' || quizCategoryFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setQuizSearchQuery('');
                    setQuizCategoryFilter('all');
                    setCurrentQuizPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.recruiter.pipeline.clearFilters}</span>
                </button>
              )}
            </div>

            <span className="text-xs text-slate-500 font-semibold self-end md:self-auto px-1">
              {filteredQuizzes.length} {t.recruiter.quizzes.cardQuestions.split(' ')[0]} {language === 'es' ? 'bancos' : 'banks'}
            </span>
          </div>

          {/* Quizzes Grid */}
          {paginatedQuizzes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {t.recruiter.quizzes.noQuizzes}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'es'
                  ? 'Intenta ajustar los filtros de búsqueda o categoría.'
                  : 'Try adjusting your search or category filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedQuizzes.map(quiz => {
                const isExpanded = Boolean(expandedQuizIds[quiz.id]);
                const classifications = quiz.supportedClassifications || [];
                const displayedClassifications = isExpanded
                  ? classifications
                  : classifications.slice(0, 3);
                const remainingCount = classifications.length - 3;

                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-[#2368f5] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-[#2368f5] truncate max-w-[200px]">
                          {getLocalizedArea(quiz.category, language)}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
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
                              if (
                                window.confirm(
                                  `${t.recruiter.quizzes.confirmDelete} "${quiz.title}"?`
                                )
                              ) {
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

                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {getLocalizedArea(quiz.title, language)}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {quiz.description}
                      </p>

                      {/* Supported County of Orange Classifications */}
                      {classifications.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                              <Briefcase className="w-3 h-3 text-[#2368f5]" />
                              <span>{t.recruiter.quizzes.supportedClassifications}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {classifications.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {displayedClassifications.map((item, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 font-medium border border-slate-200 truncate max-w-full"
                                title={item}
                              >
                                {item}
                              </span>
                            ))}
                            {classifications.length > 3 && (
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleQuizExpanded(quiz.id);
                                }}
                                className="text-[10px] font-bold text-[#2368f5] hover:underline px-1 py-0.5 cursor-pointer"
                              >
                                {isExpanded
                                  ? t.recruiter.quizzes.showLessClassifications
                                  : t.recruiter.quizzes.showMoreClassifications.replace(
                                      '{count}',
                                      String(remainingCount)
                                    )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-3 text-xs text-slate-600 font-semibold">
                        <span>
                          {quiz.questions.length} {t.recruiter.quizzes.cardQuestions}
                        </span>
                        <span>•</span>
                        <span>
                          {quiz.timeLimitMinutes} {t.recruiter.quizzes.cardTime}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400 truncate">
                        {t.recruiter.quizzes.createdLabel} {quiz.createdAt}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
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
                          onClick={() => {
                            setAssigningQuizId(quiz.id);
                            setIsAssignModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#10243e] text-white text-xs font-bold hover:bg-[#1c3553] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <SendHorizontal className="w-3 h-3" />
                          <span>{t.recruiter.quizzes.assignBtn}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quizzes Pagination Controls */}
          {totalQuizItems > 0 && (
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold">{t.recruiter.quizzes.pageSizeLabel}</span>
                <select
                  value={quizPageSize}
                  onChange={e => {
                    setQuizPageSize(Number(e.target.value));
                    setCurrentQuizPage(1);
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2368f5] cursor-pointer"
                >
                  <option value={5}>5 {t.recruiter.quizzes.perPage}</option>
                  <option value={10}>10 {t.recruiter.quizzes.perPage}</option>
                  <option value={15}>15 {t.recruiter.quizzes.perPage}</option>
                  <option value={20}>20 {t.recruiter.quizzes.perPage}</option>
                  <option value={50}>50 {t.recruiter.quizzes.perPage}</option>
                </select>
                <span className="text-slate-400 ml-1">
                  {t.recruiter.quizzes.showingPage
                    .replace('{from}', String(quizStartIndex + 1))
                    .replace('{to}', String(Math.min(quizStartIndex + quizPageSize, totalQuizItems)))
                    .replace('{total}', String(totalQuizItems))}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentQuizPage(p => Math.max(1, p - 1))}
                  disabled={validQuizCurrentPage <= 1}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{t.recruiter.quizzes.prevPage}</span>
                </button>
                <span className="px-2 text-xs font-bold text-slate-700">
                  {validQuizCurrentPage} / {totalQuizPages}
                </span>
                <button
                  onClick={() => setCurrentQuizPage(p => Math.min(totalQuizPages, p + 1))}
                  disabled={validQuizCurrentPage >= totalQuizPages}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <span>{t.recruiter.quizzes.nextPage}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
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
            {paginatedCandidates.map(cand => {
              const candAssignments = assignments.filter(a => a.candidateId === cand.id);
              const completed = candAssignments.filter(a => a.status === 'completed');
              const candGender = resolveCandidateGender(cand);
              const isFemaleCand = candGender === 'female';
              const candInitials = getCandidateInitials(cand.name);

              return (
                <div
                  key={cand.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-[#2368f5] transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      {/* Stylized Non-Image Gender Avatar */}
                      <button
                        type="button"
                        onClick={() => setSelectedProfileCandidate(cand)}
                        className="flex items-center gap-2.5 text-left cursor-pointer group"
                        title={t.recruiter.pipeline.viewCandidateProfile}
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black text-sm shadow-2xs border shrink-0 transition-transform group-hover:scale-105 ${
                            isFemaleCand
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          <span>{candInitials}</span>
                          <span className="text-[8px] font-bold uppercase tracking-wider">
                            {isFemaleCand ? (language === 'es' ? 'Mujer' : 'Female') : (language === 'es' ? 'Hombre' : 'Male')}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border inline-flex items-center gap-1 ${
                            isFemaleCand
                              ? 'bg-purple-100/60 text-purple-800 border-purple-200'
                              : 'bg-blue-100/60 text-blue-800 border-blue-200'
                          }`}
                        >
                          <User className="w-2.5 h-2.5" />
                          <span>{isFemaleCand ? (language === 'es' ? 'Mujer' : 'Female') : (language === 'es' ? 'Hombre' : 'Male')}</span>
                        </span>
                      </button>

                      <button
                        onClick={() => deleteCandidate(cand.id)}
                        className="text-slate-300 hover:text-red-500 p-1 cursor-pointer"
                        title="Delete candidate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProfileCandidate(cand)}
                      className="text-left w-full mt-3 group cursor-pointer"
                      title={t.recruiter.pipeline.viewCandidateProfile}
                    >
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#2368f5] group-hover:underline flex items-center justify-between">
                        <span>{cand.name}</span>
                        <span className="text-xs text-slate-400 group-hover:text-[#2368f5]">↗</span>
                      </h3>
                      <p className="text-xs text-[#2368f5] font-semibold">{cand.roleApplied}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{cand.email}</p>
                    </button>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>{t.recruiter.candidates.testsAssigned}</span>
                        <span className="font-bold">{candAssignments.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.recruiter.candidates.testsCompleted}</span>
                        <span className="font-bold text-[#22a06b]">{completed.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProfileCandidate(cand)}
                      className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{language === 'es' ? 'Ver Ficha' : 'Profile'}</span>
                    </button>

                    <button
                      onClick={() => setIsAssignModalOpen(true)}
                      className="flex-1 py-2 bg-blue-50 text-[#2368f5] rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <SendHorizontal className="w-3 h-3" />
                      <span>{t.recruiter.candidates.assignQuizBtn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Candidates Pagination Controls */}
          {totalCandItems > 5 && (
            <div className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white mt-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {t.recruiter.pipeline.showingPage
                    .replace('{from}', totalCandItems === 0 ? '0' : String(candStartIndex + 1))
                    .replace('{to}', String(Math.min(candStartIndex + candPageSize, totalCandItems)))
                    .replace('{total}', String(totalCandItems))}
                </span>

                <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                  <span className="text-xs text-slate-400">{t.recruiter.pipeline.pageSizeLabel}</span>
                  <select
                    value={candPageSize}
                    onChange={e => {
                      setCandPageSize(Number(e.target.value));
                      setCandCurrentPage(1);
                    }}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                  >
                    {[5, 10, 15, 20, 50].map(size => (
                      <option key={size} value={size}>
                        {size} {t.recruiter.pipeline.perPage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCandCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentCandPage <= 1}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{t.recruiter.pipeline.prevPage}</span>
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalCandPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCandCurrentPage(page)}
                      className={`min-w-7 h-7 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        currentCandPage === page
                          ? 'bg-[#2368f5] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCandCurrentPage(p => Math.min(totalCandPages, p + 1))}
                  disabled={currentCandPage >= totalCandPages}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <span>{t.recruiter.pipeline.nextPage}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
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
        defaultQuizId={assigningQuizId}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssigningQuizId(undefined);
        }}
      />

      <ResultsAuditModal
        assignment={selectedAuditAssignment}
        onClose={() => setSelectedAuditAssignment(null)}
      />

      <CandidateProfileModal
        candidate={selectedProfileCandidate}
        onClose={() => setSelectedProfileCandidate(null)}
        onViewScorecard={assignment => {
          setSelectedProfileCandidate(null);
          setSelectedAuditAssignment(assignment);
        }}
        onAssignTest={() => {
          setSelectedProfileCandidate(null);
          setIsAssignModalOpen(true);
        }}
      />
    </div>
  );
};
