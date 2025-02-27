import { useState } from "react";
import Swal from "sweetalert2";
import { loginUser, registerUser, resetPassword } from "../utils/supabaseClient";
import { useRouter } from "next/router";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login, register, reset
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (authMode === "login") {
        const { error } = await loginUser(email, password);
        if (error) {
          throw error;
        }
        router.push("/"); // Redirect if no error
      } else if (authMode === "register") {

        await registerUser(email, password);
        Swal.fire({
          icon: "success",
          title: "Registratie gelukt!",
          text: "Controleer je e-mail voor bevestiging.",
        });

      } else if (authMode === "reset") {
        await resetPassword(email);
        Swal.fire({
          icon: "info",
          title: "Wachtwoord reset!",
          text: "Er is een reset link naar je e-mail gestuurd.",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Probeer opnieuw.";
      Swal.fire({
        icon: "error",
        title: "Er ging iets mis",
        text: errorMessage,
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
          {authMode !== "reset" && (
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
                <button type="button" onClick={() => setAuthMode("register")}>
                  Registreer hier
                </button>
              </p>
              <p>
                Wachtwoord vergeten?{" "}
                <button type="button" onClick={() => setAuthMode("reset")}>
                  Reset hier
                </button>
              </p>
            </>
          ) : (
            <button type="button" onClick={() => setAuthMode("login")}>
              Terug naar Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
