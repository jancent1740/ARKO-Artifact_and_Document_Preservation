import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  Eye,
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Download,
} from "lucide-react";
import { CuratorDigitalArchivesProjectsPage } from "./CuratorDigitalArchivesProjectsPage";
import { CuratorDigitalArchivesNeedsAttentionPage } from "./CuratorDigitalArchivesNeedsAttentionPage";
import { CuratorDigitalArchivesActivityHistoryPage } from "./CuratorDigitalArchivesActivityHistoryPage";
import { CuratorStatusBadge } from "./CuratorStatusBadge";
import { CuratorDateRangePicker } from "./CuratorDateRangePicker";
import { toast } from "sonner";
import { decode as decodeTiff } from "tiff";
import { items, assets, collections, type Item } from "../../lib/api";

interface CuratorDigitalArchivesPageProps {
  activePage?: string;
  onNavigateToCatalog?: (data?: {
    fileName?: string;
    itemType?: string;
    collection?: string;
    project?: string;
  }) => void;
}

interface DigitalItem {
  id: string;
  name: string;
  itemType: "Artifact" | "Document";
  project: string;
  collection: string;
  addedBy: string;
  dateAdded: string;
  fileHealth: "OK" | "Flagged";
  imageQuality?: string;
  reviewStatus?: string;
  numberOfFiles?: number;
}

/**
 * CuratorDigitalArchivesPage
 * Digital archives management with 4 separate pages: All Items, Projects, Needs Attention, Activity History
 */
