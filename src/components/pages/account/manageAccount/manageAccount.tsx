import Header from "../../../navigation/header/header";
import Footer from "../../../navigation/footer/footer";
import "./manageAccount.scss";
import React, { useState } from "react";
import { AccountDetails } from "./accountDetails/accountDetails";
import { Spin } from "antd";

export const ManageAccount = () => {
  const [activeContent, setActiveContent] = useState("account");

  const handleSideNavElementClick = (sideNavItemKey: string) => {
    setActiveContent(sideNavItemKey);
  };

  const getActiveItem = () => {
    if (activeContent === "account") {
      return <AccountDetails />;
    } else {
      return <Spin tip={"Loading..."} spinning={true} />;
    }
  };

  const getClassNameForMenuItem = (sectionId: string) => {
    return `manage_account_menu_item ${
      activeContent === sectionId ? "manage_account_menu_active_item" : null
    }`;
  };

  return (
    <div className={"manage_account_container"}>
      <Header />
      <div className={"manage_account_content_container"}>
        <div className={"manage_account_menu"}>
          <h1>Settings</h1>
          <div className={"manage_account_menu_items"}>
            <div
              className={getClassNameForMenuItem("account")}
              onClick={() => handleSideNavElementClick("account")}
            >
              <p>Account</p>
            </div>
          </div>
        </div>
        <div className={"manage_account_main_content"}>{getActiveItem()}</div>
      </div>
      <Footer />
    </div>
  );
};
