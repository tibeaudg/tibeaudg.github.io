import React, {   } from "react";
import Head from "next/head";
import Header from "../pages/components/header"; // Importeer je Header component
import Navbar from "../pages/components/navbar"; // Importeer je Navbar component


const HomePage: React.FC = () => {



  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <Header /> {/* Hergebruik Header component */}


      <Navbar /> {/* Hergebruik Navbar component */}

    </>
  );
};

export default HomePage;