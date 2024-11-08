import { TextField } from "@mui/material";
import { useField } from "formik";

export default function TextfieldWrapper({ name, span, ...otherProps }) {
  const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
    size: "small",
    fullWidth: true,
    variant: "outlined",
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return <TextField sx={{ gridColumn: `span ${span}` }} {...configTextfield} />;
}
