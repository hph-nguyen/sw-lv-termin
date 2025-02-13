import { Box, Button, Typography } from "@mui/material";
import Header from "./Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export const AfterBook = () => {
  const location = useLocation();
  const data = location.state?.data;
  const isDataValidArray = Array.isArray(data) && data.length > 0;
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAusloggen = () => {
    sessionStorage.clear();
    login(null);
    navigate("/");
  };

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
              <>
                <Typography variant="h6" mb={2}>
                  <strong>Sie haben folgende Lehrveranstaltungen gebucht:</strong>
                </Typography>
                {data.map((item, index) => {
                  const nonEmptyValues = Object.values(item).filter((value) => value !== "");

                  return (
                    <Typography key={index} variant="h6" sx={{ marginBottom: 1 }}>
                      <strong>{nonEmptyValues.length > 0 && nonEmptyValues.join(" - ")}</strong>
                    </Typography>
                  );
                })}
              </>
            ) : (
              <Typography variant="h6">
                <strong>Sie haben keinen Termin gebucht</strong>
              </Typography>
            )}
          </Box>
          <Link to="/">
            <Button variant="contained" sx={{ marginRight: 1 }}>
              Zurück
            </Button>
            <Button variant="contained" onClick={handleAusloggen}>
              Ausloggen
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
};
