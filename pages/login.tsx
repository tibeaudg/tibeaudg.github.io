import { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  loginUser,
  registerUser,
  resetPassword,
} from "../utils/supabaseClient";
import { useRouter } from "next/router"; // Import useRouter from Next.js

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); // Add username state
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login, register, reset
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (authMode === "login") {
        console.log("Attempting to log in with email:", email);
        await loginUser(email, password);
        router.push("/"); // Redirect to the homepage

        
      } else if (authMode === "register") {
        if (password !== confirmPassword) {
          throw new Error("Wachtwoorden komen niet overeen");
        }
        await registerUser(email, password, username); // Add username during registration
        Swal.fire({
          icon: "success",
          title: "Registratie gelukt!",
          text: "Controleer je e-mail voor bevestiging.",
        });
        router.push("/login"); // Redirect to the login page after successful registration


      } else if (authMode === "reset") {
        await resetPassword(email);
        Swal.fire({
          icon: "info",
          title: "Wachtwoord reset!",
          text: "Er is een reset link naar je e-mail gestuurd.",
        });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      Swal.fire({
        icon: "error",
        title: "Er ging iets mis",
        text: error.message || "Probeer opnieuw.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Disney Magic Quest</h1>
      <div className="form-container login-container">
        <form onSubmit={handleSubmit}>
          {authMode === "login" && (
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {authMode !== "reset" && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {authMode === "register" && (
            <>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {authMode === "reset" && (
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {errorMessage && <p className="error">{errorMessage}</p>}

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading
              ? "Loading..."
              : authMode === "login"
              ? "Log In"
              : authMode === "register"
              ? "Register"
              : "Reset Password"}
          </button>
        </form>

        <div className="auth-switch">
          {authMode === "login" ? (
            <>
              <p>
                Nog geen account?{" "}
                <button onClick={() => setAuthMode("register")}>
                  Registreer hier
                </button>
              </p>
              <p>
                Wachtwoord vergeten?{" "}
                <button onClick={() => setAuthMode("reset")}>Reset hier</button>
              </p>
            </>
          ) : (
            <button onClick={() => setAuthMode("login")}>
              Terug naar Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
