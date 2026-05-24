import { useState, useRef, useEffect } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface DateRangePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowFutureDates?: boolean; // Optional prop to allow future dates
}

export function DateRangePicker({ value, onChange, placeholder = 'Select date range', allowFutureDates = false }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [validationError, setValidationError] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Helper function to normalize dates (set time to midnight for comparison)
  const normalizeDate = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // Get today's date normalized
  const getTodayNormalized = (): Date => {
    return normalizeDate(new Date());
  };

  // Validate if a date is in the future
  const isFutureDate = (date: Date): boolean => {
    const normalized = normalizeDate(date);
    const today = getTodayNormalized();
    return normalized > today;
  };

  // Validate if a date is disabled (future dates when not allowed)
  const isDateDisabled = (date: Date): boolean => {
    if (!allowFutureDates && isFutureDate(date)) {
      return true;
    }
    return false;
  };

  // Validate date range
  const validateDateRange = (start: Date | null, end: Date | null): string => {
    if (!start || !end) return '';

    // Check if end date is before start date
    if (normalizeDate(end) < normalizeDate(start)) {
      return 'End date cannot be earlier than start date.';
    }

    // Check if dates are in the future (when not allowed)
    if (!allowFutureDates) {
      if (isFutureDate(start)) {
        return 'Start date cannot be in the future.';
      }
      if (isFutureDate(end)) {
        return 'End date cannot be in the future.';
      }
    }

    return '';
  };

  // Parse existing value on mount
  useEffect(() => {
    if (value && value.includes('–')) {
      const [start, end] = value.split(' – ');
      const startParts = start.split('/');
      const endParts = end.split('/');
      
      if (startParts.length === 3 && endParts.length === 3) {
        const parsedStartDate = new Date(parseInt(startParts[2]), parseInt(startParts[0]) - 1, parseInt(startParts[1]));
        const parsedEndDate = new Date(parseInt(endParts[2]), parseInt(endParts[0]) - 1, parseInt(endParts[1]));
        
        setStartDate(parsedStartDate);
        setEndDate(parsedEndDate);
        
        // Validate the parsed dates
        const error = validateDateRange(parsedStartDate, parsedEndDate);
        if (error) {
          setValidationError(error);
        }
      }
    }
  }, []);

  // Clear validation error when calendar opens
  useEffect(() => {
    if (isOpen) {
      setValidationError('');
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Announce validation errors to screen readers
  useEffect(() => {
    if (validationError && errorRef.current) {
      errorRef.current.focus();
    }
  }, [validationError]);

  const formatDate = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleDateClick = (date: Date) => {
    // Don't allow selecting disabled dates
    if (isDateDisabled(date)) {
      setValidationError('Future dates are not allowed.');
      return;
    }

    // Clear any previous validation errors
    setValidationError('');

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(date);
      setEndDate(null);
    } else {
      // Set end date
      let newStartDate = startDate;
      let newEndDate = date;

      if (date < startDate) {
        // If end date is before start date, swap them
        newStartDate = date;
        newEndDate = startDate;
      }

      // Validate the range before setting
      const error = validateDateRange(newStartDate, newEndDate);
      if (error) {
        setValidationError(error);
        return;
      }

      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  };

  const handleApply = () => {
    if (!startDate || !endDate) {
      setValidationError('Please select both start and end dates.');
      return;
    }

    // Final validation before applying
    const error = validateDateRange(startDate, endDate);
    if (error) {
      setValidationError(error);
      return;
    }

    const dateRangeString = `${formatDate(startDate)} – ${formatDate(endDate)}`;
    onChange(dateRangeString);
    setValidationError('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setValidationError('');
    onChange('');
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateInRange = (date: Date): boolean => {
    if (!startDate) return false;
    
    const compareDate = endDate || hoverDate;
    if (!compareDate) return false;

    const start = startDate < compareDate ? startDate : compareDate;
    const end = startDate < compareDate ? compareDate : startDate;

    const normalized = normalizeDate(date);
    const normalizedStart = normalizeDate(start);
    const normalizedEnd = normalizeDate(end);

    return normalized >= normalizedStart && normalized <= normalizedEnd;
  };

  const isDateSelected = (date: Date): boolean => {
    return (startDate && normalizeDate(date).getTime() === normalizeDate(startDate).getTime()) ||
           (endDate && normalizeDate(date).getTime() === normalizeDate(endDate).getTime()) ||
           false;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Empty cells before the first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isInRange = isDateInRange(date);
      const isSelected = isDateSelected(date);
      const isToday = normalizeDate(date).getTime() === getTodayNormalized().getTime();
      const disabled = isDateDisabled(date);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => !disabled && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          disabled={disabled}
          className={`h-9 flex items-center justify-center rounded-lg text-[13px] transition-colors ${
            disabled
              ? 'text-[#d1d5db] cursor-not-allowed opacity-40'
              : isSelected
              ? 'bg-[#111827] text-white font-medium'
              : isInRange
              ? 'bg-[#e5e7eb] text-[#111827]'
              : isToday
              ? 'border border-[#111827] text-[#111827] font-medium'
              : 'text-[#374151] hover:bg-[#f3f4f6]'
          }`}
          aria-label={`${disabled ? 'Disabled date: ' : 'Select '}${formatDate(date)}`}
          aria-disabled={disabled}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4">
        {/* Month/Year Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={previousMonth}
            className="p-1 hover:bg-[#f3f4f6] rounded transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-[#374151]" />
          </button>
          <h3 className="font-medium text-[#111827] text-[14px]">
            {monthNames[month]} {year}
          </h3>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 hover:bg-[#f3f4f6] rounded transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-[#374151]" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="h-9 flex items-center justify-center text-[11px] font-medium text-[#6b7280]">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div 
            ref={errorRef}
            className="mt-4 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg flex items-start gap-2"
            role="alert"
            aria-live="polite"
            tabIndex={-1}
          >
            <AlertCircle className="w-4 h-4 text-[#dc2626] flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#dc2626] font-medium">{validationError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e5e7eb]">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 text-[#6b7280] hover:text-[#111827] text-[13px] font-medium transition-colors"
            aria-label="Clear date selection"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!startDate || !endDate || !!validationError}
            className="px-4 py-2 bg-[#111827] text-white rounded-lg text-[13px] font-medium hover:bg-[#1f2937] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Apply date range"
          >
            Apply
          </button>
        </div>
      </div>
    );
  };

  const displayValue = value || '';

  return (
    <div ref={containerRef} className="relative flex-1">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer"
      >
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#111827] pointer-events-none" />
        <input
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly
          className={`w-full pl-12 pr-4 py-2.5 border border-[#d1d5db] rounded-lg text-[14px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563eb] ${
            displayValue ? 'text-[#111827]' : 'text-[#adaebc]'
          }`}
          aria-label="Date range picker"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-invalid={!!validationError}
          aria-describedby={validationError ? 'date-range-error' : undefined}
        />
      </div>

      {/* Validation Error Below Input (shown when calendar is closed) */}
      {validationError && !isOpen && (
        <div 
          id="date-range-error"
          className="mt-2 p-2 bg-[#fef2f2] border border-[#fecaca] rounded-lg flex items-start gap-2"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4 text-[#dc2626] flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#dc2626] font-medium">{validationError}</p>
        </div>
      )}

      {/* Calendar Dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-50 min-w-[320px]"
          role="dialog"
          aria-label="Date range picker calendar"
        >
          {renderCalendar()}
        </div>
      )}
    </div>
  );
}
