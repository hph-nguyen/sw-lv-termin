/* eslint-disable no-unused-vars */
import MUIAccordion from "./shared/MUIAccordion";
import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { GridToolbar, DataGrid, GridActionsCellItem, gridClasses } from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import { deDE } from "@mui/x-data-grid/locales";
import { redAccent } from "../theme";
// import { DUMMY_TABLE_DATA } from "../dummyData";
import MUIDialog from "./shared/MUIDialog";
import TerminChangeForm from "./TerminChangeForm";
// import ConfirmDialog from "./shared/ConfirmDialog";

const GebuchtTermine = ({ rowsData, defaultExpanded = true }) => {
  // eslint-disable-next-line
  const [rows, setRows] = useState(rowsData);
  const [openForm, setOpenForm] = useState(false);
  const [terminToEdit, setTerminToEdit] = useState({});

  useEffect(() => {}, [rowsData]);

  const handleEditClick = (e) => () => {
    console.log(e.row.rawData);
    setTerminToEdit(e.row.rawData);
    setOpenForm(true);
  };

  const handleDeleteClick = (e) => () => {
    const temp = { ...e.row.rawData, status: "storniert" };
    console.log(temp);
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
          />,
          //   <GridActionsCellItem
          //     icon={<DeleteIcon />}
          //     label="Stornieren"
          //     onClick={handleDeleteClick(e)}
          //     color="primary"
          //   />,
          <Button variant="outlined" onClick={handleDeleteClick(e)} size="small">
            Stornieren
          </Button>,
        ];
      },
    },
  ];

  return (
    <Box>
      <MUIAccordion header={"Gebuchte Wunschtermine"} defaultExpanded={defaultExpanded}>
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
        content={<TerminChangeForm initialValues={terminToEdit} />}
        disableBackdropClick="true"
        title={"Test Title"}
      />
    </Box>
  );
};

export default GebuchtTermine;
