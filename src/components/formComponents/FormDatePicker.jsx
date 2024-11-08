import { TextField } from "@mui/material";
import { useField } from "formik";

export default function DatePickerWrapper({ name, span, ...otherProps }) {
  const [field, meta] = useField(name);

  const configDateTimePicker = {
    ...field,
    ...otherProps,
    type: "date",
    variant: "outlined",
    fullWidth: true,
    InputLabelProps: {
      shrink: true,
    },
    size: "small",
  };

  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }

  return <TextField sx={{ gridColumn: `span ${span}` }} {...configDateTimePicker} />;
}
