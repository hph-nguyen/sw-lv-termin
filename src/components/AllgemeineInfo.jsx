import { useEffect, useState } from "react";
import MUIAccordion from "./shared/MUIAccordion";
import * as apiService from "../services/apiService";
import dayjs from "dayjs";

const AllgemeineInfo = () => {
  const [feierTagList, setFeierTagList] = useState([]);
  const currentSemester = sessionStorage.getItem("currentSemester");
  const getFeierTage = async () => {
    const res = await apiService.getFeiertage(currentSemester);
    setFeierTagList(res.data);
  };
  useEffect(() => {
    getFeierTage();
  }, []);
  return (
    <div>
      <MUIAccordion header={"Hinweis für allgemeine Vorlesungszeiten"}>
        Insbesondere bei Blockveranstaltungen bitte ich um Beachtung der Vorlesungszeiten in Bezug auf Feiertage,
        Gremienzeit etc. Diese sind im kommenden Studienjahr wie folgt:
        <br />
        <strong>
          {currentSemester.includes("ws") ? (
            <strong>Wintersemester: 07.10 - 16.01</strong>
          ) : (
            <strong>Sommersemester: 17.03 - 02.07</strong>
          )}
        </strong>
        <br />
        {feierTagList.map((e) => {
          return (
            <>
              {dayjs(e.tag).format("DD.MM.YY")} - {e.beschreibung}
              <br />
            </>
          );
        })}
        Darüber hinaus sind folgende Zeiten bitte{" "}
        <i>
          <u>nur nach vorheriger Absprache</u>
        </i>{" "}
        zu belegen:
        <br />
        <strong>Mittwochs von 11:30-13:00 Uhr</strong> (Gremienzeit der Fakultät SW) <br />
        <strong>Donnerstags 08:00-15:30 Uhr</strong> (Fehlende Raumkapazitäten aufgrund der Schwerpunktveranstaltungen)
      </MUIAccordion>
    </div>
  );
};

export default AllgemeineInfo;
