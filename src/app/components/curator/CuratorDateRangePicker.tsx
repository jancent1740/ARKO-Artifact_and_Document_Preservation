import { Calendar, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CuratorDateRangePickerProps {
  value: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onChange: (value: { startDate: Date | null; endDate: Date | null }) => void;
  placeholder?: string;
}

export function CuratorDateRangePicker({
  value,
  onChange,
  placeholder = 'Select Date Range'
}: CuratorDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const displayText = () => {
    if (value.startDate && value.endDate) {
      return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
    } else if (value.startDate) {
      return formatDate(value.startDate);
    }
    return placeholder;
  };

  const handleClear = () => {
    onChange({ startDate: null, endDate: null });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full lg:min-w-[180px] h-[42px] px-4 pr-10 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <Calendar className="w-4 h-4 text-[#374151]" />
        <span className={value.startDate ? 'text-[#111827]' : 'text-[#6B7280]'}>
          {displayText()}
        </span>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#374151]" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#E5E7EB] rounded-[10px] shadow-lg z-50 p-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[#6A7282] mb-1">Start Date</label>
              <input
                type="date"
                value={value.startDate ? value.startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const newDate = e.target.value ? new Date(e.target.value) : null;
                  onChange({ ...value, startDate: newDate });
                }}
                className="w-full h-9 px-3 border border-[#D1D5DC] rounded-[8px] text-sm focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6A7282] mb-1">End Date</label>
              <input
                type="date"
                value={value.endDate ? value.endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const newDate = e.target.value ? new Date(e.target.value) : null;
                  onChange({ ...value, endDate: newDate });
                }}
                className="w-full h-9 px-3 border border-[#D1D5DC] rounded-[8px] text-sm focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleClear}
                className="flex-1 h-8 px-3 border border-[#D1D5DC] rounded-[8px] text-sm text-[#364153] hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 h-8 px-3 bg-black text-white rounded-[8px] text-sm hover:bg-gray-900 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}