import "../styles/index.css"; // Je eigen globale CSS
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/authContext'; // Zorg ervoor dat dit pad correct is

// Hier kun je ook CSS-frameworks importeren
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "font-awesome/css/font-awesome.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
