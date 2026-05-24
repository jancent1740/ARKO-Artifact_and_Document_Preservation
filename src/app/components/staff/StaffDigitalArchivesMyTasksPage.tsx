import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Upload, X, FileCheck, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { CuratorDateRangePicker } from '../curator/CuratorDateRangePicker';
import { toast } from 'sonner';
import { decode as decodeTiff } from 'tiff';
import { items, assets, submissions } from '../../lib/api';

interface Task {
  id: string;
  itemId: string;
  itemName: string;
  collection: string;
  notes: string;
  requestDate: string;
  status: 'Awaiting Correction' | 'Awaiting Approval';
}

interface StaffDigitalArchivesMyTasksPageProps {
  onNavigate?: (page: string) => void;
}

export function StaffDigitalArchivesMyTasksPage({ onNavigate }: StaffDigitalArchivesMyTasksPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await items.list({ status: 'Pending Review' });
        const mapped: Task[] = res.items.map((item: any) => ({
          id: String(item.id),
          itemId: item.item_identifier,
          itemName: item.title,
          collection: item.collection_name || '',
          notes: item.description || 'Needs review',
          requestDate: item.created_at ? item.created_at.split('T')[0] : '',
          status: 'Awaiting Correction' as const,
        }));
        setTasks(mapped);
      } catch {
        toast.error('Failed to load tasks');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Filter tasks based on search
  const filteredTasks = tasks.filter((task) =>
    searchQuery === '' ||
    task.itemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.collection.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const convertTiffToPreview = async (file: File): Promise<string> => {
    try {
      const buffer = await file.arrayBuffer();
      const decoded = decodeTiff(buffer);

      if (!decoded || decoded.length === 0) {
        throw new Error('Failed to decode TIFF');
      }

      const image = decoded[0];
      const { width, height, data, bitsPerSample, alpha } = image;

      const pixelCount = width * height;
      const samplesPerPixel = data.length / pixelCount;
      const isGrayscale = samplesPerPixel <= 2;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      const imageData = ctx.createImageData(width, height);
      const pixels = imageData.data;

      const is16bit = bitsPerSample === 16;
      const is32bit = bitsPerSample === 32;

      for (let i = 0; i < pixelCount; i++) {
        const destIdx = i * 4;

        if (isGrayscale) {
          const srcIdx = alpha ? i * 2 : i;
          let gray = 0;

          if (is16bit) {
            const typedData = data as Uint16Array;
            gray = (typedData[srcIdx] / 65535) * 255;
          } else if (is32bit) {
            const typedData = data as Float32Array;
            gray = Math.min(255, Math.max(0, typedData[srcIdx] * 255));
          } else {
            const typedData = data as Uint8Array;
            gray = typedData[srcIdx];
          }

          pixels[destIdx] = gray;
          pixels[destIdx + 1] = gray;
          pixels[destIdx + 2] = gray;

          if (alpha) {
            if (is16bit) {
              const typedData = data as Uint16Array;
              pixels[destIdx + 3] = (typedData[srcIdx + 1] / 65535) * 255;
            } else if (is32bit) {
              const typedData = data as Float32Array;
              pixels[destIdx + 3] = Math.min(255, Math.max(0, typedData[srcIdx + 1] * 255));
            } else {
              const typedData = data as Uint8Array;
              pixels[destIdx + 3] = typedData[srcIdx + 1];
            }
          } else {
            pixels[destIdx + 3] = 255;
          }
        } else {
          const channels = alpha ? 4 : 3;
          const srcIdx = i * channels;

          if (is16bit) {
            const typedData = data as Uint16Array;
            pixels[destIdx] = (typedData[srcIdx] / 65535) * 255;
            pixels[destIdx + 1] = (typedData[srcIdx + 1] / 65535) * 255;
            pixels[destIdx + 2] = (typedData[srcIdx + 2] / 65535) * 255;
            pixels[destIdx + 3] = alpha ? (typedData[srcIdx + 3] / 65535) * 255 : 255;
          } else if (is32bit) {
            const typedData = data as Float32Array;
            pixels[destIdx] = Math.min(255, Math.max(0, typedData[srcIdx] * 255));
            pixels[destIdx + 1] = Math.min(255, Math.max(0, typedData[srcIdx + 1] * 255));
            pixels[destIdx + 2] = Math.min(255, Math.max(0, typedData[srcIdx + 2] * 255));
            pixels[destIdx + 3] = alpha ? Math.min(255, Math.max(0, typedData[srcIdx + 3] * 255)) : 255;
          } else {
            const typedData = data as Uint8Array;
            pixels[destIdx] = typedData[srcIdx];
            pixels[destIdx + 1] = typedData[srcIdx + 1];
            pixels[destIdx + 2] = typedData[srcIdx + 2];
            pixels[destIdx + 3] = alpha ? typedData[srcIdx + 3] : 255;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      return dataUrl;
    } catch (error) {
      console.error('TIFF conversion error:', error);
      throw error;
    }
  };

  const handleReupload = (task: Task) => {
    setSelectedTask(task);
    setIsUploadModalOpen(true);
    setSelectedFile(null);
    setCheckComplete(false);
    setFilePreview(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.name.toLowerCase().endsWith('.tif') && !file.name.toLowerCase().endsWith('.tiff')) {
        toast.error('Only TIFF files are accepted');
        return;
      }

      setSelectedFile(file);
      setCheckComplete(false);

      try {
        const preview = await convertTiffToPreview(file);
        setFilePreview(preview);
      } catch (error) {
        console.error('Failed to generate preview:', error);
        toast.error('Failed to generate preview');
        setFilePreview(null);
      }
    }
  };

  const handleRunFileCheck = async () => {
    if (!selectedFile) return;

    setIsRunningCheck(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploaded = await assets.upload(formData);
      const result = await assets.verify(uploaded.id);

      if (result.health_status === 'healthy') {
        setCheckComplete(true);
        toast.success(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">File Check Passed!</p>
              <p className="text-sm text-gray-600">File integrity confirmed. Ready to submit.</p>
            </div>
          </div>,
          { duration: 3000, style: { background: 'white', border: '1px solid #e5e7eb', padding: '16px' } }
        );
      } else {
        toast.error(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">File Check Failed!</p>
              <p className="text-sm text-gray-600">File corrupted or checksum mismatch. Please try again.</p>
            </div>
          </div>,
          { duration: 3000, style: { background: 'white', border: '1px solid #e5e7eb', padding: '16px' } }
        );
      }
    } catch {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">File Check Failed!</p>
            <p className="text-sm text-gray-600">The file integrity check detected issues. Please try a different file.</p>
          </div>
        </div>,
        { duration: 3000, style: { background: 'white', border: '1px solid #e5e7eb', padding: '16px' } }
      );
    } finally {
      setIsRunningCheck(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      await (submissions.create as any)({
        itemName: selectedTask.itemName,
        itemId: selectedTask.itemId,
        notes: 'Corrected file submitted for review',
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id
            ? { ...task, status: 'Awaiting Approval' as const }
            : task
        )
      );

      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Submitted for Review!</p>
            <p className="text-sm text-gray-600">Your file has been sent to the curator for approval.</p>
          </div>
        </div>,
        { duration: 3000, style: { background: 'white', border: '1px solid #e5e7eb', padding: '16px' } }
      );

      setIsUploadModalOpen(false);
      setSelectedTask(null);
      setSelectedFile(null);
      setCheckComplete(false);
      setFilePreview(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="px-4 lg:px-8 py-8 border-b border-gray-200">
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] lg:text-[30px] leading-[32px] lg:leading-[36px] text-[#101828]">
            My Tasks
          </h1>
          <p className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] text-[#4A5565]">
            Items requiring re-upload or correction
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
                placeholder="Search tasks..."
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
            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-[14px] border-[2px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-6 ${
                    task.status === 'Awaiting Approval' ? 'border-[#1F74FF]' : 'border-[#DC2626]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-[18px] text-[#101828] mb-1">{task.itemName}</h3>
                          <p className="text-[14px] text-[#F59E0B] mb-2">{task.itemId}</p>
                          <p className="text-[14px] text-[#4A5565] mb-2">{task.collection}</p>
                          <p className="text-[12px] text-[#6A7282]">
                            Requested: {task.requestDate}
                          </p>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full border-[0.8px] text-[12px] ${
                        task.status === 'Awaiting Approval'
                          ? 'border-[rgba(31,116,255,0.3)] text-[#1F74FF]'
                          : 'border-[rgba(249,115,22,0.3)] text-[#F97316]'
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {task.status === 'Awaiting Approval' ? (
                        <button
                          disabled
                          className="w-full lg:w-auto h-10 px-6 bg-gray-300 text-gray-500 rounded-[10px] text-[14px] flex items-center gap-2 cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4" strokeWidth={1.33} />
                          Awaiting Curator Approval
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReupload(task)}
                          className="w-full lg:w-auto h-10 px-6 bg-[#1F2937] hover:bg-[#111827] text-white rounded-[10px] text-[14px] flex items-center gap-2 transition-colors"
                        >
                          <Upload className="w-4 h-4" strokeWidth={1.33} />
                          Re-upload File
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <FileCheck className="w-16 h-16 text-[#D1D5DC] mb-4" strokeWidth={1.33} />
                <p className="text-[16px] text-[#4A5565]">No tasks requiring attention</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* File Upload Modal */}
      {isUploadModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] w-full max-w-[600px]">
            {/* Modal Header */}
            <div className="border-b border-[#E5E7EB] px-6 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[20px] text-[#101828]">Re-upload File</h2>
                  <p className="text-[14px] text-[#4A5565] mt-1">
                    {selectedTask.itemId} - {selectedTask.itemName}
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-[10px] transition-colors"
                >
                  <X className="w-5 h-5 text-[#4A5565]" strokeWidth={1.67} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Notes Alert */}
              <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-[10px] p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
                  <div>
                    <h4 className="text-[14px] text-[#DC2626]">Correction Required</h4>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-[14px] text-[#101828] mb-2">
                  Select Corrected File (TIFF only)
                </label>
                <input
                  type="file"
                  accept=".tif,.tiff"
                  onChange={handleFileChange}
                  className="w-full h-12 px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-[14px] file:bg-[#F3F4F6] file:text-[#4A5565] hover:file:bg-[#E5E7EB] cursor-pointer"
                />
              </div>

              {/* File Info */}
              {selectedFile && (
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] p-4">
                  <p className="text-[12px] text-[#4A5565]">
                    <span className="font-semibold">Selected: </span>
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}

              {/* File Preview */}
              {filePreview && (
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] p-4">
                  <p className="text-[12px] text-[#4A5565] mb-2 font-semibold">Preview:</p>
                  <div className="flex justify-center">
                    <img
                      src={filePreview}
                      alt="TIFF Preview"
                      className="max-w-full h-auto max-h-[300px] rounded-[8px] border border-[#D1D5DC]"
                    />
                  </div>
                </div>
              )}

              {/* File Check Result */}
              {checkComplete && (
                <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] p-4">
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                    <div>
                      <h4 className="text-[14px] text-[#22C55E] mb-1">File Check Passed</h4>
                      <p className="text-[12px] text-[#4A5565]">
                        Checksum verified • File integrity confirmed
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E5E7EB] px-6 py-6 flex justify-end gap-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors text-[14px]"
              >
                Cancel
              </button>
              {!checkComplete && selectedFile && (
                <button
                  onClick={handleRunFileCheck}
                  disabled={isRunningCheck}
                  className={`h-10 px-6 rounded-[10px] text-[14px] flex items-center gap-2 transition-colors ${
                    isRunningCheck
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#1F74FF] hover:bg-[#1E6FE8] text-white'
                  }`}
                >
                  <FileCheck className="w-4 h-4" strokeWidth={1.33} />
                  {isRunningCheck ? 'Checking...' : 'Run File Check'}
                </button>
              )}
              {checkComplete && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="h-10 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-[10px] text-[14px] flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" strokeWidth={1.33} />
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
