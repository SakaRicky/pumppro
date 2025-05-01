import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { ProductCategory, Tank } from "types";
import CreatableSelect from "react-select/creatable";
import { StylesConfig } from "react-select";
import { saveProductCategory } from "services/productCategory";
import { red } from "@mui/material/colors";

type Props = {
  label?: string;
  name: string;
  isLoading?: boolean;
  options: ProductCategory[] | Tank[] | undefined;
  handleChange?: (e: any) => void;
  refetch: any;
};

interface SelectItems {
  value: string;
  label: string;
}

const CreatableSelectInput = ({
  label,
  isLoading,
  name,
  options,
  refetch,
  handleChange,
}: Props) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const [isLocalIsLoading, setIsLocalIsLoading] = useState(false);

  const theme = useTheme();

  const handleReactSelectChange = (newValue: any) => {
    if (handleChange) {
      handleChange(newValue);
    } else {
      // else it's formik
      if (newValue.value) {
        setFieldValue(name, newValue.value);
      }
    }
  };

  const handleCreate = async (inputValue: string) => {
    setIsLocalIsLoading(true);
    await saveProductCategory({ name: inputValue });
    setIsLocalIsLoading(false);
    refetch();
  };

  const styles: StylesConfig = {
    control: (styles) => ({ ...styles, backgroundColor: "inherit" }),
    option: (styles) => {
      return {
        ...styles,
        backgroundColor: theme.palette.background.main,
        color: "inherit",

        ":active": {
          ...styles[":active"],
          backgroundColor: theme.palette.background.alt,
        },
      };
    },
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: theme.palette.background.default,
      color: "inherit",
    }),
    input: (styles) => ({ ...styles, color: "inherit" }),
    singleValue: (styles) => ({
      ...styles,
      color: "inherit",
    }),
  };

  const optionsForSelect: SelectItems[] | undefined = options?.map((option) => {
    return {
      value: option.id.toString(),
      label: option.name,
    };
  });

  return (
    <Box>
      <CreatableSelect
        value={optionsForSelect?.find(
          (option) => option.value === field.value.toString()
        )}
        isClearable
        isLoading={isLoading || isLocalIsLoading}
        isSearchable
        onChange={handleReactSelectChange}
        onCreateOption={handleCreate}
        options={optionsForSelect}
        styles={styles}
      />
      {meta && meta.touched && meta.error ? (
        <Typography color={red[500]} fontSize="0.7rem" mt="0.5rem">
          {meta.error}
        </Typography>
      ) : null}
    </Box>
  );
};

export default CreatableSelectInput;
