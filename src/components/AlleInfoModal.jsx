import { Typography } from "@mui/material";
import MUIAccordion from "./shared/MUIAccordion";

const InfoModal = () => {
  return (
    <div>
      <Typography color="black">
        Liebe Kolleg*innen, <br />
        die Planung des BA-Studiengangs ist wie immer mit einigem Aufwand verbunden, gewissenhaft ausgefüllte
        Erhebungsbögen erleichtern diesen Prozess jedoch erheblich.{" "}
        <strong>
          Entsprechend bin ich außerordentlich dankbar für Ihre Unterstützung durch die Beachtung folgender Punkte beim
          Ausfüllen:{" "}
        </strong>
        <br />
      </Typography>
      {/* <MUIAccordion header={"Allgemeine Vorlesungszeiten"}>
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
      </MUIAccordion> */}
      <MUIAccordion header={'LV-Rhythmus "vierzehntägig, dafür LV mit doppelter SWS-Zahl"'}>
        Sollen Veranstaltungen vierzehntägig mit doppelter SWS-Zahl angeboten werden, ist darauf zu achten, dass eine
        andere Veranstaltung gegenläufig in den jeweils freien Wochen im gleichen Zeitfenster geplant wird. Dies kann
        sowohl eine eigene Veranstaltung sein als auch die von Kolleg*innen. Veranstaltungen des gleichen Fachs sollten
        nicht 14tägig angeboten werden, um die Wahlmöglichkeiten der Studierenden nicht einzuschränken. Wird eine
        alternierende Veranstaltung nicht von vornherein geplant führt dies in der Regel zu Leerstand des Raumes in den
        freien Wochen, dies ist aufgrund der prekären Raumsituation nur in Ausnahmesituationen machbar.{" "}
        <strong>Bitte nutzen Sie bei 14tägigen Veranstaltungen unbedingt das Feld Tag der 1. Veranstaltung</strong>
      </MUIAccordion>
      <MUIAccordion header={"Einsatz von Blocktagen"}>
        Sollte Ihre Veranstaltung nicht absolut regelmäßig ein- oder zweiwöchentlich stattfinden, z.B. beim Einsatz
        zusätzlicher Einzeltermine, verwenden Sie bitte unbedingt den LV-Rhythmus <strong>Blockveranstaltung</strong>
      </MUIAccordion>
      <MUIAccordion header={"Gemischte KÄB/AW-Angebote"}>
        Werden Veranstaltungen im Modul 2.1 bzw. 4.4 gleichzeitig sowohl als KÄB- als auch als AW-Fach angeboten, legen
        Sie bitte jeweils die Veranstaltung mit kompletten Angaben doppelt an (zwei Karteireiter), einmal als
        KÄB-Angebot, einmal als AW-Angebot.{" "}
        <strong>Bitte geben Sie hierbei unbedingt die jeweiligen maximalen Teilnehmerzahlen mit an!</strong>
      </MUIAccordion>
      <MUIAccordion header={"Digitale / Hybride Lehre"}>
        {/* Um die Planbarkeit für die Studierenden zu erhöhen bitte ich bei digitalen / hybriden Lehrformaten jeweils um
        entsprechende Angabe einer der folgenden Kategorien im Feld <strong>Raumwunsch</strong> der jeweiligen
        Veranstaltung
        <br />
        <br /> */}
        <strong>Hybride Vollversion (HV)</strong>
        <br />
        Die Veranstaltung wird durchgängig oder an ausgewählten festgelegten Terminen (Termine werden angegeben) hybrid
        angeboten. D.h. der Kompetenzerwerb ist durchgängig bzw. an den festgelegten hybriden Terminen sowohl in Präsenz
        als auch digital in gleichem Maße möglich. Zusätzlich bitte angeben, ob die hybriden Termine ausschließlich
        synchron zur Präsenz oder auch asynchron (z.B. per Mediasharing/Moodle) angeboten werden. <br />
        <br />
        <strong>Hybride Notfalloption (HN)</strong>
        <br />
        Die Veranstaltung wird durchgängig oder an ausgewählten Terminen (Termine bitte angeben) hybrid angeboten. Die
        digitale Teilnahme soll Studierenden in Sondersituationen die Teilnahme an der Veranstaltung ermöglichen. Es
        liegt kein digitales Lehrkonzept vor und es liegt in der Eigenverantwortung der Studierenden den Kompetenzerwerb
        analog zu den Terminen in Präsenz zu gestalten. Zusätzlich bitte angeben, ob die hybriden Termine ausschließlich
        synchron zur Präsenz oder auch asynchron angeboten werden.
        <br />
        <br />
        <strong>Rein digitale Veranstaltung (DV)</strong>
        <br />
        Die gesamte Veranstaltung bzw. ausgewählte Termine (bitte angeben) findet auf der Grundlage eines digitalen
        Lehrkonzepts (z.B. vhb-Kurs) ausschließlich digital statt.
        <br />
      </MUIAccordion>
      <br />
      <i> Vielen Dank für die Berücksichtigung!</i>
    </div>
  );
};

export default InfoModal;
