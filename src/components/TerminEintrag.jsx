import {
  Box,
  Button,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  // FormControlLabel,
  // Checkbox,
} from "@mui/material";
import { useState, useRef } from "react";
import { Formik } from "formik";
import { Add, Delete, ErrorOutline } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
// import moment from "moment";
import dayjs from "dayjs";
import * as yup from "yup";

import { FormDatePicker, FormInput, FormSelect } from "../components/formComponents";
// eslint-disable-next-line no-unused-vars
import { LV_RHYTHMUS, TIME_PICKER_VON, TIME_PICKER_BIS, SEMESTER, WEEKDAY, VIRTUELLES_FORMAT } from "../dummyData";
import { redAccent } from "../theme";

const TerminEintrag = ({ onSubmit, moduleList = [] }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const initialValues = {
    semester: "",
    modul_id: "",
    modul_titel: "",
    lv_titel: "",
    co_dozent: "",
    rhythmus: "",
    vformat: ["Präsenz"],
    anmerkung: "",
    max_tn: "",
    warteliste_len: "",
    raum_wunsch: "",
    // mitbk: false,
    start_datum: "",
    wochentag: "",
    von: "",
    bis: "",
    status: "angefragt",
    bk: [],
    bktemp: {
      block_titel: "",
      von: "",
      bis: "",
      datum: "",
    },
  };

  const resetFormRef = useRef(null);
  const resetAll = () => {
    if (resetFormRef.current) resetFormRef.current();
    setSerienDisabled(true);
    setBkDisabled(true);
    setRhythmusInfo(false);
  };

  const [serienDisabled, setSerienDisabled] = useState(true);
  const [bkDisabled, setBkDisabled] = useState(true);
  const [rhythmusInfo, setRhythmusInfo] = useState(false);

  const checkoutSchema = yup.object().shape({
    // semester: yup.string().required("Bitte auswählen"),
    modul_id: yup.string().required("Bitte auswählen"),
    lv_titel: yup.string().required("Bitte auswählen/ eingeben"),
    rhythmus: yup.string().required("Bitte auswählen"),
  });

  const modules = moduleList.map((e) => {
    return { value: e.modul_id, label: `${e.modul_id} ${e.modul_titel}`, name: e.modul_titel };
  });

  return (
    <Box m={"10px"}>
      <Formik
        onSubmit={(values, actions) => {
          onSubmit(values, actions);
          resetAll();
        }}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({ values, handleSubmit, handleReset, handleChange, setFieldValue }) => {
          let filteredLectures = moduleList.find((el) => el.modul_id === values.modul_id)?.lectures || [];
          filteredLectures = filteredLectures.map((e) => {
            return { value: e, label: e };
          });

          return (
            <form onSubmit={handleSubmit} onReset={handleReset}>
              <Box
                display="grid"
                gap={1.5}
                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                }}
              >
                {/* <FormSelect name="semester" label="Semester" options={SEMESTER} /> */}
                <FormSelect
                  name="modul_id"
                  label="Modul"
                  options={modules}
                  onChange={(e) => {
                    handleChange(e);
                    const selectedModule = moduleList.find((module) => module.modul_id === e.target.value);
                    setFieldValue("modul_titel", selectedModule ? selectedModule.modul_titel : "");
                  }}
                />

                {filteredLectures.length ? (
                  <FormSelect
                    name={"lv_titel"}
                    label="LV-Titel auswählen"
                    defaultValue={filteredLectures[0].value}
                    options={filteredLectures}
                  />
                ) : (
                  <FormInput
                    name={"lv_titel"}
                    label="LV-Titel auswählen"
                    helperText={"Bitte Titel der Veranstaltung eingeben"}
                  />
                )}

                <FormInput
                  name={"co_dozent"}
                  label="Co-Dozent:innen"
                  helperText={"Eingabenformat: Vorname, Nachname & Vorname, Nachname..."}
                />

                <FormSelect
                  name="rhythmus"
                  label="LV-Rhythmus"
                  onChange={(e) => {
                    if (e.target.value === "BK") {
                      setBkDisabled(false);
                      setSerienDisabled(true);
                    } else if (e.target.value === "WZ") {
                      setBkDisabled(false);
                      setSerienDisabled(false);
                    } else {
                      setBkDisabled(true);
                      setSerienDisabled(false);
                    }

                    if (e.target.value === "VZ" || e.target.value === "VZ2") {
                      setRhythmusInfo(true);
                    } else {
                      setRhythmusInfo(false);
                    }

                    handleChange(e);
                  }}
                  options={LV_RHYTHMUS}
                  helperText={
                    rhythmusInfo ? (
                      <>
                        <ErrorOutline sx={{ fontSize: "small", mr: 0.5 }} />
                        <strong>Nur nach Absprache</strong>, für mehr Informationen klicken Sie bitte auf{" "}
                        <strong>Hinweise</strong>
                      </>
                    ) : (
                      ""
                    )
                  }
                />

                {/* <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="mitbk"
                        checked={values.mitbk}
                        onChange={(e) => {
                          setFieldValue("mitbk", e.target.checked);
                        }}
                      />
                    }
                    label="mit Blockkurs"
                  />
                </Box> */}
                <FormSelect
                  name={"vformat"}
                  label="Virtuelles Format"
                  options={VIRTUELLES_FORMAT}
                  onChange={handleChange}
                  multiple={true}
                  helperText={"Mehrfach wählbar"}
                />
              </Box>

              <Box
                mt={1.5}
                display="grid"
                gap={1.5}
                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                }}
              >
                <Box
                  component={"fieldset"}
                  sx={{
                    border: "1px solid",
                    borderColor: !serienDisabled ? redAccent[400] : "gray",
                  }}
                >
                  <legend>
                    <Typography variant="h5" color={serienDisabled ? "gray" : "primary"}>
                      <strong>Serientermin</strong>
                    </Typography>
                  </legend>
                  <Box
                    display="grid"
                    gap={1.5}
                    gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    sx={{
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                    }}
                  >
                    <FormSelect disabled={serienDisabled} label="Wochentag" name="wochentag" options={WEEKDAY} />
                    <FormDatePicker name="start_datum" label="1.Tag (Opt.)" disabled={serienDisabled} />

                    <FormSelect name="von" label="Von" disabled={serienDisabled} options={TIME_PICKER_VON} />
                    <FormSelect name="bis" label="Bis" disabled={serienDisabled} options={TIME_PICKER_BIS} />
                  </Box>
                </Box>

                <Box
                  component={"fieldset"}
                  sx={{
                    border: "1px solid",
                    borderColor: bkDisabled ? "gray" : redAccent[400],
                  }}
                >
                  <legend>
                    <Typography variant="h5" color={bkDisabled ? "gray" : "primary"}>
                      <strong> Blocktermine </strong>
                    </Typography>
                  </legend>
                  <Box
                    display="grid"
                    gap={1.5}
                    gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                    sx={{
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                    }}
                  >
                    <FormInput name="bktemp.block_titel" label="Titel/Gruppe (Opt.)" span={2} disabled={bkDisabled} />
                    {/* <FormDateRangePicker name="bktemp.datum" size="small" disabled={bkDisabled} /> */}
                    <FormDatePicker name="bktemp.datum" label="Datum" disabled={bkDisabled} />
                    <FormSelect name="bktemp.von" label="Von" disabled={bkDisabled} options={TIME_PICKER_VON} />
                    <FormSelect name="bktemp.bis" label="Bis" disabled={bkDisabled} options={TIME_PICKER_BIS} />

                    <Box>
                      <IconButton
                        disabled={bkDisabled}
                        sx={{
                          backgroundColor: "primary.main",
                          color: "white",
                          "&:hover": {
                            backgroundColor: redAccent[700],
                          },
                        }}
                        onClick={() => {
                          const addData = {
                            block_titel: values.bktemp.block_titel,
                            bkvon: values.bktemp.von,
                            bkbis: values.bktemp.bis,
                            datum: values.bktemp.datum,
                          };
                          setFieldValue("bk", [...values.bk, addData]);
                          // console.log("bkTemp", values.bk);
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <TableContainer component={Paper} sx={{ gridColumn: "span 2", maxHeight: "250px" }}>
                      <Table stickyHeader size="small">
                        <TableHead sx={{ backgroundColor: "background.default" }}>
                          <TableRow>
                            <TableCell sx={{ color: "primary.main" }}>
                              <strong>Titel</strong>
                            </TableCell>
                            <TableCell sx={{ color: "primary.main" }}>
                              <strong>Datum</strong>
                            </TableCell>
                            <TableCell sx={{ color: "primary.main" }}>
                              <strong>Von</strong>
                            </TableCell>
                            <TableCell sx={{ color: "primary.main" }}>
                              <strong>Bis</strong>
                            </TableCell>
                            <TableCell sx={{ color: "primary.main" }}>
                              <strong>Aktion</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {values.bk.length ? (
                            values.bk.map((bk, index) => (
                              <TableRow key={index}>
                                <TableCell>{bk.block_titel}</TableCell>
                                <TableCell>
                                  {bk.datum
                                    ? dayjs(bk.datum).isValid()
                                      ? dayjs(bk.datum).format("DD.MM.YYYY")
                                      : "Invalid Date"
                                    : "Keine Datum"}
                                </TableCell>
                                <TableCell>{bk.bkvon}</TableCell>
                                <TableCell>{bk.bkbis}</TableCell>
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                      const updateData = values.bk.filter((_, i) => i !== index);
                                      setFieldValue("bk", updateData);
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                <strong>Übersicht</strong>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>

                <Box
                  component={"fieldset"}
                  sx={{
                    border: "1px solid",
                    borderColor: redAccent[400],
                    gridColumn: "span 2",
                  }}
                >
                  <legend>
                    <Typography variant="h5" color={"primary"}>
                      <strong> Allgemeine Eigenschaften (Opt. für alle Termine) </strong>
                    </Typography>
                  </legend>
                  <Box
                    display="grid"
                    gap={1.5}
                    gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    sx={{
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                    }}
                  >
                    <FormInput name="max_tn" label="Bevorzugte maximale TN-Zahl" />
                    <FormInput name="warteliste_len" label="Länge der Warteliste" />
                    <FormInput name="raum_wunsch" label="Raumwunsch" />
                    <FormInput name="anmerkung" label="Anmerkungen" />
                  </Box>
                </Box>
                <Button type="submit" color="primary" variant="contained">
                  Termin Hinzufügen
                </Button>
                <Button
                  type="reset"
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    handleReset(), resetAll();
                  }}
                >
                  Zurücksetzen
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default TerminEintrag;
