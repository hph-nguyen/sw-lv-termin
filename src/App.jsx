/* eslint-disable no-unused-vars */
import "./App.css";
import { useState, useEffect } from "react";
import { Box, TextField, IconButton, Tooltip, Button, MenuItem } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import Card from "./components/shared/Card";
import OverviewTable from "./components/OverviewTable";
import Header from "./components/Header";

import TerminEintrag from "./components/TerminEintrag";
import { randomId } from "@mui/x-data-grid-generator";
import moment from "moment";
import MUIDialog from "./components/shared/MUIDialog";
import InfoModal from "./components/AlleInfoModal";
import dayjs from "dayjs";
import AllgemeineInfo from "./components/AllgemeineInfo";
import { InfoOutlined } from "@mui/icons-material";
import { useAuth } from "./components/hooks/useAuth";
import ConfirmDialog from "./components/shared/ConfirmDialog";
import GebuchtTermine from "./components/GebuchtTermine";
import * as apiService from "../src/services/apiService";
import { dauerBerechnung, formatTimeRange, numberToWeekday } from "./services/timeUtils";
import { useNavigate } from "react-router-dom";

function App() {
  const { logout } = useAuth();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [tableData, setTableData] = useState(
    sessionStorage.getItem("tableData") ? JSON.parse(sessionStorage.getItem("tableData")) : []
  );
  const [currentSemester, setCurrentSemester] = useState(sessionStorage.getItem("currentSemester"));
  const [openInfo, setOpenInfo] = useState(false);
  const [semesterChangeWarn, setSemesterChangeWarn] = useState(false);
  const [userChangeWarn, setUserChangeWarn] = useState(false);
  const [failToPostTermin, setFailToPostTermin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gebuchteTermine, setGebuchteTermine] = useState([]);
  const [modulLvMergeList, setModulLvMergeList] = useState([]);
  const [lvListe, setLvListe] = useState([]);
  const navigate = useNavigate();

  const handleUserChange = () => {
    setUserChangeWarn(true);
  };

  const handlePostNewTerminList = async () => {
    const sendData = prepareDataForSendTermine(
      sessionStorage.getItem("terminList") ? JSON.parse(sessionStorage.getItem("terminList")) : null
    );

    if (sendData) {
      const result = await apiService.postNewTerminListe(currentSemester, sendData);

      if (result.status === 200) {
        // Data to show in AfterBook
        const infoData = sendData.map((data) => {
          return {
            semester: sessionStorage.getItem("currentSemester"),
            module: `${data.modul_id} ${data.modul_titel}`,
            lv_titel: data.lv_titel ? data.lv_titel : data.lv_frei_titel,
            block_titel: data.block_titel,
            rhythmus: data.rhythmus,
            start_datum: `${data.wochentag ? numberToWeekday(data.wochentag) : data.start_datum}, ${formatTimeRange(
              data.anfangszeit,
              data.dauer
            )} `,
            vformat: data.vformat,
          };
        });
        navigate("/sw-lv-termin/info", { state: { data: infoData } });
        sessionStorage.removeItem("terminList");
        sessionStorage.removeItem("tableData");
      } else {
        console.log(result);
        setFailToPostTermin(true);
      }
    }
  };

  const handleSemesterChange = (e) => {
    setSemesterChangeWarn(true);
    sessionStorage.setItem("currentSemester", e.target.value);
    setCurrentSemester(e);
  };

  const handleTerminEintrag = (values, actions) => {
    const { bk, bktemp, ...rest } = values;

    let newTerminList = [];
    let serienTermin = {};
    if (rest.wochentag !== "") {
      serienTermin = {
        id: randomId(),
        benutzer_id: user.benutzer_id,
        datum: "",
        block_titel: "",
        ...rest,
      };
      newTerminList.push(serienTermin);
    }

    let bkTermin = [];
    if (bk.length > 0) {
      bkTermin = bk.map((e) => {
        return {
          id: randomId(),
          benutzer_id: user.benutzer_id,
          datum: moment(e.datum).format("YYYY-MM-DD"),
          ...rest,
          start_datum: "",
          von: e.bkvon,
          bis: e.bkbis,
          block_titel: e.block_titel,
          wochentag: "",
          rhythmus: "BK",
        };
      });
    }

    newTerminList.push(...bkTermin);

    const oldTerminList = sessionStorage.getItem("terminList")
      ? JSON.parse(sessionStorage.getItem("terminList"))
      : null;
    if (oldTerminList) {
      newTerminList.push(...oldTerminList);
    }
    sessionStorage.setItem("terminList", JSON.stringify(newTerminList));

    const weekday = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const tableData = newTerminList.map((data) => {
      return {
        id: data.id,
        module: `${data.modul_id} ${data.modul_titel}`,
        lv_titel: data.lv_titel,
        block_titel: data.block_titel,
        rhythmus: data.rhythmus === "WZ" ? "W" : data.rhythmus,
        vformat: data.vformat.toString(),
        lv_termin:
          data.datum && dayjs(data.datum).isValid()
            ? `${dayjs(data.datum).format("DD.MM.YYYY")}, ${data.von}-${data.bis}`
            : `${weekday[data.wochentag]}, ${data.von}-${data.bis}`,
        start_datum: dayjs(data.start_datum).isValid() ? dayjs(data.start_datum).format("DD.MM.YYYY") : "",
        raum_wunsch: data.raum_wunsch,
        co_dozent: data.co_dozent,
        max_tn: data.max_tn,
        warteliste_len: data.warteliste_len,
        anmerkung: data.anmerkung,
        rawData: { ...data },
      };
    });

    sessionStorage.setItem("tableData", JSON.stringify(tableData));
    setTableData(tableData);

    actions.resetForm();
  };

  const getGebuchteTermine = async () => {
    try {
      setLoading(true);
      const res = await apiService.getGebuchteTermine(currentSemester, user.benutzer_id);
      if (Array.isArray(res.data)) {
        const terminList = res.data.map((el) => ({
          id: el.id,
          dozent: el.dozent,
          module: `${el.modul_id} ${el.modul_titel}`,
          lv_titel: el.lv_titel ? el.lv_titel : el.lv_frei_titel,
          block_titel: el.block_titel,
          rhythmus: el.rhythmus,
          vformat: el.vformat,
          lv_termin: el.wochentag
            ? `${numberToWeekday(el.wochentag)},  ${formatTimeRange(el.anfangszeit, el.dauer)}`
            : `${dayjs(el.start_datum).format("DD.MM.YYYY")},  ${formatTimeRange(el.anfangszeit, el.dauer)}`,
          start_datum: el.wochentag ? el.start_datum : "",
          raum_wunsch: el.raum_wunsch,
          co_dozent: el.co_dozent,
          max_tn: el.max_tn,
          warteliste_len: el.warteliste_len,
          status: el.status,
          rawData: { ...el },
        }));
        // console.log(dayjs("10:00", "HH:mm"));
        setGebuchteTermine([...terminList]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getModulListe = async () => {
    try {
      const res = await apiService.getModulListe(currentSemester);
      // console.log(res.data);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };

  const getLvListe = async () => {
    try {
      const res = await apiService.getLvListe(currentSemester);
      setLvListe(res.data);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };

  const findLvIdByName = (name) => {
    if (lvListe) {
      const foundItem = lvListe.find((item) => item.name === name);
      return foundItem ? foundItem.id : "";
    }
    return "";
  };

  const prepareDataForSendTermine = (terminList = []) => {
    // const terminList = sessionStorage.getItem("terminList") ? JSON.parse(sessionStorage.getItem("terminList")) : null;
    console.log(terminList);
    let sendData = [];
    if (terminList) {
      sendData = terminList.map(({ id, von, bis, ...rest }) => {
        const lv_id = findLvIdByName(rest.lv_titel);
        return {
          ...rest,
          vformat: Array.isArray(rest.vformat) ? rest.vformat.toString() : rest.vformat || "",
          lv_id: lv_id,
          lv_titel: lv_id ? rest.lv_titel : "",
          lv_frei_titel: lv_id ? "" : rest.lv_titel,
          anfangszeit: von,
          start_datum: rest.wochentag ? rest.start_datum : rest.datum,
          rhythmus: rest.rhythmus === "WZ" ? "W" : rest.rhythmus,
          dauer: dauerBerechnung(von, bis),
          dozent: `${user.vorname}, ${user.name}`,
        };
      });
      return sendData;
    }
    // console.log(sendData);
    return null;
  };

  const getMergedLvList = async () => {
    try {
      const modules = await getModulListe();
      const lectures = await getLvListe();
      const moduleMap = {};

      for (const module of modules) {
        moduleMap[module.modul_id] = {
          modul_id: module.modul_id,
          modul_titel: module.name,
          lectures: [],
        };
      }

      for (const lecture of lectures) {
        if (moduleMap[lecture.modul_id]) {
          moduleMap[lecture.modul_id].lectures.push(lecture.name);
        }
      }

      return Object.values(moduleMap);
    } catch (error) {
      console.log("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    if (currentSemester && user?.benutzer_id) {
      getGebuchteTermine();
      const fetchModulLvMergeList = async () => {
        const data = await getMergedLvList();
        setModulLvMergeList(data);
      };
      fetchModulLvMergeList();
    }
    // eslint-disable-next-line
  }, [currentSemester, user?.benutzer_id]);

  return (
    <>
      <Header />
      <Box sx={{ flexGrow: 1, px: 5, py: 1 }}>
        <Box
          display="grid"
          gap={1.5}
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
          }}
        >
          {/* STAMMDATEN */}
          <Card title={"Stammdaten"} sx={{ gridColumn: "span 2" }}>
            <Box
              display="grid"
              gap={1.5}
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                placeholder="Vorname"
                label="Vorname"
                size="small"
                sx={{ gridColumn: "span 1" }}
                value={user.vorname}
                name="vorname"
                disabled
                // onChange={handleNameChange}
              />
              <TextField
                placeholder="Nachname"
                label="Nachname"
                size="small"
                sx={{ gridColumn: "span 1" }}
                value={user.name}
                name="name"
                disabled
                // onChange={handleNameChange}
              />

              <TextField
                select
                label="Semester"
                defaultValue={sessionStorage.getItem("currentSemester")}
                size="small"
                onChange={handleSemesterChange}
                disabled
              >
                {user.semesterliste.split(",").map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <Button variant="contained" onClick={handleUserChange}>
                Ausloggen
              </Button>

              <Box sx={{ gridColumn: "span 4" }}>
                <AllgemeineInfo />
              </Box>
              <Box sx={{ gridColumn: "span 4" }}>{loading ? "" : <GebuchtTermine rowsData={gebuchteTermine} />}</Box>
            </Box>
          </Card>

          {/* TERMIN EINTRAGEN */}
          <Card
            title={" Daten zur Lehrveranstaltung"}
            sx={{ gridColumn: "span 2" }}
            subTitle={"Für Hinweise klicken Sie bitte auf das Icon rechts"}
            headerAction={
              <Tooltip arrow title="Hinweise">
                <IconButton onClick={() => setOpenInfo(true)} color="primary">
                  <InfoOutlined />
                </IconButton>
              </Tooltip>
            }
          >
            <TerminEintrag moduleList={modulLvMergeList} onSubmit={handleTerminEintrag} />
          </Card>

          {/* OVERVIEW TABLE */}
          <Card
            sx={{ gridColumn: "span 2" }}
            sxContent={{ p: 0 }}
            title={"Übersicht"}
            subTitle={
              <>
                Klicken Sie auf die Spalten-Taste, um alle Spalten anzuzeigen
                <br />
                Vor dem Export als CSV bitte erst alle Spalten anzeigen
              </>
            }
            headerAction={
              <Tooltip
                title="Name, Semester, Modul, LV-Titel, Rhythmus & LV-Termin können nicht durch Tabelle verändert werden. Bitte löschen Sie den Termin und addieren Sie neu"
                arrow
              >
                <IconButton aria-label="info">
                  <InfoOutlined />
                </IconButton>
              </Tooltip>
            }
          >
            <OverviewTable rowsData={tableData} handleSend={handlePostNewTerminList} />
          </Card>
        </Box>
      </Box>

      <MUIDialog onOpen={openInfo} title={"Hinweise"} onClose={() => setOpenInfo(false)} content={<InfoModal />} />
      <MUIDialog
        onOpen={semesterChangeWarn}
        onClose={() => setOpenInfo(false)}
        content={
          <ConfirmDialog
            msg={
              "Sind Sie sicher, dass Sie den Semester wechseln möchten? Alle in der aktuellen Sitzung nicht gespeicherten Daten werden gelöscht!"
            }
            onConfirm={() => setSemesterChangeWarn(false)}
            onDecline={() => setSemesterChangeWarn(false)}
          />
        }
      />
      <MUIDialog
        onOpen={userChangeWarn}
        onClose={() => setUserChangeWarn(false)}
        content={
          <ConfirmDialog
            msg={"Sind Sie sicher, dass Sie ausloggen möchten?"}
            subMsg={
              sessionStorage.getItem("tableData") ? "Alle ungespeicherte Daten in Übersicht-Tabelle wird gelöscht!" : ""
            }
            onConfirm={() => {
              sessionStorage.clear();
              logout();
              setUserChangeWarn(false);
            }}
            onDecline={() => setUserChangeWarn(false)}
          />
        }
      />
      <MUIDialog
        onOpen={failToPostTermin}
        onClose={() => setFailToPostTermin(false)}
        content={
          <ConfirmDialog
            msg={"Etwas ist schiefgelaufen, Ihre Termine können nicht gebucht werden"}
            hideButton={true}
            type="error"
          />
        }
      />
    </>
  );
}

export default App;
