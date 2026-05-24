import { useState, useEffect } from 'react';
import { Search, FolderOpen, X, Calendar, Eye, Loader2 } from 'lucide-react';
import { programs, items } from '../../lib/api';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  itemsUploaded: number;
  collections?: string[];
  startDate?: string;
  endDate?: string;
}

interface ProjectItem {
  id: string;
  name: string;
  project: string;
  collection: string;
  addedBy: string;
  dateAdded: string;
}

interface StaffDigitalArchivesMyProjectsPageProps {
  onNavigate?: (page: string) => void;
  userId?: number;
}

export function StaffDigitalArchivesMyProjectsPage({ onNavigate, userId }: StaffDigitalArchivesMyProjectsPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await programs.list({ user_id: userId });
        const mapped: Project[] = data.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          description: p.description || '',
          itemsUploaded: p.item_count || 0,
          progress: 0,
          collections: [],
          startDate: p.start_date || undefined,
          endDate: p.end_date || undefined,
        }));
        setProjects(mapped);
      } catch {
        toast.error('Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const handleOpenProject = async (project: Project) => {
    try {
      const detail = await programs.get(Number(project.id));
      setSelectedProject({
        ...project,
        collections: detail.collections.map((c: any) => c.name),
      });
    } catch {
      setSelectedProject(project);
    }
    setIsDetailsModalOpen(true);
  };

  const handleOpenItems = async (project: Project) => {
    setSelectedProject(project);
    setIsItemsModalOpen(true);
    try {
      setItemsLoading(true);
      const detail = await programs.get(Number(project.id));
      const mapped: ProjectItem[] = (detail.items || []).map((item: any) => ({
        id: item.item_identifier || String(item.id),
        name: item.title,
        project: project.name,
        collection: item.collection_name || '',
        addedBy: item.created_by_name || 'Staff',
        dateAdded: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      }));
      setProjectItems(mapped);
    } catch {
      toast.error('Failed to load project items');
      setProjectItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  // Filter projects based on search
  const filteredProjects = projects.filter((project) =>
    searchQuery === '' ||
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="px-4 lg:px-8 py-8 border-b border-gray-200">
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] lg:text-[30px] leading-[32px] lg:leading-[36px] text-[#101828]">
            My Projects
          </h1>
          <p className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] text-[#4A5565]">
            Your assigned digitization tasks and projects
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-8 py-4 lg:py-8">
        {/* Search Section */}
        <div className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-3 lg:p-6 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]"
              strokeWidth={1.33}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[42px] pl-10 pr-4 border-[0.8px] border-[#D1D5DC] rounded-[10px] bg-white text-gray-900 placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#D1D5DC]"
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
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-[14px] border-[0.8px] border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-shadow"
                >
                  {/* Project Icon */}
                  <div className="w-12 h-12 bg-[#F3F4F6] rounded-[10px] flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-[#4A5565]" strokeWidth={1.33} />
                  </div>

                  {/* Project Info */}
                  <div className="flex-1">
                    <h3 className="text-[18px] text-[#101828] mb-2">{project.name}</h3>
                    <p className="text-[14px] text-[#4A5565] mb-4">{project.description}</p>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-[#4A5565]">Items Uploaded</span>
                        <span className="text-[12px] font-medium text-[#101828]">{project.itemsUploaded}</span>
                      </div>
                    </div>

                    {/* Items Count */}
                    <div className="mt-3">
                      <p className="text-[12px] text-[#4A5565]">
                        {project.itemsUploaded} item{project.itemsUploaded !== 1 ? 's' : ''} uploaded
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleOpenProject(project)}
                    className="w-full h-10 px-4 bg-[#1F2937] hover:bg-[#111827] text-white rounded-[10px] text-[14px] transition-colors"
                  >
                    Open Project
                  </button>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <FolderOpen className="w-16 h-16 text-[#D1D5DC] mb-4" strokeWidth={1.33} />
                <p className="text-[16px] text-[#4A5565]">No projects found</p>
              </div>
            )}
          </>
        )}
      </div>

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
                      Project ID: PROJ-{selectedProject.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
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
                  {selectedProject.description}
                </p>
              </div>

              {/* Items Section */}
              <div className="border border-[#E5E7EB] rounded-[10px] p-4">
                <h3 className="text-[14px] font-semibold text-[#4A5565] mb-2">Items Uploaded</h3>
                <p className="text-[24px] font-semibold text-[#101828]">{selectedProject.itemsUploaded}</p>
              </div>

              {/* Timeline */}
              {selectedProject.startDate && selectedProject.endDate && (
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
              {selectedProject.collections && selectedProject.collections.length > 0 && (
                <div>
                  <h3 className="text-[14px] font-semibold text-[#4A5565] mb-3">
                    Collections
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.collections.map((collection, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 text-[14px] text-[#0000FF] bg-white border border-[rgba(59,130,246,0.3)] rounded-md"
                      >
                        {collection}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - Fixed */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="h-10 px-4 border border-[#D1D5DC] text-[#364153] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleOpenItems(selectedProject);
                }}
                className="h-10 px-4 bg-[#1F2937] text-white rounded-[10px] hover:bg-[#111827] transition-colors"
              >
                View Project Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Items Modal */}
      {isItemsModalOpen && selectedProject && (
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
                      Project ID: PROJ-{selectedProject.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsItemsModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[#4A5565]" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              {/* Loading State */}
              {itemsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#6A7282]" />
                </div>
              ) : (
                <>
                  {/* Items Count */}
                  <p className="text-[14px] text-[#4A5565] mb-4">
                    {projectItems.length} items in this project
                  </p>

                  {/* Items Table */}
                  <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E5E7EB] bg-gray-50">
                          <th className="py-4 px-4 text-left text-[11px] uppercase text-[#4A5565] tracking-[0.6px]">
                            Preview
                          </th>
                          <th className="py-4 px-4 text-left text-[11px] uppercase text-[#4A5565] tracking-[0.6px]">
                            Item ID
                          </th>
                          <th className="py-4 px-4 text-left text-[11px] uppercase text-[#4A5565] tracking-[0.6px]">
                            Item Name
                          </th>
                          <th className="py-4 px-4 text-left text-[11px] uppercase text-[#4A5565] tracking-[0.6px]">
                            Collection
                          </th>
                          <th className="py-4 px-4 text-left text-[11px] uppercase text-[#4A5565] tracking-[0.6px]">
                            Added By
                          </th>
                          <th className="py-4 px-4 text-left text-[11px] uppercase text-[#4A5565] tracking-[0.6px]">
                            Date Added
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectItems.map((item, index, arr) => (
                          <tr
                            key={item.id}
                            className={`${
                              index !== arr.length - 1 ? 'border-b border-[#E5E7EB]' : ''
                            } hover:bg-gray-50/50 transition-colors`}
                          >
                            {/* Preview */}
                            <td className="py-4 px-4">
                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-[12px] text-[#4A5565]">IMG</span>
                              </div>
                            </td>

                            {/* Item ID */}
                            <td className="py-4 px-4 text-[14px] text-[#F59E0B]">
                              {item.id}
                            </td>

                            {/* Item Name */}
                            <td className="py-4 px-4 text-[14px] text-[#101828]">
                              {item.name}
                            </td>

                            {/* Collection */}
                            <td className="py-4 px-4 text-[14px] text-[#4A5565]">
                              {item.collection}
                            </td>

                            {/* Added By */}
                            <td className="py-4 px-4 text-[14px] text-[#4A5565]">
                              {item.addedBy}
                            </td>

                            {/* Date Added */}
                            <td className="py-4 px-4 text-[14px] text-[#4A5565]">
                              {item.dateAdded}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Empty State */}
                    {projectItems.length === 0 && (
                      <div className="py-12 text-center">
                        <p className="text-[14px] text-[#6A7282]">No items in this project yet</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer - Fixed */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-3 flex-shrink-0">
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
    </div>
  );
}
