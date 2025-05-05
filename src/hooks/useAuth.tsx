import { useEffect, useState, useContext, createContext } from "react";

import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

interface StudentProfile {
  fullName: string;
  email: string;
  gender: string;
  age: number;
  phone: string;
  profileImage: string;
  level?: string;
  department?: string;
  registeredAt: any;
  lastLogin: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  studentData: StudentProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const studentRef = doc(db, "students", firebaseUser.uid);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          setStudentData(studentSnap.data() as StudentProfile);
          await updateDoc(studentRef, {
            lastLogin: serverTimestamp(),
          });
        } else {
          setStudentData(null);
        }
      } else {
        setStudentData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, studentData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};