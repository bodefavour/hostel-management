// /pages/student/HostelListPage.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import HostelCard from "../../components/HostelCard";

interface Hostel {
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
}

const HostelListPage: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const snapshot = await getDocs(collection(db, "hostels"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Hostel[];
        setHostels(data);
      } catch (err) {
        console.error("Error fetching hostels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Available Hostels</h1>

      {loading ? (
        <p className="text-gray-500">Loading hostels...</p>
      ) : hostels.length === 0 ? (
        <p className="text-gray-600">No hostels found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map(hostel => (
            <HostelCard key={hostel.id} hostel={hostel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HostelListPage;