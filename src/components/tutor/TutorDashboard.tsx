import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Star,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const TutorDashboard: React.FC = () => {
  const { bookings, tutors, t } = useApp();

  const currentTutor = tutors[0]; // Dr. Elena Rostova
  const tutorBookings = bookings.filter(b => b.tutorId === currentTutor.id);

  const totalEarnings = tutorBookings.reduce((acc, b) => acc + b.hourlyRate, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E4DF] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={currentTutor.avatar}
            alt={currentTutor.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-amber-500/20 shadow-xs shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                {t.tutor.badge}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> {t.tutor.compliance}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A2332] mt-1">
              {currentTutor.name}
            </h1>
            <p className="text-xs text-[#52697C]">{currentTutor.title}</p>
          </div>
        </div>

        <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <div className="text-2xl font-bold text-[#1A2332]">${currentTutor.hourlyRate}<span className="text-xs text-[#52697C]">{t.common.perHour}</span></div>
          <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold sm:justify-end">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{currentTutor.rating} ({currentTutor.reviewsCount} {t.common.reviews})</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#52697C] uppercase">{t.tutor.bookedSessions}</span>
            <Calendar className="w-4 h-4 text-[#0D8B8B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#1A2332] mt-2">{tutorBookings.length}</p>
          <p className="text-xs text-[#52697C] mt-1">{t.tutor.withFamilies}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#52697C] uppercase">{t.tutor.estimatedEarnings}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">${totalEarnings}</p>
          <p className="text-xs text-[#52697C] mt-1">{t.tutor.guaranteedPayouts}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#52697C] uppercase">{t.tutor.marketVisibility}</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#1A2332] mt-2">{t.tutor.topRank}</p>
          <p className="text-xs text-[#52697C] mt-1">{t.tutor.topSpecialist}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4DF] p-5 shadow-xs">
        <h2 className="text-base font-bold text-[#1A2332] mb-3">
          {t.tutor.upcomingSessions}
        </h2>

        {tutorBookings.length === 0 ? (
          <p className="text-xs text-[#52697C] py-6 text-center">{t.tutor.noBookings}</p>
        ) : (
          <div className="divide-y divide-[#E8E4DF]">
            {tutorBookings.map(b => (
              <div key={b.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1A2332]">{b.studentName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-[#0D8B8B] font-semibold">
                      {b.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#52697C] mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{b.date} • {b.timeSlot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {t.common.confirmed} (${b.hourlyRate})
                  </span>
                  <button className="px-3.5 py-1.5 bg-[#0D8B8B] text-white text-xs font-semibold rounded-xl hover:bg-[#096363] transition-colors cursor-pointer shadow-xs">
                    {t.tutor.openVirtualClassroom}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slots Available Management */}
      <div className="bg-white rounded-2xl border border-[#E8E4DF] p-5 shadow-xs">
        <h2 className="text-base font-bold text-[#1A2332] mb-1">
          {t.tutor.availableSlotsTitle}
        </h2>
        <p className="text-xs text-[#52697C] mb-4">
          {t.tutor.availableSlotsDesc}
        </p>

        <div className="flex flex-wrap gap-2">
          {currentTutor.availableSlots.map((slot, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50/50 text-xs font-semibold text-[#0D8B8B] flex items-center gap-2"
            >
              <Clock className="w-3 h-3" />
              <span>{slot}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
