import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { signOut as googleAuthSignOut } from "../../../utilities/auth/googleAuthHelper";
import { store } from "../../../store/store";
import { setIsUserSignedIn, setUser } from "../../../store/reducers/userSlice";

const signOut = async () => {
  store.dispatch(setIsUserSignedIn(false));
  await googleAuthSignOut();
};

export const getMenu = (
  clickAction: (path: string) => void,
  isSignedIn: boolean
) => {
  return (
    <List className={"sidebar_collapsible_nav"}>
      {isSignedIn ? (
        <ListItem
          key={"dashboard"}
          disablePadding
          onClick={() => {
            clickAction("/account");
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <DashboardOutlinedIcon htmlColor={"black"} />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItemButton>
        </ListItem>
      ) : null}
      {isSignedIn ? (
        <ListItem
          key={"account"}
          disablePadding
          onClick={() => {
            clickAction("/account/settings");
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <AccountCircleOutlinedIcon htmlColor={"black"} />
            </ListItemIcon>
            <ListItemText primary={"Account"} />
          </ListItemButton>
        </ListItem>
      ) : null}
      <ListItem
        key={"support"}
        disablePadding
        onClick={() => {
          clickAction("/contact-us");
        }}
      >
        <ListItemButton>
          <ListItemIcon>
            <HelpOutlineIcon htmlColor={"black"} />
          </ListItemIcon>
          <ListItemText primary={"Help & Support"} />
        </ListItemButton>
      </ListItem>
      <ListItem
        key={"faq"}
        disablePadding
        onClick={() => {
          clickAction("/faq");
        }}
      >
        <ListItemButton>
          <ListItemIcon>
            <QuestionAnswerOutlinedIcon htmlColor={"black"} />
          </ListItemIcon>
          <ListItemText primary={"FAQs"} />
        </ListItemButton>
      </ListItem>
      {getSignInOrSignOutButton(isSignedIn, clickAction)}
    </List>
  );
};

const getSignInOrSignOutButton = (
  isSignedIn: boolean,
  clickAction: (path: string) => void
) => {
  const text = isSignedIn ? "Logout" : "Sign In";
  const icon = isSignedIn ? (
    <LogoutIcon htmlColor={"black"} />
  ) : (
    <LoginIcon htmlColor={"black"} />
  );
  const action = isSignedIn
    ? async () => {
        await signOut();
        clickAction("/");
      }
    : () => clickAction("/signin");
  return (
    <ListItem
      key={"sign-in-sign-out"}
      disablePadding
      onClick={() => {
        action();
      }}
    >
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};
