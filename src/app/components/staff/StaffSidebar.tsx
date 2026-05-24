import logoImg from 'figma:asset/137cba3587472c30b3a6689fdf6fd28befe23022.png';
import imgArkoLogoNew from 'figma:asset/46a7c40df42c58a640692a560d514465085e4443.png';
import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, LogOut, Bell, Plus } from 'lucide-react';
import { notifications } from '../../lib/api';

interface StaffSidebarProps {
  activePage?: string;
  userInfo?: { name: string; role: string; avatarUrl?: string };
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function StaffSidebar({
  activePage = 'digital-archives-all-items',
  userInfo = { name: '', role: '' },
  onNavigate,
  onLogout,
  isOpen,
  onClose
}: StaffSidebarProps) {
  const [digitalArchivesOpen, setDigitalArchivesOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifList, setNotifList] = useState<any[]>([]);

  const refreshNotifs = useCallback(async () => {
    try {
      const data = await notifications.list();
      setNotifList(data);
      setNotifCount(data.filter((n) => !n.is_read).length);
    } catch {
      setNotifList([]);
      setNotifCount(0);
    }
  }, []);

  useEffect(() => {
    refreshNotifs();
    const interval = setInterval(refreshNotifs, 30000);
    return () => clearInterval(interval);
  }, [refreshNotifs]);

  useEffect(() => {
    if (['digital-archives-all-items', 'digital-archives-projects', 'digital-archives-needs-attention', 'digital-archives-activity-history', 'create-item-draft'].includes(activePage || '')) {
      setDigitalArchivesOpen(true);
    }
  }, [activePage]);

  const handleMarkRead = async (id: number) => {
    try {
      await notifications.markRead(id);
      refreshNotifs();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notifications.markAllRead();
      refreshNotifs();
    } catch {}
  };

  const handleNav = (page: string) => {
    onNavigate?.(page);
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
      )}
      <div className={`w-64 h-screen bg-[#1f2937] border-r border-[#364153] flex flex-col fixed left-0 top-0 overflow-y-auto z-30 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-4 py-[17px] border-b border-[#364153] flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 size-[40px]" data-name="image 138">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgArkoLogoNew} />
          </div>
          <div className="flex-1">
            <h1 className="text-white text-[17px] leading-[28px]">Staff Dashboard</h1>
          </div>
          <button onClick={onClose} className="p-1 text-[#9ca3af] hover:text-[#f3f4f6] lg:hidden" aria-label="Close sidebar">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div>
          <button
            onClick={() => setDigitalArchivesOpen(!digitalArchivesOpen)}
            className={`w-full flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg transition-colors ${
              digitalArchivesOpen || ['digital-archives-all-items', 'digital-archives-projects', 'digital-archives-needs-attention', 'digital-archives-activity-history', 'create-item-draft'].includes(activePage || '')
                ? 'bg-[rgba(106,114,130,0.2)] text-[#f3f4f6]'
                : 'text-[#f3f4f6] hover:bg-[rgba(106,114,130,0.15)]'
            }`}
          >
            <div className="flex items-center gap-4">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                <path d="M8 5.33333C11.3137 5.33333 14 4.4379 14 3.33333C14 2.22876 11.3137 1.33333 8 1.33333C4.68629 1.33333 2 2.22876 2 3.33333C2 4.4379 4.68629 5.33333 8 5.33333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                <path d="M2 3.33333V12.6667C2 13.1971 2.63214 13.7058 3.75736 14.0809C4.88258 14.456 6.4087 14.6667 8 14.6667C9.5913 14.6667 11.1174 14.456 12.2426 14.0809C13.3679 13.7058 14 13.1971 14 12.6667V3.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                <path d="M2 8C2 8.53043 2.63214 9.03914 3.75736 9.41421C4.88258 9.78929 6.4087 10 8 10C9.5913 10 11.1174 9.78929 12.2426 9.41421C13.3679 9.03914 14 8.53043 14 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
              <span className="text-[13px] font-semibold">Digital Archives</span>
            </div>
            {digitalArchivesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {digitalArchivesOpen && (
            <div className="relative ml-6 mt-1 space-y-1">
              <button
                onClick={() => handleNav('digital-archives-all-items')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors relative ${
                  activePage === 'digital-archives-all-items' ? 'text-[#f3f4f6]' : 'text-[#d1d5dc] hover:bg-[rgba(106,114,130,0.15)]'
                }`}
              >
                <div className="absolute left-[-8px] top-0 h-5 w-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 w-2 h-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 bottom-0 w-px bg-[rgba(106,114,130,0.3)]" />
                <svg className="w-4 h-4 flex-shrink-0 ml-2" fill="none" viewBox="0 0 16 16">
                  <path d="M6.66667 2H2.66667C2.29848 2 2 2.29848 2 2.66667V6.66667C2 7.03486 2.29848 7.33333 2.66667 7.33333H6.66667C7.03486 7.33333 7.33333 7.03486 7.33333 6.66667V2.66667C7.33333 2.29848 7.03486 2 6.66667 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M13.3333 2H9.33333C8.96514 2 8.66667 2.29848 8.66667 2.66667V6.66667C8.66667 7.03486 8.96514 7.33333 9.33333 7.33333H13.3333C13.7015 7.33333 14 7.03486 14 6.66667V2.66667C14 2.29848 13.7015 2 13.3333 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M6.66667 8.66667H2.66667C2.29848 8.66667 2 8.96514 2 9.33333V13.3333C2 13.7015 2.29848 14 2.66667 14H6.66667C7.03486 14 7.33333 13.7015 7.33333 13.3333V9.33333C7.33333 8.96514 7.03486 8.66667 6.66667 8.66667Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M13.3333 8.66667H9.33333C8.96514 8.66667 8.66667 8.96514 8.66667 9.33333V13.3333C8.66667 13.7015 8.96514 14 9.33333 14H13.3333C13.7015 14 14 13.7015 14 13.3333V9.33333C14 8.96514 13.7015 8.66667 13.3333 8.66667Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </svg>
                <span className="text-[13px] font-semibold">All Items</span>
              </button>

