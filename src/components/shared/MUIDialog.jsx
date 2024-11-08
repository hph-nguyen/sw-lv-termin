import { Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function MUIDialog({ onOpen, title, content, onClose, ...otherProps }) {
  return (
    <Dialog open={onOpen} onClose={onClose} sx={{ position: "absolute" }} {...otherProps}>
      {title && (
        <DialogTitle color="primary">
          <Typography variant="h4">
            <strong>{title}</strong>
          </Typography>
        </DialogTitle>
      )}
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
