import { useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useField, useFormikContext } from "formik";
import CreatableSelect from "react-select/creatable";
import {
  ActionMeta,
  MultiValue,
  SingleValue,
  StylesConfig,
} from "react-select";
import { red } from "@mui/material/colors";
import { useNotify } from "hooks/useNotify";

interface Props<T> {
  label?: string;
  name: string;
  isDataLoading?: boolean;
  options: T[];
  handleChange?: (e: any) => void;
  onCreate: (name: string) => Promise<T | undefined>;
}

interface BaseOption {
  id: string | number;
  name: string;
}

interface SelectOption {
  value: string | number;
  label: string;
}

const CreatableSelectInput = <T extends BaseOption>({
  label,
  isDataLoading,
  name,
  options,
  handleChange,
  onCreate,
}: Props<T>) => {
  const [field, meta] = useField<string | undefined | null>(name);
  const { setFieldValue } = useFormikContext();

  const notify = useNotify();

  const [isCreating, setIsCreating] = useState(false);

  const [justCreatedOption, setJustCreatedOption] = useState<T | null>();

  const theme = useTheme();

  const selectOptions: SelectOption[] = useMemo<SelectOption[]>(() => {
    return options.map((o) => ({ value: o.id, label: o.name }));
  }, [options]);

  // Memoize the styles object to prevent recreation on every render
  const customStyles = useMemo<StylesConfig<SelectOption, false>>( // Single select = false
    () => ({
      control: (base) => ({
        ...base,
        backgroundColor: "inherit", // Or default/inherit as needed
        // Add other control styles like border color based on error state if desired
        borderColor:
          meta.touched && meta.error
            ? theme.palette.error.main
            : base.borderColor,
        "&:hover": {
          borderColor:
            meta.touched && meta.error
              ? theme.palette.error.main
              : base.borderColor,
        },
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
          ? theme.palette.action.hover
          : theme.palette.background.paper, // Use theme colors
        color: theme.palette.text.primary,
        ":active": {
          ...base[":active"],
          backgroundColor: theme.palette.action.selected,
        },
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.modal, // Ensure menu appears above other content
      }),
      input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
      }),
      singleValue: (base) => ({
        ...base,
        color: theme.palette.text.primary,
      }),
      // Add more style customizations if needed
    }),
    [theme, meta.touched, meta.error] // Recalculate if theme or error state changes
  );

  const selectedValue = useMemo<SelectOption | null>(() => {
    const currentID = field.value;
    if (currentID === null || currentID === undefined || currentID === "") {
      return null;
    }

    const currentIdStr = currentID.toString();

    // check whether it's the just created option and return the label
    if (currentIdStr === justCreatedOption?.id.toString()) {
      return { value: currentIdStr, label: justCreatedOption?.name };
    }

    const optionFound = selectOptions.find((o) => o.value === currentIdStr);

    return optionFound ?? null;
  }, [field.value, selectOptions, justCreatedOption]);

  const handleSelectChange = (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => {
    const selectedOption = newValue as SingleValue<SelectOption>;

    if (handleChange) {
      handleChange(selectedOption);
    } else {
      const valueToSet = selectedOption ? selectedOption.value : null;

      setFieldValue(name, valueToSet);

      // Logic to clear justCreatedOption if a different option was selected or cleared
      // Check if selectedOption is null (cleared) OR if its value is different from the justCreatedOption's ID
      if (
        !selectedOption ||
        (justCreatedOption &&
          selectedOption.value !== justCreatedOption.id.toString())
      ) {
        setJustCreatedOption(null);
      }
    }
  };

  const handleCreateOption = async (inputValue: string) => {
    setIsCreating(true);
    setJustCreatedOption(null);
    try {
      const createdOption = await onCreate(inputValue);

      if (createdOption) {
        setJustCreatedOption(createdOption);
        setFieldValue(name, createdOption?.id);
        notify(
          "Success",
          `${label || "Item"} "${createdOption.name}" created successfully.`,
          "success"
        );
      } else {
        // Handle case where creation might return undefined (e.g., validation fail server-side)
        notify("Info", `Could not create ${label || "item"}.`, "warning");
      }
    } catch (error: unknown) {
      console.error(`Error creating new ${label || "item"}:`, error); // Log detailed error
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      notify(`Create ${label || "Item"} Error`, errorMessage, "error");
      setFieldValue(name, null);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Box>
      <CreatableSelect
        value={selectedValue}
        placeholder={`Select a ${label}`}
        isClearable
        isLoading={isDataLoading || isCreating}
        isSearchable
        onChange={handleSelectChange}
        onCreateOption={handleCreateOption}
        options={options?.map((option) => ({
          value: option.id.toString(),
          label: option.name,
        }))}
        styles={customStyles}
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
