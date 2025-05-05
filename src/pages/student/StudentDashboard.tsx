// src/pages/student/StudentDashboard.tsx
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export interface User {
  data?: StudentData; 
  role: string; 
}

interface StudentData {
  fullName: string; 
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth() as unknown as { user: User };
  const fullName = user && user.role === 'student' ? (user.data as StudentData).fullName : '';

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="bg-orange-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Welcome, {fullName?.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-700">Here's your dashboard overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Summary */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="text-lg font-semibold mb-2">Current Booking</h3>
            <p className="text-gray-600">You have no current booking.</p>
            <Link
              to="/hostels"
              className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
            >
              Book a Room
            </Link>
          </div>

          {/* Pack-out CTA */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="text-lg font-semibold mb-2">Leaving Soon?</h3>
            <p className="text-gray-600">Initiate a pack-out request when you're ready.</p>
            <Link
              to="/packout-request"
              className="mt-4 inline-block bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-md"
            >
              Request Pack-Out
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;