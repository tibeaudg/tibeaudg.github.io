import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../utils/firebase"; // Zorg dat je firebase hier importeert
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface UserData {
  username?: string;
  points?: number;
  gamesPlayed?: number;
  level?: number;
  streak?: number;
}

const Header: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.email) {
          console.error("User has no email address!");
          setLoading(false);
          return;
        }
        
        const userRef = doc(db, "users", firebaseUser.email);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          if (!userData.username || userData.username.trim() === "") {
            const updatedUsername = firebaseUser.displayName || "User";
            await updateDoc(userRef, { username: updatedUsername });
            userData.username = updatedUsername;
          }
          setUser(userData);
        } else {
          const newUserData: UserData = {
            username: firebaseUser.displayName || "User",
            points: 0,
            streak: 0,
            level: 0,
          };
          await setDoc(userRef, newUserData);
          setUser(newUserData);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="header">


    <div className="stats-inline">
      <div className="stats d-flex align-items-center">
        <i className="fa-solid fa-fire"></i>
        <p className="m-0">
          <span className="number">{user?.streak ?? 0}</span>
        </p>
      </div>
      <div className="stats d-flex align-items-center">
        <i className="fa-solid fa-ticket"></i>
        <p className="m-0">
          <span className="number">{user?.points ?? 0}</span>
        </p>
      </div>
      <div className="stats d-flex align-items-center">
        <i className="fa-solid fa-flag-checkered"></i>
        <p className="m-0">
          <span className="number">{user?.level ?? 0 }</span>
        </p>
      </div>
    </div>



    </header>
  );
};

export default Header;
