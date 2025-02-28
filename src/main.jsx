import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import theme from "./theme.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./ErrorPage.jsx";
import { AfterBook } from "./components/AfterBook.jsx";
import { ProtectedRoute } from "./components/shared/ProtectedRoute.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { AuthProvider } from "./components/hooks/useAuth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter
        basename="/sw-lv-termin"
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
              errorElement={<ErrorPage />}
            />
            <Route
              path="/info"
              element={
                <ProtectedRoute>
                  <AfterBook />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/info" element={<AfterBook />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
