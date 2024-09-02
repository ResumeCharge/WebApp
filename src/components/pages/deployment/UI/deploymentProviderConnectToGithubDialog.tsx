import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import "./deploymentProviderConnectToGithubDialog.scss";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Set GitHub Token
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
            To deploy your website to GitHub you need to first set your GitHub
            access token.
          </Typography>
          <Typography fontWeight={"bold"} gutterBottom>
            Go to GitHub to generate a personal access token{" "}
            <a
              target={"_blank"}
              href={
                "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
              }
            >
              link
            </a>{" "}
            and save that token in ResumeCharge.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color={"info"}>
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={() => navigate("/account/settings")}
            color={"success"}
          >
            Set GitHub Token
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
