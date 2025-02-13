import { TextField, MenuItem, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { useEffect } from "react";

const SelectWrapper = ({
  name,
  options,
  span,
  size = "small",
  defaultValue,
  helperText,
  multiple = false,
  onChange,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      setFieldValue(name, multiple ? (Array.isArray(defaultValue) ? defaultValue : []) : defaultValue);
    } else {
      setFieldValue(name, multiple ? [] : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const configSelect = {
    ...field,
    ...otherProps,
    size,
    select: true,
    variant: "outlined",
    helperText: (
      <Typography variant="h7">
        <i>{helperText}</i>
      </Typography>
    ),
    value: field.value ?? (multiple ? [] : ""),
    onChange: onChange || handleChange,
    SelectProps: {
      multiple: multiple,
    },
  };

  if (meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = (
      <Typography variant="h7">
        <i>{meta.error}</i>
      </Typography>
    );
  }

  return (
    <TextField {...configSelect} sx={{ gridColumn: `span ${span}` }}>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectWrapper;
