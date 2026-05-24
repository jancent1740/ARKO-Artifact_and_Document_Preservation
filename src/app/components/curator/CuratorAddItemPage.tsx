import React, { useState } from "react";
import { ArrowLeft, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { items } from "../../lib/api";

interface CuratorAddItemPageProps {
  onBack: () => void;
  uploadData?: {
    fileName?: string;
    itemType?: string;
    collection?: string;
    project?: string;
    itemId?: string;
    draftData?: {
      title?: string;
      description?: string;
    };
    existingItemData?: {
      id: string;
      name: string;
      itemType: string;
      project: string;
      collection: string;
    };
    isAddingPages?: boolean;
  };
}

export function CuratorAddItemPage({ onBack, uploadData }: CuratorAddItemPageProps) {
  const [title, setTitle] = useState(
    uploadData?.draftData?.title || uploadData?.fileName?.replace(/\.[^/.]+$/, "") || ""
  );
  const [description, setDescription] = useState(uploadData?.draftData?.description || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for the item.");
      return;
    }
    setSaving(true);
    try {
      const existingId = uploadData?.itemId || uploadData?.existingItemData?.id;

      if (existingId) {
        // Update existing item and mark as published
        await items.update(existingId, {
          title,
          description: description || null,
        });
      } else {
        // Create new item directly as published
        await items.create({
          title,
          description: description || null,
          type_name: (uploadData?.itemType as "artifact" | "document") || "document",
        });
      }

      toast.success("Item published to digital archives!");
      onBack();
    } catch (err: any) {
      toast.error(err.message || "Failed to publish item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-4 lg:px-9 py-6 lg:py-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.33} />
          </button>
          <div>
            <h1 className="text-[24px] lg:text-[30px] leading-[32px] lg:leading-[36px] text-[#101828] mb-1">
              {uploadData?.isAddingPages ? "Add Information" : "Publish Item"}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#4A5565]">
              {uploadData?.isAddingPages
                ? `Adding pages to ${uploadData?.existingItemData?.name || "item"}`
                : `Publish the digitized ${uploadData?.itemType || "item"} to the digital archives`}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-9 py-4 lg:py-9 max-w-3xl">
        {/* Upload context summary */}
        {uploadData && (
          <div className="mb-6 bg-gray-50 rounded-[14px] border-[0.8px] border-[#E5E7EB] p-4 lg:p-6">
            <h3 className="text-[14px] font-medium text-[#101828] mb-3">Uploaded File</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-[13px]">
              {uploadData.fileName && (
                <div><span className="text-[#6A7282]">File:</span> <span className="text-[#364153] font-medium">{uploadData.fileName}</span></div>
              )}
              {uploadData.itemType && (
                <div><span className="text-[#6A7282]">Type:</span> <span className="text-[#364153] font-medium capitalize">{uploadData.itemType}</span></div>
              )}
              {uploadData.collection && (
                <div><span className="text-[#6A7282]">Collection:</span> <span className="text-[#364153] font-medium">{uploadData.collection}</span></div>
              )}
              {uploadData.project && (
                <div><span className="text-[#6A7282]">Project:</span> <span className="text-[#364153] font-medium">{uploadData.project}</span></div>
              )}
              {uploadData.existingItemData && (
                <div><span className="text-[#6A7282]">Item ID:</span> <span className="text-[#364153] font-medium">{uploadData.existingItemData.id}</span></div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Title <span className="text-red-600">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              placeholder="Enter item title"
            />
          </div>

          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC] resize-none"
              placeholder="Enter item description"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-[42px] px-6 bg-black text-white rounded-[10px] text-[14px] font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Globe className="w-4 h-4" strokeWidth={1.33} />}
              {saving ? "Publishing..." : "Publish"}
            </button>
            <button
              onClick={onBack}
              className="h-[42px] px-6 border-[0.8px] border-[#D1D5DC] rounded-[10px] text-[14px] text-[#6A7282] hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
