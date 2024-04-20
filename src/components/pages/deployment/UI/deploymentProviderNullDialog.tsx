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
import "./deploymentProviderNullDialog.scss";
import { useState } from "react";
import {
  getUser,
  IDbUserUpdate,
  updateUser,
} from "../../../../microservices/user-service/userService.api";
import { store } from "../../../../store/store";
import { setUser } from "../../../../store/reducers/userSlice";

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

export default function DeploymentProviderNullDialog(props: IProps) {
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

  const handleSave = async () => {
    setIsLoading(true);
    let nicknameErrorValue;
    const nickNameValue = nicknameRef?.current?.value;
    try {
      stringSchema.validateSync({
        value: nickNameValue,
      });
    } catch (err) {
      if (err instanceof Error) {
        nicknameErrorValue = err.message;
      }
    }
    if (nicknameErrorValue) {
      setNicknameError(nicknameErrorValue);
      setIsLoading(false);
      return;
    }
    // @ts-ignore
    const success = await updateWebsiteIdentifier(nickNameValue);
    if (success) {
      setOpen(false);
      props.onClose();
    }
    setIsLoading(false);
  };

  const updateWebsiteIdentifier = async (
    websiteIdentifier: string
  ): Promise<boolean> => {
    const userUpdate: IDbUserUpdate = {
      websiteIdentifier,
    };
    try {
      const user = await updateUser(userUpdate);
      await loadUserFromDatabase();
    } catch (err) {
      if (err instanceof Error) {
        setNicknameError(err.message);
      }
      return false;
    }
    return true;
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
          Choose a nickname for your profile
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
            Choose a nickname for your profile, your profile nickname will help
            others find you on ResumeCharge. You'll be able to share your
            website with other using a special link
            (resumecharge.com/profiles/nickname).
          </Typography>
          <Typography fontWeight={"bold"} gutterBottom>
            Pick something you like, as you won't be able to change it later!
          </Typography>
          <div className={"deployment_provider_dialog_nickname"}>
            <label htmlFor={"website-identifier"}>Nickname</label>
            <input type={"text"} id={"website-identifier"} ref={nicknameRef} />
            <p>{nicknameError}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
