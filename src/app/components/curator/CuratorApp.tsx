import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { CuratorSidebar } from './CuratorSidebar';
import CuratorDigitalArchivesPage from './CuratorDigitalArchivesPage';
import { CuratorStaffManagementPage } from './CuratorStaffManagementPage';
import { CuratorAddItemPage } from './CuratorAddItemPage';
import { CuratorCreateItemDraftPage } from './CuratorCreateItemDraftPage';
import { CuratorCreateCollectionPage } from './CuratorCreateCollectionPage';
import { CuratorManageItemsPage } from './CuratorManageItemsPage';
import { Toaster } from '../ui/sonner';

type PageType = 'digital-archives-all-items' | 'digital-archives-projects' | 'digital-archives-needs-attention' | 'digital-archives-activity-history' | 'staff-management' | 'add-item' | 'create-item-draft' | 'create-collection' | 'manage-items';

interface UploadData {
  fileName?: string;
  itemType?: string;
  collection?: string;
  project?: string;
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

interface CuratorAppProps {
  user?: { name: string; email: string; role: string };
  onLogout?: () => void;
}

export default function CuratorApp({ user, onLogout }: CuratorAppProps) {
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
      case 'digital-archives-projects':
      case 'digital-archives-needs-attention':
      case 'digital-archives-activity-history':
        return (
          <CuratorDigitalArchivesPage
            activePage={currentPage}
            onNavigateToCatalog={handleNavigateToCatalog}
          />
        );
      case 'manage-items':
        return (
          <CuratorManageItemsPage
            onNavigate={handleNavigate}
          />
        );
      case 'create-item-draft':
        return (
          <CuratorCreateItemDraftPage
            onBack={() => setCurrentPage('digital-archives-all-items')}
          />
        );
      case 'create-collection':
        return (
          <CuratorCreateCollectionPage
            onBack={() => setCurrentPage('digital-archives-all-items')}
          />
        );
      case 'add-item':
        return (
          <CuratorAddItemPage
            onBack={handleBackFromAddItem}
            uploadData={uploadData}
          />
        );
      case 'staff-management':
        return <CuratorStaffManagementPage />;
      default:
        return (
          <CuratorDigitalArchivesPage
            activePage="digital-archives-all-items"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      <Toaster position="top-right" richColors toastOptions={{ style: { zIndex: 9999 } }} />
      <CuratorSidebar
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
            {currentPage === 'digital-archives-projects' && 'Projects'}
            {currentPage === 'digital-archives-needs-attention' && 'Needs Attention'}
            {currentPage === 'digital-archives-activity-history' && 'Activity History'}
            {currentPage === 'manage-items' && 'Manage Items'}
            {currentPage === 'create-item-draft' && 'Create Item Draft'}
            {currentPage === 'create-collection' && 'Create Collection'}
            {currentPage === 'add-item' && 'Add Item'}
            {currentPage === 'staff-management' && 'Staff Management'}
          </span>
        </div>
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
