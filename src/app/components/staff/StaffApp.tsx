import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { StaffSidebar } from './StaffSidebar';
import { StaffDigitalArchivesAllItemsPage } from './StaffDigitalArchivesAllItemsPage';
import { StaffDigitalArchivesMyProjectsPage } from './StaffDigitalArchivesMyProjectsPage';
import { StaffDigitalArchivesMyTasksPage } from './StaffDigitalArchivesMyTasksPage';
import { StaffDigitalArchivesMyHistoryPage } from './StaffDigitalArchivesMyHistoryPage';
import { StaffAddItemPage } from './StaffAddItemPage';
import { StaffCreateItemDraftPage } from './StaffCreateItemDraftPage';
import { Toaster } from '../ui/sonner';

type PageType = 'digital-archives-all-items' | 'digital-archives-projects' | 'digital-archives-needs-attention' | 'digital-archives-activity-history' | 'add-item' | 'create-item-draft';

interface UploadData {
  fileName?: string;
  itemType?: string;
  collection?: string;
  project?: string;
  checksum?: string;
  draftData?: {
    title?: string;
    description?: string;
    physicalDimensions?: string;
    material?: string;
    condition?: string;
  };
  existingItemData?: {
    id: string;
    name: string;
    itemType: string;
    project: string;
    collection: string;
  };
  isAddingPages?: boolean;
}

interface StaffAppProps {
  user?: { id: number; name: string; email: string; role: string };
  onLogout?: () => void;
}

export default function StaffApp({ user, onLogout }: StaffAppProps) {
  const [currentPage, setCurrentPage] = useState<PageType>('digital-archives-all-items');
  const [uploadData, setUploadData] = useState<UploadData | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userInfo = {
    name: user?.name || '',
    role: user?.role || ''
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const handleNavigateToCatalog = (data?: UploadData) => {
    setUploadData(data);
    setCurrentPage('add-item');
  };

  const handleBackFromAddItem = () => {
    setUploadData(undefined);
    setCurrentPage('digital-archives-all-items');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'digital-archives-all-items':
        return <StaffDigitalArchivesAllItemsPage onNavigate={handleNavigate} onNavigateToCatalog={handleNavigateToCatalog} />;
      case 'digital-archives-projects':
        return <StaffDigitalArchivesMyProjectsPage onNavigate={handleNavigate} userId={user?.id} />;
      case 'digital-archives-needs-attention':
        return <StaffDigitalArchivesMyTasksPage onNavigate={handleNavigate} />;
      case 'digital-archives-activity-history':
        return <StaffDigitalArchivesMyHistoryPage onNavigate={handleNavigate} />;
      case 'create-item-draft':
        return (
          <StaffCreateItemDraftPage
            onBack={() => setCurrentPage('digital-archives-all-items')}
          />
        );
      case 'add-item':
        return (
          <StaffAddItemPage
            onBack={handleBackFromAddItem}
            uploadData={uploadData}
          />
        );
      default:
        return <StaffDigitalArchivesAllItemsPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f9fafb]">
      <Toaster position="top-right" richColors toastOptions={{ style: { zIndex: 9999 } }} />
      <StaffSidebar
        activePage={currentPage}
        userInfo={userInfo}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-64 w-full">
        <div className="flex lg:hidden items-center h-12 px-4 border-b border-gray-200 bg-white sticky top-0 z-10 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" strokeWidth={1.33} />
          </button>
          <span className="ml-3 text-[15px] font-semibold text-gray-900 truncate">
            {currentPage === 'digital-archives-all-items' && 'All Items'}
            {currentPage === 'digital-archives-projects' && 'My Projects'}
            {currentPage === 'digital-archives-needs-attention' && 'My Tasks'}
            {currentPage === 'digital-archives-activity-history' && 'My History'}
            {currentPage === 'add-item' && 'Add Item'}
            {currentPage === 'create-item-draft' && 'Create Item Draft'}
          </span>
        </div>
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
