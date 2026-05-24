import { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, Upload, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { CuratorDateRangePicker } from '../curator/CuratorDateRangePicker';
import { activityLogs } from '../../lib/api';
import { toast } from 'sonner';

interface HistoryEntry {
  id: string;
  action: string;
  actionType: 'upload' | 'verified' | 'completed' | 'corrected';
  description: string;
  timestamp: string;
}

interface StaffDigitalArchivesMyHistoryPageProps {
  onNavigate?: (page: string) => void;
}

export function StaffDigitalArchivesMyHistoryPage({ onNavigate }: StaffDigitalArchivesMyHistoryPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const user = (() => {
          try { return JSON.parse(localStorage.getItem('arko_user') || '{}'); }
          catch { return {}; }
        })();
        const userId = user.id;
        const params: Record<string, string> = {};
        if (userId) params.user_id = String(userId);
        const logs = await activityLogs.list(params);
        const mapped: HistoryEntry[] = logs.map((log: any) => ({
          id: String(log.id),
          action: log.action,
          actionType: mapActionToType(log.action),
          description: log.details || '',
          timestamp: log.created_at,
        }));
        setHistoryEntries(mapped);
      } catch {
        toast.error('Failed to load activity history');
        setHistoryEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const mapActionToType = (action: string): HistoryEntry['actionType'] => {
    const lower = action.toLowerCase();
    if (lower.includes('upload')) return 'upload';
    if (lower.includes('verif') || lower.includes('check')) return 'verified';
    if (lower.includes('correct') || lower.includes('re-upload')) return 'corrected';
    return 'completed';
  };

  // Filter history based on search
  const filteredHistory = historyEntries.filter((entry) =>
    searchQuery === '' ||
    entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEntries = filteredHistory.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / 10));

  const getIcon = (actionType: string) => {
    switch (actionType) {
      case 'upload':
        return <Upload className="w-5 h-5 text-[#1F74FF]" strokeWidth={1.67} />;
      case 'verified':
        return <FileCheck className="w-5 h-5 text-[#22C55E]" strokeWidth={1.67} />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-[#05DF72]" strokeWidth={1.67} />;
      case 'corrected':
        return <AlertCircle className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.67} />;
      default:
        return <Clock className="w-5 h-5 text-[#6A7282]" strokeWidth={1.67} />;
    }
  };

  const getIconBgColor = (actionType: string) => {
    switch (actionType) {
      case 'upload':
        return 'bg-[#EFF6FF]';
      case 'verified':
        return 'bg-[#F0FDF4]';
      case 'completed':
        return 'bg-[#F0FFF4]';
      case 'corrected':
        return 'bg-[#FFF7ED]';
      default:
        return 'bg-[#F9FAFB]';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="px-4 lg:px-8 py-8 border-b border-gray-200">
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] lg:text-[30px] leading-[32px] lg:leading-[36px] text-[#101828]">
            My History
          </h1>
          <p className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] text-[#4A5565]">
            Your personal activity log and contribution history
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-8 py-4 lg:py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-3 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]"
                strokeWidth={1.33}
              />
              <input
                type="text"
                placeholder="Search activity history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[42px] pl-10 pr-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              />
            </div>

            {/* Date Range Filter */}
            <CuratorDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Date Range"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#6A7282]" />
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <p className="text-[14px] lg:text-[16px] text-[#4A5565]">
                Showing {totalEntries} of {totalEntries} entries
              </p>
              <p className="text-[14px] lg:text-[16px] text-[#4A5565]">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-6">
              <div className="space-y-6">
                {filteredHistory.map((entry, index) => (
                  <div key={entry.id} className="flex gap-4">
                    {/* Timeline Icon */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 ${getIconBgColor(entry.actionType)} rounded-full flex items-center justify-center flex-shrink-0`}>
                        {getIcon(entry.actionType)}
                      </div>
                      {index !== filteredHistory.length - 1 && (
                        <div className="w-px h-full bg-[#E5E7EB] mt-2" />
                      )}
                    </div>

                    {/* Entry Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-[16px] text-[#101828]">
                            {entry.action} <span className="text-[#4A5565]">{entry.description}</span>
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-[#6A7282] flex-shrink-0">
                          <Clock className="w-3.5 h-3.5" strokeWidth={1.67} />
                          {entry.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredHistory.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Clock className="w-16 h-16 text-[#D1D5DC] mb-4" strokeWidth={1.33} />
                <p className="text-[16px] text-[#4A5565]">No activity history found</p>
              </div>
            )}

            {/* Pagination Section */}
            {filteredHistory.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-10 px-3 lg:px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] text-[14px] text-[#4A5565] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="h-10 min-w-[40px] px-4 bg-[#1F2937] text-white rounded-[10px] text-[14px]">
                  {currentPage}
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-10 px-3 lg:px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] text-[14px] text-[#4A5565] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
