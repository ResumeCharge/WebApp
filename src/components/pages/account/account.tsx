import React, { useState } from "react";
import MyResumes from "./myResumes/myResumes";
import MyWebsites from "./myWebsites/myWebsites";
import "./acount.scss";
import website from "../../../assets/images/account/website.svg";
import resume from "../../../assets/images/account/resume.svg";
import templates from "../../../assets/images/account/template.svg";
import settings from "../../../assets/images/account/settings.svg";
import logo from "../../../assets/images/logo-no-name-no-bg.png";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Footer, { SIGNUP_KEY } from "../../navigation/footer/footer";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountTemplates from "./templates/accountTemplates";

interface IActiveComponent {
  key: string;
  component: JSX.Element;
}

function Account() {
  const [activeComponent, setActiveComponent] = useState<IActiveComponent>({
    key: "my-resumes",
    component: <MyResumes />,
  });
  const [contentMainTitle, setContentMainTitle] = useState("Resumes");
  const [contentMainImage, setContentMainImage] = useState(resume);
  const [showSideNav, setShowSideNav] = useState(false);
  const navigate = useNavigate();

  const handleGoToResumes = () => {
    setActiveComponent({
      key: "my-resumes",
      component: <MyResumes />,
    });
  };

  const toggleShowDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setShowSideNav(open);
    };

  const menu = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleShowDrawer(false)}
      onKeyDown={toggleShowDrawer(false)}
    >
      <List className={"sidebar_collapsible_nav"}>
        <ListItem
          key={"resumes"}
          disablePadding
          onClick={() => {
            setActiveComponent({
              key: "my-resumes",
              component: <MyResumes />,
            });
            setContentMainTitle("Resumes");
            setContentMainImage(resume);
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <img src={resume} />
            </ListItemIcon>
            <ListItemText primary={"Resumes"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"websites"}
          disablePadding
          onClick={() => {
            setActiveComponent({
              key: "my-websites",
              component: <MyWebsites onGoToResumes={handleGoToResumes} />,
            });
            setContentMainTitle("Websites");
            setContentMainImage(website);
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <img src={website} />
            </ListItemIcon>
            <ListItemText primary={"Websites"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"templates"}
          disablePadding
          onClick={() => {
            setActiveComponent({
              key: "templates",
              component: <AccountTemplates />,
            });
            setContentMainTitle("Templates");
            setContentMainImage(website);
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <img src={templates} />
            </ListItemIcon>
            <ListItemText primary={"Templates"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"account"}
          disablePadding
          onClick={() => {
            navigate("/account/settings");
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <img src={settings} />
            </ListItemIcon>
            <ListItemText primary={"Account"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className={"account_container"}>
      <div className={"account_sidebar"}>
        <div className={"account_sidebar_menu_full"}>
          <div className={"menu-header"}>
            <img src={logo} />
            <h1>
              ResumeCharge
              <p>Standalone!</p>
            </h1>
          </div>
          <div
            className={`account_sidebar_menu_item ${
              activeComponent.key === "my-resumes" ? "active_menu_item" : null
            }`}
            onClick={() => {
              setActiveComponent({
                key: "my-resumes",
                component: <MyResumes />,
              });
              setContentMainTitle("Resumes");
              setContentMainImage(resume);
            }}
          >
            <img src={resume} />
            <h1>Resumes</h1>
          </div>
          <div
            className={`account_sidebar_menu_item ${
              activeComponent.key === "my-websites" ? "active_menu_item" : null
            }`}
            onClick={() => {
              setActiveComponent({
                key: "my-websites",
                component: <MyWebsites onGoToResumes={handleGoToResumes} />,
              });
              setContentMainTitle("Websites");
              setContentMainImage(website);
            }}
          >
            <img src={website} />
            <h1>Websites</h1>
          </div>
          <div
            className={`account_sidebar_menu_item ${
              activeComponent.key === "templates" ? "active_menu_item" : null
            }`}
            onClick={() => {
              setActiveComponent({
                key: "templates",
                component: <AccountTemplates />,
              });
              setContentMainTitle("Templates");
              setContentMainImage(templates);
            }}
          >
            <img src={templates} />
            <h1>Templates</h1>
          </div>
          <hr />
          <div
            className={`account_sidebar_menu_item `}
            onClick={() => {
              navigate("/account/settings");
            }}
          >
            <img src={settings} />
            <h1>Account</h1>
          </div>
        </div>
        <div className={"account_small_size_nav"}>
          <div className={"account_small_size_nav_header"}>
            <div className={"header_logo_and_title_container_small"}>
              <img
                src={logo}
                alt={"Resume Charge logo"}
                className={"account_nav_header header_logo"}
              />
              <p className={"account_nav_header header_companyname"}>
                <p>ResumeCharge</p>
                <p className={"header_subtext"}>Standalone!</p>
              </p>
            </div>
            <MenuIcon
              className={"account_small_size_nav_header_menu"}
              fontSize={"large"}
              onClick={() => setShowSideNav(true)}
            />
          </div>
          <div className={"account_sidebar_menu"}>
            <Drawer
              anchor={"left"}
              open={showSideNav}
              onClose={toggleShowDrawer(false)}
              onKeyDown={toggleShowDrawer(false)}
            >
              {menu}
            </Drawer>
          </div>
        </div>
      </div>
      <div className={"account_content_section"}>
        <div className={"account_content_header"}>
          <img src={contentMainImage} />
          <h1>{contentMainTitle}</h1>
        </div>
        <div className={"account_main_content"}>
          {activeComponent.component}
        </div>
      </div>
      <Footer
        className={"account-footer"}
        elementOverrides={new Map([[SIGNUP_KEY, false]])}
      />
    </div>
  );
}

export default Account;
