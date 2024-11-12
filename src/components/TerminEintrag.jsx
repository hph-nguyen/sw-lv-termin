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
import { useState } from "react";
import { Formik } from "formik";
import { Add, Delete, ErrorOutline } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
// import moment from "moment";
import dayjs from "dayjs";
import * as yup from "yup";

import { FormDatePicker, FormInput, FormSelect } from "../components/formComponents";
import { LV_RHYTHMUS, TIME_PICKER_VON, TIME_PICKER_BIS, SEMESTER, WEEKDAY, VIRTUELLES_FORMAT } from "../dummyData";
import { redAccent } from "../theme";

const TerminEintrag = ({ onSubmit, moduleList = [] }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const initialValues = {
    semester: "",
    module: "",
    lv_title: "",
    co_dozent: "",
    rhythmus: "",
    vformat: "",
    anmerkungen: "",
    tn_zahl: "",
    wartelist: "",
    raumwunsch: "",
    // mitbk: false,
    firstdate: "",
    wochentag: "",
    von: "",
    bis: "",
    bk: [],
    bktemp: {
      bktitle: "",
      von: "",
      bis: "",
      datum: "",
    },
  };

  const [serienDisabled, setSerienDisabled] = useState(true);
  const [bkDisabled, setBkDisabled] = useState(true);
  const [rhythmusInfo, setRhythmusInfo] = useState(false);

  const checkoutSchema = yup.object().shape({
    semester: yup.string().required("Bitte auswählen"),
    module: yup.string().required("Bitte auswählen"),
    lv_title: yup.string().required("Bitte auswählen/ eingeben"),
    rhythmus: yup.string().required("Bitte auswählen"),
  });

  const modules = moduleList.map((e) => {
    return { value: e.module, label: e.module };
  });

  return (
    <Box m={"10px"}>
      <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ values, handleSubmit, handleReset, handleChange, setFieldValue }) => {
          let filteredLectures = moduleList.find((el) => el.module === values.module)?.lectures || [];
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
                <FormSelect name="semester" label="Semester" options={SEMESTER} />
                <FormSelect name="module" label="Modul" options={modules} />

                {filteredLectures.length ? (
                  <FormSelect
                    name={"lv_title"}
                    label="LV-Titel auswählen"
                    defaultValue={filteredLectures.length === 1 ? filteredLectures[0].value : ""}
                    options={filteredLectures}
                  />
                ) : (
                  <FormInput
                    name={"lv_title"}
                    label="LV-Titel auswählen"
                    helperText={"Bitte Titel der Veranstaltung eingeben"}
                  />
                )}

                <FormSelect
                  name="rhythmus"
                  label="LV-Rhythmus"
                  onChange={(e) => {
                    if (e.target.value === "Blockveranstaltung") {
                      setBkDisabled(false);
                      setSerienDisabled(true);
                    } else if (e.target.value === "wöchentlich mit Zusatzterminen") {
                      setBkDisabled(false);
                      setSerienDisabled(false);
                    } else {
                      setBkDisabled(true);
                      setSerienDisabled(false);
                    }

                    if (
                      e.target.value === "wöchentlich, doppelte SWS-Zahl, aber mit halbierter Anzahl Termine" ||
                      e.target.value === "vierzehntägig, dafür LV mit doppelter SWS-Zahl"
                    ) {
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

                <FormInput
                  name={"co_dozent"}
                  label="Co-Dozent:innen"
                  helperText={"Eingabenformat: Vorname, Nachname & Vorname, Nachname..."}
                />

                {/* TODO DROPDOWN FOR HYBRID HIER */}
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
                  label="Virtulles Format"
                  options={VIRTUELLES_FORMAT}
                  onChange={handleChange}
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
                    <FormDatePicker name="firstdate" label="1.Tag (Opt.)" disabled={serienDisabled} />

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
                    <FormInput name="bktemp.bktitle" label="Titel/Gruppe (Opt.)" span={2} disabled={bkDisabled} />
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
                            bktitle: values.bktemp.bktitle,
                            bkvon: values.bktemp.von,
                            bkbis: values.bktemp.bis,
                            datum: values.bktemp.datum,
                          };
                          setFieldValue("bk", [...values.bk, addData]);
                          console.log("bkTemp", values.bk);
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
                                <TableCell>{bk.bktitle}</TableCell>
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
                    <FormInput name="tn_zahl" label="Bevorzugte maximale TN-Zahl" />
                    <FormInput name="wartelist" label="Länge der Warteliste" />
                    <FormInput name="raumwunsch" label="Raumwunsch" />
                    <FormInput name="anmerkungen" label="Anmerkungen" />
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
                    handleReset(), setSerienDisabled(true), setBkDisabled(true);
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
