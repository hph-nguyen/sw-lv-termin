import { Box } from "@mui/material";

import OhmLogo from "../assets/OhmLogo.png";

const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // bgcolor: redAccent[500],
      }}
    >
      <Box
        component="img"
        sx={{
          maxHeight: { xs: "16vh" },
          maxWidth: { xs: "16vh" },
        }}
        alt="OhmLogo"
        src={OhmLogo}
      />
    </Box>
  );
};

export default Header;
