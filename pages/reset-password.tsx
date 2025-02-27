// pages/reset-password.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { updatePassword } from "../utils/supabaseClient";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Wachtwoorden komen niet overeen");
      setLoading(false);
      return;
    }

    try {
      await updatePassword(password);
      Swal.fire({
        icon: "success",
        title: "Wachtwoord bijgewerkt!",
        text: "Je wachtwoord is succesvol bijgewerkt.",
      });
      router.push("/login"); // Redirect to the login page after successful password update
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Probeer opnieuw.";
      Swal.fire({
        icon: "error",
        title: "Er ging iets mis",
        text: errorMessage,
      });
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Reset je wachtwoord</h1>
      <div className="form-container login-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Nieuw wachtwoord</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Reset Wachtwoord"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
