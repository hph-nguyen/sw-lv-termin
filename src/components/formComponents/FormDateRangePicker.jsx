import { useState, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css"; // Theme for flatpickr
import { TextField } from "@mui/material";
import { German } from "flatpickr/dist/l10n/de.js";
import moment from "moment";

export default function DateRangePicker({ name, startValue = "", mode = "multiple", ...otherProps }) {
  const [date, setDate] = useState(startValue);
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  // Sync local date state with Formik field value on reset
  useEffect(() => {
    let temp = [];
    if (field.value) {
      temp = field.value.map((e) => {
        return moment(e).format("DD.MM.YYYY");
      });
      setDate(temp);
    } else setDate("");
  }, [field.value]);

  const handleDateChange = (selectedDates) => {
    // setDate(dateStr); // Update local state for Flatpickr
    setFieldValue(name, selectedDates); // Update Formik's field value
  };

  return (
    <Flatpickr
      value={date}
      onChange={handleDateChange}
      options={{
        dateFormat: "d.m.Y",
        defaultDate: startValue,
        mode: mode, // Choose "single", "multiple", or "range"
        locale: German,
      }}
      render={({ ...props }, ref) => (
        <TextField {...props} inputRef={ref} label={"Datum"} variant="outlined" fullWidth {...otherProps} />
      )}
    />
  );
}
