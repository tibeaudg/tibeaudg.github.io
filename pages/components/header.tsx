// components/Header.tsx
import React, { useState } from "react";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "../../utils/firebase"; // Zorg dat je firebase hier importeert

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (

    
    <header className="header">
      <div className="logo">
        <Image src="/assets/Magic Quest.png" alt="Logo" width={100} height={100} />
      </div>
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className="hamburger-icon"></div>
        <div className="hamburger-icon"></div>
        <div className="hamburger-icon"></div>
      </div>

      {menuOpen && (
        <div className="menu">
          <div className="menu-item" onClick={handleLogout}>Logout</div>
          {/* Voeg hier meer menu-items toe */}
        </div>
      )}
    </header>
  );
};

export default Header;
