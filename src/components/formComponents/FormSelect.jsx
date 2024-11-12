import { TextField, MenuItem } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { useEffect } from "react";

const SelectWrapper = ({ name, options, size = "small", defaultValue, helperText, onChange, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFieldValue(name, value);
    // setSelectedValue(value);
  };
  useEffect(() => {
    if (defaultValue) setFieldValue(name, defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const configSelect = {
    ...field,
    ...otherProps,
    size,
    select: true,
    variant: "outlined",
    // fullWidth: true,
    helperText: helperText,
    // defaultValue: defaultValue,
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
