import {
    onAuthStateChanged,
    signOut,
    User as FirebaseUser,
  } from "firebase/auth";
  import {
    doc,
    getDoc,
  } from "firebase/firestore";
  import React, {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import { auth, db } from "../services/firebase";
  
  // -----------------------------
  // Types
  // -----------------------------
  type Role = "student" | "landlord" | "admin";
  
  interface StudentData {
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
  
  interface LandlordData {
    fullName: string;
    email: string;
    phone: string;
    hostels: string[];
    joinedAt: any;
  }
  
  interface AdminData {
    name: string;
    email: string;
    role: "superadmin" | "moderator";
    permissions: string[];
    createdAt: any;
  }
  
  interface UserData {
    uid: string;
    role: Role;
    data: StudentData | LandlordData | AdminData;
  }
  
  interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    logout: () => void;
  }
  
  // -----------------------------
  // Context
  // -----------------------------
  export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: () => {},
  });
  
  export const useAuth = () => useContext(AuthContext);
  
  // -----------------------------
  // Provider
  // -----------------------------
  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const uid = firebaseUser.uid;
  
          try {
            const studentDoc = await getDoc(doc(db, "students", uid));
            if (studentDoc.exists()) {
              setUser({
                uid,
                role: "student",
                data: studentDoc.data() as StudentData,
              });
              setLoading(false);
              return;
            }
  
            const landlordDoc = await getDoc(doc(db, "landlords", uid));
            if (landlordDoc.exists()) {
              setUser({
                uid,
                role: "landlord",
                data: landlordDoc.data() as LandlordData,
              });
              setLoading(false);
              return;
            }
  
            const adminDoc = await getDoc(doc(db, "admins", uid));
            if (adminDoc.exists()) {
              setUser({
                uid,
                role: "admin",
                data: adminDoc.data() as AdminData,
              });
              setLoading(false);
              return;
            }
  
            // No matching doc found — sign user out
            console.warn("No user document found. Logging out...");
            await signOut(auth);
            setUser(null);
          } catch (err) {
            console.error("AuthContext error:", err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
  
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    const logout = () => {
      signOut(auth);
    };
  
    return (
      <AuthContext.Provider value={{ user, loading, logout }}>
        {!loading && children}
      </AuthContext.Provider>
    );
  };  