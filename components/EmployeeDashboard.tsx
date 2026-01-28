
import React, { useEffect, useState } from 'react';
import { User, AttendanceRecord, Location, Geofence } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import MapDisplay from './MapDisplay';
import { LocationIcon } from './icons/LocationIcon';
import { ClockIcon } from './icons/ClockIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { GeoTrackerLogo } from './icons/GeoTrackerLogo';

interface EmployeeDashboardProps {
  currentUser: User;
  attendanceRecords: AttendanceRecord[];
  onMarkAttendance: (userId: number, location: Location) => void;
  onLogout: () => void;
  attendanceError: string | null;
  clearAttendanceError: () => void;
  defaultGeofence: Geofence;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  attendanceRecords,
  onMarkAttendance,
  onLogout,
  attendanceError,
  clearAttendanceError,
  defaultGeofence,
}) => {
  const { location, error: geoError, isLoading, getLocation } = useGeolocation();
  const [mapView, setMapView] = useState<Location | null>(null);

  const employeeGeofence = currentUser.geofence || defaultGeofence;

  useEffect(() => {
    if (location) {
      onMarkAttendance(currentUser.id, location);
      setMapView(location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  
  const handleAttendanceClick = () => {
    clearAttendanceError();
    getLocation();
  }

  const handleHistoryClick = (record: AttendanceRecord) => {
    setMapView(record.checkInLocation);
  }

  const currentStatusRecord = attendanceRecords.find((r) => !r.checkOutTime);
  const statusText = currentStatusRecord ? 'Checked In' : 'Checked Out';
  const statusColor = currentStatusRecord ? 'bg-green-500' : 'bg-red-500';
  const buttonText = currentStatusRecord ? 'Check Out' : 'Check In';
  
  const sortedRecords = [...attendanceRecords].sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime());

  const mapCenter = mapView || employeeGeofence.center;

  return (
    <div className="md:flex">
      <header className="bg-brand-dark text-white p-4 flex justify-between items-center w-full md:hidden">
        <div className="flex items-center space-x-2">
            <div className="h-8 w-8"><GeoTrackerLogo isLight={true}/></div>
            <h1 className="text-xl font-bold">GeoTracker</h1>
        </div>
        <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-700">
            <LogoutIcon />
        </button>
      </header>

      <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
             <h2 className="text-3xl font-bold text-brand-dark">Welcome, {currentUser.name.split(' ')[0]}!</h2>
             <button onClick={onLogout} className="hidden md:flex items-center space-x-2 text-brand-secondary hover:text-brand-primary">
                <LogoutIcon />
                <span>Logout</span>
            </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 flex flex-col justify-center">
              <div className="flex items-center justify-center space-x-3">
                <p className="text-lg text-brand-secondary">Your current status:</p>
                <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${statusColor}`}>
                  {statusText}
                </span>
              </div>
              <button
                onClick={handleAttendanceClick}
                disabled={isLoading}
                className="w-full md:w-3/4 mx-auto py-4 px-6 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Getting Location...' : buttonText}
              </button>
              {geoError && <p className="text-red-500 text-sm mt-2 text-center">{geoError}</p>}
              {attendanceError && <p className="text-red-500 text-sm mt-2 text-center">{attendanceError}</p>}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-2 h-80 md:h-auto">
                <MapDisplay
                    key={`${mapCenter.latitude}-${mapCenter.longitude}`}
                    center={mapCenter}
                    markerPosition={mapView}
                    circle={employeeGeofence}
                    zoom={15}
                />
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-brand-dark mb-4">Your Attendance History</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {sortedRecords.length > 0 ? (
              sortedRecords.map((record) => (
                <button key={record.id} onClick={() => handleHistoryClick(record)} className="w-full text-left bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-brand-primary">
                  <div>
                    <p className="font-semibold text-brand-dark">{record.checkInTime.toLocaleDateString()}</p>
                    <div className="flex items-center text-sm text-brand-secondary space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <ClockIcon />
                        <span>In: {record.checkInTime.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="opacity-50" />
                        <span>Out: {record.checkOutTime ? record.checkOutTime.toLocaleTimeString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-2 md:mt-0">
                    <LocationIcon />
                    <span>{record.checkInLocation.latitude.toFixed(4)}, {record.checkInLocation.longitude.toFixed(4)}</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-brand-secondary text-center py-4">No attendance records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
