import { Box, Button, Typography } from "@mui/material";
import Header from "./Header";
import { Link, useLocation } from "react-router-dom";

export const AfterBook = () => {
  const location = useLocation();
  const data = location.state?.data;
  const isDataValidArray = Array.isArray(data) && data.length > 0;

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          margin: 0,
          minHeight: "90vh",
          placeItems: "center",
          minWidth: "320px",
        }}
      >
        <Box
          sx={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <Box sx={{ margin: 10 }}>
            {isDataValidArray ? (
              // Render each object in a single line, excluding empty values
              data.map((item, index) => {
                // Filter out empty string values from the object
                const nonEmptyValues = Object.values(item).filter((value) => value !== "");

                return (
                  <Typography key={index} variant="h6" sx={{ marginBottom: 1 }}>
                    <strong>{nonEmptyValues.length > 0 && nonEmptyValues.join(" - ")}</strong>
                  </Typography>
                );
              })
            ) : (
              <Typography variant="h6">
                <strong>Sie haben keine Termin gebucht</strong>
              </Typography>
            )}
          </Box>
          <Link to="/">
            <Button variant="contained">Zurück</Button>
          </Link>
        </Box>
      </Box>
    </>
  );
};
