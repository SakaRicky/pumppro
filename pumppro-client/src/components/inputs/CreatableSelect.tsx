import { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useField, useFormikContext } from "formik";
import CreatableSelect from "react-select/creatable";
import { StylesConfig } from "react-select";
import { red } from "@mui/material/colors";
import { useNotify } from "hooks/useNotify";

interface Props<T> {
  label?: string;
  name: string;
  isLoading?: boolean;
  options: T[];
  handleChange?: (e: any) => void;
  onCreate: (name: string) => Promise<T | undefined>;
}

const CreatableSelectInput = <T extends { id: string | number; name: string }>({
  label,
  isLoading,
  name,
  options,
  handleChange,
  onCreate,
}: Props<T>) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const notify = useNotify();

  const [isLocalIsLoading, setIsLocalIsLoading] = useState(false);

  const theme = useTheme();

  const handleReactSelectChange = (newValue: any) => {
    if (handleChange) {
      handleChange(newValue);
    } else {
      console.log("newValue: ", newValue);
      // it's a reset
      if (!newValue) {
        setFieldValue(name, "");
      } else {
        //it's formik, so set formik field
        setFieldValue(name, newValue.value);
      }
    }
  };

  const handleCreate = async (inputValue: string) => {
    try {
      setIsLocalIsLoading(true);
      const createdCat = await onCreate(inputValue);
      setFieldValue(name, createdCat?.id);
      setIsLocalIsLoading(false);
    } catch (error: unknown) {
      console.log("error while creating a new category");
      if (error instanceof Error) {
        notify("Create Category Error", error.message, "error");
      }
    }
  };

  const getVale = () => {
    const found = options?.find(
      (option) => option.id === field.value.toString()
    );
    return found ? { value: found.id, label: found.name } : null;
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

  return (
    <Box>
      <CreatableSelect
        value={getVale()}
        placeholder={`Select a ${label}`}
        isClearable
        isLoading={isLoading || isLocalIsLoading}
        isSearchable
        onChange={handleReactSelectChange}
        onCreateOption={handleCreate}
        options={options?.map((option) => ({
          value: option.id.toString(),
          label: option.name,
        }))}
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
