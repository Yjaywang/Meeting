import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./PreviewPage.css";

import PreviewContent from "./PreviewContent";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";

const PreviewPage = () => {
  const [stream, setStream] = useState(null);

  return (
    <>
      <Nav />
      <div className="preview-page-container">
        <PreviewContent stream={stream} setStream={setStream} />
      </div>
      <Footer />
    </>
  );
};

export default PreviewPage;
