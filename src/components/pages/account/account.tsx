import React, { useEffect, useState } from "react";
import MyResumes from "./myResumes/myResumes";
import MyWebsites from "./myWebsites/myWebsites";
import "./acount.scss";
import website from "../../../assets/images/account/website.svg";
import resume from "../../../assets/images/account/resume.svg";
import templates from "../../../assets/images/account/template.svg";
import settings from "../../../assets/images/account/settings.svg";
import logo from "../../../assets/images/logo-no-name-no-bg.png";
import help from "../../../assets/images/account/help.svg";
import logout from "../../../assets/images/account/logout.svg";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Footer, { SIGNUP_KEY } from "../../navigation/footer/footer";
import { getAuth } from "firebase/auth";
import { saveTokenToUserAccount } from "../../../utilities/github/githubTokenHelper";
import { signOut as googleAuthSignOut } from "../../../utilities/auth/googleAuthHelper";
import FirstSignInDialog from "./ui/firstSignInDialog";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import { getUser } from "../../../store/reducers/userSlice";
import AccountTemplates from "./templates/accountTemplates";

interface IActiveComponent {
  key: string;
  component: JSX.Element;
}

function Account() {
  const OAUTH_PATH = "/account/oauth";
  const CODE_PARAM = "code";
  const STATE_PARAM = "state";
  const [activeComponent, setActiveComponent] = useState<IActiveComponent>({
    key: "my-resumes",
    component: <MyResumes />,
  });
  const [contentMainTitle, setContentMainTitle] = useState("Resumes");
  const [contentMainImage, setContentMainImage] = useState(resume);
  const [searchParams] = useSearchParams();
  const [showFirstVisitDialog, setShowFirstVisitDialog] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const user = useAppSelector(getUser);
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFirstPageViewFromSignUp = () => {
    setShowFirstVisitDialog(true);
    navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    const handleUserGithubAuth = async () => {
      if (location.pathname === OAUTH_PATH && auth.currentUser) {
        const code = searchParams.get(CODE_PARAM);
        const state = searchParams.get(STATE_PARAM);
        if (!(code && state)) {
          return;
        }
        await saveTokenToUserAccount(code, state, auth.currentUser.uid);
        window.location.href = "/account";
      }
    };
    handleUserGithubAuth();

    const activeItem = location.state?.activeItem;
    const previousPage = location.state?.previousPage;
    if (previousPage === "sign-up") {
      handleFirstPageViewFromSignUp();
    }
  }, []);

  const handleGoToResumes = () => {
    setActiveComponent({
      key: "my-resumes",
      component: <MyResumes />,
    });
  };

  const signOut = async () => {
    await googleAuthSignOut();
    navigate("/");
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
        <ListItem
          key={"support"}
          disablePadding
          onClick={() => {
            navigate("/contact-us");
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <img src={help} />
            </ListItemIcon>
            <ListItemText primary={"Help & Support"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"logout"}
          disablePadding
          onClick={async () => {
            await signOut();
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <img src={logout} />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
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
            <h1>ResumeCharge</h1>
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
          <div
            className={`account_sidebar_menu_item `}
            onClick={(e) => {
              navigate("/contact-us");
            }}
          >
            <img src={help} />
            <h1>Help & Support</h1>
          </div>
          <div
            className={`account_sidebar_menu_item `}
            onClick={async (e) => {
              await signOut();
            }}
          >
            <img src={logout} />
            <h1>Logout</h1>
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
                ResumeCharge
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
        {showFirstVisitDialog ? (
          <FirstSignInDialog open={showFirstVisitDialog} />
        ) : null}
      </div>
      <Footer
        className={"account-footer"}
        elementOverrides={new Map([[SIGNUP_KEY, false]])}
      />
    </div>
  );
}

export default Account;
