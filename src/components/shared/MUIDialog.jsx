import { Typography, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

export default function MUIDialog({ onOpen, title, content, onClose, disableBackdropClick = false, ...otherProps }) {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === "backdropClick") {
      return; // Prevent closing when clicking the backdrop
    }
    onClose();
  };

  return (
    <Dialog open={onOpen} onClose={handleClose} sx={{ position: "absolute" }} {...otherProps}>
      {title && (
        <DialogTitle color="primary" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" component="div">
            <strong>{title}</strong>
          </Typography>
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon color="warning" />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
}
