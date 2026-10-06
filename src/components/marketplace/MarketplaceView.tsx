import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Tutor } from '../../types';
import {
  Search,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  CreditCard,
  MapPin,
  GraduationCap,
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { tutors, students, createBooking, t } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<Tutor | null>(null);

  // Booking Form State
  const [selectedStudentId, setSelectedStudentId] = useState('s1');
  const [selectedDate, setSelectedDate] = useState('2026-10-08');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const subjects = ['all', 'Mathematics', 'Biology', 'Literature', 'Coding', 'SAT Math'];

  const filteredTutors = tutors.filter(tutor => {
    if (selectedSubject !== 'all') {
      const matchSub = tutor.subjects.some(s =>
        s.toLowerCase().includes(selectedSubject.toLowerCase()) ||
        (selectedSubject === 'Mathematics' && s.toLowerCase().includes('matemáticas')) ||
        (selectedSubject === 'Biology' && s.toLowerCase().includes('biología')) ||
        (selectedSubject === 'Coding' && s.toLowerCase().includes('programación'))
      );
      if (!matchSub) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = tutor.name.toLowerCase().includes(q);
      const matchSub = tutor.subjects.some(s => s.toLowerCase().includes(q));
      const matchBio = tutor.bio.toLowerCase().includes(q);
      if (!matchName && !matchSub && !matchBio) return false;
    }
    return true;
  });

  const handleOpenBooking = (tutor: Tutor) => {
    setSelectedTutorForBooking(tutor);
    setSelectedSlot(tutor.availableSlots[0] || '17:00');
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutorForBooking) return;

    createBooking(
      selectedTutorForBooking.id,
      selectedStudentId,
      selectedDate,
      selectedSlot
    );

    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedTutorForBooking(null);
      setBookingSuccess(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Marketplace Hero Header */}
      <div className="bg-gradient-to-r from-teal-900 via-[#0D8B8B] to-[#15A9A9] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.marketplace.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.marketplace.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-white/90 mt-2 leading-relaxed">
            {t.marketplace.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4DF] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52697C]" />
          <input
            type="text"
            placeholder={t.marketplace.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E8E4DF] focus:outline-none focus:ring-1 focus:ring-[#0D8B8B] bg-[#F8F6F3]"
          />
        </div>

        {/* Subject Pills (Scrollable on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-[#0D8B8B] text-white shadow-xs'
                  : 'bg-[#F8F6F3] text-[#52697C] hover:text-[#1A2332]'
              }`}
            >
              {sub === 'all' ? t.marketplace.allSubjects : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTutors.map(tutor => (
          <div
            key={tutor.id}
            className="bg-white rounded-2xl border border-[#E8E4DF] p-5 shadow-xs hover:shadow-md hover:border-[#0D8B8B]/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top row: Avatar & Basic info */}
              <div className="flex items-start gap-4">
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-100 shadow-xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-base text-[#1A2332] truncate">
                      {tutor.name}
                    </h3>
                    {tutor.isVerified && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        <ShieldCheck className="w-3 h-3" /> {t.common.verified}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-[#52697C] mt-0.5">
                    {tutor.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {tutor.rating}
                    </span>
                    <span className="text-[#52697C]">({tutor.reviewsCount} {t.common.reviews})</span>
                    <span className="text-[#52697C] flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {tutor.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Education */}
              <div className="mt-3.5">
                <p className="text-xs text-[#52697C] line-clamp-2 leading-relaxed">
                  {tutor.bio}
                </p>

                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#1A2332] font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0D8B8B] shrink-0" />
                  <span className="truncate">{tutor.education}</span>
                </div>
              </div>

              {/* Subjects Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tutor.subjects.map(s => (
                  <span
                    key={s}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-teal-50 text-[#0D8B8B]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row: Next Available & CTA */}
            <div className="mt-5 pt-4 border-t border-[#E8E4DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-[#52697C] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#2ECC71]" />
                  <span>{t.marketplace.availableToday} {tutor.nextAvailable}</span>
                </div>
                <div className="text-base font-extrabold text-[#1A2332] mt-0.5">
                  ${tutor.hourlyRate} <span className="text-xs font-normal text-[#52697C]">{t.common.perHour}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenBooking(tutor)}
                className="w-full sm:w-auto px-4 py-2 bg-[#0D8B8B] text-white text-xs font-semibold rounded-xl hover:bg-[#096363] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.marketplace.bookSession}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedTutorForBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E4DF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {bookingSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2332]">
                  {t.marketplace.successTitle}
                </h3>
                <p className="text-xs text-[#52697C]">
                  {t.marketplace.successDesc}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-[#E8E4DF]">
                  <div>
                    <h3 className="text-lg font-bold text-[#1A2332]">
                      {t.marketplace.modalTitle}
                    </h3>
                    <p className="text-xs text-[#52697C]">
                      {t.marketplace.withTutor} {selectedTutorForBooking.name} (${selectedTutorForBooking.hourlyRate}{t.common.perHour})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTutorForBooking(null)}
                    className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleConfirmBooking} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                      {t.marketplace.whichChild}
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={e => setSelectedStudentId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF] bg-white"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.grade.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                        {t.marketplace.date}
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                        {t.marketplace.timeSlot}
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={e => setSelectedSlot(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF] bg-white"
                      >
                        {selectedTutorForBooking.availableSlots.map(slot => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary & Price Checkout */}
                  <div className="p-3.5 rounded-xl bg-[#F8F6F3] border border-[#E8E4DF] space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#52697C]">
                      <span>{t.marketplace.rateSummary}</span>
                      <span>${selectedTutorForBooking.hourlyRate}.00</span>
                    </div>
                    <div className="flex justify-between text-[#52697C]">
                      <span>{t.marketplace.orbitFee}</span>
                      <span className="text-emerald-600 font-semibold">{t.marketplace.feeFree}</span>
                    </div>
                    <div className="border-t border-[#E8E4DF] pt-1.5 flex justify-between font-bold text-[#1A2332]">
                      <span>{t.marketplace.total}</span>
                      <span className="text-base text-[#0D8B8B]">${selectedTutorForBooking.hourlyRate}.00</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#52697C]">
                    <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{t.marketplace.secureNotice}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTutorForBooking(null)}
                      className="flex-1 py-2.5 text-xs font-semibold text-[#52697C] hover:bg-gray-100 rounded-xl cursor-pointer"
                    >
                      {t.common.cancel}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-xs font-semibold bg-[#FF6B54] text-white rounded-xl hover:bg-[#FF5A40] transition-colors shadow-xs cursor-pointer"
                    >
                      {t.marketplace.confirmPayBtn}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
