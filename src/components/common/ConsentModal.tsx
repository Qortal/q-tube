import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import localForage from "localforage";
import { useTheme } from "@mui/material";
const generalLocal = localForage.createInstance({
  name: "q-tube-general",
});

export default function ConsentModal() {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const getIsConsented = React.useCallback(async () => {
    try {
      const hasConsented = await generalLocal.getItem("general-consent");
      if (hasConsented) return;

      setOpen(true);
      generalLocal.setItem("general-consent", true);
    } catch (error) {}
  }, []);

  React.useEffect(() => {
    getIsConsented();
  }, []);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Welcome</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Q-Tube is currently in its early stages, and may yet have undiscovered bugs.
            The Qortal community, including the Qortal Development Group, cannot be held responsible for any 
            content published with the assistance of Q-Tube. All content published to QDN is done so by the owner of 
            the registered name, and no one else. The same applies to data loss, social manipulation, 
            any other potential issue. All responsibility lies with the user, as with every application built by
            the Qortal Development Group.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.text.primary,
              fontFamily: "Arial",
            }}
            onClick={handleClose}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
