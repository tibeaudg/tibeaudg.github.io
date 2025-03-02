// components/Navbar.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <nav className="navbar">
      <Link href="/" className={`nav-link ${currentRoute === "/" ? "active" : ""}`}>
        <i className={`bi ${currentRoute === "/" ? "bi-house-door-fill" : "bi-house-door"}`}></i>
        <span className="d-block small">Home</span>
      </Link>

      <Link href="/leaderboard" className={`nav-link ${currentRoute === "/leaderboard" ? "active" : ""}`}>
        <i className={`bi ${currentRoute === "/leaderboard" ? "bi-bar-chart-line-fill" : "bi-bar-chart-line"}`}></i>
        <span className="d-block small">Ranking</span>
      </Link>

      <Link href="/play" className={`nav-link ${currentRoute === "/play" ? "active" : ""}`}>
        <i className={`bi ${currentRoute === "/play" ? "bi-rocket-fill" : "bi-rocket"}`}></i>
        <span className="d-block small">Play</span>
      </Link>

      <Link href="/friends" className={`nav-link ${currentRoute === "/friends" ? "active" : ""}`}>
        <i className={`bi ${currentRoute === "/friends" ? "bi-people-fill" : "bi-people"}`}></i>
        <span className="d-block small">Friends</span>
      </Link>
    </nav>
  );
};

export default Navbar;
