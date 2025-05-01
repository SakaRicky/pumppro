/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, forwardRef } from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { NewDailySale, User } from "types";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { saveDailySales } from "services/dailySales";
import { FormattedMessage } from "react-intl";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import FlexBetween from "components/FlexBetween";
import { useMutation } from "@tanstack/react-query";
import { useNotify } from "hooks/useNotify";
import { SelectInput } from "components/inputs/SelectInput";
import TextInput from "components/inputs/TextInput";
import {
  LocalGasStation,
  LocalGasStationOutlined,
  LocalGasStationTwoTone,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers";
import PropaneTankIcon from "@mui/icons-material/PropaneTank";
import { DailySalePumpSale } from "./DailySalePumpSale";
import { DailySaleGazSale } from "./DailySaleGazSale";
import { green, red } from "@mui/material/colors";
import { DailySaleStore } from "./DailySaleStore";
import { useFuels } from "features/fuel/components/hooks/useFuels";
import {
  getFuelFromFuels,
  getGasoilFromFuels,
  getPetrolFromFuels,
} from "pages/fuel";
import { useDailySales, useSales } from "../hooks/useSale";

type DailySaleSaveFormProps = {
  users: User[];
  handleModalClose: () => void;
};

const modes = [
  { names: "Store", id: "store" },
  { names: "Fuel", id: "fuel" },
];

const DailySaleSaveForm = forwardRef(
  ({ users, handleModalClose }: DailySaleSaveFormProps, ref: any) => {
    const theme = useTheme();

    const notify = useNotify();

    const [userIDError, setUserIDError] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User>();

    const [startDate, setStartDate] = useState(new Date());
    const [stopDate, setStopDate] = useState(new Date());

    const {
      data: sales,
      error: salesError,
      isLoading: isSalesLoading,
      refetch: refetchSales,
    } = useSales(
      false,
      startDate.toISOString(),
      stopDate.toISOString(),
      selectedUser?.id
    );

    // need this for the select in the New Daily Sale Form
    const {
      data: dailySales,
      error: dailySaleError,
      isLoading: dailySaleIsLoading,
      refetch: dailySaleRefetch,
    } = useDailySales(
      startDate.toISOString(),
      stopDate.toISOString(),
      selectedUser?.id
    );
    const dailySale = dailySales?.[0];

    const [saleMode, setSaleMode] = useState(modes[0]);

    const { data, isLoading, error, refetch } = useFuels();

    const fuel = getFuelFromFuels(data);
    const gasoil = getGasoilFromFuels(data);
    const petrol = getPetrolFromFuels(data);
    const gaz = getGasoilFromFuels(data);

    type FormValuesType = NewDailySale & { isStore: boolean };

    const initialValues: FormValuesType = {
      isStore: saleMode.id === "store",
      amount_sold: 0,
      amount_given: 0,
      difference: 0,
      date_of_sale_start: startDate,
      date_of_sale_stop: stopDate,
      user_id: "",
      start_count_fuel_1: 0,
      stop_count_fuel_1: 0,
      start_count_gasoil_1: 0,
      stop_count_gasoil_1: 0,
      start_count_fuel_2: 0,
      stop_count_fuel_2: 0,
      start_count_gasoil_2: 0,
      stop_count_gasoil_2: 0,
      start_count_fuel_3: 0,
      stop_count_fuel_3: 0,
      start_count_gasoil_3: 0,
      stop_count_gasoil_3: 0,
      start_count_gaz: 0,
      stop_count_gaz: 0,
    };

    // Pumpist must submit the index and fuel types
    // I'm not validating userID here because I also need this
    // to search for sale details, hence I can;t validate in formik since I don't have access outside of formik
    const dailySaleValidationSchema = yup.object({
      expected_amount: yup.number().min(1, "should be >= 1"),
      amount_sold: yup.number().when("isStore", {
        is: true,
        then: yup
          .number()
          .min(1, "should be >= 1")
          .required(
            "amount_sold is required when expected_amount is greater than 0"
          ),
        otherwise: yup.number(),
      }),
      amount_given: yup.number().min(1, "should be >= 1").required(),
      date_of_sale_start: yup.date(),
      date_of_sale_stop: yup
        .date()
        .test(
          "different-dates",
          "Start and end dates must be different",
          function (value) {
            const { date_of_sale_start } = this.parent;
            return (
              !value ||
              !date_of_sale_start ||
              value.getTime() !== date_of_sale_start.getTime()
            );
          }
        ),
    });

    const createMutation = useMutation({
      mutationFn: saveDailySales,
      onSuccess: (data, variable, context: any) => {
        console.log("saved successfull");
        notify("Save Success", context.successMessage, "success");
      },
      onMutate: (variables) => {
        return { successMessage: "Created Daily Sale Successfully" };
      },
    });

    const saveSale = async (values: FormValuesType) => {
      const { isStore, ...rest } = values;

      if (!selectedUser) {
        setUserIDError(true);
      } else {
        const newDailySale: NewDailySale = {
          ...rest,
          user_id: selectedUser.id,
        };

        setUserIDError(false);
        createMutation.mutateAsync(newDailySale);
        handleModalClose();
      }
    };

    const handleModeChange = (value: any) => {
      setSaleMode(value);
    };

    const handleUserChange = (value: { names: string; id: string }) => {
      const user = users.find((u) => u.id === value.id);
      setSelectedUser(user);
      setUserIDError(false);
    };

    console.log("sales line 194: ", sales);
    console.log("sales line 198: ", typeof sales?.at(0)?.total);

    if (sales !== undefined && sales.length > 0) {
      console.log("sales line 198: ", typeof sales[0].total);
    }

    const totalAmountSold = sales?.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue.total), // Prisma Decimal type is coverted to string when it's transfered
      0
    );

    return (
      <Box
        sx={{
          border: `4px dashed ${theme.palette.secondary[300]}`,
          p: 2,
          width: "100%",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CloseIcon
            sx={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() => handleModalClose()}
          />
        </Box>
        <Typography
          fontSize="2rem"
          mb="2rem"
          textAlign="center"
          fontWeight="700"
        >
          <FormattedMessage id="newDailySale" defaultMessage="New Daily Sale" />
        </Typography>
        {fuel && gasoil && gaz && (
          <Formik
            initialValues={initialValues}
            validationSchema={dailySaleValidationSchema}
            enableReinitialize
            onSubmit={(values) => {
              saveSale(values);
            }}
          >
            {({ errors, touched, values, setFieldValue }) => {
              const fuel_liters_sold =
                Number(values.stop_count_fuel_1) -
                Number(values.start_count_fuel_1) +
                (Number(values.stop_count_fuel_2) -
                  Number(values.start_count_fuel_2)) +
                (Number(values.stop_count_fuel_3) -
                  Number(values.start_count_fuel_3));

              const gasoil_liters_sold =
                Number(values.stop_count_gasoil_1) -
                Number(values.start_count_gasoil_1) +
                (Number(values.stop_count_gasoil_2) -
                  Number(values.start_count_gasoil_2)) +
                (Number(values.stop_count_gasoil_3) -
                  Number(values.start_count_gasoil_3));

              const gaz_number_sold =
                Number(values.start_count_gaz) - Number(values.stop_count_gaz);

              let totalSold =
                fuel_liters_sold * fuel.selling_price +
                gasoil_liters_sold * gasoil.selling_price +
                gaz_number_sold * gaz.selling_price;

              let difference = Number(values.amount_given) - totalSold;

              if (saleMode.id === "store") {
                values.difference = values.amount_given - values.amount_sold;
                totalSold = values.amount_sold;
                difference = values.amount_given - values.amount_sold;
              } else {
                values.amount_sold = totalSold;
                values.difference = difference;
              }

              return (
                <Form>
                  <FlexBetween>
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: { md: "flex" },
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "4rem",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            width: { xs: "70%", md: "50%" },
                          }}
                        >
                          <Box width="50%" sx={{ position: "relative" }}>
                            <SelectInput
                              options={users}
                              name="user_id"
                              label="Select a Worker"
                              handleChange={handleUserChange}
                            />
                            {userIDError && (
                              <Typography
                                fontSize="0.8rem"
                                mt=""
                                sx={{
                                  position: "absolute",
                                  bottom: "-1.1rem",
                                  left: 0,
                                  transform: "translate(50%)",
                                }}
                                color={red[500]}
                              >
                                Select a user
                              </Typography>
                            )}
                          </Box>
                          <Box width="50%">
                            <SelectInput
                              name="mode"
                              label="Select a mode"
                              options={modes}
                              handleChange={handleModeChange}
                            />
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            alignItems: "center",
                            width: { xs: "70%", md: "50%" },
                            mt: { xs: "1rem", md: 0 },
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              display: { md: "flex" },
                              gap: 1,
                              width: "50%",
                              alignItems: "center",
                            }}
                          >
                            <Typography>
                              <FormattedMessage
                                id="from"
                                defaultMessage="From"
                              />
                            </Typography>
                            <DateTimePicker
                              value={values.date_of_sale_start}
                              onChange={(newValue: Date | null) => {
                                if (newValue) {
                                  setFieldValue("date_of_sale_start", newValue);
                                  setStartDate(newValue);
                                }
                              }}
                              renderInput={(props: any) => (
                                <FormControl fullWidth>
                                  <TextField
                                    sx={{
                                      boxShadow: 2,
                                    }}
                                    size="small"
                                    {...props}
                                  />
                                </FormControl>
                              )}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: { md: "flex" },
                              gap: 2,
                              width: "50%",
                              alignItems: "center",
                            }}
                          >
                            <Typography>
                              <FormattedMessage id="to" defaultMessage="To" />
                            </Typography>
                            <DateTimePicker
                              value={values.date_of_sale_stop}
                              onChange={(newValue: Date | null) => {
                                if (newValue) {
                                  setFieldValue("date_of_sale_stop", newValue);
                                  setStopDate(newValue);
                                }
                              }}
                              renderInput={(props: any) => (
                                <FormControl fullWidth>
                                  <TextField
                                    sx={{
                                      boxShadow: 2,
                                    }}
                                    size="small"
                                    {...props}
                                  />
                                </FormControl>
                              )}
                            />
                          </Box>
                          {Boolean(errors.date_of_sale_stop) && (
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                color: red[500],
                                position: "absolute",
                                bottom: "-1rem",
                                left: 0,
                                transform: "translateX(50%)",
                              }}
                            >
                              <FormattedMessage
                                id="dateError"
                                defaultMessage="Start and end dates must be different"
                              />
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          mt: "1rem",
                          p: "0 1rem",
                        }}
                      >
                        <Box>
                          <Typography fontSize="1.3rem">
                            <FormattedMessage id="role" defaultMessage="Role" />
                            : {selectedUser?.role}
                          </Typography>
                          <Typography fontSize="1.3rem">
                            <FormattedMessage id="sale" defaultMessage="Sale" />
                            : {totalAmountSold}
                          </Typography>
                          <Typography fontSize="1.3rem">
                            <FormattedMessage
                              id="dailySale"
                              defaultMessage="Daily Sale"
                            />
                            : {dailySale?.amount_given}
                          </Typography>
                        </Box>
                        {saleMode.id === "store" ? (
                          <DailySaleStore />
                        ) : (
                          <Box>
                            <DailySalePumpSale
                              icon={
                                <LocalGasStation
                                  sx={{ width: "6rem", height: "6rem" }}
                                />
                              }
                              fuel={fuel}
                              gasoil={gasoil}
                              pump_number="1"
                              start_count_fuel={Number(
                                values.start_count_fuel_1
                              )}
                              stop_count_fuel={Number(values.stop_count_fuel_1)}
                              start_count_gasoil={Number(
                                values.start_count_gasoil_1
                              )}
                              stop_count_gasoil={Number(
                                values.stop_count_gasoil_1
                              )}
                            />
                            <DailySalePumpSale
                              icon={
                                <LocalGasStationOutlined
                                  sx={{ width: "6rem", height: "6rem" }}
                                />
                              }
                              fuel={fuel}
                              gasoil={gasoil}
                              pump_number="2"
                              start_count_fuel={Number(
                                values.start_count_fuel_2
                              )}
                              stop_count_fuel={Number(values.stop_count_fuel_2)}
                              start_count_gasoil={Number(
                                values.start_count_gasoil_2
                              )}
                              stop_count_gasoil={Number(
                                values.stop_count_gasoil_2
                              )}
                            />
                            <DailySalePumpSale
                              icon={
                                <LocalGasStationTwoTone
                                  sx={{ width: "6rem", height: "6rem" }}
                                />
                              }
                              fuel={fuel}
                              gasoil={gasoil}
                              pump_number="3"
                              start_count_fuel={Number(
                                values.start_count_fuel_3
                              )}
                              stop_count_fuel={Number(values.stop_count_fuel_3)}
                              start_count_gasoil={Number(
                                values.start_count_gasoil_3
                              )}
                              stop_count_gasoil={Number(
                                values.stop_count_gasoil_3
                              )}
                            />
                            <DailySaleGazSale
                              icon={
                                <PropaneTankIcon
                                  sx={{ width: "5rem", height: "5rem" }}
                                />
                              }
                              gaz={gaz}
                              start_count_gaz={Number(values.start_count_gaz)}
                              stop_count_gaz={Number(values.stop_count_gaz)}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box
                        sx={{
                          m: 2,
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: green[700],
                            color: "#fff",
                            p: "0.5rem",
                            borderRadius: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography fontSize="1rem">To Pay: </Typography>

                          <Typography fontSize="1.5rem" fontWeight="700">
                            {totalSold}
                          </Typography>
                        </Box>
                        <TextInput
                          name="amount_given"
                          label="Amount Given"
                          type="number"
                          variant="outlined"
                        />
                        <Box
                          sx={{
                            backgroundColor:
                              difference < 0 ? red[700] : green[700],
                            color: "#fff",
                            p: "0.5rem",
                            borderRadius: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography fontSize="1rem">Difference: </Typography>

                          <Typography fontSize="1.5rem" fontWeight="700">
                            {difference}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </FlexBetween>
                  <Box
                    sx={{
                      mt: "1rem",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <LoadingButton
                      type="submit"
                      loading={createMutation.isLoading}
                      endIcon={<AddIcon />}
                      loadingPosition="end"
                      sx={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.grey[50],

                        "&:hover": {
                          backgroundColor: theme.palette.secondary.dark,
                        },
                      }}
                    >
                      <FormattedMessage
                        id="addDailySale"
                        defaultMessage="Add Daily Sale"
                      />
                    </LoadingButton>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        )}
      </Box>
    );
  }
);

export default DailySaleSaveForm;
