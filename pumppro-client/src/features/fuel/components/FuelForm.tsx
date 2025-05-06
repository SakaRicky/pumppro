import { LoadingButton } from "@mui/lab";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import TextInput from "components/inputs/TextInput";
import { AuthError } from "errors/authError";
import { UserError } from "errors/userError";
import { Form, Formik } from "formik";
import { useNotify } from "hooks/useNotify";
import { forwardRef } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Fuel, FuelCategories, NewFuel } from "types";
import * as yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import CreatableSelectInput from "components/inputs/CreatableSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import { saveFuel, updateFuel } from "services/fuel";
import { useFuels } from "./hooks/useFuels";
import { UseTanks } from "features/tank/hooks/useTank";
import withAuth from "hoc/withAuth";
import { saveTank } from "services/tank";
import CloseIcon from "@mui/icons-material/Close";
import { SelectInput } from "components/inputs/SelectInput";

type FuelFormProps = {
  fuel?: Fuel;
  handleCloseModal: () => void;
};

const FuelForm = forwardRef(
  ({ fuel, handleCloseModal }: FuelFormProps, ref: any) => {
    const theme = useTheme();

    const queryClient = useQueryClient();

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      data: fuelsData,
      isLoading: fuelsIsLoading,
      error: fuelsError,
      refetch: refetchFuels,
    } = useFuels();

    const {
      data: tankData,
      isLoading: tankIsLoading,
      error: tankError,
      refetch: refetchTank,
    } = UseTanks();

    console.log("🚀 ~ fuelsData:", fuelsData);

    const notify = useNotify();

    if (fuelsError) {
      notify("Fuel Error", fuelsError.message, "error");
    }
    if (tankError) {
      notify("Tank Error", tankError.message, "error");
    }

    const isEditMode = !!fuel;

    const navigate = useNavigate();

    const initialValues: NewFuel = {
      name: isEditMode ? fuel.name : "",
      purchase_price: isEditMode ? fuel.purchase_price : 0,
      selling_price: isEditMode ? fuel.selling_price : 0,
      quantity_theory: isEditMode ? fuel.quantity_theory : 0,
      quantity_actual: isEditMode ? fuel.quantity_actual : 0,
      description: isEditMode ? fuel.name : "",
      fuel_type: isEditMode ? fuel.fuel_type : FuelCategories.FUEL,
      tank_id: isEditMode ? fuel.tank.id : 0,
    };

    const fuelSelectOptions = [
      { names: FuelCategories.FUEL, id: FuelCategories.FUEL },
      { names: FuelCategories.GASOIL, id: FuelCategories.GASOIL },
      { names: FuelCategories.GAZ, id: FuelCategories.GAZ },
      { names: FuelCategories.PETROL, id: FuelCategories.PETROL },
    ];

    const createProductValidationSchema = yup.object({
      name: yup.string().required("Names is required"),
      purchase_price: yup.number().min(1, "Required"),
      selling_price: yup.number().min(1, "Required"),
      quantity_theory: yup.number().min(1, "Required"),
      quantity_actual: yup.number().min(1, "Required"),
      description: yup.string(),
      tank_id: yup.number().min(1, "You must choose a tank"),
    });

    const createFuelMutation = useMutation({
      mutationFn: saveFuel,
      onSuccess: (data, variables, context: any) => {
        notify("Save Success", context.successMessage, "success");
        handleCloseModal();
        queryClient.invalidateQueries(["products"], { exact: true });
      },
      onMutate: (variables) => {
        return { successMessage: "Created Product Successfully" };
      },
    });

    const updateFuelMutation = useMutation({
      mutationFn: updateFuel,
      onSuccess: (data, variables, context: any) => {
        notify("Update Success", context.successMessage, "success");
        queryClient.invalidateQueries(["products"], { exact: true });
        handleCloseModal();
      },
      onMutate: (variables) => {
        return { successMessage: "Updated Product Successfully" };
      },
      onError: (error: unknown) => {
        if (error instanceof Error) {
          notify("Fuel Update Error", error.message, "error");
        }
      },
    });

    const onNewFuelSubmit = async (data: NewFuel) => {
      try {
        if (isEditMode) {
          updateFuelMutation.mutateAsync({
            ...data,
            id: fuel.id,
            created_at: fuel.created_at,
            updated_at: fuel.updated_at,
            tank: fuel.tank,
            tank_id: fuel.tank.id,
          });
        } else {
          await createFuelMutation.mutateAsync(data);
        }
      } catch (error) {
        if (error instanceof UserError) {
          notify("Login Error", error.message, "error");
        }
        if (error instanceof Error) {
          notify("Login Error", error.message, "error");
        }
        if (error instanceof AuthError) {
          notify("Login Error", error.message, "error");
          navigate("/login");
        }
      }
    };

    return (
      <Box
        ref={ref}
        p={4}
        sx={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(4, 110, 174) 0px 0px 0px 3px",
          backgroundColor: theme.palette.background.alt,
          width: "60%",
          height: "80%",
          mt: "5rem",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <CloseIcon
          onClick={handleCloseModal}
          sx={{
            fontSize: 30,
            position: "absolute",
            right: "2rem",
            top: "1rem",
          }}
        />
        <Typography variant="h2" fontSize="2rem" mb="2rem" textAlign="center">
          <FormattedMessage
            id="form.fuel.heading"
            defaultMessage={isEditMode ? "Edit Fuel" : "Add New Fuel"}
          />
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={createProductValidationSchema}
          validate={() => ({})}
          onSubmit={(values) => {
            console.log("🚀 ~ values:", values);
            onNewFuelSubmit(values);
          }}
        >
          <Form>
            <Grid
              container
              spacing={{ xs: 0, sm: 2, md: 3 }}
              rowSpacing={2}
              columns={12}
            >
              <Grid item xs={12} sm={6}>
                <TextInput type="text" label="Name" name="name" />
              </Grid>

              <Grid item xs={12} sm={6} zIndex={100}>
                <CreatableSelectInput
                  label="Tank"
                  name="tank_id"
                  options={tankData ?? []}
                  isDataLoading={tankIsLoading}
                  onCreate={async (value: string) => {
                    const createdCategory = await saveTank({
                      name: value,
                      capacity: 10000,
                    });
                    refetchFuels();
                    return createdCategory;
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextInput
                  type="number"
                  label="Theory Quantity"
                  name="quantity_theory"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextInput
                  type="number"
                  label="Actual Quantity"
                  name="quantity_actual"
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <TextInput
                  type="number"
                  label="Purchase Price/L"
                  name="purchase_price"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextInput
                  type="number"
                  label="Selling Price/L"
                  name="selling_price"
                />
              </Grid>
              <Grid item xs={12}>
                <SelectInput
                  name="fuel_type"
                  options={fuelSelectOptions}
                  label="Fuel Type"
                  value={{
                    names: initialValues.fuel_type,
                    id: initialValues.fuel_type,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  type="text"
                  label="Description"
                  name="description"
                  multiline
                />
              </Grid>
            </Grid>
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", mt: "2rem" }}
            >
              <LoadingButton
                type="submit"
                loading={
                  createFuelMutation.isLoading || updateFuelMutation.isLoading
                }
                endIcon={isEditMode ? <EditIcon /> : <AddIcon />}
                loadingPosition="end"
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.grey[50],

                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                {isEditMode ? "Save" : "Add Fuel"}
              </LoadingButton>
            </Box>
          </Form>
        </Formik>
      </Box>
    );
  }
);

export default withAuth(FuelForm);
