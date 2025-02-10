import { useEffect, useState } from "react";
import { useAuth } from "./components/hooks/useAuth";
import { FormInput, FormSelect } from "./components/formComponents";
import { Box, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import * as apiService from "../src/services/apiService";
import ConfirmDialog from "./components/shared/ConfirmDialog";
import MUIDialog from "./components/shared/MUIDialog";

export const LoginPage = () => {
  // const [uid, setUid] = useState("");
  const [semester, setSemester] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const { login } = useAuth();
  const [openInfo, setOpenInfo] = useState(false);

  const handleLogin = async (e) => {
    const res = await apiService.getUser(e.uid);
    if (res.status === 200) {
      console.log(res.data);
      await login(res.data);
      console.log(res.data.semesterliste);
      sessionStorage.setItem("currentSemester", e.semester);
    } else {
      // alert("Invalid username");
      setOpenInfo(true);
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
      {/* <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" value={uid} onChange={(e) => setUid(e.target.value)} />
        </div>
        <div>
          <label htmlFor="semester">Semester:</label>
          <input id="semester" type="text" value={semester} onChange={(e) => setSemester(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form> */}

      <Formik onSubmit={handleLogin} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="10px" mt={"20px"}>
              <FormInput name={"uid"} label="Benutzername" size="small" autoComplete="off" />
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
      <MUIDialog
        onOpen={openInfo}
        onClose={() => setOpenInfo(false)}
        content={<ConfirmDialog type="warning" msg={`Benutzer nicht gefunden`} hideButton={true} />}
      />
    </Box>
  );
};

const initialValues = {
  uid: "",
  semester: "",
};

const checkoutSchema = yup.object().shape({
  semester: yup.string().required("Bitte wählen Sie das Semester aus"),
  uid: yup.string().required("Bitte geben Sie Ihren Benutzenamen ein"),
});
