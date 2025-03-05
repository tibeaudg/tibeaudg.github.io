import "../styles/Globals.css"; // Je eigen globale CSS
import "../styles/friends.css"; // Je eigen globale CSS
import "../styles/index.css"; // Je eigen globale CSS
import "../styles/header.css"; // Je eigen globale CSS
import "../styles/navbar.css"; // Je eigen globale CSS
import "../styles/progressPage.css"; // Je eigen globale CSS
import "../styles/ranking.css"; // Je eigen globale CSS
import "../styles/play.css"; // Je eigen globale CSS
import "../styles/gameOverScreen.css"; // Je eigen globale CSS
import "../styles/solo&multiplayerGameplay.css"; // Je eigen globale CSS
import "../styles/soloGameplay.css"; // Je eigen globale CSS
import "../styles/loginPage.css"; // Je eigen globale CSS
import "../styles/multiplayerGameplay.css"; // Je eigen globale CSS











import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/authContext'; // Zorg ervoor dat dit pad correct is

// Hier kun je ook CSS-frameworks importeren
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "font-awesome/css/font-awesome.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
