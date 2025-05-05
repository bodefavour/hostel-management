import React, { useState } from "react";
import { addDoc, collection, doc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../services/firebase";
import { v4 as uuidv4 } from "uuid";
import MainLayout from "../../layouts/MainLayout";

const AddHostel = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    amenities: "",
    landlordEmail: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Get landlord UID
      const landlordQuery = query(collection(db, "landlords"), where("email", "==", formData.landlordEmail));
      const landlordSnap = await getDocs(landlordQuery);
      if (landlordSnap.empty) {
        throw new Error("Landlord not found with provided email");
      }

      const landlordDoc = landlordSnap.docs[0];
      const landlordUID = landlordDoc.id;

      // Upload images to Firebase Storage
      const imageURLs: string[] = [];
      for (const image of images) {
        const imageRef = ref(storage, `hostel-images/${uuidv4()}-${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        imageURLs.push(url);
      }

      // Create new hostel
      const hostelData = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        amenities: formData.amenities.split(",").map((a) => a.trim()),
        images: imageURLs,
        landlordId: landlordUID,
        createdAt: new Date(),
      };

      const newHostelRef = await addDoc(collection(db, "hostels"), hostelData);

      // Update landlord’s hostel list
      const landlordHostels = landlordDoc.data().hostels || [];
      await updateDoc(doc(db, "landlords", landlordUID), {
        hostels: [...landlordHostels, newHostelRef.id],
      });

      setMessage("Hostel added successfully!");
      setFormData({ name: "", address: "", description: "", amenities: "", landlordEmail: "" });
      setImages([]);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Hostel</h2>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
          <input
            name="name"
            placeholder="Hostel Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
          <input
            name="amenities"
            placeholder="Amenities (comma-separated)"
            value={formData.amenities}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <input
            name="landlordEmail"
            placeholder="Landlord Email"
            value={formData.landlordEmail}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Adding..." : "Add Hostel"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-green-600">{message}</p>
        )}
      </div>
    </MainLayout>
  );
};

export default AddHostel;