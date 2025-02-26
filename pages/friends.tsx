import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase, loginUser, registerUser, resetPassword, updatePassword, confirmEmail } from "./supabaseClient"; // Adjust the import path as needed

interface Friend {
  id: number;
  name: string;
  profileImage: string;
}

interface FriendRequest extends Friend {
  status: "pending" | "approved" | "rejected";
}

const HomePage: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [invitationSent, setInvitationSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch friends from your API
    const fetchFriends = async () => {
      try {
        const { data, error } = await supabase.rpc('get_friends');
        if (error) throw error;
        setFriends(data);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();

    // Fetch friend requests from your API
    const fetchFriendRequests = async () => {
      try {
        const { data, error } = await supabase.rpc('get_friend_requests');
        if (error) throw error;
        setFriendRequests(data);
      } catch (error) {
        console.error("Failed to fetch friend requests:", error);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.rpc('send_invitation', { sender_id: supabase.auth.user()?.id, receiver_id: inviteEmail });
      if (error) throw error;
      setInvitationSent(true);
      setInviteEmail("");
      setTimeout(() => setInvitationSent(false), 3000);
    } catch (error) {
      console.error("Failed to send invitation:", error);
    }
  };

  const handleRequest = async (requestId: number, action: "approve" | "reject") => {
    try {
      const { error } = await supabase.rpc('handle_friend_request', { request_id: requestId, action });
      if (error) throw error;
      setFriendRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: action }
            : request
        )
      );
      if (action === "approve") {
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
    const { user, error } = await loginUser(email, password);
    if (error) {
      setAuthError(error.message);
    } else {
      setIsLoggedIn(true);
      setAuthError(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(email, password, username);
      setAuthError(null);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      setAuthError(null);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    try {
      await updatePassword(newPassword);
      setAuthError(null);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleConfirmEmail = async (token: string) => {
    try {
      await confirmEmail(token);
      setAuthError(null);
    } catch (error) {
      setAuthError(error.message);
    }
  };

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
          {authError && <p>{authError}</p>}
        </div>
      ) : (
        <>
          <div className="friends-list-container">
            <h3>Vriendenlijst</h3>
            <ul className="friends-list">
              {friends.map((friend) => (
                <motion.li
                  key={friend.id}
                  className="friend-item"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={friend.profileImage}
                    alt={friend.name}
                    className="friend-img"
                  />
                  <div className="friend-info">
                    <p className="friend-name">{friend.name}</p>
                    <div className="friend-actions">
                      <button className="view-profile">Bekijk profiel</button>
                      <button className="remove-friend">Verwijder</button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="friend-requests-container">
            <h3>Vriendverzoeken</h3>
            <ul className="friend-requests-list">
              {friendRequests.map((request) => (
                <li key={request.id} className="friend-request-item">
                  <img
                    src={request.profileImage}
                    alt={request.name}
                    className="friend-img"
                  />
                  <div className="friend-info">
                    <p className="friend-name">{request.name}</p>
                    <div className="request-actions">
                      <button
                        onClick={() => handleRequest(request.id, "approve")}
                        disabled={request.status !== "pending"}
                      >
                        Accepteer
                      </button>
                      <button
                        onClick={() => handleRequest(request.id, "reject")}
                        disabled={request.status !== "pending"}
                      >
                        Weiger
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="invite-friend-container">
            <h3>Nodig een vriend uit</h3>
            <form onSubmit={handleInvite}>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email of gebruikersnaam"
                required
              />
              <button type="submit">Verstuur uitnodiging</button>
            </form>
            {invitationSent && <p>Uitnodiging verzonden!</p>}
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
            <Link href="/inbox" className="nav-link">
              <i className="bi bi-envelope-paper"></i>
              <span className="d-block small">Inbox</span>
            </Link>
          </nav>
        </>
      )}
    </>
  );
};

export default HomePage;
