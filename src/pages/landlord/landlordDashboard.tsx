import React from "react";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export interface User {
  data?: landlordData; 
  role: string;
}

interface landlordData {
  fullName: string; 
}

const LandlordDashboard: React.FC = () => {
  const { user } = useAuth() as unknown as { user: User };

  const fullName = user && user.role === 'landlord' ? (user.data as landlordData).fullName : '';

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="bg-orange-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Welcome, {fullName?.split(" ")[0]} 👋
          </h2>
          <p className="text-gray-700">Manage your hostels and bookings</p>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Your Hostels</h3>
          <Link
            to="/landlord/add-hostel"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            + Add Hostel
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder: Replace with mapped hostel cards later */}
          <div className="bg-white p-4 rounded shadow text-center text-gray-500">
            No hostels added yet.
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LandlordDashboard;