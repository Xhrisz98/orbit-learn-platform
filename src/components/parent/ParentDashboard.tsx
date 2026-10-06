import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentSelector } from './StudentSelector';
import {
  AlertTriangle,
  Clock,
  Sparkles,
  FileCheck2,
  Calendar,
  ExternalLink,
  Search,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const {
    students,
    assignments,
    bookings,
    permissionSlips,
    activeStudentId,
    setCurrentView,
    lastSyncedText,
    t,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'missing' | 'due-soon' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter assignments based on active student and status filter
  const displayedAssignments = assignments.filter(a => {
    if (activeStudentId !== 'all' && a.studentId !== activeStudentId) return false;
    if (filterStatus === 'missing' && a.status !== 'missing') return false;
    if (filterStatus === 'due-soon' && a.status !== 'due-soon') return false;
    if (filterStatus === 'completed' && a.status !== 'submitted' && a.status !== 'graded') return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const missingTotal = assignments.filter(a =>
    (activeStudentId === 'all' || a.studentId === activeStudentId) && a.status === 'missing'
  ).length;

  const dueSoonTotal = assignments.filter(a =>
    (activeStudentId === 'all' || a.studentId === activeStudentId) && a.status === 'due-soon'
  ).length;

  const pendingSlips = permissionSlips.filter(s =>
    (activeStudentId === 'all' || s.studentId === activeStudentId) && s.status === 'pending'
  );

  const activeBookings = bookings.filter(b =>
    activeStudentId === 'all' || b.studentId === activeStudentId
  );

  return (
    <div className="space-y-6">
      {/* Welcome & Sync Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E4DF] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A2332] tracking-tight">
            {t.parent.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#52697C] mt-1">
            {t.parent.subtitle} • {lastSyncedText}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('marketplace')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D8B8B] text-white text-xs font-semibold hover:bg-[#096363] transition-colors shadow-xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.parent.searchTutorCta}</span>
          </button>
        </div>
      </div>

      {/* Child Selector */}
      <StudentSelector />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Missing Assignments */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#52697C] uppercase tracking-wide">
              {t.parent.missingAssignmentsTitle}
            </span>
            <div className={`p-2 rounded-xl ${missingTotal > 0 ? 'bg-[#FFE4DC] text-[#FF6B54]' : 'bg-gray-100 text-gray-500'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold ${missingTotal > 0 ? 'text-[#FF6B54]' : 'text-[#1A2332]'}`}>
              {missingTotal}
            </span>
            <span className="text-xs text-[#52697C]">{t.parent.requireAttention}</span>
          </div>
          {missingTotal > 0 && (
            <p className="text-[11px] text-[#FF6B54] mt-2 font-medium flex items-center gap-1">
              <span>●</span> {t.parent.missingAlertSent}
            </p>
          )}
        </div>

        {/* Due Soon */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#52697C] uppercase tracking-wide">
              {t.parent.dueSoonTitle}
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-[#0D8B8B]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1A2332]">{dueSoonTotal}</span>
            <span className="text-xs text-[#52697C]">{t.parent.next7Days}</span>
          </div>
          <p className="text-[11px] text-[#0D8B8B] mt-2 font-medium">
            {t.parent.syncedWithLms}
          </p>
        </div>

        {/* Tutoring Sessions */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#52697C] uppercase tracking-wide">
              {t.parent.bookedSessionsTitle}
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1A2332]">{activeBookings.length}</span>
            <span className="text-xs text-[#52697C]">{t.parent.activeSessions}</span>
          </div>
          <p className="text-[11px] text-purple-600 mt-2 font-medium truncate">
            {activeBookings.length > 0 ? activeBookings[0].timeSlot : t.parent.noSessions}
          </p>
        </div>

        {/* Pending Slips */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#52697C] uppercase tracking-wide">
              {t.parent.pendingSlipsTitle}
            </span>
            <div className={`p-2 rounded-xl ${pendingSlips.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold ${pendingSlips.length > 0 ? 'text-amber-600' : 'text-[#1A2332]'}`}>
              {pendingSlips.length}
            </span>
            <span className="text-xs text-[#52697C]">{t.parent.toAuthorize}</span>
          </div>
          {pendingSlips.length > 0 ? (
            <button
              onClick={() => setCurrentView('compliance')}
              className="text-[11px] text-amber-700 font-semibold hover:underline mt-2 flex items-center gap-1 cursor-pointer"
            >
              {t.parent.signNowCta}
            </button>
          ) : (
            <p className="text-[11px] text-[#2ECC71] mt-2 font-medium">{t.parent.allSlipsSigned}</p>
          )}
        </div>
      </div>

      {/* Smart Predictive Tutor Alert */}
      {missingTotal > 0 && (
        <div className="bg-gradient-to-r from-[#FFE4DC]/80 to-[#FFE4DC]/30 border border-[#FF6B54]/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B54] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A2332]">
                {t.parent.smartAlertTitle}
              </h3>
              <p className="text-xs text-[#52697C] mt-0.5">
                {t.parent.smartAlertDesc}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('marketplace')}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FF6B54] text-white text-xs font-semibold rounded-xl hover:bg-[#FF5A40] transition-colors cursor-pointer shadow-xs"
          >
            <span>{t.parent.smartAlertCta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Aggregator Section: Assignments Table & Filters */}
      <div className="bg-white rounded-2xl border border-[#E8E4DF] shadow-xs overflow-hidden">
        {/* Header & Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-[#E8E4DF] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1A2332]">
              {t.parent.scheduleTitle}
            </h2>
            <p className="text-xs text-[#52697C]">
              {t.parent.scheduleSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#52697C]" />
              <input
                type="text"
                placeholder={t.parent.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-xs bg-[#F8F6F3] border border-[#E8E4DF] rounded-xl text-[#1A2332] focus:outline-none focus:ring-1 focus:ring-[#0D8B8B]"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-[#F8F6F3] p-1 rounded-xl border border-[#E8E4DF] overflow-x-auto">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer transition-colors whitespace-nowrap ${
                  filterStatus === 'all'
                    ? 'bg-white text-[#1A2332] shadow-xs font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332]'
                }`}
              >
                {t.parent.filterAll}
              </button>
              <button
                onClick={() => setFilterStatus('missing')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer transition-colors whitespace-nowrap ${
                  filterStatus === 'missing'
                    ? 'bg-[#FF6B54] text-white shadow-xs font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332]'
                }`}
              >
                {t.parent.filterMissing}
              </button>
              <button
                onClick={() => setFilterStatus('due-soon')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer transition-colors whitespace-nowrap ${
                  filterStatus === 'due-soon'
                    ? 'bg-[#0D8B8B] text-white shadow-xs font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332]'
                }`}
              >
                {t.parent.filterDueSoon}
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer transition-colors whitespace-nowrap ${
                  filterStatus === 'completed'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-[#52697C] hover:text-[#1A2332]'
                }`}
              >
                {t.parent.filterCompleted}
              </button>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="divide-y divide-[#E8E4DF]">
          {displayedAssignments.length === 0 ? (
            <div className="text-center py-12 px-4">
              <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1A2332]">{t.parent.noAssignmentsFound}</p>
            </div>
          ) : (
            displayedAssignments.map(assignment => {
              const student = students.find(s => s.id === assignment.studentId);
              return (
                <div
                  key={assignment.id}
                  className="p-4 sm:p-5 hover:bg-gray-50/70 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Status Indicator Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        assignment.status === 'missing'
                          ? 'bg-[#FFE4DC] text-[#FF6B54]'
                          : assignment.status === 'due-soon'
                          ? 'bg-teal-50 text-[#0D8B8B]'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {assignment.status === 'missing' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : assignment.status === 'due-soon' ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-[#1A2332]">
                          {assignment.subject}
                        </span>
                        <span className="text-xs font-medium text-[#52697C]">
                          • {assignment.studentName} ({student?.school})
                        </span>
                        {/* LMS Source Badge */}
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-[#0D8B8B]/10 text-[#0D8B8B]">
                          {assignment.sourceLms}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-[#1A2332] mt-1">
                        {assignment.title}
                      </h3>

                      {assignment.instructions && (
                        <p className="text-xs text-[#52697C] mt-1 line-clamp-1">
                          {assignment.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Due Date & Action */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pl-12 md:pl-0">
                    <div className="text-left md:text-right">
                      <div className="text-xs font-semibold text-[#1A2332] flex items-center md:justify-end gap-1">
                        <Calendar className="w-3 h-3 text-[#52697C]" />
                        <span>{t.parent.dueDate} {assignment.dueDate}</span>
                      </div>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider inline-block mt-0.5 ${
                          assignment.status === 'missing'
                            ? 'text-[#FF6B54]'
                            : assignment.status === 'due-soon'
                            ? 'text-[#0D8B8B]'
                            : 'text-emerald-600'
                        }`}
                      >
                        {assignment.status === 'missing'
                          ? t.parent.statusMissing
                          : assignment.status === 'due-soon'
                          ? t.parent.statusDueSoon
                          : assignment.grade ? `${t.common.graded}: ${assignment.grade}` : t.common.submitted}
                      </span>
                    </div>

                    {assignment.status === 'missing' ? (
                      <button
                        onClick={() => setCurrentView('marketplace')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FFE4DC] text-[#FF6B54] hover:bg-[#FF6B54] hover:text-white transition-all cursor-pointer shrink-0"
                      >
                        {t.parent.hireHelp}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs px-2 py-1">
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
