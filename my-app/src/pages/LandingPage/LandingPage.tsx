import React from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import Screen1 from "./Screen1";
import Screen2 from "./Screen2";

const LandingPage: React.FC = () => {
  return (
    <div>
      <Nav />
      <div>
        <Screen1 />
        <Screen2 />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
