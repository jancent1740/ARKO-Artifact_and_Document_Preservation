import { useState, useEffect, useCallback } from "react";
import { Plus, FolderPlus, CheckCircle, XCircle, Eye, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { submissions, type Submission } from "../../lib/api";

interface CuratorManageItemsPageProps {
  onNavigate?: (page: string) => void;
}

export function CuratorManageItemsPage({ onNavigate }: CuratorManageItemsPageProps) {
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [pendingItems, setPendingItems] = useState<Submission[]>([]);
  const [approvedItems, setApprovedItems] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const refresh = useCallback(() => {
    Promise.all([
      submissions.list({ status: "Pending" }),
      submissions.list({ status: "Approved" }),
    ]).then(([pending, approved]) => {
      setPendingItems(pending);
      setApprovedItems(approved);
    }).catch((err) => toast.error(err.message));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleApprove = (id: number) => {
    submissions.review(id, "Approved").then(() => {
      toast.success("Item approved and published to digital archives.");
      refresh();
    }).catch((err) => toast.error(err.message));
  };

  const handleReject = (id: number) => {
    submissions.review(id, "Rejected").then(() => {
      toast.success("Item rejected.");
      refresh();
    }).catch((err) => toast.error(err.message));
  };

  const filteredPending = pendingItems.filter(
    (item) =>
      (item.item_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.item_identifier || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.submitted_by_name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredApproved = approvedItems.filter(
    (item) =>
      (item.item_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.item_identifier || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.submitted_by_name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-4 lg:px-9 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-[24px] lg:text-[30px] leading-[32px] lg:leading-[36px] text-[#101828] mb-1">
              Manage Items
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#4A5565]">
              Approve staff submissions, view approved items, and manage collections
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate?.("create-item-draft")}
              className="h-[40px] px-5 bg-black text-white rounded-[10px] text-[14px] font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" strokeWidth={1.33} />
              Add Item Draft
            </button>
            <button
              onClick={() => onNavigate?.("create-collection")}
              className="h-[40px] px-5 border-[0.8px] border-[#D1D5DC] rounded-[10px] text-[14px] text-[#364153] font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FolderPlus className="w-4 h-4" strokeWidth={1.33} />
              Create Collection
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-9 py-4 lg:py-9">
        <div className="flex gap-6 border-b border-[#E5E7EB] mb-6">
          <button
            onClick={() => setTab("pending")}
            className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${tab === "pending" ? "border-black text-black" : "border-transparent text-[#6A7282] hover:text-[#4A5565]"}`}
          >
            Approval Requests {pendingItems.length > 0 && `(${pendingItems.length})`}
          </button>
          <button
            onClick={() => setTab("approved")}
            className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${tab === "approved" ? "border-black text-black" : "border-transparent text-[#6A7282] hover:text-[#4A5565]"}`}
          >
            Approved Items {approvedItems.length > 0 && `(${approvedItems.length})`}
          </button>
        </div>

        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" strokeWidth={1.33} />
          <input
            type="text"
            placeholder="Search by item name or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[42px] pl-10 pr-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
          />
        </div>

        {tab === "pending" && (
          <div className="space-y-4">
            {filteredPending.length === 0 ? (
              <div className="text-center py-16 text-[14px] text-[#6A7282]">
                <FileText className="w-12 h-12 mx-auto mb-3 text-[#D1D5DC]" strokeWidth={1.33} />
                <p>No pending approval requests</p>
              </div>
            ) : (
              filteredPending.map((item) => (
                <div key={item.id} className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[16px] font-medium text-[#101828]">{item.item_title || item.item_identifier || `Submission #${item.id}`}</h3>
                      <p className="text-[13px] text-[#6A7282] mt-1">
                        Submitted by {item.submitted_by_name} · {new Date(item.created_at).toLocaleDateString()} · {item.notes || ""}
                      </p>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                      Pending
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-[13px]">
                    <div><span className="text-[#6A7282]">Item ID:</span> <span className="text-[#364153] font-medium">{item.item_identifier || "—"}</span></div>
                    <div><span className="text-[#6A7282]">Status:</span> <span className="text-[#364153] font-medium capitalize">{item.status}</span></div>
                  </div>

                  {item.notes && (
                    <p className="text-[13px] text-[#4A5565] mb-4">{item.notes}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[#E5E7EB]">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="h-[36px] px-5 bg-green-600 text-white rounded-[8px] text-[13px] font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" strokeWidth={1.33} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="h-[36px] px-5 border-[0.8px] border-[#D1D5DC] rounded-[8px] text-[13px] text-[#6A7282] hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" strokeWidth={1.33} />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "approved" && (
          <div className="space-y-4">
            {filteredApproved.length === 0 ? (
              <div className="text-center py-16 text-[14px] text-[#6A7282]">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-[#D1D5DC]" strokeWidth={1.33} />
                <p>No approved items yet</p>
              </div>
            ) : (
              filteredApproved.map((item) => (
                <div key={item.id} className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[16px] font-medium text-[#101828]">{item.item_title || item.item_identifier || `Submission #${item.id}`}</h3>
                      <p className="text-[13px] text-[#6A7282] mt-1">
                        Approved · Reviewed by {item.reviewed_by_name || "—"} · {item.notes || ""}
                      </p>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-medium">
                      Approved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[12px] uppercase font-semibold text-[#6A7282] tracking-wider mb-3">Submission Info</h4>
                      <div className="space-y-2 text-[13px]">
                        <div><span className="text-[#6A7282]">Item ID:</span> <span className="text-[#364153]">{item.item_identifier || "—"}</span></div>
                        <div><span className="text-[#6A7282]">Submitted by:</span> <span className="text-[#364153]">{item.submitted_by_name}</span></div>
                        <div><span className="text-[#6A7282]">Status:</span> <span className="text-[#364153] capitalize">{item.status}</span></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[12px] uppercase font-semibold text-[#6A7282] tracking-wider mb-3">Review Info</h4>
                      <div className="space-y-2 text-[13px]">
                        <div><span className="text-[#6A7282]">Title:</span> <span className="text-[#364153]">{item.item_title || item.item_identifier || "—"}</span></div>
                        <div><span className="text-[#6A7282]">Reviewed by:</span> <span className="text-[#364153]">{item.reviewed_by_name || "—"}</span></div>
                        <div><span className="text-[#6A7282]">Notes:</span> <span className="text-[#364153]">{item.notes || "—"}</span></div>
                      </div>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                      <h4 className="text-[12px] uppercase font-semibold text-[#6A7282] tracking-wider mb-2">Notes</h4>
                      <p className="text-[13px] text-[#4A5565]">{item.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
