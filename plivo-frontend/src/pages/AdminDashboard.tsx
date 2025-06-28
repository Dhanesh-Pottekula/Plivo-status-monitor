import React from 'react';
import MainLayout from './MainLayout';

export default function AdminDashboard() {
  return (
    <MainLayout title="Admin Dashboard">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Admin Dashboard</h2>
        <p className="text-gray-600">
          This is the admin dashboard. You can manage users, view analytics, and configure system settings here.
        </p>
        
        {/* Sample Dashboard Content */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">1,234</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Active Sessions</h3>
            <p className="text-2xl font-bold text-green-600">89</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">System Status</h3>
            <p className="text-2xl font-bold text-purple-600">Healthy</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
