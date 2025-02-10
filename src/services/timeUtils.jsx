import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const numberToWeekday = (num) => {
  const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  return weekdays[num] || null;
};

export const formatTimeRange = (anfangszeit, dauer) => {
  const startTime = dayjs().hour(anfangszeit.split(":")[0]).minute(anfangszeit.split(":")[1]);
  const endTime = startTime.add(dauer, "minute").format("HH:mm");
  return `${startTime.format("HH:mm")} - ${endTime}`;
};

export const dauerBerechnung = (von, bis) => {
  const startTime = dayjs(von, "HH:mm");
  const endTime = dayjs(bis, "HH:mm");
  return endTime.diff(startTime, "minute");
};
