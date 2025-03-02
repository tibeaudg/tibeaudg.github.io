import { useState } from "react";
import Swal from "sweetalert2";
import { loginUser } from "../utils/firebase"; // Zorg ervoor dat dit correct is geïmporteerd
import { useRouter } from "next/router";
import Image from "next/image";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Importeer Firestore functies
import { app } from "../utils/firebase"; // Zorg dat je Firebase-configuratie correct is

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const firestore = getFirestore(app); // Initialize Firestore

  const createUserDocument = async (userEmail: string) => {
    try {
      const userDocRef = doc(firestore, "users", userEmail); // Document referentie maken
      await setDoc(userDocRef, {
        email: userEmail,
        points: 0, // Je kunt de standaardwaarde hier instellen
        username: "", // Leeg laten voor nu, kan later door gebruiker ingevuld worden
      });
    } catch (error) {
      console.error("Error creating user document: ", error);
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
      
      // Aanmaken van Firestore document na succesvolle login
      await createUserDocument(email);

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
