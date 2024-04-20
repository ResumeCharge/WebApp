import React from "react";
import Header from "../../navigation/header/header";
import Footer from "../../navigation/footer/footer";
import { FaqItem } from "./faq-items";
import "./faq.scss";
import FAQCard from "./faq-card";

interface IProps {
  faqItems: FaqItem[];
}

function FAQ(props: IProps) {
  return (
    <div className={"faq-page-container"}>
      <Header />
      <div className={"faq-container"}>
        <h1 className={"faq-title"}>Frequently Asked Questions</h1>
        <div className={"faq-collapsible-section"}>
          {<FAQCard faqItems={props.faqItems} />}
        </div>
      </div>
      <Footer className={"faq-footer"} />
    </div>
  );
}

export default FAQ;
