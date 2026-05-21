import { User, AttendanceRecord, Role, Location, Geofence, Leave, LeaveType, LeaveStatus, MonthlyAttendanceSummary } from "../types";

// Auto-detect backend URL from current window or use environment
// In WSL, use the same host as the frontend is served from
const getApiBaseUrl = (): string => {
  // Check if there's a custom API URL set in localStorage (useful for WSL/Windows)
  const customUrl = localStorage.getItem('geotracker_api_url');
  if (customUrl) return customUrl;

  // Use relative path - works when frontend and backend are on same domain
  // For development with separate ports, use the current hostname
  const { protocol, hostname } = window.location;
  // For WSL accessing from Windows browser, use current host
  return `${protocol}//${hostname}:${window.location.port}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Helper to get auth token
const getToken = (): string | null => localStorage.getItem("geotracker_token");

// Helper for authenticated fetch
const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response;
};

// Auth API
export const login = async (name: string, password: string): Promise<{ token: string; user: User }> => {
  // DEMO LOGIC - use fetchDemoUsers() so localStorage-stored users (newly added) are included
  try {
    const users = await fetchDemoUsers();
    if (users) {
      const user = users.find((u: any) => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
      if (user) {
        const token = "demo-token";
        localStorage.setItem("geotracker_token", token);
        return { token, user: { ...user, role: user.role as Role } };
      }
      // Found demo users but credentials didn't match — throw immediately (no real backend)
      throw new Error("Invalid username or password");
    }
  } catch (e) {
    if ((e as Error).message === "Invalid username or password") throw e;
    console.error("Demo auth failed", e);
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  const data = await response.json();
  localStorage.setItem("geotracker_token", data.token);
  return data;
};

export const logout = (): void => {
  localStorage.removeItem("geotracker_token");
};

// ==================== Demo Users (localStorage-backed) ====================
const LS_USERS = 'geotracker_demo_users';
let demoUsersCache: any[] | null = null;

const saveDemoUsers = () => {
  if (demoUsersCache) localStorage.setItem(LS_USERS, JSON.stringify(demoUsersCache));
};

const fetchDemoUsers = async (): Promise<any[] | null> => {
  if (demoUsersCache !== null) return demoUsersCache;
  // 1. Check localStorage first (survives refresh)
  const saved = localStorage.getItem(LS_USERS);
  if (saved) { try { demoUsersCache = JSON.parse(saved); return demoUsersCache; } catch (e) {} }
  // 2. Fall back to static JSON
  try {
    const res = await fetch("/data/users.json");
    if (res.ok) {
      demoUsersCache = await res.json();
      saveDemoUsers();
      return demoUsersCache;
    }
  } catch (e) {}
  return null;
};

const mapUser = (user: any): User => ({
  id: user.id,
  name: user.name,
  role: user.role as Role,
  geofence: user.geofence ? { center: user.geofence.center, radius: user.geofence.radius } : undefined,
});

export const getAllUsers = async (): Promise<User[]> => {
  const demo = await fetchDemoUsers();
  if (demo) return demo.map(mapUser);

  const response = await fetchWithAuth("/users");
  const users = await response.json();
  return users.map((user: any) => ({
    id: user.id,
    name: user.name,
    role: user.role as Role,
    geofence: user.geofence
      ? { center: { latitude: user.geofence.centerLatitude, longitude: user.geofence.centerLongitude }, radius: user.geofence.radius }
      : undefined,
  }));
};

export const addUser = async (name: string, password: string): Promise<User> => {
  const demo = await fetchDemoUsers();
  if (demo) {
    const exists = demo.find((u: any) => u.name.toLowerCase() === name.toLowerCase());
    if (exists) throw new Error("User already exists");
    const newId = Math.max(...demo.map((u: any) => u.id)) + 1;
    const newUser = { id: newId, name, password, role: "EMPLOYEE" };
    demo.push(newUser);
    saveDemoUsers();
    return mapUser(newUser);
  }
  const response = await fetchWithAuth("/users", { method: "POST", body: JSON.stringify({ name, password }) });
  return mapUser(await response.json());
};

export const removeUser = async (userId: number): Promise<void> => {
  const demo = await fetchDemoUsers();
  if (demo) {
    const idx = demo.findIndex((u: any) => u.id === userId);
    if (idx !== -1) demo.splice(idx, 1);
    saveDemoUsers();
    return;
  }
  await fetchWithAuth(`/users/${userId}`, { method: "DELETE" });
};

export const updateUserGeofence = async (userId: number, geofence: Geofence | undefined): Promise<User> => {
  const demo = await fetchDemoUsers();
  if (demo) {
    const user = demo.find((u: any) => u.id === userId);
    if (user) {
      user.geofence = geofence ? { center: geofence.center, radius: geofence.radius } : undefined;
      saveDemoUsers();
      return mapUser(user);
    }
  }
  const body = geofence
    ? { centerLatitude: geofence.center.latitude, centerLongitude: geofence.center.longitude, radius: geofence.radius }
    : {};
  const response = await fetchWithAuth(`/users/${userId}/geofence`, { method: "PUT", body: JSON.stringify(body) });
  return mapUser(await response.json());
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> => {
  // Demo fallback: validate and update password in localStorage-backed user cache
  const demo = await fetchDemoUsers();
  if (demo) {
    if (newPassword !== confirmPassword) {
      throw new Error("New passwords do not match");
    }
    // Get current logged-in user
    let userId: number | null = null;
    try {
      const saved = localStorage.getItem("geotracker_user");
      if (saved) userId = JSON.parse(saved).id;
    } catch (e) {}

    const user = demo.find((u: any) => u.id === userId);
    if (!user) throw new Error("User not found");
    if (user.password !== currentPassword) throw new Error("Current password is incorrect");

    user.password = newPassword;
    saveDemoUsers();
    return;
  }

  await fetchWithAuth("/users/change-password", {
    method: "POST",
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmPassword,
    }),
  });
};

// ==================== Demo Attendance (localStorage-backed) ====================
const LS_ATTENDANCE = 'geotracker_demo_attendance';
let demoAttendanceCache: any[] | null = null;

const saveDemoAttendance = () => {
  if (demoAttendanceCache) localStorage.setItem(LS_ATTENDANCE, JSON.stringify(demoAttendanceCache));
};

const fetchDemoAttendance = async (): Promise<any[] | null> => {
  if (demoAttendanceCache !== null) return demoAttendanceCache;
  // 1. Check localStorage first
  const saved = localStorage.getItem(LS_ATTENDANCE);
  if (saved) { try { demoAttendanceCache = JSON.parse(saved); return demoAttendanceCache; } catch (e) {} }
  // 2. Fall back to static JSON
  try {
    const res = await fetch("/data/attendance.json");
    if (res.ok) {
      demoAttendanceCache = await res.json();
      saveDemoAttendance();
      return demoAttendanceCache;
    }
  } catch (e) {}
  return null;
};

const mapRecord = (record: any): AttendanceRecord => ({
  id: record.id,
  userId: record.userId,
  checkInTime: new Date(record.checkInTime),
  checkOutTime: record.checkOutTime ? new Date(record.checkOutTime) : undefined,
  checkInLocation: {
    latitude: record.checkInLocation?.latitude ?? record.checkInLatitude ?? 21.0125,
    longitude: record.checkInLocation?.longitude ?? record.checkInLongitude ?? 75.5025,
  },
});

export const getAllAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  const demo = await fetchDemoAttendance();
  if (demo) return demo.map(mapRecord);

  const response = await fetchWithAuth("/attendance");
  const records = await response.json();
  return records.map((record: any) => ({
    id: record.id,
    userId: record.userId,
    checkInTime: new Date(record.checkInTime + 'Z'),
    checkOutTime: record.checkOutTime ? new Date(record.checkOutTime + 'Z') : undefined,
    checkInLocation: { latitude: record.checkInLatitude, longitude: record.checkInLongitude },
  }));
};

export const getUserAttendanceRecords = async (userId: number): Promise<AttendanceRecord[]> => {
  const demo = await fetchDemoAttendance();
  if (demo) return demo.filter((r: any) => r.userId === userId).map(mapRecord);

  const response = await fetchWithAuth(`/attendance/user/${userId}`);
  const records = await response.json();
  return records.map((record: any) => ({
    id: record.id,
    userId: record.userId,
    checkInTime: new Date(record.checkInTime + 'Z'),
    checkOutTime: record.checkOutTime ? new Date(record.checkOutTime + 'Z') : undefined,
    checkInLocation: { latitude: record.checkInLatitude, longitude: record.checkInLongitude },
  }));
};

export const checkIn = async (location: Location): Promise<AttendanceRecord> => {
  const demo = await fetchDemoAttendance();
  if (demo) {
    let userId = 2;
    try {
      const saved = localStorage.getItem("geotracker_user");
      if (saved) userId = JSON.parse(saved).id;
    } catch (e) {}
    const newId = demo.length > 0 ? Math.max(...demo.map((r: any) => r.id)) + 1 : 1;
    const newRecord = {
      id: newId, userId,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      checkInLocation: { latitude: location.latitude, longitude: location.longitude },
    };
    demo.push(newRecord);
    saveDemoAttendance();
    return mapRecord(newRecord);
  }
  const response = await fetchWithAuth("/attendance/checkin", { method: "POST", body: JSON.stringify(location) });
  return mapRecord(await response.json());
};

export const checkOut = async (): Promise<AttendanceRecord> => {
  const demo = await fetchDemoAttendance();
  if (demo) {
    let userId = 2;
    try {
      const saved = localStorage.getItem("geotracker_user");
      if (saved) userId = JSON.parse(saved).id;
    } catch (e) {}
    const open = [...demo].reverse().find((r: any) => r.userId === userId && !r.checkOutTime);
    if (open) {
      open.checkOutTime = new Date().toISOString();
      saveDemoAttendance();
      return mapRecord(open);
    }
  }
  const response = await fetchWithAuth("/attendance/checkout", { method: "POST" });
  return mapRecord(await response.json());
};

// Check if user has open check-in (for determining button state)
export const getOpenCheckIn = async (): Promise<AttendanceRecord | null> => {
  const token = getToken();
  if (!token) return null;

  // Decode JWT to get user ID (simple base64 decode)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.sub;

    const records = await getUserAttendanceRecords(userId);
    return records.find((r) => !r.checkOutTime) || null;
  } catch {
    return null;
  }
};

// Initialize API - just validates connection
export const initializeAPI = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Method to override API URL (useful for WSL+Windows setup)
export const setApiUrl = (url: string) => {
  localStorage.setItem('geotracker_api_url', url);
};

// Get current API URL for display
export const getApiUrl = (): string => API_BASE_URL;

// ==================== Demo Leaves (localStorage-backed) ====================

// Shared helper: map raw leave object to typed Leave
const mapLeave = (leave: any): Leave => ({
  id: leave.id,
  userId: leave.userId,
  userName: leave.userName,
  type: leave.type as LeaveType,
  status: leave.status as LeaveStatus,
  startDate: new Date(leave.startDate),
  endDate: new Date(leave.endDate),
  reason: leave.reason,
  approvedBy: leave.approvedBy,
  approvedByName: leave.approvedByName,
  approvedAt: leave.approvedAt ? new Date(leave.approvedAt) : undefined,
  createdAt: new Date(leave.createdAt),
});
const LS_LEAVES = 'geotracker_demo_leaves';
let demoLeavesCache: any[] | null = null;

const saveDemoLeaves = () => {
  if (demoLeavesCache) localStorage.setItem(LS_LEAVES, JSON.stringify(demoLeavesCache));
};

const fetchDemoLeaves = async (): Promise<any[] | null> => {
  if (demoLeavesCache !== null) return demoLeavesCache;
  // 1. Check localStorage first
  const saved = localStorage.getItem(LS_LEAVES);
  if (saved) { try { demoLeavesCache = JSON.parse(saved); return demoLeavesCache; } catch (e) {} }
  // 2. Fall back to static JSON
  try {
    const res = await fetch("/data/leaves.json");
    if (res.ok) {
      demoLeavesCache = await res.json();
      saveDemoLeaves();
      return demoLeavesCache;
    }
  } catch (e) {}
  return null;
};

export const getMyLeaves = async (): Promise<Leave[]> => {
  const demo = await fetchDemoLeaves();
  if (demo) return demo.map(mapLeave);

  const response = await fetchWithAuth("/leaves/my");
  const leaves = await response.json();
  return leaves.map(mapLeave);
};

export const getLeavesByUser = async (userId: number): Promise<Leave[]> => {
  const demo = await fetchDemoLeaves();
  if (demo) return demo.filter((l: any) => l.userId === userId).map(mapLeave);

  const response = await fetchWithAuth("/leaves");
  const leaves = await response.json();
  return leaves.filter((leave: any) => leave.userId === userId).map(mapLeave);
};

export const getPendingLeaves = async (): Promise<Leave[]> => {
  const demo = await fetchDemoLeaves();
  if (demo) return demo.filter((l: any) => l.status === "PENDING").map(mapLeave);

  const response = await fetchWithAuth("/leaves/pending");
  const leaves = await response.json();
  return leaves.map(mapLeave);
};

export const getAllLeaves = async (): Promise<Leave[]> => {
  const demo = await fetchDemoLeaves();
  if (demo) return demo.map(mapLeave);

  const response = await fetchWithAuth("/leaves");
  const leaves = await response.json();
  return leaves.map(mapLeave);
};

export const createLeave = async (
  type: LeaveType,
  startDate: string,
  endDate: string,
  reason: string
): Promise<Leave> => {
  // Demo fallback: persist new leave into localStorage-backed cache
  const demo = await fetchDemoLeaves();
  if (demo) {
    // Get current user from localStorage
    let userId = 2;
    let userName = "Employee";
    try {
      const saved = localStorage.getItem("geotracker_user");
      if (saved) { const u = JSON.parse(saved); userId = u.id; userName = u.name; }
    } catch (e) {}
    const newId = demo.length > 0 ? Math.max(...demo.map((l: any) => l.id)) + 1 : 1;
    const newLeave = {
      id: newId,
      userId,
      userName,
      type,
      status: "PENDING",
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      reason,
      approvedBy: null,
      approvedByName: null,
      approvedAt: null,
      createdAt: new Date().toISOString(),
    };
    demo.push(newLeave);
    saveDemoLeaves();
    return mapLeave(newLeave);
  }

  const response = await fetchWithAuth("/leaves", {
    method: "POST",
    body: JSON.stringify({
      type,
      startDate,
      endDate,
      reason,
    }),
  });

  const leave = await response.json();
  return {
    id: leave.id,
    userId: leave.userId,
    userName: leave.userName,
    type: leave.type as LeaveType,
    status: leave.status as LeaveStatus,
    startDate: new Date(leave.startDate),
    endDate: new Date(leave.endDate),
    reason: leave.reason,
    approvedBy: leave.approvedBy,
    approvedByName: leave.approvedByName,
    approvedAt: leave.approvedAt ? new Date(leave.approvedAt) : undefined,
    createdAt: new Date(leave.createdAt),
  };
};

export const approveLeave = async (leaveId: number): Promise<Leave> => {
  // Demo fallback: mutate in-memory cache
  const demo = await fetchDemoLeaves();
  if (demo) {
    const leaf = demo.find((l: any) => l.id === leaveId);
    if (leaf) {
      leaf.status = "APPROVED";
      leaf.approvedBy = 1;
      leaf.approvedByName = "admin";
      leaf.approvedAt = new Date().toISOString();
      saveDemoLeaves();
      return mapLeave(leaf);
    }
  }

  const response = await fetchWithAuth(`/leaves/${leaveId}/approve`, {
    method: "POST",
  });
  const leave = await response.json();
  return mapLeave(leave);
};

export const rejectLeave = async (leaveId: number): Promise<Leave> => {
  // Demo fallback: mutate in-memory cache
  const demo = await fetchDemoLeaves();
  if (demo) {
    const leaf = demo.find((l: any) => l.id === leaveId);
    if (leaf) {
      leaf.status = "REJECTED";
      leaf.approvedBy = 1;
      leaf.approvedByName = "admin";
      leaf.approvedAt = new Date().toISOString();
      saveDemoLeaves();
      return mapLeave(leaf);
    }
  }

  const response = await fetchWithAuth(`/leaves/${leaveId}/reject`, {
    method: "POST",
  });
  const leave = await response.json();
  return mapLeave(leave);
};

// ==================== Monthly Attendance Summary ====================
export const getMonthlyAttendanceSummary = async (
  year: number,
  month: number
): Promise<MonthlyAttendanceSummary> => {
  // Demo fallback: compute from localStorage-backed attendance cache
  const demoAtt = await fetchDemoAttendance();
  if (demoAtt) {
    // Get current user id from localStorage
    let userId: number | null = null;
    try {
      const saved = localStorage.getItem("geotracker_user");
      if (saved) userId = JSON.parse(saved).id;
    } catch (e) {}

    const userRecords = demoAtt.filter((r: any) => {
      const d = new Date(r.checkInTime);
      return (userId === null || r.userId === userId) &&
        d.getFullYear() === year && d.getMonth() === month;
    });

    const checkInDays: string[] = [];
    let totalWorkingMinutes = 0;
    userRecords.forEach((r: any) => {
      const dateKey = new Date(r.checkInTime).toISOString().split('T')[0];
      if (!checkInDays.includes(dateKey)) checkInDays.push(dateKey);
      if (r.checkOutTime) {
        totalWorkingMinutes += (new Date(r.checkOutTime).getTime() - new Date(r.checkInTime).getTime()) / 60000;
      }
    });

    return {
      year,
      month,
      checkInDays,
      totalWorkingMinutes: Math.round(totalWorkingMinutes),
      totalDaysPresent: checkInDays.length,
    };
  }

  const response = await fetchWithAuth(`/attendance/summary/${year}/${month}`);
  const summary = await response.json();

  return {
    year: summary.year,
    month: summary.month,
    checkInDays: summary.checkInDays,
    totalWorkingMinutes: summary.totalWorkingMinutes,
    totalDaysPresent: summary.totalDaysPresent,
  };
};

export const getUserMonthlySummary = async (
  userId: number,
  year: number,
  month: number
): Promise<MonthlyAttendanceSummary> => {
  // Demo fallback: compute summary from local attendance.json
  try {
    const res = await fetch("/data/attendance.json");
    if (res.ok) {
      const records = await res.json();
      const userRecords = records.filter((r: any) => {
        const d = new Date(r.checkInTime);
        return r.userId === userId && d.getFullYear() === year && d.getMonth() === month;
      });
      const checkInDays: string[] = [];
      let totalWorkingMinutes = 0;
      userRecords.forEach((r: any) => {
        const dateKey = new Date(r.checkInTime).toISOString().split('T')[0];
        if (!checkInDays.includes(dateKey)) checkInDays.push(dateKey);
        if (r.checkOutTime) {
          totalWorkingMinutes += (new Date(r.checkOutTime).getTime() - new Date(r.checkInTime).getTime()) / 60000;
        }
      });
      return {
        year,
        month,
        checkInDays,
        totalWorkingMinutes: Math.round(totalWorkingMinutes),
        totalDaysPresent: checkInDays.length,
      };
    }
  } catch (e) {}

  const response = await fetchWithAuth(`/attendance/summary/${userId}/${year}/${month}`);
  const summary = await response.json();

  return {
    year: summary.year,
    month: summary.month,
    checkInDays: summary.checkInDays,
    totalWorkingMinutes: summary.totalWorkingMinutes,
    totalDaysPresent: summary.totalDaysPresent,
  };
};
