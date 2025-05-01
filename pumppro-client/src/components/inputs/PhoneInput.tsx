import { useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import React from "react";
import { FormattedMessage } from "react-intl";
import PhoneInput from "react-phone-input-2";

type Props = {
  label?: string;
  name: string;
};

const PhoneInputField = ({ label, name }: Props) => {
  const theme = useTheme();

  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  let errorMessage = "";

  const handleChange = (phone: string) => {
    setFieldValue(name, phone);
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const configRadioGroup: any = {
    ...field,
    name,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    errorMessage = meta.error;
  }

  return (
    <Box>
      {label && (
        <Typography>
          <FormattedMessage id={`form.worker.${name}`} defaultMessage={label} />
        </Typography>
      )}
      <PhoneInput
        country={"cm"}
        value={field.value}
        onChange={(phone) => handleChange(phone)}
        inputStyle={{
          backgroundColor: "inherit",
          color: "inherit",
          width: "100%",
        }}
        dropdownStyle={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.neutral[600],
        }}
      />
      {errorMessage && (
        <Typography color={theme.palette.error.main}>
          <FormattedMessage
            id="login.error.phone"
            defaultMessage={errorMessage}
          />
        </Typography>
      )}
    </Box>
  );
};

export default PhoneInputField;
