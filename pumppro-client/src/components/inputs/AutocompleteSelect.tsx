import React from "react";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { FormattedMessage } from "react-intl";
import { ProductCategory } from "types";

type Props = {
  label?: string;
  name: string;
  isLoading?: boolean;
  options: ProductCategory[] | undefined;
  handleChange?: (e: any) => void;
};

const AutocompleteSelect = ({
  label,
  isLoading,
  name,
  options,
  handleChange,
}: Props) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const handleFormikChange = (event: any, newValue: ProductCategory | null) => {
    setFieldValue(name, newValue?.id);
  };

  const configSelectGroup: any = {
    ...field,
    name,
    variant: "filled",
  };

  if (meta && meta.touched && meta.error) {
    configSelectGroup.error = meta && meta.touched && meta.error;
    configSelectGroup.helperText = meta.error;
  }
  // will use these to search for categories later
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [value, setValue] = React.useState<ProductCategory | undefined | null>(
    options?.[0]
  );
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Box>
      {label && (
        <Typography>
          <FormattedMessage id={`form.worker.${name}`} defaultMessage={label} />
        </Typography>
      )}
      <Autocomplete
        // value={value}
        onChange={handleFormikChange}
        loading={isLoading}
        getOptionLabel={(option: ProductCategory) => option.name || ""}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={options || []}
        size="small"
        fullWidth
        renderInput={(params) => (
          <TextField {...configSelectGroup} {...params} />
        )}
      />
    </Box>
  );
};

export default AutocompleteSelect;
