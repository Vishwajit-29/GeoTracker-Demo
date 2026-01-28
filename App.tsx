import React, { useState, useEffect } from 'react';
import { User, Role, AttendanceRecord, Location, Geofence } from './types';
import { DEFAULT_GEOFENCE } from './constants';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import * as db from './services/dbService';

// Haversine formula to calculate distance between two lat/lng points in meters
const getDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371e3; // metres
  const φ1 = (loc1.latitude * Math.PI) / 180;
  const φ2 = (loc2.latitude * Math.PI) / 180;
  const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      await db.initializeDB();
      setUsers(db.getAllUsers());
      setAttendanceRecords(db.getAllAttendanceRecords());
      setIsLoading(false);
    };

    loadData();
  }, []);


  const handleLogin = (name: string, password: string):boolean => {
    const user = users.find(
      (u) => u.name === name && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleMarkAttendance = (userId: number, location: Location) => {
    setAttendanceError(null);
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const existingRecord = attendanceRecords.find(
      (record) => record.userId === userId && !record.checkOutTime
    );

    if (existingRecord) {
      // Check out - no geofence restriction
      const updatedRecord = { ...existingRecord, checkOutTime: new Date() };
      db.updateAttendanceRecord(updatedRecord);
      setAttendanceRecords(records => records.map(r => r.id === updatedRecord.id ? updatedRecord : r));

    } else {
      // Check in - apply geofence restriction
      const geofence = user.geofence || DEFAULT_GEOFENCE;
      const distance = getDistance(location, geofence.center);
      if (distance > geofence.radius) {
        setAttendanceError(`Check-in failed: You are outside the designated work area. (${Math.round(distance)}m away)`);
        return;
      }

      const newRecord: AttendanceRecord = {
        id: Date.now(), // Use timestamp for unique ID
        userId,
        checkInTime: new Date(),
        checkInLocation: location,
      };
      db.addAttendanceRecord(newRecord);
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };
  
  const handleSetGeofence = (userId: number, newGeofence: Geofence | undefined) => {
    db.updateUserGeofence(userId, newGeofence);
    setUsers(db.getAllUsers());
  };

  const handleAddUser = (name: string, password: string) => {
    const newUser: User = {
      id: Date.now(),
      name: name,
      password,
      role: Role.Employee,
    };
    db.addUser(newUser);
    setUsers(db.getAllUsers());
  };

  const handleRemoveUser = (userId: number) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      db.removeUser(userId);
      db.removeAttendanceRecordsForUser(userId);
      setUsers(db.getAllUsers());
      setAttendanceRecords(db.getAllAttendanceRecords());
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-brand-secondary">Loading GeoTracker...</p>
        </div>
      );
    }
      
    if (!currentUser) {
      return <LoginScreen users={users} onLogin={handleLogin} />;
    }

    const fullCurrentUser = users.find(u => u.id === currentUser.id) || currentUser;

    if (currentUser.role === Role.Admin) {
      return (
        <AdminDashboard
          currentUser={fullCurrentUser}
          allUsers={users}
          attendanceRecords={attendanceRecords}
          onSetGeofence={handleSetGeofence}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
          onLogout={handleLogout}
        />
      );
    }

    if (currentUser.role === Role.Employee) {
      const employeeRecords = attendanceRecords.filter((record) => record.userId === currentUser.id);
      return (
        <EmployeeDashboard
          currentUser={fullCurrentUser}
          attendanceRecords={employeeRecords}
          onMarkAttendance={handleMarkAttendance}
          onLogout={handleLogout}
          attendanceError={attendanceError}
          clearAttendanceError={() => setAttendanceError(null)}
          defaultGeofence={DEFAULT_GEOFENCE}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <main>{renderContent()}</main>
    </div>
  );
};

export default App;
