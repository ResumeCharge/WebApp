import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export const getMenu = (clickAction: (path: string) => void) => {
  return (
    <List className={"sidebar_collapsible_nav"}>
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
    </List>
  );
};
