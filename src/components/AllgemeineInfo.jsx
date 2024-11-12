import MUIAccordion from "./shared/MUIAccordion";

const AllgemeineInfo = () => {
  return (
    <div>
      <MUIAccordion header={"Hinweis für allgemeine Vorlesungszeiten"}>
        Insbesondere bei Blockveranstaltungen bitte ich um Beachtung der Vorlesungszeiten in Bezug auf Feiertage,
        Gremienzeit etc. Diese sind im kommenden Studienjahr wie folgt:
        <br />
        <strong>
          <i>Wintersemester: 07.10.24-16.01.25</i>
        </strong>{" "}
        <br />
        01.11.24 Allerheiligen (vorlesungsfrei) <br />
        06.11.24 Praxismarkt (vorlesungsfrei) <br />
        03.12.24 Kollegiumskonferenz (vorlesungsfrei für Hauptamtliche) <br />
        21.12.24-06.01.25 Weihnachten (vorlesungsfrei)
        <br />
        <strong>
          <i>Sommersemester: 17.03.25-02.07.25</i>
        </strong>
        <br />
        17.04.25-22.04.25 Ostern (vorlesungsfrei)
        <br />
        01.05.25 Tag der Arbeit (vorlesungsfrei)
        <br />
        29.05.25 Christi Himmelfahrt (vorlesungsfrei)
        <br />
        02.06.25 Kollegiumskonferenz (vorlesungsfrei für HA)
        <br />
        06.06.25-10.06.25 Pfingsten (vorlesungsfrei)
        <br />
        19.06.25 Fronleichnam (vorlesungsfrei)
        <br />
        <br />
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
