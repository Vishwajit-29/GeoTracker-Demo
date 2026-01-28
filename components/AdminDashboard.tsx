import React, { useState } from "react";
import { User, AttendanceRecord, Role, Geofence } from "../types";
import { exportToCSV } from "../services/exportService";
import { LogoutIcon } from "./icons/LogoutIcon";
import { UsersIcon } from "./icons/UsersIcon";
import { DocumentTextIcon } from "./icons/DocumentTextIcon";
import { DownloadIcon } from "./icons/DownloadIcon";
import { GeoTrackerLogo } from "./icons/GeoTrackerLogo";
import { GlobeIcon } from "./icons/GlobeIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { TrashIcon } from "./icons/TrashIcon";
import GeofenceEditorModal from "./GeofenceEditorModal";
import { PencilIcon } from "./icons/PencilIcon";

interface AdminDashboardProps {
  currentUser: User;
  allUsers: User[];
  attendanceRecords: AttendanceRecord[];
  onSetGeofence: (userId: number, geofence: Geofence | undefined) => void;
  onAddUser: (name: string, password: string) => void;
  onRemoveUser: (userId: number) => void;
  onLogout: () => void;
}

type Tab = "employees" | "attendance" | "geofence";

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  allUsers,
  attendanceRecords,
  onSetGeofence,
  onAddUser,
  onRemoveUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("attendance");
  const [isAddUserFormVisible, setAddUserFormVisible] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const employeeUsers = allUsers.filter((u) => u.role === Role.Employee);

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName && newUserPassword) {
      onAddUser(newUserName, newUserPassword);
      setNewUserName("");
      setNewUserPassword("");
      setAddUserFormVisible(false);
    }
  };

  const handleGeofenceSave = (user: User, geofence: Geofence | undefined) => {
    onSetGeofence(user.id, geofence);
    setEditingUser(null);
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-brand-dark text-white p-6 hidden md:flex flex-col justify-between fixed h-full">
        <div>
          <div className="flex items-center space-x-3 mb-10">
            <div className="h-10 w-10">
              <GeoTrackerLogo isLight={true} />
            </div>
            <h1 className="text-2xl font-bold">GeoTracker</h1>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition ${activeTab === "attendance" ? "bg-brand-primary" : "hover:bg-gray-700"}`}
            >
              <DocumentTextIcon />
              <span>Attendance Logs</span>
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition ${activeTab === "employees" ? "bg-brand-primary" : "hover:bg-gray-700"}`}
            >
              <UsersIcon />
              <span>Employees</span>
            </button>
            <button
              onClick={() => setActiveTab("geofence")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition ${activeTab === "geofence" ? "bg-brand-primary" : "hover:bg-gray-700"}`}
            >
              <GlobeIcon />
              <span>Geofence</span>
            </button>
          </nav>
        </div>
        <div>
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-gray-400">{currentUser.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 p-3 mt-4 rounded-lg text-left hover:bg-gray-700 transition"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-100 md:ml-64">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold text-brand-dark">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="p-2 rounded-full text-brand-secondary hover:bg-gray-200"
          >
            <LogoutIcon />
          </button>
        </header>

        <div className="p-4 md:p-8">
          <div className="md:hidden mb-4">
            <select
              onChange={(e) => setActiveTab(e.target.value as Tab)}
              value={activeTab}
              className="w-full p-2 border rounded"
            >
              <option value="attendance">Attendance Logs</option>
              <option value="employees">Employees</option>
              <option value="geofence">Geofence</option>
            </select>
          </div>

          {activeTab === "attendance" && (
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 flex justify-between items-center border-b">
                <h3 className="text-xl font-bold text-brand-dark">
                  All Attendance Logs
                </h3>
                <button
                  onClick={() => exportToCSV(attendanceRecords, allUsers)}
                  className="flex items-center space-x-2 bg-brand-success text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition"
                >
                  <DownloadIcon />
                  <span>Export CSV</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 font-semibold text-sm">Employee</th>
                      <th className="p-4 font-semibold text-sm">Date</th>
                      <th className="p-4 font-semibold text-sm">Check-In</th>
                      <th className="p-4 font-semibold text-sm">Check-Out</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {attendanceRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          {allUsers.find((u) => u.id === record.userId)?.name}
                        </td>
                        <td className="p-4">
                          {record.checkInTime.toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {record.checkInTime.toLocaleTimeString()}
                        </td>
                        <td className="p-4">
                          {record.checkOutTime ? (
                            record.checkOutTime.toLocaleTimeString()
                          ) : (
                            <span className="text-gray-400">
                              Not Checked Out
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "employees" && (
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-brand-dark">
                  All Employees
                </h3>
                <button
                  onClick={() => setAddUserFormVisible(!isAddUserFormVisible)}
                  className="flex items-center space-x-2 bg-brand-primary text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
                >
                  <PlusIcon />
                  <span>
                    {isAddUserFormVisible ? "Cancel" : "Add Employee"}
                  </span>
                </button>
              </div>
              {isAddUserFormVisible && (
                <div className="p-6 border-b bg-gray-50">
                  <form
                    onSubmit={handleAddUserSubmit}
                    className="flex flex-col md:flex-row gap-4 items-end"
                  >
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full md:w-auto bg-brand-success text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition"
                    >
                      Save Employee
                    </button>
                  </form>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 font-semibold text-sm">Name</th>
                      <th className="p-4 font-semibold text-sm">Role</th>
                      <th className="p-4 font-semibold text-sm text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {employeeUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => onRemoveUser(user.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "geofence" && (
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-brand-dark">
                  Employee Geofence Settings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 font-semibold text-sm">Employee</th>
                      <th className="p-4 font-semibold text-sm">
                        Geofence Status
                      </th>
                      <th className="p-4 font-semibold text-sm text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {employeeUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">
                          {user.geofence ? (
                            <span className="text-sm text-gray-700">{`Radius: ${user.geofence.radius}m at (${user.geofence.center.latitude.toFixed(2)}, ${user.geofence.center.longitude.toFixed(2)})`}</span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Using company default
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-brand-primary hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"
                          >
                            <PencilIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      {editingUser && (
        <GeofenceEditorModal
          user={editingUser}
          onSave={handleGeofenceSave}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
