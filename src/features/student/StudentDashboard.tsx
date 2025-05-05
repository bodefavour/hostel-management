import { useEffect, useState } from "react";
import { getDocs, collection, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";

const StudentDashboard = () => {
  const { user } = useAuth();
  interface Booking {
    id: string;
    hostelName: string;
    roomTitle: string;
    status: string;
    checkInDate: { seconds: number };
    amountPaid: number;
  }

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, "bookings"), where("studentId", "==", user?.uid));
        const querySnapshot = await getDocs(q);
        const bookingsData = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const hostelRef = doc(db, "hostels", data.hostelId);
          const hostelSnap = await getDoc(hostelRef);
          const roomSnap = await getDoc(doc(db, "hostels", data.hostelId, "rooms", data.roomId));
          return {
            id: docSnap.id,
            hostelName: hostelSnap.exists() ? hostelSnap.data().name : "Unknown",
            roomTitle: roomSnap.exists() ? roomSnap.data().title : "Unknown",
            status: data.status || "Unknown",
            checkInDate: data.checkInDate || { seconds: 0 },
            amountPaid: data.amountPaid || 0,
          };
        }));
        setBookings(bookingsData);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchBookings();
    }
  }, [user?.uid]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Welcome, {user?.displayName || "Student"} 🎓</h1>
      <h2 className="text-xl font-bold mb-2">Your Bookings</h2>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="border rounded-xl p-4 shadow">
              <h3 className="text-lg font-bold">{booking.hostelName} - {booking.roomTitle}</h3>
              <p>Status: {booking.status}</p>
              <p>Check-in: {new Date(booking.checkInDate.seconds * 1000).toLocaleDateString()}</p>
              <p>Amount Paid: ₦{booking.amountPaid.toLocaleString()}</p>
              {/* TODO: Add packout button if eligible */}
            </div>
          ))
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;