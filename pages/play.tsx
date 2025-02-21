import Head from "next/head";
import Link from "next/link";
import "../styles/index.css"; // Eigen styles importeren
import "../styles/play.css"; // Eigen styles importeren




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
          {/* Go Back Button */}
          <Link href="/" passHref>
            <div className="logout">
              <i className="bi bi-arrow-left-circle-fill"></i>
            </div>
          </Link>

          <div dir="auto" className="css-text-146c3p1 r-color-kkedbh r-fontSize-1x35g6 r-fontWeight-vw2c0b r-marginBottom-1yflyrw r-textAlign-q4m81j">
                </div>
        </header>

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

            <div className="game-mode-card">
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





        {/* Bottom Navigation Bar */}
        <nav className="navbar fixed-bottom bg-body-tertiary border-top">
          <div className="container-fluid d-flex justify-content-around align-items-center py-2">
            <Link legacyBehavior href="/">
              <a className="nav-link text-center text-dark">
                <i className="bi bi-house-door fs-4"></i>
                <span className="d-block small">Home</span>
              </a>
            </Link>
            <Link legacyBehavior href="/play">
              <a className="nav-link active text-center text-dark">
              <i className="bi bi-dpad-fill"></i>
                <span className="d-block small">Play</span>
              </a>
            </Link>
            <Link legacyBehavior href="/friends">
              <a className="nav-link text-center text-dark">
                <i className="bi bi-people fs-4"></i>
                <span className="d-block small">Friends</span>
              </a>
            </Link>
            <Link legacyBehavior href="/inbox">
              <a className="nav-link text-center text-dark">
                <i className="bi bi-chat fs-4"></i>
                <span className="d-block small">Inbox</span>
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default HomePage;
