import { Collapse } from "antd";
import React from "react";
import { FaqItem } from "./faq-items";
const { Panel } = Collapse;

interface IProps {
  faqItems: FaqItem[];
}

function FAQCard(props: IProps) {
  return (
    <Collapse defaultActiveKey={["0"]} accordion className={"faq-holder"}>
      {props.faqItems.map((faqItem, index) => {
        return (
          <Panel header={faqItem.title} key={index} className={"faq-item"}>
            <p dangerouslySetInnerHTML={{ __html: faqItem.content }}></p>
          </Panel>
        );
      })}
    </Collapse>
  );
}

export default FAQCard;
