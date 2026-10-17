import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, X, RotateCcw } from 'lucide-react';

interface Props {
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
  onChange: (startDate: string, endDate: string) => void;
  language?: 'en' | 'es';
  placeholder?: string;
  className?: string;
  align?: 'left' | 'right';
  direction?: 'down' | 'up';
}

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DAYS_ES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

export const ModernDateRangePicker: React.FC<Props> = ({
  startDate,
  endDate,
  onChange,
  language = 'en',
  placeholder,
  className = '',
  align = 'right',
  direction = 'down',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial view year & month based on startDate or current date
  const initialDate = useMemo(() => {
    if (startDate) {
      const parts = startDate.split('-').map(Number);
      if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
  }, [startDate]);

  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // When opening, sync view month to selected date
  useEffect(() => {
    if (isOpen) {
      if (startDate) {
        const parts = startDate.split('-').map(Number);
        if (parts.length === 3) {
          setViewYear(parts[0]);
          setViewMonth(parts[1] - 1);
        }
      }
    }
  }, [isOpen, startDate]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Escape listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const months = language === 'es' ? MONTHS_ES : MONTHS_EN;
  const daysHeader = language === 'es' ? DAYS_ES : DAYS_EN;

  const formatDateStr = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = useMemo(() => formatDateStr(new Date()), []);

  // Quick Presets
  const applyPreset = (preset: 'today' | '7days' | '30days' | 'thisMonth') => {
    const today = new Date();
    const endStr = formatDateStr(today);

    if (preset === 'today') {
      onChange(endStr, endStr);
    } else if (preset === '7days') {
      const past = new Date(today);
      past.setDate(today.getDate() - 6);
      onChange(formatDateStr(past), endStr);
    } else if (preset === '30days') {
      const past = new Date(today);
      past.setDate(today.getDate() - 29);
      onChange(formatDateStr(past), endStr);
    } else if (preset === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      onChange(formatDateStr(firstDay), endStr);
    }
    setIsOpen(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange('', '');
  };

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i);
      days.push({
        dateStr: formatDateStr(prevDate),
        dayNum: daysInPrevMonth - i,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      days.push({
        dateStr: formatDateStr(date),
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    // Next month filler days (fill remaining of 6 rows = 42 cells or remaining of week)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining && days.length < 35; d++) {
      const nextDate = new Date(viewYear, viewMonth + 1, d);
      days.push({
        dateStr: formatDateStr(nextDate),
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  // Click on a date cell
  const handleDateClick = (dateStr: string) => {
    if (!startDate || (startDate && endDate)) {
      // Starting new selection
      onChange(dateStr, '');
    } else if (startDate && !endDate) {
      // Finishing selection
      if (dateStr === startDate) {
        onChange(startDate, startDate);
      } else if (dateStr < startDate) {
        onChange(dateStr, startDate);
      } else {
        onChange(startDate, dateStr);
      }
      setIsOpen(false);
    }
  };

  // Label formatting
  const displayLabel = useMemo(() => {
    if (!startDate && !endDate) {
      return placeholder || (language === 'es' ? 'Rango de fechas' : 'Date range');
    }

    const formatShort = (dateStr: string) => {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const mIdx = Number(parts[1]) - 1;
      const mName = (language === 'es' ? MONTHS_ES : MONTHS_EN)[mIdx]?.slice(0, 3);
      return `${mName} ${Number(parts[2])}`;
    };

    if (startDate && endDate) {
      if (startDate === endDate) return formatShort(startDate);
      return `${formatShort(startDate)} – ${formatShort(endDate)}`;
    }

    if (startDate) {
      return `${formatShort(startDate)} – ...`;
    }

    return formatShort(endDate);
  }, [startDate, endDate, placeholder, language]);

  const hasSelection = Boolean(startDate || endDate);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-2 bg-white border border-slate-200 hover:border-[#2368f5] focus:outline-none focus:ring-2 focus:ring-[#2368f5]/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer transition-all ${
          isOpen ? 'border-[#2368f5] ring-2 ring-[#2368f5]/20' : ''
        }`}
      >
        <Calendar className="w-3.5 h-3.5 text-[#2368f5] shrink-0" />
        <span className="truncate max-w-[150px] sm:max-w-[180px]">
          {displayLabel}
        </span>

        {hasSelection ? (
          <span
            onClick={handleClear}
            title={language === 'es' ? 'Limpiar fecha' : 'Clear dates'}
            className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ml-0.5"
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#2368f5]' : ''
            }`}
          />
        )}
      </button>

      {/* Floating Modern Calendar Popover */}
      {isOpen && (
        <div
          className={`absolute z-[100] w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 overflow-hidden ${
            direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
          } ${align === 'right' ? 'right-0 left-auto' : 'left-0 right-auto sm:left-auto'}`}
          style={{
            animation: 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Quick Presets Pills */}
          <div className="flex flex-wrap gap-1.5 pb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={() => applyPreset('today')}
              className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2368f5] text-slate-600 border border-slate-200 transition-colors"
            >
              {language === 'es' ? 'Hoy' : 'Today'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('7days')}
              className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2368f5] text-slate-600 border border-slate-200 transition-colors"
            >
              {language === 'es' ? '7 días' : '7 days'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('30days')}
              className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2368f5] text-slate-600 border border-slate-200 transition-colors"
            >
              {language === 'es' ? '30 días' : '30 days'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('thisMonth')}
              className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2368f5] text-slate-600 border border-slate-200 transition-colors"
            >
              {language === 'es' ? 'Este mes' : 'This month'}
            </button>
            {hasSelection && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors flex items-center gap-1 ml-auto"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>{language === 'es' ? 'Limpiar' : 'Clear'}</span>
              </button>
            )}
          </div>

          {/* Month / Year Navigation */}
          <div className="flex items-center justify-between py-2.5">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-800">
              {months[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {daysHeader.map(d => (
              <span key={d} className="text-[10px] font-bold text-slate-400 uppercase py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ dateStr, dayNum, isCurrentMonth }) => {
              const isToday = dateStr === todayStr;
              const isStart = dateStr === startDate;
              const isEnd = dateStr === endDate;
              const isSelected = isStart || isEnd;

              // Check if inside range or hover range
              const effectiveEnd = endDate || hoverDate;
              const inRange =
                startDate &&
                effectiveEnd &&
                startDate < effectiveEnd &&
                dateStr > startDate &&
                dateStr < effectiveEnd;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleDateClick(dateStr)}
                  onMouseEnter={() => startDate && !endDate && setHoverDate(dateStr)}
                  className={`h-8 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center relative ${
                    !isCurrentMonth
                      ? 'text-slate-300 hover:text-slate-500'
                      : isSelected
                      ? 'bg-[#2368f5] text-white font-bold shadow-xs'
                      : inRange
                      ? 'bg-blue-50 text-[#2368f5] font-bold rounded-none'
                      : 'text-slate-700 hover:bg-slate-100'
                  } ${isStart && endDate && startDate !== endDate ? 'rounded-r-none' : ''} ${
                    isEnd && startDate && startDate !== endDate ? 'rounded-l-none' : ''
                  }`}
                >
                  <span>{dayNum}</span>
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#2368f5]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Range Summary / Helper text */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {!startDate
                ? language === 'es' ? 'Selecciona fecha de inicio' : 'Pick start date'
                : !endDate
                ? language === 'es' ? 'Selecciona fecha final' : 'Pick end date'
                : language === 'es' ? 'Rango seleccionado' : 'Range selected'}
            </span>
            {hasSelection && (
              <button
                type="button"
                onClick={() => {
                  if (startDate && !endDate) {
                    onChange(startDate, startDate);
                  }
                  setIsOpen(false);
                }}
                className="font-bold text-[#2368f5] hover:underline cursor-pointer"
              >
                {language === 'es' ? 'Listo' : 'Done'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
