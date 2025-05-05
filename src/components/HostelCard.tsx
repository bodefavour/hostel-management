import React from "react";
import { Link } from "react-router-dom";

type HostelCardProps = {
  hostel: {
    id: string;
    name: string;
    type: "Male" | "Female" | "Mixed";
    location: {
      address: string;
    };
    images: string[];
    priceRange: {
      min: number;
      max: number;
    };
    amenities: string[];
  };
};

const HostelCard: React.FC<HostelCardProps> = ({ hostel }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 space-y-2">
      <img
        src={hostel.images[0] || "/assets/placeholder.jpg"}
        alt={hostel.name}
        className="w-full h-48 object-cover rounded-xl"
      />

      <div>
        <h2 className="text-lg font-bold text-gray-800">{hostel.name}</h2>
        <p className="text-sm text-gray-500">{hostel.location.address}</p>
        <p className="text-sm text-orange-600 font-medium">
          Type: {hostel.type}
        </p>
        <p className="text-sm font-semibold text-gray-800">
          ₦{hostel.priceRange.min.toLocaleString()} – ₦{hostel.priceRange.max.toLocaleString()}
        </p>
      </div>

      <Link
        to={`/student/hostels/${hostel.id}`}
        className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600"
      >
        View Details
      </Link>
    </div>
  );
};

export default HostelCard;