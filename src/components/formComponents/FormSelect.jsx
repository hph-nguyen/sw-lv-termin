import { TextField, MenuItem } from "@mui/material";
import { useField, useFormikContext } from "formik";

const SelectWrapper = ({ name, options, size = "small", helperText, onChange, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFieldValue(name, value);
    // setSelectedValue(value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    size,
    select: true,
    variant: "outlined",
    fullWidth: true,
    helperText: helperText,
    onChange: onChange || handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect}>
      {options.map((opt) => {
        return (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default SelectWrapper;
