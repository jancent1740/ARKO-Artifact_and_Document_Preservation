import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { items, collections as collectionsApi, type Item } from "../../lib/api";

interface CuratorCreateCollectionPageProps {
  onBack: () => void;
}

export function CuratorCreateCollectionPage({ onBack }: CuratorCreateCollectionPageProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [availableDraftItems, setAvailableDraftItems] = useState<Item[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    items.list({ status: "Draft" }).then((res) => {
      setAvailableDraftItems(res.items);
    }).catch((err) => toast.error(err.message));
  }, []);

  const handleToggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a collection name.");
      return;
    }
    setSaving(true);
    try {
      const result = await collectionsApi.create({
        collectionName: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success(`Collection "${name}" created successfully!`);
      onBack();
    } catch (err: any) {
      toast.error(err.message || "Failed to create collection");
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
              Create Collection
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#4A5565]">
              Group draft items into a collection for digitization projects.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-9 py-4 lg:py-9 max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Collection Name <span className="text-red-600">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              placeholder="e.g. Historical Maps"
            />
          </div>

          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC] resize-none"
              placeholder="Describe the collection's scope and contents"
            />
          </div>

          <div>
            <label className="block text-[14px] text-[#364153] mb-2">
              Select Draft Items <span className="text-red-600">*</span>
            </label>
            <p className="text-[12px] text-[#6A7282] mb-3">
              Choose draft items to include in this collection. {selectedItems.length} selected.
            </p>
            <div className="border-[0.8px] border-[#D1D5DC] rounded-[10px] max-h-[300px] overflow-y-auto divide-y divide-[#E5E7EB]">
              {availableDraftItems.map((item) => (
                <label
                  key={item.item_identifier}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.item_identifier)}
                    onChange={() => handleToggleItem(item.item_identifier)}
                    className="w-4 h-4 rounded border-[#D1D5DC] text-black focus:ring-1 focus:ring-gray-400"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] text-gray-900">{item.title}</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-[#6A7282] bg-gray-100 px-2 py-0.5 rounded-full">
                    {item.type_name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-[42px] px-6 bg-black text-white rounded-[10px] text-[14px] font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FolderPlus className="w-4 h-4" strokeWidth={1.33} />
              {saving ? "Saving..." : "Save Collection"}
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
