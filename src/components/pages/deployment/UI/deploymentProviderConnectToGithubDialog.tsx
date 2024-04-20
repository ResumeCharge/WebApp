import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import * as Yup from "yup";
import "./deploymentProviderConnectToGithubDialog.scss";
import { useState } from "react";
import {
  getUser,
  IDbUserUpdate,
  updateUser,
} from "../../../../microservices/user-service/userService.api";
import { store } from "../../../../store/store";
import { setUser } from "../../../../store/reducers/userSlice";
import { getGithubAuthEndpoint } from "../../../../utilities/github/githubTokenHelper";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface IProps {
  open: boolean;
  onClose(): void;
}

export default function DeploymentProviderConnectToGithubDialog(props: IProps) {
  const [open, setOpen] = useState(props.open);
  const [loading, setIsLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState<string | undefined>(
    undefined
  );
  const nicknameRef = React.useRef<HTMLInputElement>(null);
  const stringSchema = Yup.object({
    value: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
  });

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const connectGitHubAccount = async () => {
    const githubAuthEndpoint = getGithubAuthEndpoint();
    window.location.href = githubAuthEndpoint;
  };

  const updateWebsiteIdentifier = async (websiteIdentifier: string) => {
    const userUpdate: IDbUserUpdate = {
      websiteIdentifier,
    };
    const user = await updateUser(userUpdate);
    await loadUserFromDatabase();
  };

  async function loadUserFromDatabase() {
    const dbUser = await getUser();
    if (dbUser != null) {
      store.dispatch(setUser({ ...dbUser }));
    }
  }

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Connect to GitHub
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            To deploy your website to GitHub you need to first link your GitHub
            Account
          </Typography>
          <Typography fontWeight={"bold"} gutterBottom>
            Click the "Go to Github" button to connect your Github account. You
            will return to ResumeCharge when finished.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color={"info"}>
            Cancel
          </Button>
          <Button autoFocus onClick={connectGitHubAccount} color={"success"}>
            Connect Github Account
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
