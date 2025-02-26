import { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { loginUser, registerUser, resetPassword } from '../utils/supabaseClient';
import { useRouter } from 'next/router'; // Importeer useRouter van Next.js

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login, register, reset
  const router = useRouter(); // Initialiseer de router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (authMode === "login") {
        await loginUser(email, password);
        Swal.fire({
          icon: 'success',
          title: 'Ingelogd!',
          text: 'Je bent succesvol ingelogd.',
        });
        router.push('/'); // Redirect naar de homepagina
      } else if (authMode === "register") {
        await registerUser(email, password);
        Swal.fire({
          icon: 'success',
          title: 'Registratie gelukt!',
          text: 'Controleer je e-mail voor bevestiging.',
        });
      } else if (authMode === "reset") {
        await resetPassword(email);
        Swal.fire({
          icon: 'info',
          title: 'Wachtwoord reset!',
          text: 'Er is een reset link naar je e-mail gestuurd.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Er ging iets mis',
        text: 'Probeer opnieuw.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="loginTitle">Disney Magic Quest</h2>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="inputbox">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          {authMode !== "reset" && (
            <div className="inputbox">
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
          )}

          {errorMessage && <p className="error">{errorMessage}</p>}

          <button className="btn" type="submit" disabled={loading}>
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
                <button onClick={() => setAuthMode("reset")}>
                  Reset hier
                </button>
              </p>
            </>
          ) : (
            <button onClick={() => setAuthMode("login")}>
              Terug naar Login
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthForm;
