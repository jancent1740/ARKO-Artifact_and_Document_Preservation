import { useState } from 'react';
import { Eye, Edit2, Download } from 'lucide-react';

interface Item {
  id: string;
  itemId: string;
  title: string;
  collection: string;
  author: string;
  type: string;
  status: 'Published' | 'Pending Review' | 'Draft';
}

interface DataTableProps {
  items: Item[];
  totalResults: number;
  onExportCSV: () => void;
}

export function DataTable({ items, totalResults, onExportCSV }: DataTableProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === items.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'text-[#059669] bg-[#d1fae5]';
      case 'Pending Review':
        return 'text-[#92400e] bg-[#fef3c7]';
      case 'Draft':
        return 'text-[#4b5563] bg-[#f3f4f6]';
      default:
        return 'text-[#4b5563] bg-[#f3f4f6]';
    }
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg">
      {/* Table Controls */}
      <div className="px-4 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-3.5 h-3.5 border-[0.5px] border-black rounded-sm cursor-pointer"
          />
          <span className="text-sm text-[#4b5563]">Select All</span>
          {selectedItems.size > 0 && (
            <span className="text-sm text-[#6b7280]">
              {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected
            </span>
          )}
        </div>
        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-5 py-2 border border-[#d1d5db] bg-white text-xs text-[rgba(17,17,17,0.8)] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
            <tr>
              <th className="w-[61px] text-left"></th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs text-[#6b7280] tracking-wide">Item ID</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs text-[#6b7280] tracking-wide">Title</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs text-[#6b7280] tracking-wide">Collection</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs text-[#6b7280] tracking-wide">Author</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs text-[#6b7280] tracking-wide">Type</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs text-[#6b7280] tracking-wide">Status</span>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-xs text-[#6b7280] tracking-wide">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-[#e5e7eb] hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-3.5 h-3.5 border-[0.5px] border-black rounded-sm cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#111827]">{item.itemId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#111827]">{item.title}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#4b5563]">{item.collection}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#4b5563]">{item.author}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                    item.type === 'Artifact' ? 'text-[#6b21a8] bg-[#f3e8ff]' : 'text-[#1e40af] bg-[#dbeafe]'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {item.status === 'Published' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#059669]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Published
                    </span>
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded-md text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="View item"
                    >
                      <Eye className="w-4 h-4 text-[#0b0b0b]" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Edit item"
                    >
                      <Edit2 className="w-4 h-4 text-[#080808]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-[#e5e7eb] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#6b7280]">Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="px-2 py-1 border border-[#d1d5db] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-[#6b7280]">
            Showing 1 to {rowsPerPage} of {totalResults} results
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-[#6b7280] hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            &lt;
          </button>
          
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                currentPage === page
                  ? 'bg-[#1f2937] text-white'
                  : 'text-[#6b7280] hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          
          <span className="px-2 text-sm text-[#6b7280]">...</span>
          
          <button
            onClick={() => setCurrentPage(10)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              currentPage === 10
                ? 'bg-[#1f2937] text-white'
                : 'text-[#6b7280] hover:bg-gray-100'
            }`}
          >
            10
          </button>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-[#6b7280] hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}