import { TextField, Autocomplete } from "@mui/material";
import { useField, useFormikContext } from "formik";

export default function SearchSelect({
  name,
  data,
  label,
  span,
  defaultVal,
  ascend,
  isOptionEqualToValue,
  ...otherProps
}) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (_, newValue) => {
    setFieldValue(name, newValue.value);
  };

  const options = data.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  const configSearchSelect = {
    ...field,
    ...otherProps,
  };
  if (meta && meta.touched && meta.error) {
    configSearchSelect.error = true;
    configSearchSelect.helperText = meta.error;
  }

  return (
    <Autocomplete
      options={
        !ascend
          ? options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))
          : options.sort((a, b) => b.firstLetter.localeCompare(a.firstLetter))
      }
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => option.title}
      defaultValue={
        !defaultVal
          ? data[0]
          : () => {
              var temp = {};
              for (let i = 0; i < data.length; i++) {
                if (data[i].value === defaultVal) temp = data[i];
              }
              return temp;
            }
      }
      isOptionEqualToValue={
        isOptionEqualToValue ? isOptionEqualToValue : (option, value) => option.firstLetter === value.firstLetter
      }
      onChange={handleChange}
      disableClearable
      sx={{ gridColumn: `span ${span}` }}
      renderInput={(params) => <TextField {...params} label={label} {...configSearchSelect} />}
    />
  );
}
