import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import React, { ChangeEvent } from "react";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import { refillFuel } from "services/fuel";
import { LoadingButton } from "@mui/lab";
import SyncIcon from "@mui/icons-material/Sync";
import { useNotify } from "hooks/useNotify";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import { Fuel } from "types";

interface UpdateFuelFormProps {
  fuels: Fuel[];
  fetchFuels: () => Promise<QueryObserverResult<Fuel[], Error>>;
}

interface FormValues {
  id: string;
  quantity: number;
}

export const RefillFuelForm = ({ fuels, fetchFuels }: UpdateFuelFormProps) => {
  const fuelsWithId = fuels.map((fuel) => {
    return { id: fuel.id, fuelName: fuel.name };
  });

  const initialValues: FormValues = {
    id: "",
    quantity: 0,
  };

  const theme = useTheme();

  const notify = useNotify();

  // Pumpist must submit the index and fuel types
  const fuelUpdateValidationSchema = yup.object({
    id: yup.number().required("Required"),
    quantity: yup.number().min(1, "should be >= 1"),
  });

  const updateFuelMutation = useMutation({
    mutationFn: refillFuel,
    onSuccess: (data, variable, context: any) => {
      notify("Update Success", context.successMessage, "success");
      fetchFuels();
    },
    onMutate: (variables) => {
      return { successMessage: "Refilled was Successful" };
    },
  });

  const saveFuelUpdate = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    await updateFuelMutation.mutateAsync({
      ...values,
      id: Number.parseInt(values.id),
    });
    resetForm();
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={fuelUpdateValidationSchema}
        enableReinitialize={true}
        onSubmit={saveFuelUpdate}
      >
        {({ errors, touched, values, setFieldValue }) => {
          return (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={2}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        value={values.id}
                        size="small"
                        label="Choose fuel"
                        id="fuel-select-label"
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setFieldValue("id", event.target.value);
                        }}
                        error={Boolean(errors.id) && touched.id}
                        helperText={touched.id && errors.id}
                      >
                        {fuelsWithId.map((fuelWithId) => (
                          <MenuItem key={fuelWithId.id} value={fuelWithId.id}>
                            <FormattedMessage
                              id={fuelWithId.fuelName}
                              defaultMessage={fuelWithId.fuelName}
                            />
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      id="quantity"
                      label="Quantity"
                      type="number"
                      size="small"
                      value={values.quantity}
                      InputProps={{
                        inputProps: {
                          min: 0,
                        },
                      }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue("quantity", e.target.value)
                      }
                      error={Boolean(errors.quantity) && touched.quantity}
                      helperText={touched.quantity && errors.quantity}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ width: "20%" }}>
                  <LoadingButton
                    type="submit"
                    loading={updateFuelMutation.isLoading}
                    endIcon={<SyncIcon />}
                    loadingPosition="end"
                    sx={{
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.grey[50],
                      width: "100%",

                      "&:hover": {
                        backgroundColor: theme.palette.secondary.dark,
                      },
                    }}
                  >
                    <FormattedMessage
                      id="load_fuel"
                      defaultMessage="Load Fuel"
                    />
                  </LoadingButton>
                </Box>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
