import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { collections as collectionsApi, lookups, type Collection, items } from "../../lib/api";

interface CuratorCreateItemDraftPageProps {
  onBack: () => void;
}

export function CuratorCreateItemDraftPage({ onBack }: CuratorCreateItemDraftPageProps) {
  const [typeName, setTypeName] = useState<"document" | "artifact">("document");
  const [collectionId, setCollectionId] = useState("");
  const [itemName, setItemName] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [description, setDescription] = useState("");
  const [provenance, setProvenance] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [texture, setTexture] = useState("");
  const [color, setColor] = useState("");
  const [remarks, setRemarks] = useState("");
  const [docType, setDocType] = useState("");
  const [artifactType, setArtifactType] = useState("");
  const [authorFirstName, setAuthorFirstName] = useState("");
  const [authorLastName, setAuthorLastName] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [artifactTypes, setArtifactTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      collectionsApi.list(),
      lookups.documentTypes(),
      lookups.artifactTypes(),
    ]).then(([cols, docTypes, artTypes]) => {
      setCollections(cols);
      setDocumentTypes(docTypes);
      setArtifactTypes(artTypes);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSaveDraft = async () => {
    if (!itemName.trim()) {
      toast.error("Item name is required.");
      return;
    }
    if (!acquisitionDate) {
      toast.error("Acquisition date is required.");
      return;
    }
    setSaving(true);
    try {
      await items.create({
        title: itemName,
        type_name: typeName,
        collection_id: collectionId || null,
        acquisition_date: acquisitionDate || null,
        description: description || null,
        provenance: provenance || null,
        height: height ? parseFloat(height) : null,
        width: width ? parseFloat(width) : null,
        length: length ? parseFloat(length) : null,
        texture: texture || null,
        color: color || null,
        remarks: remarks || null,
        document_type: typeName === "document" ? (docType || null) : null,
        artifact_type: typeName === "artifact" ? (artifactType || null) : null,
        author_first_name: authorFirstName || null,
        author_last_name: authorLastName || null,
      });
      toast.success("Item saved as draft successfully!");
      setTypeName("document");
      setCollectionId("");
      setItemName("");
      setAcquisitionDate("");
      setDescription("");
      setProvenance("");
      setHeight("");
      setWidth("");
      setLength("");
      setTexture("");
      setColor("");
      setRemarks("");
      setDocType("");
      setArtifactType("");
      setAuthorFirstName("");
      setAuthorLastName("");
    } catch (err: any) {
      toast.error(err.message || "Failed to save draft");
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
              Create Item Draft
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#4A5565]">
              Fill in item details and save as draft.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-9 py-4 lg:py-9 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">

          {/* Type Name */}
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Type Name <span className="text-red-600">*</span></label>
            <select
              value={typeName}
              onChange={(e) => { setTypeName(e.target.value as "document" | "artifact"); setDocType(""); setArtifactType(""); }}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
            >
              <option value="document">Document</option>
              <option value="artifact">Artifact</option>
            </select>
          </div>

          {/* Collection */}
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Collection</label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
            >
              <option value="">Select collection</option>
              {loading ? (
                <option disabled>Loading...</option>
              ) : (
                collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
              )}
            </select>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Item Name <span className="text-red-600">*</span></label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              maxLength={100}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              placeholder="Enter item name"
            />
          </div>

          {/* Acquisition Date */}
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Acquisition Date <span className="text-red-600">*</span></label>
            <input
              type="datetime-local"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
            />
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label className="block text-[14px] text-[#364153] mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC] resize-none"
              placeholder="Enter description"
            />
          </div>

          {/* Provenance */}
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Provenance</label>
            <input
              type="text"
              value={provenance}
              onChange={(e) => setProvenance(e.target.value)}
              maxLength={255}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              placeholder="Provenance (max 255 chars)"
            />
          </div>

          {/* Author First Name */}
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Author First Name</label>
            <input
              type="text"
              value={authorFirstName}
              onChange={(e) => setAuthorFirstName(e.target.value)}
              maxLength={50}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              placeholder="Author first name"
            />
          </div>

          {/* Author Last Name */}
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Author Last Name</label>
            <input
              type="text"
              value={authorLastName}
              onChange={(e) => setAuthorLastName(e.target.value)}
              maxLength={50}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
              placeholder="Author last name"
            />
          </div>

          {/* Dimensions */}
          <div className="lg:col-span-2">
            <label className="block text-[14px] text-[#364153] mb-2">Dimensions (cm)</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] text-[#6A7282] mb-1">Height</label>
                <input type="number" step="0.01" min="0" value={height} onChange={(e) => setHeight(e.target.value)}
                  className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-[12px] text-[#6A7282] mb-1">Width</label>
                <input type="number" step="0.01" min="0" value={width} onChange={(e) => setWidth(e.target.value)}
                  className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-[12px] text-[#6A7282] mb-1">Length</label>
                <input type="number" step="0.01" min="0" value={length} onChange={(e) => setLength(e.target.value)}
                  className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]" placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Texture */}
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Texture</label>
            <input type="text" value={texture} onChange={(e) => setTexture(e.target.value)} maxLength={25}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]" placeholder="Texture (max 25 chars)" />
          </div>

          {/* Color */}
          <div>
            <label className="block text-[14px] text-[#364153] mb-2">Color</label>
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} maxLength={50}
              className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]" placeholder="Color (max 50 chars)" />
          </div>

          {/* Document Type */}
          {typeName === "document" && (
            <div>
              <label className="block text-[14px] text-[#364153] mb-2">Document Type</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value)}
                className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]">
                <option value="">Select document type</option>
                {documentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {/* Artifact Type */}
          {typeName === "artifact" && (
            <div>
              <label className="block text-[14px] text-[#364153] mb-2">Artifact Type</label>
              <select value={artifactType} onChange={(e) => setArtifactType(e.target.value)}
                className="w-full h-[42px] px-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]">
                <option value="">Select artifact type</option>
                {artifactTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {/* Remarks */}
          <div className="lg:col-span-2">
            <label className="block text-[14px] text-[#364153] mb-2">Remarks</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} maxLength={255} rows={2}
              className="w-full px-4 py-3 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC] resize-none"
              placeholder="Remarks (max 255 chars)" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-[#E5E7EB]">
          <button onClick={handleSaveDraft} disabled={saving}
            className="h-[42px] px-6 bg-black text-white rounded-[10px] text-[14px] font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.33} />}
            {saving ? "Saving..." : "Save as Draft"}
          </button>
          <button onClick={onBack}
            className="h-[42px] px-6 border-[0.8px] border-[#D1D5DC] rounded-[10px] text-[14px] text-[#6A7282] hover:bg-gray-50 transition-colors flex items-center justify-center">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
