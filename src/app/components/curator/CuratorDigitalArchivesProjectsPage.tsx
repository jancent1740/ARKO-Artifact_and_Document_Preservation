import React, { useState, useEffect } from "react";
import {
  Eye,
  Plus,
  Calendar,
  FolderOpen,
  X,
  Edit2,
  FolderPlus,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { CuratorSidebar } from "./CuratorSidebar";
import { CuratorStatusBadge } from "./CuratorStatusBadge";
import { toast } from "sonner";

import { items, collections, programs, users, type Item, type Collection, type Program, type User, type ProgramDetail } from "../../lib/api";

interface Project {
  id: string;
  name: string;
  description: string;
  staff: { initials: string; color: string; name: string }[];
  collections: string[];
  progress: {
    current: number;
    total?: number;
    percentage?: number;
  };
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "On Hold" | "Expired";
  projectType: "collection-based" | "non-collection-based";
  isExpired?: boolean;
}

interface ProjectItem {
  id: string;
  name: string;
  project: string;
  collection: string;
  addedBy: string;
  dateAdded: string;
}

/**
 * CuratorDigitalArchivesProjectsPage
 * Projects management page for Digital Archives section
 */
export function CuratorDigitalArchivesProjectsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isItemDetailsModalOpen, setIsItemDetailsModalOpen] =
    useState(false);
  const [isMarkCompleteModalOpen, setIsMarkCompleteModalOpen] =
    useState(false);
  const [isExtendTimelineModalOpen, setIsExtendTimelineModalOpen] =
    useState(false);
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);
  const [selectedItem, setSelectedItem] =
    useState<ProjectItem | null>(null);
  const [extensionDays, setExtensionDays] = useState<number>(30);

  // Form state for Add/Edit Project
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    collections: [] as string[],
    staff: [] as string[],
    items: [] as string[],
    startDate: "",
    endDate: "",
    projectType: "collection-based" as "collection-based" | "non-collection-based",
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);
  const [availableStaff, setAvailableStaff] = useState<{ id: string; name: string }[]>([]);
  const [availableItems, setAvailableItems] = useState<Array<{ id: string; name: string; addedBy: string }>>([]);
  const [loading, setLoading] = useState(false);

  const loadProjects = () => {
    Promise.all([
      programs.list(),
      collections.list(),
      users.staff(),
      items.list(),
    ]).then(([programsData, collectionsData, staffData, allItems]) => {
      const mappedProjects: Project[] = programsData.map((p: Program) => ({
        id: String(p.id),
        name: p.name,
        description: p.description || "",
        staff: [],
        collections: [],
        progress: { current: p.item_count || 0 },
        startDate: p.start_date || "",
        endDate: p.end_date || "",
        status: (p.status as Project["status"]) || "Active",
        projectType: p.program_type === "manual" ? "non-collection-based" as const : "collection-based" as const,
      }));
      setProjects(mappedProjects);
      setAvailableCollections(collectionsData.map((c: Collection) => c.name));
      setAvailableStaff(staffData.map((u: User) => ({ id: String(u.id), name: u.full_name })));
      setAvailableItems(
        allItems.items.map((item: Item) => ({
          id: String(item.id),
          name: item.title,
          addedBy: item.created_by_name || "",
        }))
      );
    }).catch((err) => toast.error(err.message));

    items.list().then((res) => {
      setProjectItems(
        res.items.map((item: Item) => ({
          id: item.item_identifier,
          name: item.title,
          project: "",
          collection: item.collection_name || "",
          addedBy: item.created_by_name || "",
          dateAdded: new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          }),
        }))
      );
    }).catch((err) => toast.error(err.message));
  };

  useEffect(() => { loadProjects(); }, []);

  const handleViewProject = async (project: Project) => {
    try {
      const detail = await programs.get(Number(project.id));
      setSelectedProject({
        ...project,
        staff: detail.staff.map((s: any) => ({
          initials: (s.full_name || '').split(' ').map((p: string) => p[0]).join('').toUpperCase(),
          color: '#6366f1',
          name: s.full_name,
        })),
        collections: detail.collections.map((c: any) => c.name),
      });
    } catch {
      setSelectedProject(project);
    }
    setIsDetailsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      projectName: project.name,
      description: project.description,
      collections: project.collections,
      staff: project.staff.map((s) => s.name),
      items: [],
      startDate: project.startDate,
      endDate: project.endDate,
      projectType: project.projectType,
    });
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleCreateProject = async () => {
    if (!formData.projectName.trim()) {
      toast.error("Project name is required.");
      return;
    }
    if (formData.projectType === "collection-based" && formData.collections.length === 0) {
      toast.error("Select at least one collection.");
      return;
    }
    setLoading(true);
    try {
      const result = await programs.create({
        name: formData.projectName,
        description: formData.description || undefined,
        program_type: formData.projectType === "collection-based" ? "collection-based" : "manual",
        start_date: formData.startDate || undefined,
        end_date: formData.endDate || undefined,
      });

      // Assign selected staff
      for (const staffEntry of formData.staff) {
        const staffMember = availableStaff.find((s) => s.name === staffEntry);
        if (staffMember) {
          await programs.assignStaff(Number(result.id), Number(staffMember.id)).catch(() => {});
        }
      }

      // Save selected collections (collection-based)
      if (formData.projectType === "collection-based") {
        const allCollections = await collections.list();
        for (const collectionName of formData.collections) {
          const col = allCollections.find((c: Collection) => c.name === collectionName);
          if (col) {
            await programs.addCollection(Number(result.id), col.id).catch(() => {});
          }
        }
      }

      // Save selected items (non-collection-based)
      if (formData.projectType === "non-collection-based" || formData.projectType === "manual") {
        for (const itemId of formData.items) {
          await programs.addItem(Number(result.id), Number(itemId)).catch(() => {});
        }
      }

      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Project Created!</p>
            <p className="text-sm text-gray-600">Your new project has been successfully created.</p>
          </div>
        </div>,
        { duration: 3000, style: { background: "white", border: "1px solid #e5e7eb", padding: "16px" } },
      );
      setIsAddModalOpen(false);
      resetForm();
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;
    if (!formData.projectName.trim()) {
      toast.error("Project name is required.");
      return;
    }
    setLoading(true);
    try {
      await programs.update(Number(selectedProject.id), {
        name: formData.projectName,
        description: formData.description || undefined,
        program_type: formData.projectType === "collection-based" ? "collection-based" : "manual",
        start_date: formData.startDate || undefined,
        end_date: formData.endDate || undefined,
      });

      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Project Updated!</p>
            <p className="text-sm text-gray-600">Project changes have been saved successfully.</p>
          </div>
        </div>,
        { duration: 3000, style: { background: "white", border: "1px solid #e5e7eb", padding: "16px" } },
      );
      setIsEditModalOpen(false);
      resetForm();
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      projectName: "",
      description: "",
      collections: [],
      staff: [],
      items: [],
      startDate: "",
      endDate: "",
      projectType: "collection-based",
    });
  };

  const handleMarkComplete = async () => {
    if (!selectedProject) return;
    try {
      await programs.update(Number(selectedProject.id), { status: "Completed" });
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Project Completed!</p>
            <p className="text-sm text-gray-600">{selectedProject.name} has been marked as complete.</p>
          </div>
        </div>,
        { duration: 3000, style: { background: "white", border: "1px solid #e5e7eb", padding: "16px" } }
      );
      setIsMarkCompleteModalOpen(false);
      setSelectedProject(null);
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to mark complete");
    }
  };

  const handleExtendTimeline = async () => {
    if (!selectedProject) return;
    const currentEndDate = selectedProject.endDate ? new Date(selectedProject.endDate) : new Date();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + extensionDays);
    const newEndDateStr = newEndDate.toISOString().split("T")[0];
    try {
      await programs.update(Number(selectedProject.id), { status: "Active", end_date: newEndDateStr });
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Timeline Extended!</p>
            <p className="text-sm text-gray-600">Project deadline extended by {extensionDays} days.</p>
          </div>
        </div>,
        { duration: 3000, style: { background: "white", border: "1px solid #e5e7eb", padding: "16px" } }
      );
      setIsExtendTimelineModalOpen(false);
      setSelectedProject(null);
      setExtensionDays(30);
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to extend timeline");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="px-4 lg:px-9 py-8 lg:py-9 border-b border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl lg:text-[30px] leading-9 text-[#101828]">
              Projects
            </h1>
            <p className="text-sm lg:text-base leading-6 text-[#4A5565]">
              Create and monitor digitization projects
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-12 px-6 bg-black text-white rounded-[10px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 w-full lg:w-auto"
          >
            <Plus className="w-5 h-5" strokeWidth={1.67} />
            <span className="text-base leading-6">
              Create New Project
            </span>
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="px-4 lg:px-9 py-6">
        <div className="rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] bg-white overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-[0.8px] border-[#E5E7EB] bg-white">
                <th className="py-6 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Project Name
                </th>
                <th className="py-6 px-6 text-center text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Type
                </th>
                <th className="py-6 px-6 text-center text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Assigned Staff
                </th>
                <th className="py-6 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Collections
                </th>
                <th className="py-6 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Progress
                </th>
                <th className="py-6 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Timeline
                </th>
                <th className="py-6 px-6 text-left text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Status
                </th>
                <th className="py-6 px-6 text-center text-[12px] uppercase font-bold text-[#4A5565] tracking-[0.6px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={project.id}
                  className={`${
                    index !== projects.length - 1
                      ? "border-b-[0.8px] border-[#E5E7EB]"
                      : ""
                  } hover:bg-gray-50/50 transition-colors`}
                >
                  {/* Project Name */}
                  <td data-label="Project Name" className="py-6 px-6">
                    <div className="flex flex-col gap-1">
                      <p className="text-[14px] text-[#101828]">
                        {project.name}
                      </p>
                      <p className="text-[12px] text-[#4A5565]">
                        {project.description}
                      </p>
                    </div>
                  </td>

                  {/* Project Type */}
                  <td data-label="Type" className="py-6 px-6">
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 text-[11px] rounded ${
                        project.projectType === "collection-based"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}>
                        {project.projectType === "collection-based" ? "Collection" : "Non-Collection"}
                      </span>
                    </div>
                  </td>

                  {/* Staff Avatars */}
                  <td data-label="Staff" className="py-6 px-6">
                    <div className="flex items-center justify-center gap-[-8px]">
                      {project.staff.map((staff, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] font-bold border-2 border-white shadow-sm"
                          style={{
                            backgroundColor: staff.color,
                            marginLeft: idx > 0 ? "-8px" : "0",
                            zIndex: project.staff.length - idx,
                            textShadow:
                              "0 1px 3px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.8)",
                          }}
                        >
                          {staff.initials}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Collections */}
                  <td data-label="Collections" className="py-6 px-6">
                    {project.collections.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {project.collections
                          .slice(0, 3)
                          .map((collection, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-[12px] text-[#1E40AF] bg-white border border-[rgba(59,130,246,0.2)] rounded"
                            >
                              {collection}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <span className="text-[12px] text-[#6B7280] italic">No collection</span>
                    )}
                  </td>

                  {/* Progress */}
                  <td data-label="Progress" className="py-6 px-6">
                    {project.projectType === "collection-based" ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-medium text-[#101828]">
                          {project.progress.current}
                        </span>
                        <span className="text-[12px] text-[#4A5565]">
                          items uploaded
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] text-[#4A5565]">
                            {project.progress.percentage}%
                          </span>
                          <span className="text-[12px] text-[#4A5565]">
                            {project.progress.current}/
                            {project.progress.total}
                          </span>
                        </div>
                        <div className="w-[128px] h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#05DF72]"
                            style={{
                              width: `${project.progress.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Timeline */}
                  <td data-label="Timeline" className="py-6 px-6">
                    {project.projectType === "non-collection-based" ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-[14px] text-[#101828]">
                          {formatDate(project.startDate)}
                        </p>
                        <p className="text-[12px] text-[#4A5565]">
                          to {formatDate(project.endDate)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[12px] text-[#6B7280] italic">No timeline</span>
                    )}
                  </td>

                  {/* Status */}
                  <td data-label="Status" className="py-6 px-6">
                    <CuratorStatusBadge
                      status={project.status}
                    />
                  </td>

                  {/* Actions */}
                  <td data-label="Actions" className="py-6 px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          handleViewProject(project)
                        }
                        className="w-[34px] h-[34px] border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label={`View project ${project.name}`}
                      >
                        <Eye
                          className="w-4 h-4 text-[#6A7282]"
                          strokeWidth={1.33}
                        />
                      </button>

                      {/* Mark Complete button for collection-based projects */}
                      {project.projectType === "collection-based" &&
                       project.status === "Active" && (
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setIsMarkCompleteModalOpen(true);
                          }}
                          className="w-[34px] h-[34px] border-[0.8px] border-[#059669] rounded-[10px] bg-white flex items-center justify-center hover:bg-green-50 transition-colors"
                          aria-label={`Mark ${project.name} as complete`}
                        >
                          <CheckCircle
                            className="w-4 h-4 text-[#059669]"
                            strokeWidth={1.33}
                          />
                        </button>
                      )}

                      {/* Extend Timeline button for expired non-collection projects */}
                      {project.projectType === "non-collection-based" &&
                       project.status === "Expired" && (
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setIsExtendTimelineModalOpen(true);
                          }}
                          className="w-[34px] h-[34px] border-[0.8px] border-[#DC2626] rounded-[10px] bg-white flex items-center justify-center hover:bg-red-50 transition-colors"
                          aria-label={`Extend timeline for ${project.name}`}
                        >
                          <Clock
                            className="w-4 h-4 text-[#DC2626]"
                            strokeWidth={1.33}
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-[672px] max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FolderPlus className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />
                  <div>
                    <h2 className="text-[20px] leading-7 text-[#101828]">
                      Add New Project
                    </h2>
                    <p className="text-[14px] leading-5 text-[#4A5565] mt-1">
                      Create a digitization project
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              {/* Project Name */}
              <div>
                <label htmlFor="project-name" className="block text-[14px] text-[#4A5565] mb-2">
                  Project Name{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  id="project-name"
                  type="text"
                  placeholder="e.g., Colonial Archives Preservation"
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      projectName: e.target.value,
                    })
                  }
                  className="w-full h-[42px] px-3 border border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="project-description" className="block text-[14px] text-[#4A5565] mb-2">
                  Description
                </label>
                <textarea
                  id="project-description"
                  placeholder="Describe the project's goals and scope..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC] resize-none"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-[14px] text-[#4A5565] mb-2">
                  Project Type{" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-[10px] border border-[#D1D5DC] transition-colors">
                    <input
                      type="radio"
                      name="projectType"
                      value="collection-based"
                      checked={formData.projectType === "collection-based"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectType: e.target.value as "collection-based" | "non-collection-based",
                        })
                      }
                      className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-1 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-[14px] font-medium text-gray-900">
                        Collection-Based Project
                      </span>
                      <p className="text-[12px] text-[#6A7282] mt-1">
                        For items in existing collections. Incremental progress tracking. Curator decides when complete.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-[10px] border border-[#D1D5DC] transition-colors">
                    <input
                      type="radio"
                      name="projectType"
                      value="non-collection-based"
                      checked={formData.projectType === "non-collection-based"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectType: e.target.value as "collection-based" | "non-collection-based",
                        })
                      }
                      className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-1 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-[14px] font-medium text-gray-900">
                        Non-Collection Project
                      </span>
                      <p className="text-[12px] text-[#6A7282] mt-1">
                        For items without collections. Fixed timeline with start/end dates. Auto-expires if not completed on time.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Collections - Only for collection-based projects */}
              {formData.projectType === "collection-based" && (
                <div>
                  <label className="block text-[14px] text-[#4A5565] mb-2">
                    Collections{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <div className={`border rounded-[10px] p-3 max-h-[180px] overflow-y-auto space-y-2 ${
                    formData.collections.length === 0 ? 'border-red-300 bg-red-50/30' : 'border-[#D1D5DC]'
                  }`}>
                    {availableCollections.map((collection) => (
                      <label
                        key={collection}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-[6px] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.collections.includes(collection)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                collections: [...formData.collections, collection],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                collections: formData.collections.filter(
                                  (c) => c !== collection
                                ),
                              });
                            }
                          }}
                          className="w-4 h-4 rounded border-[#D1D5DC] text-blue-600 focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-[14px] text-gray-900">
                          {collection}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formData.collections.length === 0 ? (
                    <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠</span> At least one collection must be selected
                    </p>
                  ) : (
                    <p className="text-[12px] text-[#6A7282] mt-1">
                      {formData.collections.length} selected
                    </p>
                  )}
                </div>
              )}

              {/* Items - Only for non-collection projects */}
              {formData.projectType === "non-collection-based" && (
                <div>
                  <label className="block text-[14px] text-[#4A5565] mb-2">
                    Items{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <div className={`border rounded-[10px] p-3 max-h-[200px] overflow-y-auto space-y-2 ${
                    formData.items.length === 0 ? 'border-red-300 bg-red-50/30' : 'border-[#D1D5DC]'
                  }`}>
                    {availableItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-[6px] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.items.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                items: [...formData.items, item.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                items: formData.items.filter(
                                  (i) => i !== item.id
                                ),
                              });
                            }
                          }}
                          className="mt-0.5 w-4 h-4 rounded border-[#D1D5DC] text-blue-600 focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="text-[14px] text-gray-900 block">
                            {item.name}
                          </span>
                          <span className="text-[12px] text-[#6A7282]">
                            {item.id} • Added by {item.addedBy}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formData.items.length === 0 ? (
                    <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠</span> At least one item must be selected
                    </p>
                  ) : (
                    <p className="text-[12px] text-[#6A7282] mt-1">
                      {formData.items.length} selected
                    </p>
                  )}
                </div>
              )}

              {/* Assigned Staff */}
              <div>
                <label className="block text-[14px] text-[#4A5565] mb-2">
                  Assigned Staff{" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className={`border rounded-[10px] p-3 max-h-[140px] overflow-y-auto space-y-2 ${
                  formData.staff.length === 0 ? 'border-red-300 bg-red-50/30' : 'border-[#D1D5DC]'
                }`}>
                  {availableStaff.map((staffMember) => (
                    <label
                      key={staffMember.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-[6px] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.staff.some((s) => (typeof s === 'string' ? s : s.id) === staffMember.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              staff: [...formData.staff, staffMember],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              staff: formData.staff.filter(
                                (s) => (typeof s === 'string' ? s : s.id) !== staffMember.id
                              ),
                            });
                          }
                        }}
                        className="w-4 h-4 rounded border-[#D1D5DC] text-blue-600 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-[14px] text-gray-900">
                        {staffMember.name}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.staff.length === 0 ? (
                  <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1">
                    <span>⚠</span> At least one staff member must be assigned
                  </p>
                ) : (
                  <p className="text-[12px] text-[#6A7282] mt-1">
                    {formData.staff.length} assigned
                  </p>
                )}
              </div>

              {/* Date Fields - Required for non-collection, optional for collection-based */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="project-start-date" className="block text-[14px] text-[#4A5565] mb-2">
                    Start Date{" "}
                    {formData.projectType === "non-collection-based" && (
                      <span className="text-red-600">*</span>
                    )}
                  </label>
                  <input
                    id="project-start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full h-[42px] px-3 border border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
                  />
                </div>
                <div>
                  <label htmlFor="project-end-date" className="block text-[14px] text-[#4A5565] mb-2">
                    End Date{" "}
                    {formData.projectType === "non-collection-based" && (
                      <span className="text-red-600">*</span>
                    )}
                  </label>
                  <input
                    id="project-end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full h-[42px] px-3 border border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
                  />
                </div>
              </div>
              {formData.projectType === "non-collection-based" && (
                <p className="text-[12px] text-[#6A7282] -mt-2">
                  ⚠️ Timeline is required. Project will auto-expire if not completed by end date.
                </p>
              )}
            </div>

            {/* Modal Footer - Fixed */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={
                  (formData.projectType === "collection-based" &&
                   (formData.collections.length === 0 || formData.staff.length === 0)) ||
                  (formData.projectType === "non-collection-based" &&
                   (formData.items.length === 0 || formData.staff.length === 0 || !formData.startDate || !formData.endDate))
                }
                className="h-10 px-4 bg-black text-white rounded-[10px] shadow-sm hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {isDetailsModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-[896px] max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FolderOpen className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />
                  <div>
                    <h2 className="text-[20px] leading-7 text-[#101828]">
                      {selectedProject.name}
                    </h2>
                    <p className="text-[14px] leading-5 text-[#4A5565] mt-1">
                      {selectedProject.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CuratorStatusBadge
                    status={selectedProject.status}
                  />
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#4A5565]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              {/* Description */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#4A5565] mb-2">
                  Description
                </h3>
                <p className="text-[14px] text-[#101828]">
                  {selectedProject.description}
                </p>
              </div>

              {/* Progress Section */}
              <div className="border border-[#E5E7EB] rounded-[10px] p-4">
                {selectedProject.projectType === "collection-based" ? (
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#4A5565] mb-3">
                      Progress
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[32px] font-bold text-[#101828]">
                        {selectedProject.progress.current}
                      </span>
                      <span className="text-[14px] text-[#6A7282]">
                        items uploaded
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-semibold text-[#4A5565]">
                        Progress
                      </h3>
                      <span className="text-[16px] font-semibold text-[#101828]">
                        {selectedProject.progress.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-black"
                        style={{
                          width: `${selectedProject.progress.percentage}%`,
                        }}
                      />
                    </div>
                    <p className="text-[12px] text-[#6A7282]">
                      {selectedProject.progress.current} of{" "}
                      {selectedProject.progress.total} items
                      completed
                    </p>
                  </div>
                )}
              </div>

              {/* Timeline - Only for non-collection projects */}
              {selectedProject.projectType === "non-collection-based" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border border-[#E5E7EB] rounded-[10px] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#3B82F6]" />
                      <h3 className="text-[14px] font-semibold text-[#4A5565]">
                        Start Date
                      </h3>
                    </div>
                    <p className="text-[16px] text-[#101828]">
                      {formatDate(selectedProject.startDate)}
                    </p>
                  </div>
                  <div className="border border-[#E5E7EB] rounded-[10px] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#3B82F6]" />
                      <h3 className="text-[14px] font-semibold text-[#4A5565]">
                        End Date
                      </h3>
                    </div>
                    <p className="text-[16px] text-[#101828]">
                      {formatDate(selectedProject.endDate)}
                    </p>
                  </div>
                </div>
              )}

              {/* Collections */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#4A5565] mb-3">
                  Collections
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.collections.map(
                    (collection, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 text-[14px] text-[#0000FF] bg-white border border-[rgba(59,130,246,0.3)] rounded-md"
                      >
                        {collection}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* Assigned Staff */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#4A5565] mb-3">
                  Assigned Staff
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {selectedProject.staff.map((staff, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: staff.color }}
                      >
                        {staff.initials}
                      </div>
                      <span className="text-[14px] text-[#101828]">
                        {staff.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row justify-between gap-3 flex-shrink-0">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleEditProject(selectedProject)
                  }
                  className="h-10 px-4 border border-[#D1D5DC] text-[#101828] rounded-[10px] hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Project
                </button>
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setIsItemsModalOpen(true);
                  }}
                  className="h-10 px-4 bg-black text-white rounded-[10px] hover:bg-gray-900 transition-colors"
                >
                  View Project Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Items Modal */}
      {isItemsModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#E5E7EB]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[20px] leading-7 text-[#101828]">
                    {selectedProject.name} - Items
                  </h2>
                  <p className="text-[14px] leading-5 text-[#4A5565] mt-1">
                    {projectItems.length} items in this project
                  </p>
                </div>
                <button
                  onClick={() => setIsItemsModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[#4A5565]" />
                </button>
              </div>
            </div>

            {/* Items Table */}
            <div className="p-6">
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="py-4 px-4 text-left text-[11px] uppercase font-bold text-[#4A5565] tracking-[0.6px] w-[104px]">
                        Preview
                      </th>
                      <th className="py-4 px-4 text-left text-[11px] uppercase font-bold text-[#4A5565] tracking-[0.6px] w-[211px]">
                        Item Name / ID
                      </th>
                      <th className="py-4 px-4 text-left text-[11px] uppercase font-bold text-[#4A5565] tracking-[0.6px] w-[240px]">
                        Project
                      </th>
                      <th className="py-4 px-4 text-left text-[11px] uppercase font-bold text-[#4A5565] tracking-[0.6px] w-[163px]">
                        Collection
                      </th>
                      <th className="py-4 px-4 text-center text-[11px] uppercase font-bold text-[#4A5565] tracking-[0.6px] w-[105px]">
                        Added By
                      </th>
                      <th className="py-4 px-4 text-center text-[11px] uppercase font-bold text-[#4A5565] tracking-[0.6px] w-[116px]">
                        Date Added
                      </th>
                      <th className="py-4 px-4 text-center text-[11px] uppercase font-bold text-[#4A5565] tracking-[0.6px] w-[104px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="py-4 px-4">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-[10px]">
                              IMG
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-[14px] text-[#101828] mb-1">
                              {item.name}
                            </p>
                            <a
                              href="#"
                              className="text-[14px] text-[#0000FF] hover:underline"
                            >
                              {item.id}
                            </a>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-[14px] text-[#6A7282]">
                          {item.project}
                        </td>
                        <td className="py-4 px-4 text-[14px] text-[#6A7282]">
                          {item.collection}
                        </td>
                        <td className="py-4 px-4 text-center text-[14px] text-[#6A7282]">
                          {item.addedBy}
                        </td>
                        <td className="py-4 px-4 text-center text-[14px] text-[#6A7282]">
                          {item.dateAdded}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setIsItemDetailsModalOpen(true);
                              }}
                              className="w-[34px] h-[34px] border border-[#D1D5DC] rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-between items-center">
              <p className="text-[14px] text-[#6A7282]">
                Showing {projectItems.length} items
              </p>
              <button
                onClick={() => setIsItemsModalOpen(false)}
                className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-[672px] max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Edit2 className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />
                  <div>
                    <h2 className="text-[20px] leading-7 text-[#101828]">
                      Edit Project
                    </h2>
                    <p className="text-[14px] leading-5 text-[#4A5565] mt-1">
                      Update project details
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[#4A5565]" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              {/* Project Name */}
              <div>
                <label htmlFor="project-name" className="block text-[14px] text-[#4A5565] mb-2">
                  Project Name{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  id="project-name"
                  type="text"
                  placeholder="e.g., Colonial Archives Preservation"
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      projectName: e.target.value,
                    })
                  }
                  className="w-full h-[42px] px-3 border border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="project-description" className="block text-[14px] text-[#4A5565] mb-2">
                  Description
                </label>
                <textarea
                  id="project-description"
                  placeholder="Describe the project's goals and scope..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC] resize-none"
                />
              </div>

              {/* Collections */}
              <div>
                <label className="block text-[14px] text-[#4A5565] mb-2">
                  Collections{" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className={`border rounded-[10px] p-3 max-h-[180px] overflow-y-auto space-y-2 ${
                  formData.collections.length === 0 ? 'border-red-300 bg-red-50/30' : 'border-[#D1D5DC]'
                }`}>
                  {availableCollections.map((collection) => (
                    <label
                      key={collection}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-[6px] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.collections.includes(collection)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              collections: [...formData.collections, collection],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              collections: formData.collections.filter(
                                (c) => c !== collection
                              ),
                            });
                          }
                        }}
                        className="w-4 h-4 rounded border-[#D1D5DC] text-blue-600 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-[14px] text-gray-900">
                        {collection}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.collections.length === 0 ? (
                  <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1">
                    <span>⚠</span> At least one collection must be selected
                  </p>
                ) : (
                    <p className="text-[12px] text-[#6A7282] mt-1">
                      {formData.collections.length} selected
                    </p>
                  )}
                </div>

              {/* Assigned Staff */}
              <div>
                <label className="block text-[14px] text-[#4A5565] mb-2">
                  Assigned Staff{" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className={`border rounded-[10px] p-3 max-h-[140px] overflow-y-auto space-y-2 ${
                  formData.staff.length === 0 ? 'border-red-300 bg-red-50/30' : 'border-[#D1D5DC]'
                }`}>
                  {availableStaff.map((staffMember) => (
                    <label
                      key={staffMember.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-[6px] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.staff.some((s) => (typeof s === 'string' ? s : s.id) === staffMember.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              staff: [...formData.staff, staffMember],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              staff: formData.staff.filter(
                                (s) => (typeof s === 'string' ? s : s.id) !== staffMember.id
                              ),
                            });
                          }
                        }}
                        className="w-4 h-4 rounded border-[#D1D5DC] text-blue-600 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-[14px] text-gray-900">
                        {staffMember.name}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.staff.length === 0 ? (
                  <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1">
                    <span>⚠</span> At least one staff member must be assigned
                  </p>
                ) : (
                  <p className="text-[12px] text-[#6A7282] mt-1">
                    {formData.staff.length} assigned
                  </p>
                )}
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="project-start-date" className="block text-[14px] text-[#4A5565] mb-2">
                    Start Date{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="project-start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full h-[42px] px-3 border border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
                  />
                </div>
                <div>
                  <label htmlFor="project-end-date" className="block text-[14px] text-[#4A5565] mb-2">
                    End Date{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="project-end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full h-[42px] px-3 border border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProject}
                disabled={formData.collections.length === 0 || formData.staff.length === 0}
                className="h-10 px-4 bg-black text-white rounded-[10px] shadow-sm hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
              >
                Update Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {isItemDetailsModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-[896px] max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FolderOpen className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />
                  <div>
                    <h2 className="text-[20px] leading-7 text-[#101828]">
                      {selectedItem.name}
                    </h2>
                    <p className="text-[14px] leading-5 text-[#4A5565] mt-1">
                      {selectedItem.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setIsItemDetailsModalOpen(false)
                  }
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[#4A5565]" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              {/* Description */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#4A5565] mb-2">
                  Description
                </h3>
                <p className="text-[14px] text-[#101828]">
                  No description available.
                </p>
              </div>

              {/* Project */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#4A5565] mb-3">
                  Project
                </h3>
                <p className="text-[14px] text-[#6A7282]">
                  {selectedItem.project}
                </p>
              </div>

              {/* Collection */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#4A5565] mb-3">
                  Collection
                </h3>
                <p className="text-[14px] text-[#6A7282]">
                  {selectedItem.collection}
                </p>
              </div>

              {/* Added By */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#4A5565] mb-3">
                  Added By
                </h3>
                <p className="text-[14px] text-[#6A7282]">
                  {selectedItem.addedBy}
                </p>
              </div>

              {/* Date Added */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#4A5565] mb-3">
                  Date Added
                </h3>
                <p className="text-[14px] text-[#6A7282]">
                  {selectedItem.dateAdded}
                </p>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setIsItemDetailsModalOpen(false)}
                className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Complete Confirmation Modal */}
      {isMarkCompleteModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-[480px]">
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[18px] font-semibold text-[#101828] mb-2">
                    Mark Project as Complete?
                  </h2>
                  <p className="text-[14px] text-[#4A5565] mb-4">
                    Are you sure you want to mark "{selectedProject.name}" as complete? This action will finalize the project.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3 mb-4">
                    <p className="text-[12px] text-[#1E40AF]">
                      Current Progress: {selectedProject.progress.current} items uploaded
                    </p>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setIsMarkCompleteModalOpen(false);
                        setSelectedProject(null);
                      }}
                      className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleMarkComplete}
                      className="h-10 px-4 bg-green-600 text-white rounded-[10px] hover:bg-green-700 transition-colors"
                    >
                      Mark as Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extend Timeline Modal */}
      {isExtendTimelineModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-[0.8px] border-[#E5E7EB] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-[480px]">
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[18px] font-semibold text-[#101828] mb-2">
                    Extend Project Timeline
                  </h2>
                  <p className="text-[14px] text-[#4A5565] mb-4">
                    This project has expired. Extend the deadline to continue working on it.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 mb-4">
                    <p className="text-[12px] text-[#DC2626] font-medium mb-1">
                      Project Expired
                    </p>
                    <p className="text-[12px] text-[#DC2626]">
                      Original End Date: {formatDate(selectedProject.endDate)}
                    </p>
                    <p className="text-[12px] text-[#DC2626]">
                      Progress: {selectedProject.progress.current} of {selectedProject.progress.total} items ({selectedProject.progress.percentage}%)
                    </p>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="extension-days" className="block text-[14px] text-[#4A5565] mb-2">
                      Extend by (days) <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="extension-days"
                      value={extensionDays}
                      onChange={(e) => setExtensionDays(Number(e.target.value))}
                      className="w-full h-[42px] px-3 border border-[#D1D5DC] rounded-[10px] text-[14px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
                    >
                      <option value={7}>7 days</option>
                      <option value={14}>14 days</option>
                      <option value={30}>30 days</option>
                      <option value={60}>60 days</option>
                      <option value={90}>90 days</option>
                    </select>
                    <p className="text-[12px] text-[#6A7282] mt-1">
                      New End Date: {new Date(new Date(selectedProject.endDate).getTime() + extensionDays * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setIsExtendTimelineModalOpen(false);
                        setSelectedProject(null);
                        setExtensionDays(30);
                      }}
                      className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExtendTimeline}
                      className="h-10 px-4 bg-red-600 text-white rounded-[10px] hover:bg-red-700 transition-colors"
                    >
                      Extend Timeline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}