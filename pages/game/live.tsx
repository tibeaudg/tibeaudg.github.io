import Head from "next/head";
import Link from "next/link";
import "../../styles/index.css"; // Eigen styles importeren
import "../../styles/play.css"; // Eigen styles importeren




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
          <Link href="/play" passHref>
            <div className="logout">
              <i className="bi bi-arrow-left-circle-fill"></i> Go Back
            </div>
          </Link>
          <div dir="auto" className="css-text-146c3p1 r-color-kkedbh r-fontSize-1x35g6 r-fontWeight-vw2c0b r-marginBottom-1yflyrw r-textAlign-q4m81j">
                Live Mode
                </div>
        </header>

            <div>

                <h3>Coming Soon</h3>

            </div>
   


      </div>
    </>
  );
};

export default HomePage;
