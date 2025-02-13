import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { FormDatePicker, FormInput, FormSelect } from "./formComponents";
import { LV_RHYTHMUS, TIME_PICKER_BIS, TIME_PICKER_VON, VIRTUELLES_FORMAT, WEEKDAY } from "../constData";
import { formatDauerZuEndzeit } from "../services/timeUtils";
import { useState } from "react";

/* eslint-disable no-unused-vars */
const TerminChangeForm = ({ onSubmit, initialValues = initVal }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [rhythmusInfo, setRhythmusInfo] = useState(false);
  return (
    <Box m={"10px"}>
      <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ handleSubmit, handleReset, handleChange }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <Box
              display={"grid"}
              gap={"15px"}
              gridTemplateColumns={"repeat(2, minmax(0,1fr))"}
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 2" } }}
            >
              <TextField
                defaultValue={`${initialValues.modul_id} ${initialValues.modul_titel}`}
                label="Modul"
                disabled
                size="small"
              />
              {initialValues.lv_titel && <FormInput name={"lv_titel"} label="Lehrveranstaltung" disabled />}
              {initialValues.lv_frei_titel && <FormInput name={"lv_frei_titel"} label="Lehrveranstaltung" />}
              {initialValues.block_titel && <FormInput name={"block_titel"} label="BK-Titel (Opt.)" span={2} />}
              <FormSelect
                name="anfangszeit"
                label="Von"
                options={TIME_PICKER_VON}
                defaultValue={initialValues.anfangszeit}
              />
              <FormSelect
                name="bis"
                label="Bis"
                options={TIME_PICKER_BIS}
                defaultValue={formatDauerZuEndzeit(initialValues.anfangszeit, initialValues.dauer)}
              />
              <FormSelect label="Wochentag" name="wochentag" options={WEEKDAY} defaultValue={initialValues.wochentag} />
              <FormDatePicker name="start_datum" label="1.Tag (Opt.)" />
              <FormSelect
                span="2"
                name="rhythmus"
                label="LV-Rhythmus"
                defaultValue={initialValues.rhythmus}
                onChange={(e) => {
                  if (e.target.value === "VZ" || e.target.value === "VZ2") {
                    setRhythmusInfo(true);
                  } else {
                    setRhythmusInfo(false);
                  }
                  handleChange(e);
                }}
                options={LV_RHYTHMUS.filter((option) => option.value !== "WZ")}
                helperText={
                  rhythmusInfo ? (
                    <>
                      <strong>Nur nach Absprache</strong>, für mehr Informationen klicken Sie bitte auf{" "}
                      <strong>Hinweise</strong>
                    </>
                  ) : (
                    ""
                  )
                }
              />
              <FormSelect
                name={"vformat"}
                label="Virtuelles Format"
                options={VIRTUELLES_FORMAT}
                onChange={handleChange}
                multiple={true}
                defaultValue={initialValues.vformat}
                helperText={"Mehrfach wählbar"}
              />
              <FormInput name="max_tn" label="Bevorzugte maximale TN-Zahl" />
              <FormInput name="warteliste_len" label="Länge der Warteliste" />
              <FormInput name="raum_wunsch" label="Raumwunsch" />
              <FormInput name="anmerkung" label="Anmerkungen" span={2} />
              <Button type="submit" color="primary" variant="contained">
                Änderung speichern
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default TerminChangeForm;

const initVal = {
  id: "",
  benutzer_id: "",
  modul_id: "",
  modul_titel: "",
  lv_id: "",
  lv_titel: "",
  lv_frei_titel: "",
  block_titel: "",
  start_datum: "",
  wochentag: "",
  anfangszeit: "",
  dauer: "",
  dozent: "",
  rhythmus: "",
  co_dozent: "",
  max_tn: "",
  warteliste_len: "",
  raum_wunsch: "",
  vformat: ["Präsenz"],
  anmerkung: "",
  status: "",
};

const checkoutSchema = yup.object().shape({});
