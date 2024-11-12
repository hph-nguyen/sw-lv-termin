import { TextField } from "@mui/material";
import { useField } from "formik";

export default function DatePickerWrapper({ name, span, size = "small", ...otherProps }) {
  const [field, meta] = useField(name);

  const configDateTimePicker = {
    ...field,
    ...otherProps,
    type: "date",
    size: size,
    variant: "outlined",
    fullWidth: true,
    InputLabelProps: {
      shrink: true,
    },
  };

  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }

  return <TextField sx={{ gridColumn: `span ${span}` }} {...configDateTimePicker} />;
}
