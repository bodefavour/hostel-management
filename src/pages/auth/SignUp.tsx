import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [role, setRole] = useState<'student' | 'landlord' | 'admin'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Add role-specific data to Firestore
      if (role === 'student') {
        await setDoc(doc(db, 'students', uid), {
          fullName,
          email,
          phone,
          gender: '',
          age: 0,
          profileImage: '',
          level: '',
          department: '',
          registeredAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
        navigate('/student');
      }

      if (role === 'landlord') {
        await setDoc(doc(db, 'landlords', uid), {
          fullName,
          email,
          phone,
          hostels: [],
          joinedAt: serverTimestamp(),
        });
        navigate('/landlord');
      }

      if (role === 'admin') {
        await setDoc(doc(db, 'admins', uid), {
          name: fullName,
          email,
          role: 'moderator',
          permissions: [],
          createdAt: serverTimestamp(),
        });
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-300 rounded-full mx-auto mb-2">LOGO</div>
          <h2 className="text-2xl font-bold text-gray-800">Create an account</h2>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none"
          >
            <option value="student">Student</option>
            <option value="landlord">Landlord</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;