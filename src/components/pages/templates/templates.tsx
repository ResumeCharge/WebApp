import React from "react";
import Header from "../../navigation/header/header";
import Footer from "../../navigation/footer/footer";
import "./templates.scss";
import TemplateCards from "./templateCards";

function Templates() {
  return (
    <div>
      <Header />
      <TemplateCards />
      <Footer />
    </div>
  );
}

export default Templates;
