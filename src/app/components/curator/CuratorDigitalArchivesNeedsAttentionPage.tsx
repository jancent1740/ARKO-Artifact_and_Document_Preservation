import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  Eye,
  X,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  Image as ImageIcon,
  PlusCircle,
} from "lucide-react";
import { CuratorStatusBadge } from "./CuratorStatusBadge";
import { CuratorDateRangePicker } from "./CuratorDateRangePicker";
import { items, type Item } from "../../lib/api";
import { toast } from "sonner";

interface AtRiskItem {
  id: string;
  name: string;
  project: string;
  dateDetected: string;
  lastVerified: string;
  fileHealth: "OK" | "Flagged";
}

interface DateRange {
  label: string;
  value: string;
}

/**
 * CuratorDigitalArchivesNeedsAttentionPage
 * Monitor items with integrity or verification problems
 */
export function CuratorDigitalArchivesNeedsAttentionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    useState(false);
  const [isReuploadDialogOpen, setIsReuploadDialogOpen] =
    useState(false);
  const [selectedItem, setSelectedItem] =
    useState<AtRiskItem | null>(null);
  const [confirmationChecked, setConfirmationChecked] =
    useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const [atRiskItems, setAtRiskItems] = useState<AtRiskItem[]>([]);

  useEffect(() => {
    items.list({ status: "Flagged" }).then((res) => {
      setAtRiskItems(
        res.items.map((item: Item) => ({
          id: item.item_identifier,
          name: item.title,
          project: item.collection_name || "",
          dateDetected: new Date(item.updated_at).toLocaleDateString("en-US", {
            year: "numeric", month: "2-digit", day: "2-digit",
          }),
          lastVerified: new Date(item.updated_at).toLocaleDateString("en-US", {
            year: "numeric", month: "2-digit", day: "2-digit",
          }),
          fileHealth: "Flagged",
        }))
      );
    }).catch((err) => toast.error(err.message));
  }, []);

  const handleViewItem = (item: AtRiskItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleRequestReupload = () => {
    setIsDetailsModalOpen(false);
    setIsReuploadDialogOpen(true);
  };

  const handleSendReuploadRequest = () => {
    // Handle sending reupload request
    setIsReuploadDialogOpen(false);
    setConfirmationChecked(false);
  };

  const handleCloseReuploadDialog = () => {
    setIsReuploadDialogOpen(false);
    setConfirmationChecked(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="px-4 lg:px-9 py-8 lg:py-9 border-b border-gray-200">
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] lg:text-[30px] leading-[32px] lg:leading-[36px] text-[#101828]">
            At-Risk / Integrity Issues
          </h1>
          <p className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] text-[#4A5565]">
            Monitor items with integrity or verification
            problems
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-9 py-4 lg:py-6">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <label
                htmlFor="search-at-risk-items"
                className="sr-only"
              >
                Search at-risk items
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                id="search-at-risk-items"
                type="text"
                placeholder="Search at-risk items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[41px] pl-10 pr-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
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

        {/* At-Risk Items Table */}
        <div className="rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] bg-white overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-[0.8px] border-[#E5E7EB] bg-white">
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Preview
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Item Name / ID
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Project
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Date Detected
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Last Verified
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  File Health
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {atRiskItems
                .filter(
                  (item) =>
                    item.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.id
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index !== atRiskItems.length - 1
                        ? "border-b-[0.8px] border-[#E5E7EB]"
                        : ""
                    } hover:bg-gray-50/50 transition-colors`}
                  >
                    {/* Preview */}
                    <td data-label="Preview" className="py-4 px-6">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-[12px] text-[#4A5565]">
                          IMG
                        </span>
                      </div>
                    </td>

                    {/* Item Name / ID */}
                    <td data-label="Item Name / ID" className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <p className="text-[14px] text-[#101828]">
                          {item.name}
                        </p>
                        <a
                          href="#"
                          className="text-[12px] text-blue-600 hover:underline"
                          onClick={(e) => e.preventDefault()}
                        >
                          {item.id}
                        </a>
                      </div>
                    </td>

                    {/* Project */}
                    <td data-label="Project" className="py-4 px-6 text-[14px] text-[#6A7282]">
                      {item.project}
                    </td>

                    {/* Date Detected */}
                    <td data-label="Date Detected" className="py-4 px-6 text-[14px] text-[#6A7282]">
                      {item.dateDetected}
                    </td>

                    {/* Last Verified */}
                    <td data-label="Last Verified" className="py-4 px-6 text-[14px] text-[#6A7282]">
                      {item.lastVerified}
                    </td>

                    {/* File Health */}
                    <td data-label="File Health" className="py-4 px-6">
                      <CuratorStatusBadge
                        status={item.fileHealth}
                      />
                    </td>

                    {/* Actions */}
                    <td data-label="Actions" className="py-4 px-6">
                      <button
                        onClick={() => handleViewItem(item)}
                        className="w-[34px] h-[34px] border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label={`View item ${item.name}`}
                      >
                        <Eye
                          className="w-4 h-4 text-[#6A7282]"
                          strokeWidth={1.33}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Details Modal */}
      {isDetailsModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="h-[101px] border-b border-[#E5E7EB] px-6 flex items-center justify-between">
              <div>
                <h2 className="text-[20px] text-[#101828]">
                  {selectedItem.name}
                </h2>
                <p className="text-[14px] text-[#4A5565] mt-1">
                  {selectedItem.id} • {selectedItem.project}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-[10px] transition-colors"
              >
                <X
                  className="w-5 h-5 text-[#4A5565]"
                  strokeWidth={1.67}
                />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Left Side - Image Preview */}
              <div className="flex-1">
                <div className="border border-[#E5E7EB] rounded-[10px] p-4">
                  {/* Main Image */}
                  <div className="aspect-[470/327.6] bg-gray-50 rounded flex items-center justify-center mb-4">
                    <ImageIcon
                      className="w-16 h-16 text-[#6B7280]"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2">
                    <div className="w-16 h-16 border border-[#D1D5DC] rounded flex items-center justify-center">
                      <span className="text-[12px] text-[#4A5565]">
                        File 1
                      </span>
                    </div>
                    <div className="w-16 h-16 border border-[#D1D5DC] rounded flex items-center justify-center">
                      <span className="text-[12px] text-[#4A5565]">
                        File 2
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Item Information */}
              <div className="flex-1 space-y-4">
                {/* Section Header */}
                <div className="border-b border-[#E5E7EB] pb-2">
                  <h3 className="text-[14px] font-bold text-black">
                    ITEM INFORMATION
                  </h3>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Project */}
                  <div>
                    <label className="block text-[12px] text-[#6A7282] mb-1">
                      Project
                    </label>
                    <p className="text-[14px] text-black">
                      {selectedItem.project}
                    </p>
                  </div>

                  {/* Date Detected */}
                  <div>
                    <label className="block text-[12px] text-[#6A7282] mb-1">
                      Date Detected
                    </label>
                    <p className="text-[14px] text-[#101828]">
                      {selectedItem.dateDetected}
                    </p>
                  </div>

                  {/* Last Verified */}
                  <div className="lg:col-span-2">
                    <label className="block text-[12px] text-[#6A7282] mb-1">
                      Last Verified
                    </label>
                    <p className="text-[14px] text-[#101828]">
                      {selectedItem.lastVerified}
                    </p>
                  </div>
                </div>

                {/* Error Alert Box */}
                <div className="border border-[#B9F8CF] bg-[#F0FFF4] rounded-[10px] p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#D30000] flex-shrink-0" />
                    <div>
                      <h4 className="text-[14px] text-[#D30000] mb-1">
                        File Health: Corrupted
                      </h4>
                      <p className="text-[12px] text-[#4A5565]">
                        Issue: Checksum Mismatch
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E5E7EB] px-6 py-6 flex justify-center">
              <button
                onClick={handleRequestReupload}
                className="h-10 px-6 bg-[#1F2937] hover:bg-[#111827] text-white rounded-[10px] border border-[#D1D5DC] flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="w-[17px] h-[17px]" />
                <span className="text-[14px]">
                  Request Re-upload
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Reupload Dialog */}
      {isReuploadDialogOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] w-full max-w-[512px]">
            {/* Dialog Header */}
            <div className="border-b border-[#E5E7EB] px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#EFF6FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <RefreshCw
                      className="w-5 h-5 text-[#1F74FF]"
                      strokeWidth={1.67}
                    />
                  </div>
                  <div>
                    <h2 className="text-[18px] text-[#101828]">
                      Request Reupload
                    </h2>
                    <p className="text-[14px] text-[#4A5565] mt-1">
                      {selectedItem.id} - {selectedItem.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="px-6 py-6 space-y-4">
              {/* Alert Box */}
              <div className="border border-[#1F74FF] bg-[#EFF6FF] rounded-[10px] p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#1F74FF] flex-shrink-0" />
                  <div>
                    <h4 className="text-[14px] text-[#1F74FF] mb-1">
                      Action Required
                    </h4>
                    <p className="text-[12px] text-black">
                      This will notify the assigned staff member
                      to re-upload a new version of this file.
                      The original file will remain until a
                      replacement is provided.
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="border border-[#E5E7EB] rounded-[10px] p-3 hover:bg-gray-50 transition-colors">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmationChecked}
                    onChange={(e) =>
                      setConfirmationChecked(e.target.checked)
                    }
                    className="w-4 h-4 mt-0.5 accent-[#1F74FF] rounded border-gray-300"
                  />
                  <span className="text-[12px] text-[#364153]">
                    I confirm that I want to request a re-upload
                    for this item and understand that the
                    assigned staff will be notified.
                  </span>
                </label>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="border-t border-[#E5E7EB] px-6 py-6 flex justify-end gap-3">
              <button
                onClick={handleCloseReuploadDialog}
                className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors text-[14px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReuploadRequest}
                disabled={!confirmationChecked}
                className={`h-10 px-4 rounded-[10px] shadow-sm flex items-center gap-2 text-[14px] transition-colors ${
                  confirmationChecked
                    ? "bg-[#1F2937] hover:bg-[#111827] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <RefreshCw
                  className="w-4 h-4"
                  strokeWidth={1.33}
                />
                <span>Send Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}