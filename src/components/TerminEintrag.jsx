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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import { Formik } from "formik";
import { Add, Delete } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";
import * as yup from "yup";

import {
  FormDatePicker,
  FormDateRangePicker,
  FormInput,
  FormSelect,
  FormTimePicker,
} from "../components/formComponents";
import { lvRHYTHMUS, semester, weekday } from "../dummyData";
import { redAccent } from "../theme";

const TerminEintrag = ({ onSubmit, moduleList = [] }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const initialValues = {
    semester: "",
    module: "",
    lv_title: "",
    co_dozent: "",
    rhythmus: "",
    anmerkungen: "",
    tn_zahl: "",
    wartelist: "",
    raumwunsch: "",
    mitbk: false,
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

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [serienDisabled, setSerienDisabled] = useState(true);

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
                <FormSelect name="semester" label="Semester" options={semester} />
                <FormSelect name="module" label="Modul" options={modules} />

                {filteredLectures.length ? (
                  <FormSelect name={"lv_title"} label="LV-Titel auswählen" options={filteredLectures} />
                ) : (
                  <FormInput
                    name={"lv_title"}
                    label="LV-Titel auswählen"
                    helperText={<i>Bitte Titel der Veranstaltng eingeben</i>}
                  />
                )}

                <FormSelect
                  name="rhythmus"
                  label="LV-Rhythmus"
                  onChange={(e) => {
                    if (e.target.value === "Blockveranstaltung") {
                      values.mitbk = true;
                      setSerienDisabled(true);
                    } else {
                      values.mitbk = false;
                      setSerienDisabled(false);
                    }
                    handleChange(e);
                  }}
                  options={lvRHYTHMUS}
                />

                <FormInput
                  name={"co_dozent"}
                  label="Co-Dozent:innen"
                  helperText={<i>Eingabenformat: Vorname, Nachname & Vorname, Nachname...</i>}
                />
                <Box>
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
                </Box>
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
                    <FormSelect disabled={serienDisabled} label="Wochentag" name="wochentag" options={weekday} />
                    <FormDatePicker name="firstdate" label="1.Tag (Opt.)" disabled={serienDisabled} />
                    <FormTimePicker name="von" label="Von" disabled={serienDisabled} />
                    <FormTimePicker name="bis" label="Bis" disabled={serienDisabled} />
                  </Box>
                </Box>

                <Box
                  component={"fieldset"}
                  sx={{
                    border: "1px solid",
                    borderColor: values.mitbk ? redAccent[400] : "gray",
                  }}
                >
                  <legend>
                    <Typography variant="h5" color={values.mitbk === false ? "gray" : "primary"}>
                      <strong> Blockkurs</strong>
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
                    <FormInput name="bktemp.bktitle" label="Titel/Gruppe (Opt.)" span={2} disabled={!values.mitbk} />
                    <FormDateRangePicker name="bktemp.datum" size="small" disabled={!values.mitbk} />

                    <FormTimePicker name="bktemp.von" label="Von" disabled={!values.mitbk} />
                    <FormTimePicker name="bktemp.bis" label="Bis" disabled={!values.mitbk} />

                    <Box>
                      <IconButton
                        disabled={!values.mitbk}
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
                          setFieldValue("bktemp.datum", "");
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
                                  {bk.datum && bk.datum.length > 0
                                    ? bk.datum
                                        .map((date) =>
                                          moment(date).isValid() ? moment(date).format("DD.MM.YYYY") : "Invalid Date"
                                        )
                                        .join(", ")
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
                                <strong>Blockkursübersicht</strong>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>

                <FormInput name="tn_zahl" label="Maximale TN-Zahl" />
                <FormInput name="wartelist" label="Länge der Warteliste" />
                <FormInput name="raumwunsch" label="Raumwunsch" />
                <FormInput name="anmerkungen" label="Anmerkungen" />
                <Button type="submit" color="primary" variant="contained">
                  Termin Addieren
                </Button>
                <Button type="reset" color="primary" variant="outlined">
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
