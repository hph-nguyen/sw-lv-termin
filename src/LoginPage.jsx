import { useEffect, useState } from "react";
import { useAuth } from "./components/hooks/useAuth";
import { FormInput, FormSelect } from "./components/formComponents";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import * as apiService from "../src/services/apiService";
import Header from "./components/Header";
import { LockPerson } from "@mui/icons-material";
import { redAccent } from "./theme";

export const LoginPage = () => {
  // const [uid, setUid] = useState("");
  const [semester, setSemester] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    try {
      // Check if the user exists
      const userRes = await apiService.getUser(e.uid);

      if (userRes.status !== 200) {
        setErrMsg("Benutzer nicht gefunden");
        setIsError(true);
        return;
      }
      // console.log(userRes.data);

      // Check if code Valid
      const zugangRes = await apiService.postSwZugang(e.semester, { code: e.code, semestername: e.semester });
      if (zugangRes.status !== 200) {
        setErrMsg("Ungültiger Zugangscode");
        setIsError(true);
        return;
      }

      await login(userRes.data);
      sessionStorage.setItem("currentSemester", e.semester);
    } catch (error) {
      console.error("Login error:", error);
      setErrMsg("Ein Fehler ist aufgetreten");
      setIsError(true);
    }
  };

  useEffect(() => {
    const getSemester = async () => {
      const res = await apiService.getSemester();
      if (res.status === 200) {
        const semester = res.data.map((data) => {
          return {
            value: data.name,
            label: data.name,
          };
        });
        setSemester(semester);
      } else {
        setIsError(true);
        if (!res?.status) setErrMsg("keine Serverantwort");
        else console.log(res);
      }
    };
    getSemester();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Header />
      <Typography variant="h4" color="primary" mt={1}>
        Fakultät Sozialwissenschaften
      </Typography>
      <Typography variant="h3" color="primary" mt={3}>
        <strong>Terminbuchung</strong>
      </Typography>
      <Avatar sx={{ m: 2, width: 70, height: 70, backgroundColor: redAccent[500] }}>
        <LockPerson fontSize="large" />
      </Avatar>
      <Formik onSubmit={handleLogin} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="10px" mt={"20px"}>
              <FormInput name={"uid"} label="Benutzername" size="small" autoComplete="off" />
              <FormInput name={"code"} label="Zugangscode" size="small" autoComplete="off" maxLength={6} />
              <FormSelect name={"semester"} label="Semester" options={semester} size="small" defaultValue={""} />
              <Button type="submit" color="primary" variant="contained">
                Anmelden
              </Button>
              {isError && (
                <Box
                  sx={{
                    color: "error.main",
                    fontWeight: "bold",
                    paddingLeft: "10px",
                  }}
                >
                  {errMsg}
                </Box>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const initialValues = {
  uid: "",
  code: "",
  semester: "",
};

const checkoutSchema = yup.object().shape({
  semester: yup.string().required("Bitte wählen Sie das Semester aus"),
  uid: yup.string().required("Bitte geben Sie Ihren Benutzenamen ein"),
  code: yup.string().required("Bitte geben Sie den Zugangscode ein"),
});
