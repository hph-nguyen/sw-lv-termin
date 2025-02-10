import { useState, useEffect } from "react";
import { Button, TextField, Box, Select, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { GridRowModes, GridToolbar, DataGrid, GridActionsCellItem, GridRowEditStopReasons } from "@mui/x-data-grid";
import { deDE } from "@mui/x-data-grid/locales";

import { redAccent } from "../theme";
// import moment from "moment";
// import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";

export default function OverviewTable({ rowsData, handleSend }) {
  const [rows, setRows] = useState(rowsData);
  const [rowModesModel, setRowModesModel] = useState({});
  // const navigate = useNavigate();

  useEffect(() => {
    setRows(rowsData);
  }, [rowsData]);

  const handleSendData = () => {
    handleSend();
  };
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    let terminList = JSON.parse(sessionStorage.getItem("terminList")).filter((el) => el.id !== id);
    let tableData = JSON.parse(sessionStorage.getItem("tableData")).filter((el) => el.id !== id);
    sessionStorage.setItem("terminList", JSON.stringify(terminList));
    sessionStorage.setItem("tableData", JSON.stringify(tableData));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
    // console.log(rows);
    sessionStorage.setItem("tableData", JSON.stringify(rows));
    const newTerminList = rows.map((e) => {
      // console.log(e.start_datum);
      return {
        ...e.rawData,
        start_datum: e.start_datum,
        raum_wunsch: e.raum_wunsch,
        co_dozent: e.co_dozent,
        max_tn: e.max_tn,
        warteliste_len: e.warteliste_len,
        anmerkungen: e.anmerkungen,
        vformat: e.vformat,
        block_titel: e.block_titel,
      };
    });
    sessionStorage.setItem("terminList", JSON.stringify(newTerminList));
  };

  const columns = [
    { field: "module", headerName: "Modul", editable: false, type: "string", flex: 1 },
    { field: "lv_titel", headerName: "LV-Titel", editable: false, type: "string", flex: 1 },
    { field: "block_titel", headerName: "BK-Titel (Opt.)", editable: true, type: "string", flex: 1 },
    { field: "rhythmus", headerName: "Rhythmus", editable: false, type: "string", flex: 1 },
    { field: "lv_termin", headerName: "LV-Termin", editable: false, type: "string", flex: 1 },
    {
      field: "start_datum",
      headerName: "1. Tag",
      editable: true,
      type: "string",
      flex: 0.5,
      renderEditCell: (params) => (
        <TextField
          sx={{ width: "100%", boxSizing: "border-box" }}
          size="small"
          type="date"
          value={params.value || ""}
          onChange={(event) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: event.target.value,
            })
          }
        />
      ),
    },
    { field: "raum_wunsch", headerName: "Raumwunsch", editable: true, type: "string", flex: 0.5 },
    { field: "co_dozent", headerName: "Co-Dozent", editable: true, type: "string", flex: 0.5 },
    { field: "max_tn", headerName: "max. TN-Zahl", editable: true, type: "number", flex: 0.5 },
    { field: "warteliste_len", headerName: "Wartelist", editable: true, type: "string", flex: 0.5 },
    { field: "anmerkungen", headerName: "Anmerkung", editable: true, type: "string", flex: 0.5 },
    {
      field: "vformat",
      headerName: "Virtuelles Format",
      editable: true,
      type: "string",
      flex: 0.5,
      renderEditCell: (params) => (
        <Select
          sx={{ width: "100%", boxSizing: "border-box" }}
          size="small"
          type="select"
          value={params.value || ""}
          onChange={(event) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: event.target.value,
            })
          }
        >
          <MenuItem value="Hybrid (synchron)">Hybrid (synchron)</MenuItem>
          <MenuItem value="Hybrid (asynchron)">Hybrid (asynchron)</MenuItem>
          <MenuItem value="Rein digital">Rein digital</MenuItem>
        </Select>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Aktion",
      flex: 1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="primary"
          />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="primary" />,
        ];
      },
    },
  ];

  return (
    <Box>
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
                // start_datum: false,
              },
            },
            density: "compact",
          }}
          sx={{ fontSize: 13 }}
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              printOptions: { disableToolbarButton: true },
              csvOptions: {
                delimiter: ";",
              },
            },
          }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="contained" onClick={handleSendData}>
          Buchen <SendIcon sx={{ ml: 1 }} />
        </Button>
      </Box>
    </Box>
  );
}
