import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./header.scss";
import { useAppSelector } from "../../../store/hooks";
import { getUser } from "../../../store/reducers/userSlice";
import { store } from "../../../store/store";
import logo from "../../../assets/images/logo-no-name.png";
import { getMenu } from "../collapsibleMenu/menuItems";
import { Box, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export interface IHeaderProps {
  disableLogin?: boolean;
  disableMainButtons?: boolean;
  disableAbout?: boolean;
}

export interface IHeaderButtonOverride {
  buttonText: string;
  buttonLink: string;
}

function Header(props: IHeaderProps) {
  const [showSideNav, setShowSideNav] = useState(false);
  const user = useAppSelector(getUser);
  const navigate = useNavigate();
  const [promptBeforeNavigation, setPromptBeforeNavigation] = useState(
    new Set<string>(["/createportfolio", "/createportfolio/review"])
  );
  const location = useLocation();
  const handleNavigation = (route: string) => {
    const pathName = location.pathname;
    if (promptBeforeNavigation.has(pathName)) {
      const doNavigate = window.confirm(
        "Any unsaved changes will be lost, are you sure you want to leave?"
      );
      if (doNavigate) {
        navigate(route);
      }
    } else {
      navigate(route);
    }
  };

  const handleMenuButtonClick = (path: string): void => {
    handleNavigation(path);
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

  const getHamburgerMenu = () => {
    return (
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleShowDrawer(false)}
        onKeyDown={toggleShowDrawer(false)}
      >
        {getMenu(handleMenuButtonClick)}
      </Box>
    );
  };

  return (
    <div className={"header_container"}>
      <div className={"header_logo_and_title_container"}>
        <img
          src={logo}
          alt={"Resume Charge logo"}
          className={"header_logo"}
          onClick={() => handleNavigation("/")}
        />
        <p
          className={"header_companyname"}
          onClick={() => handleNavigation("/")}
        >
          ResumeCharge
          <br />
        </p>
      </div>
      <div className={"header_container_small"}>
        <div className={"header_logo_and_title_container_small"}>
          <img
            src={logo}
            alt={"Resume Charge logo"}
            className={"header_logo"}
            onClick={() => handleNavigation("/")}
          />
          <p
            className={"header_companyname"}
            onClick={() => handleNavigation("/")}
          >
            ResumeCharge
          </p>
        </div>
        <div className={"header_hamburger_menu_container"}>
          <MenuIcon
            className={"header_hamburger_menu_icon"}
            fontSize={"large"}
            onClick={() => setShowSideNav(true)}
          />
          <div className={"header_hamburger_menu"}>
            <Drawer
              anchor={"left"}
              open={showSideNav}
              onClose={toggleShowDrawer(false)}
              onKeyDown={toggleShowDrawer(false)}
            >
              {getHamburgerMenu()}
            </Drawer>
          </div>
        </div>
      </div>
      <div className={"header_collapsing_menu_items"}>
        <NavLink
          to={"/about"}
          className={"navlink"}
          onClick={() => handleNavigation("/about")}
        >
          About
        </NavLink>
        <NavLink
          to={"/faq"}
          className={"navlink"}
          onClick={() => handleNavigation("/faq")}
        >
          FAQ
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
