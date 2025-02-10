import { Box, Button, Avatar } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const ConfirmDialog = ({
  msg,
  subMsg,
  confirmLabel = "Ja",
  declineLabel = "Nein",
  onConfirm,
  onDecline,
  type = "info",
  hideButton = false,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          m: 1,
        }}
      >
        {type === "error" && (
          <Avatar sx={{ bgcolor: "#F5A9A9", width: 60, height: 60 }}>
            <PriorityHighRoundedIcon color="error" sx={{ width: 40, height: 40 }} />
          </Avatar>
        )}
        {type === "info" && (
          <Avatar sx={{ bgcolor: "#89CFF0", width: 60, height: 60 }}>
            <QuestionMarkIcon color="info" sx={{ width: 40, height: 40 }} />
          </Avatar>
        )}
        {type === "warning" && <WarningAmberIcon color="warning" sx={{ width: 40, height: 40 }} />}
      </Box>
      <Box
        sx={{
          display: "grid",
          flexDirection: "column",
          textAlign: "center",
          fontSize: 16,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            textTransform: "uppercase",
            fontWeight: "bold",
            gridColumn: "span 2",
          }}
        >
          {msg}
        </Box>
        {subMsg && <Box sx={{ fontWeight: 600, gridColumn: "span 2", mb: "10px" }}>{subMsg}</Box>}
        {!hideButton && (
          <>
            <Button color="info" variant="contained" onClick={onConfirm}>
              {confirmLabel}
            </Button>
            <Button color="error" variant="contained" onClick={onDecline}>
              {declineLabel}
            </Button>
          </>
        )}
      </Box>
    </>
  );
};

export default ConfirmDialog;
