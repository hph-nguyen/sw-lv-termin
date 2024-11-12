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
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function OverviewTable({ rowsData }) {
  const [rows, setRows] = useState(rowsData);
  const [rowModesModel, setRowModesModel] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setRows(rowsData);
  }, [rowsData]);

  const handleSend = () => {
    const infoData = rowsData.map((data) => {
      return {
        semester: data.semester,
        module: data.module,
        lv_title: data.lv_title,
        bktitle: data.bktitle,
        rhythmus: data.rhythmus,
        lv_termin: data.lv_termin,
        vformat: data.vformat,
      };
    });

    navigate("/sw-lv-termin/info", { state: { data: infoData } });
    sessionStorage.clear();
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
      // console.log(dayjs(e.firstdate).isValid());
      return {
        ...e.rawData,
        firstdate: dayjs(e.firstdate).isValid() ? dayjs(e.firstdate).format("YYYY-MM-DD") : "invalid",
        raumwunsch: e.raumwunsch,
        co_dozent: e.co_dozent,
        tn_zahl: e.tn_zahl,
        wartelist: e.wartelist,
        anmerkungen: e.anmerkungen,
        vformat: e.vformat,
        bktitle: e.bktitle,
      };
    });
    sessionStorage.setItem("terminList", JSON.stringify(newTerminList));
  };

  const columns = [
    { field: "nachname", headerName: "Nachname", editable: false, type: "string", flex: 0.5 },
    { field: "vorname", headerName: "Vorname", editable: false, type: "string", flex: 0.5 },
    { field: "semester", headerName: "Semester", editable: false, type: "string", flex: 0.5 },
    { field: "module", headerName: "Modul", editable: false, type: "string", flex: 1 },
    { field: "lv_title", headerName: "LV-Titel", editable: false, type: "string", flex: 1 },
    { field: "bktitle", headerName: "BK-Titel (Opt.)", editable: true, type: "string", flex: 1 },
    { field: "rhythmus", headerName: "Rhythmus", editable: false, type: "string", flex: 1 },
    { field: "lv_termin", headerName: "LV-Termin", editable: false, type: "string", flex: 1 },
    {
      field: "firstdate",
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
    { field: "raumwunsch", headerName: "Raumwunsch", editable: true, type: "string", flex: 0.5 },
    { field: "co_dozent", headerName: "Co-Dozent", editable: true, type: "string", flex: 0.5 },
    { field: "tn_zahl", headerName: "max. TN-Zahl", editable: true, type: "number", flex: 0.5 },
    { field: "wartelist", headerName: "Wartelist", editable: true, type: "string", flex: 0.5 },
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
            color="inherit"
          />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />,
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
                raumwunsch: false,
                co_dozent: false,
                tn_zahl: false,
                wartelist: false,
                anmerkungen: false,
                vformat: false,
                // firstdate: false,
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
        <Button variant="contained" onClick={handleSend}>
          Buchen <SendIcon sx={{ ml: 1 }} />
        </Button>
      </Box>
    </Box>
  );
}
