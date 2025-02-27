import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

import { supabase, loginUser, registerUser, resetPassword} from "../utils/supabaseClient"; // Updated import path
import router from "next/router";

interface Friend {
  id: number;
  name: string;
  profileImage: string;
}

interface FriendRequest extends Friend {



  
  status: "pending" | "approved" | "rejected";
}









const FriendsPage: React.FC = () => {

  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [invitationSent, setInvitationSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        fetchFriends();
        fetchFriendRequests();
      }
    };

    checkSession();
  }, []);




  const fetchFriends = async () => {
    try {
      // Haal de ingelogde gebruiker op via Supabase Auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Geen ingelogde gebruiker gevonden");
  
      // Haal de vrienden op gebaseerd op de user_id van de gebruiker
      const { data, error } = await supabase.rpc('get_friends', { p_user_id: user.id });
      if (error) throw error;
      setFriends(data || []);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };
  


  
  const fetchFriendRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Geen ingelogde gebruiker gevonden");
      const { data, error } = await supabase.rpc('get_friend_requests', { p_user_id: user.id });
      if (error) throw error;
      setFriendRequests(data || []);
    } catch (error) {
      console.error("Failed to fetch friend requests:", error);
    }
  };
  





const handleInvite = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Sending invitation from user', user);  // Add logging to ensure user is fetched
    const { error } = await supabase.rpc('send_invitation', {
      p_sender_id: user?.id,
      p_receiver_id: inviteEmail, // Ensure this is the correct type (e.g., UUID or string)
    });
    if (error) {
      console.error("Error sending invitation:", error);
      throw error;
    }
    setInvitationSent(true);
    setInviteEmail("");
    setTimeout(() => setInvitationSent(false), 3000);
  } catch (error) {
    console.error("Failed to send invitation:", error);
  }
};







  const handleRequest = async (requestId: number, action: "approved" | "rejected") => {
    try {
      const { error } = await supabase.rpc('handle_friend_request', {
        p_request_id: requestId,
        action,
      });
      if (error) throw error;

      setFriendRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: action }
            : request
        )
      );

      if (action === "approved") {
        const approvedRequest = friendRequests.find((request) => request.id === requestId);
        if (approvedRequest) {
          setFriends((prevFriends) => [...prevFriends, approvedRequest]);
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} friend request:`, error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await loginUser(email, password);
      if (error) {
        setAuthError(error.message || "Login failed");
        return;
      }
      setIsLoggedIn(true);
      setAuthError(null);
      fetchFriends();
      fetchFriendRequests();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setAuthError(error.message || "Unexpected error during login");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      setIsLoggedIn(true);
      setAuthError(null);
      fetchFriends();
      fetchFriendRequests();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setAuthError(error.message || "Registration failed");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      setAuthError(null);
      alert("Password reset email sent. Please check your inbox.");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setAuthError(error.message || "Failed to send reset email");
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest - Friends</title>
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

      {!isLoggedIn ? (
        <div className="auth-container">
          <form onSubmit={handleLogin}>
            <h3>Login</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
          </form>
          <form onSubmit={handleRegister}>
            <h3>Register</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <button type="submit">Register</button>
          </form>
          <button onClick={handleResetPassword}>Reset Password</button>
          {authError && <p className="error-message">{authError}</p>}
        </div>
        
      ) : (
        <>
          <div className="friends-list-container">
            <h3>Vriendenlijst</h3>
            <ul className="friends-list">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <motion.li
                    key={friend.id}
                    className="friend-item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="friend-info">
                      <p className="friend-name">{friend.name}</p>
                      <div className="friend-actions">
                        <button className="view-profile">Bekijk profiel</button>
                        <button className="remove-friend">Verwijder</button>
                      </div>
                    </div>
                  </motion.li>
                ))
              ) : (
                <p>Je hebt nog geen vrienden toegevoegd.</p>
              )}
            </ul>
          </div>

          <div className="friend-requests-container">
            <h3>Vriendverzoeken</h3>
            <ul className="friend-requests-list">
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <li key={request.id} className="friend-request-item">
                    <div className="friend-info">
                      <p className="friend-name">{request.name}</p>
                      <div className="request-actions">
                        <button
                          onClick={() => handleRequest(request.id, "approved")}
                          disabled={request.status !== "pending"}
                        >
                          Accepteer
                        </button>
                        <button
                          onClick={() => handleRequest(request.id, "rejected")}
                          disabled={request.status !== "pending"}
                        >
                          Weiger
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p>Je hebt geen openstaande vriendverzoeken.</p>
              )}
            </ul>
          </div>

          <div className="invite-friend-container">
            <h3>Nodig een vriend uit</h3>
            <form className="Email" onSubmit={handleInvite}>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <button className="btn-verstuurUitnodiging" type="submit">Verstuur uitnodiging</button>
            </form>
            {invitationSent && <p className="success-message">Uitnodiging verzonden!</p>}
          </div>

          <nav className="navbar">
            <Link href="/" className="nav-link">
              <i className="bi bi-house-door"></i>
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
            <Link href="/friends" className="nav-link active">
              <i className="bi bi-people-fill"></i>
              <span className="d-block small">Friends</span>
            </Link>

          </nav>
        </>
      )}
    </>
  );
};

export default FriendsPage;