import React, { ChangeEvent, useState } from "react";
import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { User } from "types";

interface SelectInputProps {
  name: string;
  options: User[] | { names: string; id: string }[];
  label: string;
  value?: User | { names: string; id: string };
  handleChange?: (value: User | { names: string; id: string }) => void;
}

export const SelectInput = ({
  name,
  options,
  label,
  value,
  handleChange,
}: SelectInputProps) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const [localValue, setLocalValue] = useState<
    User | { names: string; id: string }
  >();

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

  const configSelectGroup: any = {
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