export function CuratorDigitalArchivesPage({
  activePage = "digital-archives-all-items",
  onNavigateToCatalog,
}: CuratorDigitalArchivesPageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] =
    useState(false);
  const [isItemDetailsModalOpen, setIsItemDetailsModalOpen] =
    useState(false);
  const [selectedItem, setSelectedItem] =
    useState<DigitalItem | null>(null);
  const [addPagesMode, setAddPagesMode] = useState(false);
  const [existingPages, setExistingPages] = useState<number[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [fileHealthFilter, setFileHealthFilter] =
    useState("all");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [uploadTab, setUploadTab] = useState<
    "artifact" | "document"
  >("artifact");
  const [selectedFile, setSelectedFile] = useState<File | null>(
    null,
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>(
    [],
  );
  const [draggedFileIndex, setDraggedFileIndex] = useState<
    number | null
  >(null);
  const [imagePreview, setImagePreview] = useState<
    string | null
  >(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [documentPreviews, setDocumentPreviews] = useState<
    Array<{ url: string; width: number; height: number }>
  >([]);
  const [isLoadingPreview, setIsLoadingPreview] =
    useState(false);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [itemType, setItemType] = useState("");
  const [collection, setCollection] = useState("");
  const [project, setProject] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [availableItems, setAvailableItems] = useState<
    Array<{
      id: string;
      name: string;
      project: string;
      collection: string;
      draftData?: any;
    }>
  >([]);
  const [fileCheckRun, setFileCheckRun] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedImageIndex, setSelectedImageIndex] =
    useState(0);
  const [fullScreenPreview, setFullScreenPreview] = useState<{
    url: string;
    index: number;
  } | null>(null);

  const [allItems, setAllItems] = useState<DigitalItem[]>([]);
  const [catalogItems, setCatalogItems] = useState<Array<{
    id: string;
    name: string;
    project: string;
    collection: string;
  }>>([]);

  useEffect(() => {
    items.list({ status: 'Published' }).then((res) => {
      const mapped: DigitalItem[] = res.items.map((item: Item) => ({
        id: item.item_identifier,
        name: item.title,
        itemType: item.type_name === "artifact" ? "Artifact" as const : "Document" as const,
        project: "",
        collection: item.collection_name || "",
        addedBy: item.created_by_name || "",
        dateAdded: new Date(item.created_at).toLocaleDateString("en-US", {
          year: "numeric", month: "2-digit", day: "2-digit",
        }),
        fileHealth: item.status === "Flagged" ? "Flagged" as const : "OK" as const,
        numberOfFiles: 1,
      }));
      setAllItems(mapped);

      const catItems = res.items.map((item: Item) => ({
        id: item.item_identifier,
        name: item.title,
        project: item.collection_name || "",
        collection: item.collection_name || "",
      }));
      setCatalogItems(catItems);
    }).catch((err) => toast.error(err.message));
  }, []);

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHealth =
      fileHealthFilter === "all" ||
      item.fileHealth.toLowerCase() ===
        fileHealthFilter.toLowerCase();

    const matchesItemType =
      itemTypeFilter === "all" ||
      item.itemType.toLowerCase() ===
        itemTypeFilter.toLowerCase();

    return matchesSearch && matchesHealth && matchesItemType;
  });

  const totalItems = filteredItems.length;

  const handleViewItem = (item: DigitalItem) => {
    setSelectedItem(item);
    setIsItemDetailsModalOpen(true);
    setActiveTab("info");
    setSelectedImageIndex(0);
  };

  const handleUploadTabChange = (
    tab: "artifact" | "document",
  ) => {
    // Prevent switching tabs in add pages mode
    if (addPagesMode && tab === "artifact") {
      return;
    }
    // Clear all uploaded files when switching tabs
    setSelectedFile(null);
    setSelectedFiles([]);
    setImagePreview(null);
    setImageDimensions(null);
    setFileSize(null);
    setDocumentPreviews([]);
    setIsLoadingPreview(false);
    setPageNumbers([]);
    setFileCheckRun(false);
    setUploadTab(tab);
  };

  const handleProjectChange = (projectValue: string) => {
    setProject(projectValue);
    setSelectedItemId("");

    if (!projectValue || projectValue === "") {
      setAvailableItems([]);
      return;
    }

    const projectItems = catalogItems.filter(
      (item) => item.project === projectValue || item.collection === projectValue
    );
    if (projectItems.length > 0) {
      setAvailableItems(projectItems);
    } else {
      setAvailableItems([]);
    }
  };

  const handleOpenUploadModal = () => {
    // Ensure clean state when opening modal normally
    setProject("");
    setSelectedItemId("");
    setAvailableItems([]);
    setCollection("");
    setItemType("");
    setAddPagesMode(false);
    setExistingPages([]);
    setIsUploadModalOpen(true);
  };

  const handleAddMorePages = (item: DigitalItem) => {
const pageNumbers = Array.from(
  { length: item.numberOfFiles || 1 },
  (_, i) => i + 1,
);
setExistingPages(pageNumbers);
    setAddPagesMode(true);
    setUploadTab("document");
    setCollection(item.collection);
    setProject(item.collection);
    setAvailableItems(projectItems);

    const catalogItem = projectItems[0] || null;
    if (catalogItem) {
      setSelectedItemId(catalogItem.id);
    }

    setIsUploadModalOpen(true);
    setIsItemDetailsModalOpen(false);
  };

  // Convert TIFF file to preview URL
  const convertTiffToPreview = async (
    file: File,
  ): Promise<{
    url: string;
    width: number;
    height: number;
  } | null> => {
    try {
      const buffer = await file.arrayBuffer();
      const decoded = decodeTiff(buffer);

      if (!decoded || decoded.length === 0) {
        throw new Error("Failed to decode TIFF");
      }

      // Get the first image from the TIFF
      const image = decoded[0];
      const { width, height, data, bitsPerSample, alpha } =
        image;

      // Determine if grayscale or RGB based on data length
      const pixelCount = width * height;
      const samplesPerPixel = data.length / pixelCount;
      const isGrayscale = samplesPerPixel <= 2; // 1 = grayscale, 2 = grayscale + alpha

      // Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Create ImageData
      const imageData = ctx.createImageData(width, height);
      const pixels = imageData.data;

      const is16bit = bitsPerSample === 16;
      const is32bit = bitsPerSample === 32;

      for (let i = 0; i < pixelCount; i++) {
        const destIdx = i * 4;

        if (isGrayscale) {
          // Grayscale: 1 or 2 channels (gray or gray+alpha)
          const srcIdx = alpha ? i * 2 : i;
          let gray = 0;

          if (is16bit) {
            const typedData = data as Uint16Array;
            gray = (typedData[srcIdx] / 65535) * 255;
          } else if (is32bit) {
            const typedData = data as Float32Array;
            gray = Math.min(
              255,
              Math.max(0, typedData[srcIdx] * 255),
            );
          } else {
            const typedData = data as Uint8Array;
            gray = typedData[srcIdx];
          }

          pixels[destIdx] = gray; // R
          pixels[destIdx + 1] = gray; // G
          pixels[destIdx + 2] = gray; // B

          if (alpha) {
            if (is16bit) {
              const typedData = data as Uint16Array;
              pixels[destIdx + 3] =
                (typedData[srcIdx + 1] / 65535) * 255;
            } else if (is32bit) {
              const typedData = data as Float32Array;
              pixels[destIdx + 3] = Math.min(
                255,
                Math.max(0, typedData[srcIdx + 1] * 255),
              );
            } else {
              const typedData = data as Uint8Array;
              pixels[destIdx + 3] = typedData[srcIdx + 1];
            }
          } else {
            pixels[destIdx + 3] = 255;
          }
        } else {
          // RGB: 3 or 4 channels (RGB or RGBA)
          const channels = alpha ? 4 : 3;
          const srcIdx = i * channels;

          if (is16bit) {
            const typedData = data as Uint16Array;
            pixels[destIdx] = (typedData[srcIdx] / 65535) * 255; // R
            pixels[destIdx + 1] =
              (typedData[srcIdx + 1] / 65535) * 255; // G
            pixels[destIdx + 2] =
              (typedData[srcIdx + 2] / 65535) * 255; // B
            pixels[destIdx + 3] = alpha
              ? (typedData[srcIdx + 3] / 65535) * 255
              : 255; // A
          } else if (is32bit) {
            const typedData = data as Float32Array;
            pixels[destIdx] = Math.min(
              255,
              Math.max(0, typedData[srcIdx] * 255),
            ); // R
            pixels[destIdx + 1] = Math.min(
              255,
              Math.max(0, typedData[srcIdx + 1] * 255),
            ); // G
            pixels[destIdx + 2] = Math.min(
              255,
              Math.max(0, typedData[srcIdx + 2] * 255),
            ); // B
            pixels[destIdx + 3] = alpha
              ? Math.min(
                  255,
                  Math.max(0, typedData[srcIdx + 3] * 255),
                )
              : 255; // A
          } else {
            const typedData = data as Uint8Array;
            pixels[destIdx] = typedData[srcIdx]; // R
            pixels[destIdx + 1] = typedData[srcIdx + 1]; // G
            pixels[destIdx + 2] = typedData[srcIdx + 2]; // B
            pixels[destIdx + 3] = alpha
              ? typedData[srcIdx + 3]
              : 255; // A
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");

      return {
        url: dataUrl,
        width,
        height,
      };
    } catch (error) {
      console.error("Error converting TIFF:", error);
      toast.error(
        `Failed to preview ${file.name}. The file may be corrupted.`,
      );
      return null;
    }
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (uploadTab === "artifact") {
      // Single file upload for artifacts
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        // Check file format - only allow TIFF
        const fileExtension = file.name
          .split(".")
          .pop()
          ?.toLowerCase();
        const allowedFormats = ["tiff", "tif"];

        if (
          !fileExtension ||
          !allowedFormats.includes(fileExtension)
        ) {
          toast.error(
            "Invalid file format. Only TIFF files are allowed.",
          );
          e.target.value = ""; // Reset file input
          return;
        }

        setSelectedFile(file);

        // Calculate file size
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        setFileSize(`${sizeInMB} MB`);

        // Convert TIFF to preview
        setIsLoadingPreview(true);
        const preview = await convertTiffToPreview(file);
        setIsLoadingPreview(false);

        if (preview) {
          setImagePreview(preview.url);
          setImageDimensions({
            width: preview.width,
            height: preview.height,
          });
        } else {
          // Fallback if preview fails
          setImagePreview(null);
          setImageDimensions(null);
        }
      }
    } else {
      // Multiple file upload for documents
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);

        // Check file formats - only allow TIFF
        const allowedFormats = ["tiff", "tif"];
        const invalidFiles = files.filter((file) => {
          const fileExtension = file.name
            .split(".")
            .pop()
            ?.toLowerCase();
          return (
            !fileExtension ||
            !allowedFormats.includes(fileExtension)
          );
        });

        if (invalidFiles.length > 0) {
          toast.error(
            "Invalid file format. Only TIFF files are allowed.",
          );
          e.target.value = ""; // Reset file input
          return;
        }

        setSelectedFiles(files);

        // Initialize page numbers
        // If in add pages mode, start from the next available page number
        if (addPagesMode && existingPages.length > 0) {
          const maxExistingPage = Math.max(...existingPages);
          const newPageNumbers = files.map(
            (_, index) => maxExistingPage + index + 1,
          );
          setPageNumbers(newPageNumbers);
        } else {
          // Normal mode: start from 1, 2, 3...
          setPageNumbers(files.map((_, index) => index + 1));
        }

        // Generate previews for document uploads
        setIsLoadingPreview(true);
        const previews = await Promise.all(
          files.map((file) => convertTiffToPreview(file)),
        );
        setIsLoadingPreview(false);

        // Filter out failed previews
        const validPreviews = previews.filter(
          (p) => p !== null,
        ) as Array<{
          url: string;
          width: number;
          height: number;
        }>;
        setDocumentPreviews(validPreviews);
      }
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedFileIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent,
    index: number,
  ) => {
    e.preventDefault();
    if (draggedFileIndex === null || draggedFileIndex === index)
      return;

    const newFiles = [...selectedFiles];
    const draggedFile = newFiles[draggedFileIndex];
    newFiles.splice(draggedFileIndex, 1);
    newFiles.splice(index, 0, draggedFile);

    // Also reorder previews to match
    const newPreviews = [...documentPreviews];
    const draggedPreview = newPreviews[draggedFileIndex];
    if (draggedPreview) {
      newPreviews.splice(draggedFileIndex, 1);
      newPreviews.splice(index, 0, draggedPreview);
      setDocumentPreviews(newPreviews);
    }

    // Auto-update page numbers to match new positions (1, 2, 3...)
    const newPageNumbers = newFiles.map((_, i) => i + 1);
    setPageNumbers(newPageNumbers);

    setSelectedFiles(newFiles);
    setDraggedFileIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedFileIndex(null);
  };

  const handlePageNumberChange = (
    index: number,
    value: string,
  ) => {
    const newPageNumbers = [...pageNumbers];
    // Allow empty string while typing
    if (value === "") {
      newPageNumbers[index] = null as any;
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        newPageNumbers[index] = Math.max(1, numValue);
      }
    }
    setPageNumbers(newPageNumbers);
  };

  const isPageNumberTaken = (pageNum: number): boolean => {
    return existingPages.includes(pageNum);
  };

  const handlePageNumberBlur = (index: number) => {
    const newPageNumbers = [...pageNumbers];
    // If empty or invalid, find next available page number
    if (!newPageNumbers[index] || newPageNumbers[index] < 1) {
      const allTakenNumbers = [
        ...existingPages,
        ...newPageNumbers.filter(
          (n, i) =>
            i !== index && n !== null && n !== undefined,
        ),
      ];
      let nextAvailable = 1;
      while (allTakenNumbers.includes(nextAvailable)) {
        nextAvailable++;
      }
      newPageNumbers[index] = nextAvailable;
    }
    // Check for duplicates and mark with red border (handled in render)
    setPageNumbers(newPageNumbers);
  };

  const hasDuplicatePageNumbers = () => {
    const validNumbers = pageNumbers.filter(
      (n) => n !== null && n !== undefined,
    );
    return validNumbers.length !== new Set(validNumbers).size;
  };

  const hasNullPageNumbers = () => {
    return pageNumbers.some(
      (n) => n === null || n === undefined || n < 1,
    );
  };

  const hasTakenPageNumbers = () => {
    return pageNumbers.some(
      (n) =>
        n !== null && n !== undefined && isPageNumberTaken(n),
    );
  };

  const handleRunFileCheck = () => {
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">
            File Check Completed!
          </p>
          <p className="text-sm text-gray-600">
            All integrity checks passed. You can now add information.
          </p>
        </div>
      </div>,
      { duration: 3000, style: { background: "white", border: "1px solid #e5e7eb", padding: "16px" } },
    );
    setFileCheckRun(true);
  };

  const handleAddInformation = () => {
    setIsUploadModalOpen(false);

    const selectedCatalogItem = catalogItems.find(
      (item) => item.id === selectedItemId
    );

    const uploadData: any = {
      fileName:
        uploadTab === "artifact"
          ? selectedFile?.name
          : selectedFiles.length > 0
            ? selectedFiles[0].name
            : undefined,
      itemType: uploadTab,
      collection: collection,
      project: project,
    };

    if (addPagesMode && selectedItem) {
      uploadData.existingItemData = {
        id: selectedItem.id,
        name: selectedItem.name,
        itemType: selectedItem.itemType,
        project: selectedItem.project,
        collection: selectedItem.collection,
        addedBy: selectedItem.addedBy,
        dateAdded: selectedItem.dateAdded,
        isAddingPages: true,
      };
    } else if (selectedCatalogItem) {
      uploadData.itemId = selectedCatalogItem.id;
      uploadData.itemName = selectedCatalogItem.name;
    }

    if (onNavigateToCatalog) {
      onNavigateToCatalog(uploadData);
    }

    setSelectedFile(null);
    setSelectedFiles([]);
    setImagePreview(null);
    setImageDimensions(null);
    setFileSize(null);
    setDocumentPreviews([]);
    setIsLoadingPreview(false);
    setPageNumbers([]);
    setItemType("");
    setCollection("");
    setProject("");
    setSelectedItemId("");
    setAvailableItems([]);
    setFileCheckRun(false);
    setAddPagesMode(false);
    setExistingPages([]);
  };

  const renderAllItems = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-3 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <label htmlFor="search-items" className="sr-only">
              Search items
            </label>
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]"
              strokeWidth={1.33}
            />
            <input
              id="search-items"
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[42px] pl-10 pr-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
            />
          </div>

          {/* Item Type Filter */}
          <div className="relative">
            <label
              htmlFor="item-type-filter"
              className="sr-only"
            >
              Filter by item type
            </label>
            <select
              id="item-type-filter"
              value={itemTypeFilter}
              onChange={(e) =>
                setItemTypeFilter(e.target.value)
              }
              className="w-full lg:min-w-[180px] h-[42px] px-4 pr-10 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
            >
              <option value="all">All Item Types</option>
              <option value="artifact">Artifact</option>
              <option value="document">Document</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4A5565] pointer-events-none" />
          </div>

          {/* File Health Filter */}
          <div className="relative">
            <label
              htmlFor="file-health-filter"
              className="sr-only"
            >
              Filter by file health
            </label>
            <select
              id="file-health-filter"
              value={fileHealthFilter}
              onChange={(e) =>
                setFileHealthFilter(e.target.value)
              }
              className="w-full lg:min-w-[180px] h-[42px] px-4 pr-10 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
            >
              <option value="all">All File Health</option>
              <option value="ok">Ok</option>
              <option value="flagged">Flagged</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4A5565] pointer-events-none" />
          </div>

          {/* Date Range Filter */}
          <CuratorDateRangePicker
            value={dateRange}
            onChange={(value) => setDateRange(value)}
            placeholder="Date Range"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div>
        <p className="text-[14px] lg:text-[16px] text-[#4A5565]">
          Showing {totalItems} of {totalItems} items
        </p>
      </div>

      {/* Digital Items Table */}
      <div className="rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] bg-white overflow-hidden">
        <div className="overflow-x-auto">
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
                  Item Type
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Project
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Collection
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Added By
                </th>
                <th className="py-4 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Date Added
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
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index !== filteredItems.length - 1
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
                  <td data-label="Item" className="py-4 px-6">
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

                  {/* Item Type */}
                  <td data-label="Type" className="py-4 px-6 text-[14px] text-[#6A7282]">
                    {item.itemType}
                  </td>

                  {/* Project */}
                  <td data-label="Project" className="py-4 px-6 text-[14px] text-[#6A7282]">
                    {item.project}
                  </td>

                  {/* Collection */}
                  <td data-label="Collection" className="py-4 px-6 text-[14px] text-[#6A7282]">
                    {item.collection}
                  </td>

                  {/* Added By */}
                  <td data-label="Added By" className="py-4 px-6 text-[14px] text-[#6A7282]">
                    {item.addedBy}
                  </td>

                  {/* Date Added */}
                  <td data-label="Date Added" className="py-4 px-6 text-[14px] text-[#6A7282]">
                    {item.dateAdded}
                  </td>

                  {/* File Health */}
                  <td data-label="File Health" className="py-4 px-6">
                    <CuratorStatusBadge
                      status={
                        item.fileHealth === "OK"
                          ? "OK"
                          : "Flagged"
                      }
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

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button
          disabled
          className="h-[38px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] text-[14px] text-[#6A7282] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button className="w-10 h-[38px] rounded-[10px] bg-black text-white text-[14px]">
          1
        </button>
        <button className="w-10 h-[38px] rounded-[10px] bg-white border-[0.8px] border-[#D1D5DC] text-[14px] text-[#6A7282] hover:bg-gray-50 transition-colors">
          2
        </button>
        <button className="w-10 h-[38px] rounded-[10px] bg-white border-[0.8px] border-[#D1D5DC] text-[14px] text-[#6A7282] hover:bg-gray-50 transition-colors">
          3
        </button>
        <button className="h-[38px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] text-[14px] text-[#6A7282] hover:bg-gray-50 transition-colors">
          Next
        </button>
      </div>
    </div>
  );

  const showUploadButton =
    activePage === "digital-archives-all-items";

  // For Projects, Needs Attention, and Activity History pages, render standalone without wrapper
  if (activePage === "digital-archives-projects") {
    return <CuratorDigitalArchivesProjectsPage />;
  }

  if (activePage === "digital-archives-needs-attention") {
    return <CuratorDigitalArchivesNeedsAttentionPage />;
  }

  if (activePage === "digital-archives-activity-history") {
    return <CuratorDigitalArchivesActivityHistoryPage />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 lg:px-9 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-[24px] lg:text-[30px] leading-[32px] lg:leading-[36px] text-[#101828] mb-2">
              All Digital Items
            </h1>
            <p className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] text-[#4A5565]">
              View and manage all scanned and photographed items
            </p>
          </div>
          {showUploadButton && (
            <button
              onClick={handleOpenUploadModal}
              className="h-[40px] px-5 bg-[#000000] text-white rounded-[10px] shadow-sm hover:bg-gray-900 transition-colors flex items-center gap-2 justify-center w-full lg:w-auto"
            >
              <Upload className="w-4 h-4" strokeWidth={1.33} />
              <span className="text-[14px]">
                Upload Digitization
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-9 py-4 lg:py-9">
        {renderAllItems()}
      </div>

      {/* Upload Digitization Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setIsUploadModalOpen(false);
            setAddPagesMode(false);
            setExistingPages([]);
            setSelectedItemId("");
            setAvailableItems([]);
          }}
        >
          <div
            className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-[#E5E7EB] px-8 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[20px] text-[#101828]">
                    {addPagesMode
                      ? "Add More Pages"
                      : "Upload Digitization"}
                  </h2>
                  <p className="text-[14px] text-[#4A5565] mt-1">
                    {addPagesMode
                      ? `Add additional pages to ${selectedItem?.name || "this document"}`
                      : "Add a new digital item to the collection"}
                  </p>
                  {addPagesMode && existingPages.length > 0 && (
                    <p className="text-[12px] text-[#6A7282] mt-2">
                      Existing pages: {existingPages.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(85vh-180px)]">
              <div className="space-y-6">
                {/* Upload Type Tabs */}
                <div className="border-b border-[#E5E7EB]">
                  <div className="flex gap-6 justify-center">
                    <button
                      onClick={() =>
                        handleUploadTabChange("artifact")
                      }
                      disabled={addPagesMode}
                      className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${
                        uploadTab === "artifact"
                          ? "border-blue-500 text-blue-500"
                          : "border-transparent text-[#6A7282] hover:text-[#4A5565]"
                      } ${addPagesMode ? "opacity-40 cursor-not-allowed hover:text-[#6A7282]" : ""}`}
                      title={
                        addPagesMode
                          ? "Cannot upload artifacts when adding pages to a document"
                          : ""
                      }
                    >
                      Artifact Upload
                    </button>
                    <button
                      onClick={() =>
                        handleUploadTabChange("document")
                      }
                      className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${
                        uploadTab === "document"
                          ? "border-blue-500 text-blue-500"
                          : "border-transparent text-[#6A7282] hover:text-[#4A5565]"
                      }`}
                    >
                      Document Upload
                    </button>
                  </div>
                </div>

                {/* File Upload Section - Artifact */}
                {uploadTab === "artifact" && (
                  <div>
                    <label className="block text-[14px] text-[#364153] mb-2">
                      Digital File{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    {!selectedFile ? (
                      <div className="min-h-[191px] rounded-[14px] border-dashed border-[1.6px] border-[#D1D5DC] bg-white p-6 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <Upload
                            className="w-8 h-8 text-blue-500"
                            strokeWidth={2.67}
                          />
                        </div>
                        <label className="cursor-pointer">
                          <span className="text-[16px] text-blue-500">
                            Click to upload
                          </span>
                          <span className="text-[16px] text-black">
                            {" "}
                            or drag and drop
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".tiff,.tif"
                            onChange={handleFileSelect}
                          />
                        </label>
                        <p className="text-[14px] text-[#4A5565] mt-1">
                          TIFF only (max 500MB)
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-[14px] border-[1.6px] border-[#D1D5DC] bg-white overflow-hidden">
                        {isLoadingPreview ? (
                          <div className="relative bg-gray-50 flex items-center justify-center p-8 min-h-[300px]">
                            <div className="text-center">
                              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                              <p className="text-[14px] text-[#6A7282]">
                                Generating preview...
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="relative bg-gray-50 flex items-center justify-center p-8">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="max-h-[300px] max-w-full object-contain rounded-lg shadow-sm"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center min-h-[300px]">
                                  <FileText
                                    className="w-16 h-16 text-[#6B7280] mb-3"
                                    strokeWidth={1.5}
                                  />
                                  <p className="text-[14px] text-[#6A7282]">
                                    Preview not available
                                  </p>
                                  <p className="text-[12px] text-[#6B7280] mt-1">
                                    File metadata shown below
                                  </p>
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  setImagePreview(null);
                                  setImageDimensions(null);
                                  setFileSize(null);
                                  setSelectedFile(null);
                                }}
                                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <X className="w-5 h-5 text-gray-600" />
                              </button>
                            </div>
                            <div className="p-4 border-t border-gray-200 bg-white">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[12px] text-[#6A7282] mb-1">
                                    File Name
                                  </p>
                                  <p className="text-[14px] text-[#364153] font-medium truncate">
                                    {selectedFile?.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[12px] text-[#6A7282] mb-1">
                                    File Size
                                  </p>
                                  <p className="text-[14px] text-[#364153] font-medium">
                                    {fileSize}
                                  </p>
                                </div>
                                {imageDimensions && (
                                  <div>
                                    <p className="text-[12px] text-[#6A7282] mb-1">
                                      Resolution
                                    </p>
                                    <p className="text-[14px] text-[#364153] font-medium">
                                      {imageDimensions.width} ×{" "}
                                      {imageDimensions.height}{" "}
                                      px
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-[12px] text-[#6A7282] mb-1">
                                    Format
                                  </p>
                                  <p className="text-[14px] text-[#364153] font-medium uppercase">
                                    {selectedFile?.name
                                      .split(".")
                                      .pop()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* File Upload Section - Document (Batch) */}
                {uploadTab === "document" && (
                  <div>
                    <label className="block text-[14px] text-[#364153] mb-2">
                      Digital Files{" "}
                      <span className="text-red-600">*</span>
                      <span className="text-[12px] text-[#6A7282] ml-2">
                        (Batch upload supported)
                      </span>
                    </label>
                    {selectedFiles.length === 0 ? (
                      <div className="min-h-[191px] rounded-[14px] border-dashed border-[1.6px] border-[#D1D5DC] bg-white p-6 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <Upload
                            className="w-8 h-8 text-blue-500"
                            strokeWidth={2.67}
                          />
                        </div>
                        <label className="cursor-pointer">
                          <span className="text-[16px] text-blue-500">
                            Click to upload
                          </span>
                          <span className="text-[16px] text-black">
                            {" "}
                            or drag and drop
                          </span>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            accept=".tiff,.tif"
                            onChange={handleFileSelect}
                          />
                        </label>
                        <p className="text-[14px] text-[#4A5565] mt-1">
                          TIFF only (max 500MB per file)
                        </p>
                        <p className="text-[12px] text-[#6A7282] mt-1">
                          Select multiple files for batch upload
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-[14px] border-[1.6px] border-[#D1D5DC] bg-white overflow-hidden">
                        {isLoadingPreview ? (
                          <div className="p-8 flex items-center justify-center min-h-[200px]">
                            <div className="text-center">
                              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                              <p className="text-[14px] text-[#6A7282]">
                                Generating previews...
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Preview Thumbnails */}
                            {documentPreviews.length > 0 && (
                              <div className="p-4 border-b border-gray-200">
                                <p className="text-[12px] text-[#6A7282] mb-3">
                                  File Previews
                                </p>
                                <div className="grid grid-cols-4 gap-3">
                                  {documentPreviews.map(
                                    (preview, index) => (
                                      <div
                                        key={index}
                                        className="relative aspect-square bg-gray-50 rounded-[8px] border border-[#E5E7EB] overflow-hidden group"
                                      >
                                        <img
                                          src={preview.url}
                                          alt={`Preview ${index + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                        <div
                                          onClick={() =>
                                            setFullScreenPreview(
                                              {
                                                url: preview.url,
                                                index,
                                              },
                                            )
                                          }
                                          className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center cursor-pointer"
                                        >
                                          <span className="text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 bg-black/60 px-2 py-1 rounded">
                                            {preview.width} ×{" "}
                                            {preview.height}
                                          </span>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                            {/* File List */}
                            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                              {selectedFiles.map(
                                (file, index) => (
                                  <div
                                    key={index}
                                    draggable
                                    onDragStart={() =>
                                      handleDragStart(index)
                                    }
                                    onDragOver={(e) =>
                                      handleDragOver(e, index)
                                    }
                                    onDragEnd={handleDragEnd}
                                    className={`flex items-center justify-between p-3 bg-gray-50 rounded-[10px] border border-[#E5E7EB] cursor-move transition-opacity ${
                                      draggedFileIndex === index
                                        ? "opacity-50"
                                        : "opacity-100"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="flex flex-col gap-0.5">
                                        <div className="w-1 h-1 bg-[#9CA3AF] rounded-full"></div>
                                        <div className="w-1 h-1 bg-[#9CA3AF] rounded-full"></div>
                                        <div className="w-1 h-1 bg-[#9CA3AF] rounded-full"></div>
                                      </div>
                                      {documentPreviews[
                                        index
                                      ] ? (
                                        <div className="w-10 h-10 rounded border border-[#E5E7EB] overflow-hidden flex-shrink-0">
                                          <img
                                            src={
                                              documentPreviews[
                                                index
                                              ].url
                                            }
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      ) : (
                                        <FileText
                                          className="w-5 h-5 text-[#6A7282] flex-shrink-0"
                                          strokeWidth={1.33}
                                        />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[14px] text-[#364153] font-medium truncate">
                                          {file.name}
                                        </p>
                                        <p className="text-[12px] text-[#6A7282]">
                                          {(
                                            file.size /
                                            (1024 * 1024)
                                          ).toFixed(2)}{" "}
                                          MB
                                          {documentPreviews[
                                            index
                                          ] && (
                                            <>
                                              {" "}
                                              •{" "}
                                              {
                                                documentPreviews[
                                                  index
                                                ].width
                                              }{" "}
                                              ×{" "}
                                              {
                                                documentPreviews[
                                                  index
                                                ].height
                                              }{" "}
                                              px
                                            </>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-2">
                                        <label className="text-[12px] text-[#6A7282] whitespace-nowrap">
                                          Page:
                                        </label>
                                        <input
                                          type="number"
                                          min="1"
                                          value={
                                            pageNumbers[
                                              index
                                            ] !== null &&
                                            pageNumbers[
                                              index
                                            ] !== undefined
                                              ? pageNumbers[
                                                  index
                                                ]
                                              : ""
                                          }
                                          onChange={(e) =>
                                            handlePageNumberChange(
                                              index,
                                              e.target.value,
                                            )
                                          }
                                          onBlur={() =>
                                            handlePageNumberBlur(
                                              index,
                                            )
                                          }
                                          onClick={(e) =>
                                            e.stopPropagation()
                                          }
                                          className={`w-16 h-8 px-2 border-[0.8px] rounded-[6px] bg-white text-[14px] text-[#364153] text-center focus:outline-none focus:ring-1 ${
                                            pageNumbers[
                                              index
                                            ] &&
                                            (pageNumbers.filter(
                                              (n) =>
                                                n ===
                                                pageNumbers[
                                                  index
                                                ],
                                            ).length > 1 ||
                                              isPageNumberTaken(
                                                pageNumbers[
                                                  index
                                                ],
                                              ))
                                              ? "border-red-500 focus:ring-red-500"
                                              : "border-[#D1D5DC] focus:ring-blue-500"
                                          }`}
                                          title={
                                            pageNumbers[
                                              index
                                            ] &&
                                            isPageNumberTaken(
                                              pageNumbers[
                                                index
                                              ],
                                            )
                                              ? `Page ${pageNumbers[index]} already exists for this document`
                                              : pageNumbers[
                                                    index
                                                  ] &&
                                                  pageNumbers.filter(
                                                    (n) =>
                                                      n ===
                                                      pageNumbers[
                                                        index
                                                      ],
                                                  ).length > 1
                                                ? "Duplicate page number in this batch"
                                                : ""
                                          }
                                        />
                                      </div>
                                      <button
                                        onClick={() => {
                                          const newFiles =
                                            selectedFiles.filter(
                                              (_, i) =>
                                                i !== index,
                                            );
                                          const newPreviews =
                                            documentPreviews.filter(
                                              (_, i) =>
                                                i !== index,
                                            );
                                          const newPageNumbers =
                                            pageNumbers.filter(
                                              (_, i) =>
                                                i !== index,
                                            );
                                          setSelectedFiles(
                                            newFiles,
                                          );
                                          setDocumentPreviews(
                                            newPreviews,
                                          );
                                          setPageNumbers(
                                            newPageNumbers,
                                          );
                                        }}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                                      >
                                        <X className="w-4 h-4 text-[#6A7282]" />
                                      </button>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                            <div className="p-4 border-t border-gray-200 bg-white">
                              <p className="text-[14px] text-[#364153]">
                                <span className="font-medium">
                                  {selectedFiles.length}
                                </span>{" "}
                                file
                                {selectedFiles.length !== 1
                                  ? "s"
                                  : ""}{" "}
                                selected
                              </p>
                              <p className="text-[12px] text-[#6A7282] mt-1">
                                Drag files to reorder
                              </p>
                              {hasDuplicatePageNumbers() && (
                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                  <AlertCircle
                                    className="w-4 h-4 flex-shrink-0"
                                    strokeWidth={1.67}
                                  />
                                  <p className="text-[12px]">
                                    Duplicate page numbers
                                    detected in this batch.
                                    Please ensure all page
                                    numbers are unique.
                                  </p>
                                </div>
                              )}
                              {hasTakenPageNumbers() && (
                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                  <AlertCircle
                                    className="w-4 h-4 flex-shrink-0"
                                    strokeWidth={1.67}
                                  />
                                  <p className="text-[12px]">
                                    Some page numbers already
                                    exist for this document.
                                    Please use different page
                                    numbers.
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Add Pages Mode Info */}
                {addPagesMode && (
                  <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle
                          className="w-3 h-3 text-white"
                          strokeWidth={2}
                        />
                      </div>
                      <div>
                        <p className="text-[14px] text-blue-900 font-medium">
                          Auto-filling Information
                        </p>
                        <p className="text-[12px] text-blue-700 mt-1">
                          Collection, Project, and all physical
                          information from "{selectedItem?.name}
                          " will be automatically applied. You
                          only need to upload the new page
                          files.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Project (left side) */}
                  <div>
                    <label className="block text-[14px] text-[#364153] mb-2">
                      Project{" "}
                      <span className="text-red-600">*</span>
                      {addPagesMode && (
                        <span className="text-[12px] text-[#6A7282] ml-2">
                          (Auto-filled)
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        value={project}
                        onChange={(e) =>
                          handleProjectChange(e.target.value)
                        }
                        disabled={addPagesMode}
                        className={`w-full h-[42px] px-4 pr-10 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#D1D5DC] ${
                          addPagesMode
                            ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <option value="">Select project</option>
                        <option value="colonial-archives">
                          Colonial Archives Preservation
                        </option>
                        <option value="19th-century-letters">
                          19th Century Letters
                        </option>
                        <option value="portraits-2025">
                          Portraits Collection 2025
                        </option>
                        <option value="archaeological">
                          Archaeological Artifacts Documentation
                        </option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6A7282] opacity-50 pointer-events-none" />
                    </div>
                  </div>

                  {/* Items (right side) */}
                  <div>
                    <label className="block text-[14px] text-[#364153] mb-2">
                      Items{" "}
                      <span className="text-red-600">*</span>
                      {addPagesMode && (
                        <span className="text-[12px] text-[#6A7282] ml-2">
                          (Auto-filled)
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedItemId}
                        onChange={(e) =>
                          setSelectedItemId(e.target.value)
                        }
                        disabled={!project || addPagesMode}
                        className={`w-full h-[42px] px-4 pr-10 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#D1D5DC] ${
                          !project || addPagesMode
                            ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <option value="">
                          {!project
                            ? "Select a project first"
                            : "Select item"}
                        </option>
                        {availableItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6A7282] opacity-50 pointer-events-none" />
                    </div>
                    {!project && (
                      <p className="text-[12px] text-[#6A7282] mt-1">
                        Select a project to view available items
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E5E7EB] px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  // Reset form state when cancelling
                  setTimeout(() => {
                    setSelectedFile(null);
                    setSelectedFiles([]);
                    setImagePreview(null);
                    setImageDimensions(null);
                    setFileSize(null);
                    setDocumentPreviews([]);
                    setIsLoadingPreview(false);
                    setPageNumbers([]);
                    setItemType("");
                    setCollection("");
                    setProject("");
                    setSelectedItemId("");
                    setAvailableItems([]);
                    setFileCheckRun(false);
                    setAddPagesMode(false);
                    setExistingPages([]);
                  }, 200);
                }}
                className="h-10 px-5 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-[14px] text-[#364153] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleAddInformation}
                  disabled={
                    !fileCheckRun ||
                    (uploadTab === "document" &&
                      (hasNullPageNumbers() ||
                        hasDuplicatePageNumbers() ||
                        hasTakenPageNumbers()))
                  }
                  title={
                    !fileCheckRun
                      ? "Please run file check first"
                      : uploadTab === "document" &&
                          hasNullPageNumbers()
                        ? "Please fill all page numbers"
                        : uploadTab === "document" &&
                            hasDuplicatePageNumbers()
                          ? "Duplicate page numbers detected"
                          : uploadTab === "document" &&
                              hasTakenPageNumbers()
                            ? "Page numbers already exist for this document"
                            : "Add information for this item"
                  }
                  className="h-10 px-6 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-[14px] text-[#364153] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Add Information
                </button>
                <button
                  onClick={handleRunFileCheck}
                  disabled={
                    uploadTab === "artifact"
                      ? !selectedFile || !project || !selectedItemId
                      : selectedFiles.length === 0 ||
                        !project ||
                        !selectedItemId ||
                        hasNullPageNumbers() ||
                        hasDuplicatePageNumbers() ||
                        hasTakenPageNumbers()
                  }
                  title={
                    uploadTab === "artifact"
                      ? !selectedFile || !project || !selectedItemId
                        ? "Please upload a file, select project and item"
                        : "Generate Checksum on uploaded file"
                      : selectedFiles.length === 0 || !project || !selectedItemId
                        ? "Please upload files, select project and item"
                        : hasNullPageNumbers()
                          ? "Please fill all page numbers"
                          : hasDuplicatePageNumbers()
                            ? "Duplicate page numbers detected"
                            : hasTakenPageNumbers()
                              ? "Page numbers already exist for this document"
                              : "Generate Checksum on uploaded files"
                  }
                  className="h-10 px-5 bg-green-600 text-white rounded-[10px] shadow-sm hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                >
                  <CheckCircle
                    className="w-4 h-4"
                    strokeWidth={1.33}
                  />
                  <span className="text-[14px]">
                    Generate Checksum
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {isItemDetailsModalOpen && selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsItemDetailsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-[#E5E7EB] px-6 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[20px] text-[#101828]">
                    {selectedItem.name}
                  </h2>
                  <p className="text-[14px] text-[#4A5565] mt-1">
                    {selectedItem.id} •{" "}
                    {selectedItem.collection}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setIsItemDetailsModalOpen(false)
                  }
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-[10px] transition-colors"
                >
                  <X
                    className="w-5 h-5 text-[#4A5565]"
                    strokeWidth={1.67}
                  />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Left Side - Images */}
              <div className="lg:w-[470px] flex-shrink-0">
                {/* Main Image */}
                <div className="border border-[#E5E7EB] rounded-[10px] p-4 mb-4">
                  <div className="aspect-[470/327.6] bg-gray-50 rounded-[5px] border border-[#D1D5DC] flex items-center justify-center">
                    <FileText
                      className="w-16 h-16 text-[#6B7280]"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mb-4">
                  {Array.from({
                    length: selectedItem.numberOfFiles || 1,
                  }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-16 h-16 rounded-[5px] flex items-center justify-center bg-gray-100 ${
                        selectedImageIndex === i
                          ? "border-2 border-[#D1D5DC]"
                          : "border border-[#D1D5DC]"
                      }`}
                    >
                      <span className="text-[10px] text-[#4A5565]">
                        File {i + 1}
                      </span>
                    </button>
                  ))}
                </div>

                {/* File Health */}
                <div className="border border-[#B9F8CF] bg-[#F0FDF4] rounded-[10px] p-4">
                  <h4 className="text-[14px] text-[#008236] mb-1">
                    File Health: {selectedItem.fileHealth}
                  </h4>
                  <p className="text-[12px] text-[#4A5565]">
                    Last checked: {selectedItem.dateAdded}
                  </p>
                </div>
              </div>

              {/* Right Side - Information */}
              <div className="flex-1">
                {/* Tabs */}
                <div className="border-b border-[#E5E7EB] mb-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab("info")}
                      className={`px-1 py-2 text-[14px] border-b-[1.6px] ${
                        activeTab === "info"
                          ? "border-blue-500 text-blue-500"
                          : "border-transparent text-gray-500"
                      }`}
                    >
                      ITEM INFORMATION
                    </button>
                    <button
                      onClick={() => setActiveTab("history")}
                      className={`px-1 py-2 text-[14px] border-b-[1.6px] ${
                        activeTab === "history"
                          ? "border-blue-500 text-blue-500"
                          : "border-transparent text-gray-500"
                      }`}
                    >
                      ACTIVITY HISTORY
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "info" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] text-[#6A7282] mb-1">
                        Project
                      </label>
                      <p className="text-[14px] text-[#101828]">
                        {selectedItem.project}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[12px] text-[#6A7282] mb-1">
                        Collection
                      </label>
                      <p className="text-[14px] text-[#101828]">
                        {selectedItem.collection}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[12px] text-[#6A7282] mb-1">
                        Added By
                      </label>
                      <p className="text-[14px] text-[#101828]">
                        {selectedItem.addedBy}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[12px] text-[#6A7282] mb-1">
                        Date Added
                      </label>
                      <p className="text-[14px] text-[#101828]">
                        {selectedItem.dateAdded}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[12px] text-[#6A7282] mb-1">
                        Resolution
                      </label>
                      <p className="text-[14px] text-[#101828]">
                        {selectedItem.imageQuality}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[12px] text-[#6A7282] mb-1">
                        Review Status
                      </label>
                      <span className="inline-flex items-center h-[22px] px-2 rounded text-[12px] text-[#05DF72] bg-white border border-[rgba(0,201,80,0.3)]">
                        {selectedItem.reviewStatus}
                      </span>
                    </div>
                    <div>
                      <label className="block text-[12px] text-[#6A7282] mb-1">
                        Number of Files
                      </label>
                      <p className="text-[14px] text-[#101828]">
                        {selectedItem.numberOfFiles}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-[14px] text-[#6A7282]">
                      Activity history will be displayed here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E5E7EB] px-6 py-6">
              <div className="flex items-center justify-between">
                <button className="h-10 px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-[14px] text-[#364153] hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download
                    className="w-4 h-4"
                    strokeWidth={1.33}
                  />
                  <span>Export Summary</span>
                </button>
                {selectedItem?.itemType === "Document" && (
                  <button
                    onClick={() =>
                      handleAddMorePages(selectedItem)
                    }
                    className="h-10 px-4 bg-blue-600 text-white rounded-[10px] shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Upload
                      className="w-4 h-4"
                      strokeWidth={1.33}
                    />
                    <span>Add More Pages</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Preview Modal */}
      {fullScreenPreview && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={() => setFullScreenPreview(null)}
        >
          <button
            onClick={() => setFullScreenPreview(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close preview"
          >
            <X className="w-6 h-6 text-white" strokeWidth={2} />
          </button>
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullScreenPreview.url}
              alt={`Full preview ${fullScreenPreview.index + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-[14px]">
              Page {fullScreenPreview.index + 1}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Default export for routing
export { CuratorDigitalArchivesPage as default };