
export enum Role {
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
}

export interface User {
  id: number;
  name: string;
  role: Role;
  password?: string;
  geofence?: Geofence;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface AttendanceRecord {
  id: number;
  userId: number;
  checkInTime: Date;
  checkOutTime?: Date;
  checkInLocation: Location;
}

export interface Geofence {
  center: Location;
  radius: number; // in meters
}