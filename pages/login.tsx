import { useState } from "react";
import Swal from "sweetalert2";
import { auth, loginUser } from "../utils/firebase"; // Zorg ervoor dat dit correct is geïmporteerd
import { useRouter } from "next/router";
import Image from "next/image";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Voor hamburger menu
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    // Implement logout functionaliteit
    try {
      await signOut(auth); // Zorg dat Firebase correct is ingesteld in je utils
      console.log("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const user = await loginUser(email, password);
      if (!user) {
        throw new Error("Login failed. Please check your credentials and try again.");
      }
      router.push("/"); // Redirect na succesvolle login
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Er is een fout opgetreden. Probeer opnieuw.";
      setErrorMessage(message);
      Swal.fire({
        icon: "error",
        title: "Er ging iets mis",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>


      <div className="container">
        <div className="form-container login-container">
        <Image src="/assets/Magic Quest.png" alt="Logo" width={200} height={200} />

          <form onSubmit={handleSubmit}>
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

            {errorMessage && <p className="error">{errorMessage}</p>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
function signOut(auth: any) {
  throw new Error("Function not implemented.");
}

