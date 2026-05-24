import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { CuratorDateRangePicker } from './CuratorDateRangePicker';
import { activityLogs, type ActivityLogEntry } from '../../lib/api';
import { toast } from 'sonner';

interface AuditLogEntry {
  timestamp: string;
  user: string;
  action: string;
  actionType: 'default' | 'success' | 'warning' | 'orange' | 'yellow';
  item: string;
  notes: string;
}

interface ActionBadgeProps {
  action: string;
  variant: 'default' | 'success' | 'warning' | 'orange' | 'yellow';
}

/**
 * ActionBadge Component
 * Badge to display action types with different color variants
 */
function ActionBadge({ action, variant }: ActionBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-[rgba(0,201,80,0.3)] text-[#047857]';
      case 'warning':
      case 'orange':
        return 'border-[rgba(249,115,22,0.3)] text-[#C2410C] shadow-[0_0_10px_0_rgba(249,115,22,0.2)]';
      case 'yellow':
        return 'border-[rgba(240,177,0,0.3)] text-[#B45309]';
      default:
        return 'border-[rgba(106,114,130,0.3)] text-[#4A5565]';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border-[0.8px] text-[12px] leading-4 ${getVariantStyles()}`}
    >
      {action}
    </span>
  );
}

/**
 * CuratorDigitalArchivesActivityHistoryPage
 * Audit logs and activity history for Digital Archives
 */
export function CuratorDigitalArchivesActivityHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityLogs.list().then((logs) => {
      setAuditLogs(
        logs.map((log: ActivityLogEntry) => ({
          timestamp: new Date(log.created_at).toLocaleString("en-US", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit",
          }),
          user: log.user_name,
          action: log.action,
          actionType: "default" as const,
          item: log.entity_type ? `${log.entity_type} #${log.entity_id || ""}` : "",
          notes: log.details || "",
        }))
      );
      setLoading(false);
    }).catch((err) => {
      toast.error(err.message);
      setLoading(false);
    });
  }, []);

  // Filter logs based on search and action filter
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction =
      actionFilter === 'all' || log.action.toLowerCase() === actionFilter.toLowerCase();

    return matchesSearch && matchesAction;
  });

  const totalEntries = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / 10));

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="px-4 lg:px-8 py-8 border-b border-gray-200">
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] lg:text-[30px] leading-[32px] lg:leading-[36px] text-[#101828]">
            Audit Logs
          </h1>
          <p className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] text-[#4A5565]">
            Transparency and traceability of all actions in the module
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
              <label htmlFor="search-activity-history" className="sr-only">
                Search by user, action, item, or notes
              </label>
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]"
                strokeWidth={1.33}
              />
              <input
                id="search-activity-history"
                type="text"
                placeholder="Search by user, action, item, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[42px] pl-10 pr-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* All Actions Dropdown */}
              <div className="relative">
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="h-[42px] px-4 pr-10 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#D1D5DC] min-w-[140px]"
                >
                  <option value="all">All Actions</option>
                  <option value="upload">Upload</option>
                  <option value="approve">Approve</option>
                  <option value="reassign">Reassign</option>
                  <option value="integrity check">Integrity Check</option>
                  <option value="request rework">Request Rework</option>
                  <option value="recovery">Recovery</option>
                  <option value="project update">Project Update</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Date Range Dropdown */}
              <CuratorDateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Date Range"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <p className="text-[14px] lg:text-[16px] text-[#4A5565]">
            Showing {totalEntries} of {totalEntries} entries
          </p>
          <p className="text-[14px] lg:text-[16px] text-[#4A5565]">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 text-[14px] text-[#6A7282]">
            Loading activity logs...
          </div>
        )}

        {/* Audit Logs Table */}
        {!loading && (
        <div className="rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b-[0.8px] border-[#E5E7EB] bg-white">
                  <th className="py-4 px-4 lg:px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px] whitespace-nowrap">
                    Timestamp
                  </th>
                  <th className="py-4 px-4 lg:px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px] whitespace-nowrap">
                    User
                  </th>
                  <th className="py-4 px-4 lg:px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px] whitespace-nowrap">
                    Action
                  </th>
                  <th className="py-4 px-4 lg:px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px] whitespace-nowrap">
                    Item / Project
                  </th>
                  <th className="py-4 px-4 lg:px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={index}
                    className={`${
                      index !== filteredLogs.length - 1 ? 'border-b-[0.8px] border-[#E5E7EB]' : ''
                    } hover:bg-gray-50/50 transition-colors`}
                  >
                    {/* Timestamp */}
                    <td data-label="Timestamp" className="py-4 lg:py-5 px-4 lg:px-6 text-[14px] text-[#4A5565] whitespace-pre-line">
                      {log.timestamp}
                    </td>

                    {/* User */}
                    <td data-label="User" className="py-4 lg:py-5 px-4 lg:px-6 text-[14px] text-[#101828] whitespace-nowrap">
                      {log.user}
                    </td>

                    {/* Action */}
                    <td data-label="Action" className="py-4 lg:py-5 px-4 lg:px-6">
                      <ActionBadge action={log.action} variant={log.actionType} />
                    </td>

                    {/* Item / Project */}
                    <td data-label="Item / Project" className="py-4 lg:py-5 px-4 lg:px-6 text-[14px] text-[#92400E] whitespace-nowrap">
                      {log.item}
                    </td>

                    {/* Notes */}
                    <td data-label="Notes" className="py-4 lg:py-5 px-4 lg:px-6 text-[14px] text-[#364153]">
                      {log.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Pagination Section */}
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
      </div>
    </div>
  );
}