              <button
                onClick={() => handleNav('create-item-draft')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors relative ${
                  activePage === 'create-item-draft' ? 'text-[#f3f4f6]' : 'text-[#d1d5dc] hover:bg-[rgba(106,114,130,0.15)]'
                }`}
              >
                <div className="absolute left-[-8px] top-0 h-5 w-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 w-2 h-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 bottom-0 w-px bg-[rgba(106,114,130,0.3)]" />
                <Plus className="w-4 h-4 flex-shrink-0 ml-2" strokeWidth={1.33} />
                <span className="text-[13px] font-semibold">Create Item Draft</span>
              </button>

              <button
                onClick={() => handleNav('digital-archives-projects')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors relative ${
                  activePage === 'digital-archives-projects' ? 'text-[#f3f4f6]' : 'text-[#d1d5dc] hover:bg-[rgba(106,114,130,0.15)]'
                }`}
              >
                <div className="absolute left-[-8px] top-0 h-5 w-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 w-2 h-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 bottom-0 w-px bg-[rgba(106,114,130,0.3)]" />
                <svg className="w-4 h-4 flex-shrink-0 ml-2" fill="none" viewBox="0 0 16 16">
                  <path d="M14.6667 12.6667C14.6667 13.0203 14.5262 13.3594 14.2761 13.6095C14.0261 13.8595 13.687 14 13.3333 14H2.66667C2.31304 14 1.97391 13.8595 1.72386 13.6095C1.47381 13.3594 1.33333 13.0203 1.33333 12.6667V3.33333C1.33333 2.97971 1.47381 2.64057 1.72386 2.39052C1.97391 2.14048 2.31304 2 2.66667 2H6L7.33333 4H13.3333C13.687 4 14.0261 4.14048 14.2761 4.39052C14.5262 4.64057 14.6667 4.97971 14.6667 5.33333V12.6667Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </svg>
                <span className="text-[13px] font-semibold">My Projects</span>
              </button>

              <button
                onClick={() => handleNav('digital-archives-needs-attention')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors relative ${
                  activePage === 'digital-archives-needs-attention' ? 'text-[#f3f4f6]' : 'text-[#d1d5dc] hover:bg-[rgba(106,114,130,0.15)]'
                }`}
              >
                <div className="absolute left-[-8px] top-0 h-5 w-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 w-2 h-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 bottom-0 w-px bg-[rgba(106,114,130,0.3)]" />
                <svg className="w-4 h-4 flex-shrink-0 ml-2" fill="none" viewBox="0 0 16 16">
                  <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M8 5.33333V8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M8 10.6667H8.00667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </svg>
                <span className="text-[13px] font-semibold">My Tasks</span>
              </button>

              <button
                onClick={() => handleNav('digital-archives-activity-history')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors relative ${
                  activePage === 'digital-archives-activity-history' ? 'text-[#f3f4f6]' : 'text-[#d1d5dc] hover:bg-[rgba(106,114,130,0.15)]'
                }`}
              >
                <div className="absolute left-[-8px] top-0 h-5 w-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 w-2 h-px bg-[rgba(106,114,130,0.3)]" />
                <div className="absolute left-[-8px] top-1/2 bottom-0 w-px bg-[rgba(106,114,130,0.3)]" />
                <svg className="w-4 h-4 flex-shrink-0 ml-2" fill="none" viewBox="0 0 16 16">
                  <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M8 4V8L10.6667 9.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </svg>
                <span className="text-[13px] font-semibold">My History</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="flex-shrink-0 px-4 py-4 border-t border-[#364153] bg-[#1a202c]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img src={userInfo.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=1f2937&color=fff`} alt={userInfo.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] text-[#f3f4f6] font-medium truncate">{userInfo.name}</p>
              <p className="text-[12px] text-[#9ca3af] truncate">{userInfo.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[rgba(106,114,130,0.15)] rounded-lg transition-colors flex-shrink-0 relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-gray-900">Notifications</span>
                    {notifCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-[12px] text-blue-600 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifList.length === 0 ? (
                    <div className="px-4 py-8 text-center text-[13px] text-gray-500">No notifications</div>
                  ) : (
                    notifList.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${n.is_read ? "" : "bg-blue-50/50"}`}
                      >
                        <p className={`text-[13px] ${n.is_read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                          {n.message || n.title}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[rgba(106,114,130,0.15)] rounded-lg transition-colors flex-shrink-0"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
