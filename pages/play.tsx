import Head from "next/head";
import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        {/* Meta en titel */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>

        {/* External CSS bestanden */}
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
      <div>




        {/* Header */}
        <header className="header">
        <h1 className="text-xl font-bold">Choose Gamemode</h1>
      </header>




        {/* Game Modes */}
        <div className="game-mode-container">
          <div className="game-mode-card">
            <a href="/game/quiz-master" className="game-mode-link">
              <div className="game-mode-card-content quiz-master">
                <div className="icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="mode-title">Quiz Master Mode</div>
                <div className="mode-description">
                  One player reads questions while others answer
                </div>
              </div>
            </a>
          </div>

          <div className="game-mode-card coming-soon">
            <a href="/game/live" className="game-mode-link">
              <div className="game-mode-card-content live-mode">
                <div className="icon">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>
                <div className="mode-title">Live Mode</div>
                <div className="mode-description">
                  Compete in real-time with other players
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>




      <nav className="navbar">
          <Link href="/" className="nav-link">
            <i className="bi bi-house-door"></i>
            <span className="d-block small">Home</span>
          </Link>

          <Link href="/play" className="nav-link active">
            <i className="bi bi-rocket-fill"></i>
            <span className="d-block small">Play</span>
          </Link>

          <Link href="/friends" className="nav-link">
            <i className="bi bi-people"></i>
            <span className="d-block small">Friends</span>
          </Link>

          <Link href="/inbox" className="nav-link">
            <i className="bi bi-envelope-paper"></i>
            <span className="d-block small">Inbox</span>
          </Link>
        </nav>

    </>
  );
};

export default HomePage;
