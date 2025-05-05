// src/features/Bookings/pages/BookRoom.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../hooks/useAuth';

export default function BookRoom() {
  const { hostelId, roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoom() {
      const roomRef = doc(db, 'hostels', hostelId!, 'rooms', roomId!);
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        setRoom({ id: roomSnap.id, ...roomSnap.data() });
      }
      setLoading(false);
    }
    fetchRoom();
  }, [hostelId, roomId]);

  async function handleBooking() {
    if (!user || !room) return;

    // 1. Create booking record
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      studentId: user.uid,
      hostelId,
      roomId,
      amountPaid: room.price,
      paymentReference: 'test-payment-ref', // to be replaced with actual ref later
      status: 'confirmed',
      bookedAt: Timestamp.now(),
      checkInDate: Timestamp.now(),
      checkOutDate: null,
      paymentSplit: {
        landlordAmount: room.price * 0.9,
        platformFee: room.price * 0.1
      }
    });

    // 2. Update room status
    const roomRef = doc(db, 'hostels', hostelId!, 'rooms', roomId!);
    await updateDoc(roomRef, {
      isBooked: true,
      bookedBy: user.uid,
      bookedAt: Timestamp.now(),
      status: 'booked'
    });

    // 3. Navigate to booking success page or dashboard
    navigate('/dashboard/student');
  }

  if (loading) return <p>Loading...</p>;
  if (!room) return <p>Room not found</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Room: {room.title}</h1>
      <p className="mb-2">Type: {room.roomType}</p>
      <p className="mb-2">Price: ₦{room.price}</p>
      <p className="mb-2">Features: {room.features.join(', ')}</p>
      <button onClick={handleBooking} className="bg-orange-500 text-white px-4 py-2 rounded">
        Confirm Booking
      </button>
    </div>
  );
}