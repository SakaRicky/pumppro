import * as yup from "yup";
import { Box, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import TextInput from "components/inputs/TextInput";

export const FuelsStatus = () => {
  // const { data, isLoading, error, refetch } = useFuels();
  // // const { fuels, fetchFuels, fuel, gasoil, petrol } = data;
  // console.log("🚀 ~ file: Fuels.tsx:6 ~ Fuels ~ fuels:", data);

  const initialFuelsValues = {
    fuel_quantity: 0,
    gasoil_quantity: 0,
    petrol_quantity: 0,
  };

  const fuelsValidationSchema = yup.object({
    fuel_quantity: yup.number().required("atleast 1"),
    gasoil_quantity: yup.number().required("atleast 1"),
    petrol_quantity: yup.number().required("atleast 1"),
  });

  const submitNewFuelValues = (values: any) => {
    console.log("values: ", values);
  };

  return (
    <Box>
      <Formik
        initialValues={initialFuelsValues}
        validationSchema={fuelsValidationSchema}
        onSubmit={(values) => {
          submitNewFuelValues(values);
        }}
      >
        <Form>
          <Grid
            container
            spacing={{ xs: 0, sm: 2, md: 3 }}
            rowSpacing={2}
            // columns={9}
          >
            <Grid item xs={12} sm={6} md={4}>
              <TextInput type="number" label="Fuel" name="fuel" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextInput type="number" label="Fuel" name="fuel" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextInput type="number" label="Fuel" name="fuel" />
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};
