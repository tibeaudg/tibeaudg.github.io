import { useState } from "react";

const LoginForm = () => {
  // State voor het opslaan van gebruikersinput
  const [password, setPassword] = useState("");

  // Handler voor het indienen van het formulier
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Hier zou je loginlogica komen, zoals het verzenden van gegevens naar een backend
    console.log("Password:", password);
  };

  return (
    <>
    <h2 className="loginTitle" >Disney Magic Quest</h2>
        <div className="glassmorphism">
          <form onSubmit={handleSubmit}>
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
            <button className="btn" type="submit">
              Log In
            </button>
          </form>
        </div>
    </>
  );
};

export default LoginForm;
