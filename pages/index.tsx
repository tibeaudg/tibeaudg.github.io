import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";



// Gegevens per user
interface User {
  user_metadata?: {
    username?: string;
    level?: string;
    accuracy?: string;
    correctanswers?: string;
    gamesplayed?: string;
    avatar?: string;


  };
}




// Definieer een lijst met beschikbare profielfoto's
const availableAvatars = [
  "/assets/avatars/31.png",
  "/assets/avatars/38.png",
  "/assets/avatars/100.png",
  "/assets/avatars/101.png",
  "/assets/avatars/102.png",
  "/assets/avatars/105.png",
  "/assets/avatars/109.png",
  "/assets/avatars/111.png",
  "/assets/avatars/112.png",
  "/assets/avatars/113.png",
  "/assets/avatars/119.png",
  "/assets/avatars/122.png",
  "/assets/avatars/126.png",
  "/assets/avatars/131.png",
  "/assets/avatars/132.png",
  "/assets/avatars/133.png",









];



const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);





  // Functie om de gekozen avatar op te slaan
  const handleAvatarSelect = async (avatar: string) => {
    if (!user) return;
    // Update lokale state
    const updatedUser = { ...user, user_metadata: { ...user.user_metadata, avatar } };
    setUser(updatedUser);
    // Update Supabase user metadata zodat de keuze bewaard blijft
    const { data, error } = await supabase.auth.updateUser({
      data: { avatar },
    });
    if (error) {
      console.error("Error updating avatar:", error.message);
    } else {
      console.log("Avatar updated successfully");
    }
    // Sluit het keuzemenu
    setAvatarMenuOpen(false);
  };




  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching user session:", error.message);
        router.push("/login");
      } else {
        if (!data.session) {
          router.push("/login");
        } else {
          setUser(data.session.user);
        }
      }
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);






  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };







  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        />
      </Head>

      <div>


        
      <header className="header">
        <div className="logo">
          <Image src="/assets/logo.png" alt="Logo" width={100} height={100} />
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



        <div className="profile-section text-center">
        <div className="profile-image" onClick={() => setAvatarMenuOpen(true)}>
            <Image
              src={user.user_metadata?.avatar || "/assets/default-avatar.png"}
              alt="Profile Avatar"
              width={150}
              height={150}
            />
             </div>
            {avatarMenuOpen && (
              <div className="avatar-menu">
                <h3>Kies een profielfoto</h3>
                <div className="avatar-options">
                  {availableAvatars.map((avatar) => (
                    <div
                      key={avatar}
                      className="avatar-option"
                      onClick={() => handleAvatarSelect(avatar)}
                      style={{ display: "inline-block", margin: "5px", cursor: "pointer" }}
                    >
                      <Image src={avatar} alt="Avatar option" width={50} height={50} />
                    </div>
                  ))}
                </div>
                <button onClick={() => setAvatarMenuOpen(false)}>Sluiten</button>
              </div>
            )}
              
            <div className="profile-info">
            <h2 className="username">
              {user.user_metadata?.username ?? "N/A"}
            </h2>
            <p className="text-muted">Level: {user.user_metadata?.level ?? "N/A"}</p>
          </div>
        </div>

        <div className="stats-inline">
          <h4>Games Played</h4>
          <p>{user.user_metadata?.gamesplayed ?? "N/A"}</p>
        </div>

        <div className="stats-inline">
          <h4>Correct Answers</h4>
          <p>{user.user_metadata?.correctanswers ?? "N/A"}</p>
        </div>

        <div className="stats-inline">
          <h4>Accuracy Percentage</h4>
          <p>{user.user_metadata?.accuracy ?? "N/A"}</p>
        </div>

        <nav className="navbar">
          <Link href="/" className="nav-link active">
            <i className="bi bi-house-door-fill"></i>
            <span className="d-block small">Home</span>
          </Link>
          <Link href="/leaderboard" className="nav-link">
            <i className="bi bi-bar-chart-line"></i>
            <span className="d-block small">Ranking</span>
          </Link>
          <Link href="/play" className="nav-link">
            <i className="bi bi-rocket"></i>
            <span className="d-block small">Play</span>
          </Link>
          <Link href="/friends" className="nav-link">
            <i className="bi bi-people"></i>
            <span className="d-block small">Friends</span>
          </Link>

        </nav>
      </div>
    </>
  );
};

export default HomePage;
