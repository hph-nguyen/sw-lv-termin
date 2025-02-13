/* eslint-disable no-unused-vars */
import MUIAccordion from "./shared/MUIAccordion";
import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { GridToolbar, DataGrid, GridActionsCellItem, gridClasses } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";

import { deDE } from "@mui/x-data-grid/locales";
import { redAccent } from "../theme";
import MUIDialog from "./shared/MUIDialog";
import TerminChangeForm from "./TerminChangeForm";
import * as apiService from "../services/apiService";
// import ConfirmDialog from "./shared/ConfirmDialog";
import { numberToWeekday, formatTimeRange, dauerBerechnung } from "../services/timeUtils";

const GebuchtTermine = ({ rowsData, defaultExpanded = true }) => {
  const [rows, setRows] = useState(rowsData);
  const [openForm, setOpenForm] = useState(false);
  const [terminToEdit, setTerminToEdit] = useState({});

  useEffect(() => {}, [rowsData]);

  const handleEditClick = (e) => () => {
    if (!e?.row?.rawData) return "";

    const rawData = e.row.rawData;

    // Replace null values with empty strings
    const sanitizedData = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, value === null ? "" : value])
    );
    sanitizedData.vformat = sanitizedData.vformat ? sanitizedData.vformat.split(",") : [];
    sanitizedData.status = "geaendert";
    console.log(sanitizedData);
    setTerminToEdit(sanitizedData);
    setOpenForm(true);
  };

  const handleChange = async (e) => {
    const benId = JSON.parse(sessionStorage.getItem("user")).benutzer_id;
    const res = await apiService.putTermin(
      sessionStorage.getItem("currentSemester"),
      { ...e, vformat: e.vformat.toString(), dauer: dauerBerechnung(e.anfangszeit, e.bis) },
      benId
    );
    if (res.status === 200) {
      setOpenForm(false);
      getGebuchteTermine(benId);
    } else {
      console.log(res);
    }
  };

  const getGebuchteTermine = async (benutzerId) => {
    try {
      const res = await apiService.getGebuchteTermine(sessionStorage.getItem("currentSemester"), benutzerId);
      if (Array.isArray(res.data)) {
        const terminList = res.data.map((el) => ({
          id: el.id,
          module: el.modul_titel,
          lv_titel: el.lv_titel ? el.lv_titel : el.lv_frei_titel,
          block_titel: el.block_titel,
          rhythmus: el.rhythmus,
          vformat: el.vformat,
          lv_termin: el.wochentag
            ? `${numberToWeekday(el.wochentag)},  ${formatTimeRange(el.anfangszeit, el.dauer)}`
            : `${el.start_datum},  ${formatTimeRange(el.anfangszeit, el.dauer)}`,
          start_datum: el.wochentag ? el.start_datum : "",
          raum_wunsch: el.raum_wunsch,
          co_dozent: el.co_dozent,
          max_tn: el.max_tn,
          warteliste_len: el.warteliste_len,
          status: el.status,
          rawData: { ...el },
        }));
        // console.log(dayjs("10:00", "HH:mm"));
        setRows([...terminList]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelClick = (e) => async () => {
    if (window.confirm("Sind sie sicher, diese Buchung zu stornieren?")) {
      console.log(e);
      const temp = { ...e.row.rawData, status: "storniert" };
      Object.keys(temp).forEach((key) => {
        if (temp[key] === null) {
          temp[key] = "";
        }
      });
      const benutzerId = JSON.parse(sessionStorage.getItem("user")).benutzer_id;
      if (benutzerId) {
        const res = await apiService.putTermin(sessionStorage.getItem("currentSemester"), temp, benutzerId);
        if (res.status === 200) {
          getGebuchteTermine(benutzerId);
        } else {
          console.log(e);
        }
      }
    }
  };

  const columns = [
    { field: "module", headerName: "Modul", editable: false, type: "string", flex: 1 },
    { field: "lv_titel", headerName: "LV-Titel", editable: false, type: "string", flex: 1 },
    { field: "block_titel", headerName: "BK-Titel (Opt.)", type: "string", flex: 1 },
    { field: "rhythmus", headerName: "Rhythmus", editable: false, type: "string", flex: 1 },
    { field: "lv_termin", headerName: "LV-Termin", editable: false, type: "string", flex: 1 },
    { field: "start_datum", headerName: "1. Tag", type: "string", flex: 0.5 },
    { field: "raum_wunsch", headerName: "Raumwunsch", type: "string", flex: 0.5 },
    { field: "co_dozent", headerName: "Co-Dozent", type: "string", flex: 0.5 },
    { field: "max_tn", headerName: "max. TN-Zahl", type: "number", flex: 0.5 },
    { field: "warteliste_len", headerName: "Wartelist", type: "string", flex: 0.5 },
    { field: "anmerkungen", headerName: "Anmerkung", type: "string", flex: 0.5 },
    { field: "vformat", headerName: "Virtuelles Format", type: "string", flex: 0.5 },
    { field: "status", headerName: "Status", editable: false, type: "string", flex: 0.5 },
    {
      field: "actions",
      type: "actions",
      headerName: "Aktion",
      flex: 1,
      cellClassName: "actions",
      getActions: (e) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(e)}
            color="primary"
            disabled={e.row.rawData.status === "storniert" ? true : false}
          />,
          <Button
            variant="outlined"
            onClick={handleCancelClick(e)}
            size="small"
            disabled={e.row.rawData.status === "storniert" ? true : false}
          >
            Stornieren
          </Button>,
        ];
      },
    },
  ];

  return (
    <Box>
      <MUIAccordion header={"Gebuchte Termine"} defaultExpanded={defaultExpanded}>
        <Box
          height={300}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              color: redAccent[500],
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "700",
              fontSize: 13,
            },
            [`.${gridClasses.cell}.geplant`]: {
              backgroundColor: "#b9d5ff91",
            },
            [`.${gridClasses.cell}.storniert`]: {
              backgroundColor: "#f6685e75",
            },
            [`.${gridClasses.cell}.angefragt`]: {
              backgroundColor: "#6fbf7391",
            },
            [`.${gridClasses.cell}.geaendert`]: {
              backgroundColor: "#ffd32c75",
            },
          }}
        >
          <DataGrid
            localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  raum_wunsch: false,
                  co_dozent: false,
                  max_tn: false,
                  warteliste_len: false,
                  anmerkungen: false,
                  vformat: false,
                  start_datum: false,
                },
              },
              density: "compact",
            }}
            sx={{ fontSize: 13 }}
            rows={rows}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                printOptions: { disableToolbarButton: true },
                csvOptions: {
                  delimiter: ";",
                },
              },
            }}
            getCellClassName={(params) => {
              if (params.field === "status") {
                switch (params.value) {
                  case "geplant":
                    return "geplant";
                  case "angefragt":
                    return "angefragt";
                  case "storniert":
                    return "storniert";
                  case "geaendert":
                    return "geaendert";
                  default:
                    return "";
                }
              }
            }}
          />
        </Box>
      </MUIAccordion>
      <MUIDialog
        onOpen={openForm}
        onClose={() => setOpenForm(false)}
        content={<TerminChangeForm initialValues={terminToEdit} onSubmit={handleChange} />}
        disableBackdropClick="true"
        title={"Test Title"}
      />
    </Box>
  );
};

export default GebuchtTermine;
