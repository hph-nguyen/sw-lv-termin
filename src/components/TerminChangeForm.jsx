import { Box, useMediaQuery } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { FormInput } from "./formComponents";

/* eslint-disable no-unused-vars */
const TerminChangeForm = ({ onSubmit, initialValues = {}, modulList, lvList }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <Box m={"10px"}>
      <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ handleSubmit, handleReset }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <Box
              display={"grid"}
              gap={"15px"}
              gridTemplateColumns={"repeat(2, minmax(0,1fr))"}
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 2" } }}
            >
              {/* <FormSelect name="modul" label="Modul" options={TIME_PICKER_VON} /> */}
              <FormInput name={"lv_titel"} label="Lehrveranstaltung" />
              <FormInput name={"von"} label="Von"></FormInput>
              <FormInput name={"bis"} label="Bis"></FormInput>
              <FormInput name={"wochentag"} label="Wochentag"></FormInput>
              <FormInput name="rhythmus" label="Rhythmus"></FormInput>
              <FormInput name={"start_datum"} label="1.Tag (Opt.)"></FormInput>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default TerminChangeForm;

// Bsp. Datenstruktur
// const initialValues = {
//   id: "15",
//   benutzer_id: "807",
//   modul_id: "1.1",
//   modul_titel: "Propädeutik",
//   lv_id: "2",
//   lv_titel: "Informationstechnologien in der Sozialen Arbeit",
//   lv_frei_titel: null,
//   block_titel: null,
//   start_datum: null,
//   wochentag: "3",
//   anfangszeit: "12:00",
//   dauer: "90",
//   dozent: "Testsw, Co-Dozent",
//   rhythmus: "W",
//   co_dozent: null,
//   max_tn: null,
//   warteliste_len: null,
//   raum_wunsch: null,
//   vformat: "Präsenz",
//   anmerkung: null,
//   status: "angefragt",
// };

const checkoutSchema = yup.object().shape({});
