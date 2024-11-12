import "./App.css";
import { useState, useEffect } from "react";
import { Box, TextField, IconButton, Tooltip, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import Card from "./components/shared/Card";
import OverviewTable from "./components/OverviewTable";
import Header from "./components/Header";

import TerminEintrag from "./components/TerminEintrag";
import { LV_LIST } from "./dummyData";
import { randomId } from "@mui/x-data-grid-generator";
import moment from "moment";
import MUIDialog from "./components/shared/MUIDialog";
import InfoModal from "./components/AlleInfoModal";
import dayjs from "dayjs";
import AllgemeineInfo from "./components/AllgemeineInfo";
import { InfoOutlined } from "@mui/icons-material";

function App() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [user, setUser] = useState({
    vorname: sessionStorage.getItem("vorname") || "",
    nachname: sessionStorage.getItem("nachname") || "",
    mail: sessionStorage.getItem("mail") || "",
  });
  const [tableData, setTableData] = useState(
    sessionStorage.getItem("tableData") ? JSON.parse(sessionStorage.getItem("tableData")) : []
  );

  const [openInfo, setOpenInfo] = useState(false);

  const convertSpecialCharacters = (name) => {
    return name
      .replace(/Ö/g, "oe")
      .replace(/Ä/g, "ae")
      .replace(/Ü/g, "ue")
      .replace(/ö/g, "oe")
      .replace(/ä/g, "ae")
      .replace(/ü/g, "ue");
  };

  const autoMailGenerate = (name, vorname) => {
    // const firstTwo = convertSpecialCharacters(vorname.substring(0, 2).trim().toLowerCase());
    return `${convertSpecialCharacters(vorname.trim().toLowerCase())}.${name.trim().toLowerCase()}@th-nuernberg.de`;
  };

  const handleNameChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleTerminEintrag = (values, actions) => {
    // console.log(values);
    // eslint-disable-next-line
    const { bk, bktemp, ...rest } = values;

    let newTerminList = [];
    let serienTermin = {};
    if (rest.wochentag !== "") {
      serienTermin = {
        id: randomId(),
        nachname: sessionStorage.getItem("nachname"),
        vorname: sessionStorage.getItem("vorname"),
        datum: "",
        bktitle: "",
        ...rest,
      };
      newTerminList.push(serienTermin);
    }

    let bkTermin = [];
    // if (bk.length > 0) {
    //   for (let i = 0; i < bk.length; i++) {
    //     let dates = bk[i].datum.map((date) => moment(date).format());
    //     let temp = dates.map((date) => ({
    //       id: randomId(),
    //       nachname: sessionStorage.getItem("nachname"),
    //       vorname: sessionStorage.getItem("vorname"),
    //       datum: moment(date).format("YYYY-MM-DD"),
    //       ...rest,
    //       firstdate: "",
    //       von: bk[i].bkvon,
    //       bis: bk[i].bkbis,
    //       bktitle: bk[i].bktitle,
    //       wochentag: "-",
    //     }));
    //     bkTermin.push(...temp);
    //   }
    // }
    if (bk.length > 0) {
      bkTermin = bk.map((e) => {
        return {
          id: randomId(),
          nachname: sessionStorage.getItem("nachname"),
          vorname: sessionStorage.getItem("vorname"),
          datum: moment(e.datum).format("YYYY-MM-DD"),
          ...rest,
          firstdate: "",
          von: e.bkvon,
          bis: e.bkbis,
          bktitle: e.bktitle,
          wochentag: "-",
        };
      });
    }

    // console.log("bkTermin", bkTermin);
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
        nachname: sessionStorage.getItem("nachname"),
        vorname: sessionStorage.getItem("vorname"),
        semester: data.semester,
        module: data.module,
        lv_title: data.lv_title,
        bktitle: data.bktitle,
        rhythmus: data.datum ? "Blockveranstaltung" : data.rhythmus,
        vformat: data.vformat,
        lv_termin:
          data.datum && dayjs(data.datum).isValid()
            ? `${dayjs(data.datum).format("DD.MM.YYYY")}, ${data.von}-${data.bis}`
            : `${weekday[data.wochentag]}, ${data.von}-${data.bis}`,
        firstdate: dayjs(data.firstdate).isValid() ? dayjs(data.firstdate).format("DD.MM.YYYY") : "",
        raumwunsch: data.raumwunsch,
        co_dozent: data.co_dozent,
        tn_zahl: data.tn_zahl,
        wartelist: data.wartelist,
        anmerkung: data.anmerkung,
        rawData: { ...data },
      };
    });

    sessionStorage.setItem("tableData", JSON.stringify(tableData));
    setTableData(tableData);

    actions.resetForm();
  };

  useEffect(() => {
    const updatedMail = autoMailGenerate(user.nachname, user.vorname);
    setUser((prevUser) => ({ ...prevUser, mail: updatedMail }));
    sessionStorage.setItem("vorname", user.vorname);
    sessionStorage.setItem("nachname", user.nachname);
    sessionStorage.setItem("mail", updatedMail);
    // eslint-disable-next-line
  }, [user.vorname, user.nachname]);

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
              gridTemplateColumns="repeat(3, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
              }}
            >
              <TextField
                placeholder="Vorname"
                label="Vorname"
                size="small"
                sx={{ gridColumn: "span 1" }}
                value={user.vorname}
                name="vorname"
                onChange={handleNameChange}
              />
              <TextField
                placeholder="Nachname"
                label="Nachname"
                size="small"
                sx={{ gridColumn: "span 1" }}
                value={user.nachname}
                name="nachname"
                onChange={handleNameChange}
              />
              <TextField
                placeholder="TH-Email"
                label="TH-Email"
                size="small"
                sx={{ gridColumn: "span 1" }}
                disabled
                value={user.mail}
                helperText={
                  <Typography variant="h7">
                    <i>
                      <strong>Email wird automatisch generiert. Bitte überprüfen</strong>
                    </i>
                  </Typography>
                }
              />

              <Box sx={{ gridColumn: "span 3" }}>
                <AllgemeineInfo />
              </Box>
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
            <TerminEintrag moduleList={LV_LIST} onSubmit={handleTerminEintrag} />
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
            <OverviewTable rowsData={tableData} />
          </Card>
        </Box>
      </Box>

      <MUIDialog onOpen={openInfo} title={"Hinweise"} onClose={() => setOpenInfo(false)} content={<InfoModal />} />
    </>
  );
}

export default App;
