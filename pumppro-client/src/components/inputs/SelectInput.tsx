import React, { ChangeEvent, useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useField, useFormikContext } from "formik";

interface SelectInputProps<T> {
  name: string;
  options: T[];
  label: string;
  value?: T;
  handleChange?: (value: T) => void;
}

interface BaseOption {
  names: string;
  id: string;
}

export const SelectInput = <T extends BaseOption>({
  name,
  options,
  label,
  value,
  handleChange,
}: SelectInputProps<T>) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const [localValue, setLocalValue] = useState<T | undefined>(value);

  const handleLocalChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const found = options.find((u) => u.id === event.target.value);
    if (found) {
      setLocalValue(found);
      if (handleChange) {
        handleChange(found);
      } else {
        setFieldValue(name, found?.id);
      }
    }
  };

  const configSelectGroup: TextFieldProps = {
    onBlur: field.onBlur,
    onChange:
      handleLocalChange !== undefined ? handleLocalChange : field.onChange,
    name,
    label: label,
    variant: "outlined",
  };

  if (meta && meta.touched && meta.error) {
    configSelectGroup.error = Boolean(meta && meta.touched && meta.error);
    configSelectGroup.helperText = meta.error;
  }

  return (
    <Box>
      <FormControl fullWidth>
        <TextField
          select
          value={localValue === undefined ? "" : localValue.id}
          size="small"
          {...configSelectGroup}
        >
          {options?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.names}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </Box>
  );
};
