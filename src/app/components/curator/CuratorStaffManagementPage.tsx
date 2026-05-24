import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Users,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";
import { users, activityLogs, type User, type ActivityLogEntry } from "../../lib/api";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  department: string;
  status: string;
  joinedDate: string;
  lastActive: string;
  avatar_url: string | null;
}

/**
 * CuratorStaffManagementPage - Manage museum staff and permissions
 */
export function CuratorStaffManagementPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] =
    useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(
    null,
  );
  const [selectedStaff, setSelectedStaff] =
    useState<StaffMember | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] =
    useState(false);
  const [editFormData, setEditFormData] =
    useState<StaffMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    password: "",
    role: "staff",
  });
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [activityLogEntries, setActivityLogEntries] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    users.list().then((usersData) => {
      setStaffList(
        usersData.map((u: User) => {
          const nameParts = u.full_name.split(" ");
          return {
            id: String(u.id),
            username: u.username,
            email: u.email,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            name: u.full_name,
            role: u.role,
            department: u.assigned_museum || "Collections",
            status: u.is_active ? "Active" : "Inactive",
            joinedDate: "",
            lastActive: "",
            avatar_url: u.avatar_url,
          };
        })
      );
    }).catch((err) => toast.error(err.message));
  }, [refreshKey]);

  // Calculate statistics
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.status === "Active").length;

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      filterRole === "all" ||
      staff.role.toLowerCase() === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "curator":
      case "Administrator":
        return "bg-purple-100 text-purple-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "volunteer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleViewProfile = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsViewModalOpen(true);
    setActiveMenu(null);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditFormData(staff);
    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  const handleDeactivate = async (staff: StaffMember) => {
    try {
      await users.deactivate(staff.id);
      toast.success(`${staff.name} has been deactivated.`);
      setActiveMenu(null);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate staff member");
    }
  };

  const handleViewActivityLog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    const staffId = parseInt(staff.id);
    activityLogs.list({ user_id: String(staffId) }).then((logs) => {
      setActivityLogEntries(logs);
    }).catch((err) => toast.error(err.message));
    setIsActivityLogOpen(true);
    setActiveMenu(null);
  };

  const handleSaveEdit = async () => {
    if (!editFormData) return;
    try {
      await users.update(editFormData.id, {
        username: editFormData.username,
        email: editFormData.email,
        firstName: editFormData.firstName,
        middleName: editFormData.middleName || undefined,
        lastName: editFormData.lastName,
        role: editFormData.department === 'Volunteer' ? 'volunteer' : 'staff',
      });
      toast.success("Staff member updated successfully.");
      setIsEditModalOpen(false);
      setEditFormData(null);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to update staff member");
    }
  };

  const handleAddStaff = async () => {
    const { username, email, firstName, middleName, lastName, password, role } = addFormData;
    if (!username || !email || !firstName || !lastName || !password) {
      toast.error("Username, email, first name, last name, and password are required.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      await users.create({
        username,
        email,
        full_name: `${firstName}${middleName ? ' ' + middleName : ''} ${lastName}`.trim(),
        role,
        password,
      });
      toast.success("Staff member added successfully.");
      setIsAddModalOpen(false);
      setAddFormData({
        username: "",
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
        password: "",
        role: "staff",
      });
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to add staff member");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900 mb-2">
                Staff Management
              </h1>
              <p className="text-gray-600">
                Manage museum staff and their permissions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 bg-[#2c3e50] text-white rounded-lg hover:bg-[#1a252f] transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Staff Member
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">
                  Total Staff
                </p>
                <p className="text-gray-900">{totalStaff}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">
                  Active Staff
                </p>
                <p className="text-gray-900">{activeStaff}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] appearance-none bg-white cursor-pointer min-w-[200px]"
              >
                <option value="all">All Roles</option>
                <option value="curator">Curator</option>
                <option value="staff">Museum Staff</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4" data-label="Staff Member">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                          {staff.firstName?.[0] || ''}{staff.lastName?.[0] || ''}
                        </div>
                        <div>
                          <div className="text-gray-900">
                            {staff.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700" data-label="Username">
                      @{staff.username}
                    </td>
                    <td className="px-6 py-4 text-gray-700" data-label="Email">
                      {staff.email}
                    </td>
                    <td className="px-6 py-4" data-label="Role">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getRoleColor(staff.role)}`}
                      >
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4" data-label="Status">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusColor(staff.status)}`}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4" data-label="Actions">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === staff.id
                                ? null
                                : staff.id,
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {activeMenu === staff.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() =>
                                handleViewProfile(staff)
                              }
                            >
                              View Profile
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() =>
                                handleEditStaff(staff)
                              }
                            >
                              Edit Details
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() =>
                                handleViewActivityLog(staff)
                              }
                            >
                              View Activity Log
                            </button>
                            {staff.role !== 'Administrator' && (
                              <>
                                <div className="border-t border-gray-200 my-1"></div>
                                <button
                                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                                  onClick={() => handleDeactivate(staff)}
                                >
                                  Deactivate Staff
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No staff members found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Profile Modal */}
      {isViewModalOpen && selectedStaff && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-gray-900">
                    Staff Profile
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    View staff member details
                  </p>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Staff Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                    {selectedStaff.firstName?.[0] || ''}{selectedStaff.lastName?.[0] || ''}
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">
                      {selectedStaff.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      @{selectedStaff.username}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Username
                    </label>
                    <p className="text-gray-900">
                      {selectedStaff.username}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">
                      {selectedStaff.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      First Name
                    </label>
                    <p className="text-gray-900">
                      {selectedStaff.firstName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Middle Name
                    </label>
                    <p className="text-gray-900">
                      {selectedStaff.middleName || "—"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Last Name
                    </label>
                    <p className="text-gray-900">
                      {selectedStaff.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Role
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs ${getRoleColor(selectedStaff.role)}`}
                    >
                      {selectedStaff.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {isEditModalOpen && editFormData && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-gray-900">
                    Edit Staff Member
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update staff member information
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Username <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.username}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        username: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Email{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.middleName || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        middleName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Role{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={editFormData.department}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        department: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] appearance-none bg-white cursor-pointer"
                  >
                    <option value="Museum staff">
                      Museum staff
                    </option>
                    <option value="Volunteer">
                      Volunteer
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2.5 bg-[#2c3e50] text-white rounded-lg hover:bg-[#1a252f] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {isActivityLogOpen && selectedStaff && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsActivityLogOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-gray-900">
                    Activity Log
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Recent activities for {selectedStaff.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsActivityLogOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {activityLogEntries.map(
                  (log, index) => (
                    <div key={log.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        {index <
                          activityLogEntries.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-gray-900">
                            {log.action}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(
                              log.created_at,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {log.details}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setIsActivityLogOpen(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-gray-900">
                    Add Staff Member
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Add a new staff member
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Username <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={addFormData.username}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        username: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Email{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={addFormData.email}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={addFormData.firstName}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={addFormData.middleName}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        middleName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={addFormData.lastName}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Role <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={addFormData.role}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        role: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] appearance-none bg-white cursor-pointer"
                  >
                    <option value="staff">Museum Staff</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={addFormData.password}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                className="px-4 py-2.5 bg-[#2c3e50] text-white rounded-lg hover:bg-[#1a252f] transition-colors"
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CuratorStaffManagementPage;