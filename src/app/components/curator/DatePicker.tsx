import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  error?: boolean;
  allowFutureDates?: boolean; // Optional prop to allow future dates (default: false)
  label?: string; // Optional label for better error messages
}

/**
 * DatePicker - Simple date input component with calendar icon and validation
 * Used in curator forms for date selection
 * Validates against future dates by default for historical/current data
 */
export function DatePicker({ 
  value, 
  onChange, 
  placeholder = 'mm/dd/yyyy', 
  error,
  allowFutureDates = false,
  label = 'Date'
}: DatePickerProps) {
  const [validationError, setValidationError] = useState<string>('');

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Validate date on change
  const handleDateChange = (newValue: string) => {
    if (!newValue) {
      setValidationError('');
      onChange(newValue);
      return;
    }

    // Validate future dates
    if (!allowFutureDates) {
      const selectedDate = new Date(newValue);
      const today = new Date(getTodayString());
      
      if (selectedDate > today) {
        setValidationError('Future dates are not allowed.');
        return;
      }
    }

    setValidationError('');
    onChange(newValue);
  };

  // Validate on mount if value exists
  useEffect(() => {
    if (value && !allowFutureDates) {
      const selectedDate = new Date(value);
      const today = new Date(getTodayString());
      
      if (selectedDate > today) {
        setValidationError('Future dates are not allowed.');
      }
    }
  }, []);

  const todayString = getTodayString();
  const hasError = error || !!validationError;

  return (
    <div>
      <div className="relative">
        <input
          type="date"
          value={value}
          max={allowFutureDates ? undefined : todayString}
          onChange={(e) => handleDateChange(e.target.value)}
          className={`w-full px-4 py-2.5 bg-white border ${
            hasError ? 'border-red-500' : 'border-[#d1d5db]'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent hover:border-[#9ca3af] transition-colors text-[14px] text-[#111827]`}
          style={{
            colorScheme: 'light'
          }}
          aria-label={label}
          aria-invalid={hasError}
          aria-describedby={validationError ? 'date-picker-error' : undefined}
        />
      </div>
      
      {/* Validation Error Message */}
      {validationError && (
        <div 
          id="date-picker-error"
          className="mt-2 p-2 bg-[#fef2f2] border border-[#fecaca] rounded-lg flex items-start gap-2"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4 text-[#dc2626] flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#dc2626] font-medium">{validationError}</p>
        </div>
      )}
    </div>
  );
}