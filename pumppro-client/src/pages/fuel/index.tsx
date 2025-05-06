import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import TankGauge from "features/fuel/components/TankGauge";
import { Fuel, FuelCategories } from "types";
import { RefillFuelForm } from "features/dashboard/components/RefillFuelForm";
import MyDataGrid from "components/MyDataGrid";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useMutation } from "@tanstack/react-query";
import { deleteFuel } from "services/fuel";
import { useNotify } from "hooks/useNotify";
import FuelForm from "features/fuel/components/FuelForm";
import withAuth from "hoc/withAuth";
import { useFuels } from "features/fuel/components/hooks/useFuels";
import { GridColDef } from "@mui/x-data-grid";

export const getFuelFromFuels = (
  fuels: Fuel[] | undefined
): Fuel | undefined => {
  const fuel = fuels?.find((f) => f.fuel_type === FuelCategories.FUEL);
  return fuel;
};

export const getGasoilFromFuels = (
  fuels: Fuel[] | undefined
): Fuel | undefined => {
  const gasoil = fuels?.find((f) => f.fuel_type === FuelCategories.GASOIL);
  return gasoil;
};

export const getPetrolFromFuels = (
  fuels: Fuel[] | undefined
): Fuel | undefined => {
  const petrol = fuels?.find((f) => f.fuel_type === FuelCategories.PETROL);
  return petrol;
};

export const getGazFromFuels = (
  fuels: Fuel[] | undefined
): Fuel | undefined => {
  const gaz = fuels?.find((f) => f.name === "Gaz Bottle");
  return gaz;
};

const Fuels = () => {
  const theme = useTheme();
  // const { fuels, fetchFuels, fuel, gasoil, petrol, gaz, isLoading } =
  // 	useFuels();

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    data: fuels,
    isLoading,
    error: fuelsError,
    refetch: refetchFuels,
  } = useFuels();

  const [addEditFuelModal, setAddEditFuelModal] = useState(false);

  const notify = useNotify();

  const fuelTableColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quantity_actual",
      headerName: "Phisical Quantity",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "quantity_theory",
      headerName: "Theory Quantity",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "tank",
      headerName: "Tank",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        // Gaz don't have a value for tank
        if (params.value) {
          return params.value.name || "";
        } else {
          return "";
        }
      },
    },
    {
      field: "id",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      width: 400,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: "1rem 0.5rem",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                endIcon={<EditIcon />}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.grey[50],

                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
                onClick={() => handleFuelEdit(Number(params.id))}
              >
                <FormattedMessage id="edit_fuel" defaultMessage="Edit Fuel" />
              </Button>
              <LoadingButton
                onClick={() => handleDeleteFuel(Number(params.id))}
                loading={deleteFuelMutation.isLoading}
                endIcon={<DeleteIcon />}
                loadingPosition="end"
                sx={{
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.grey[50],

                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
              >
                <FormattedMessage
                  id="delete_fuel"
                  defaultMessage="Delete Fuel"
                />
              </LoadingButton>
            </Box>
          </Box>
        );
      },
    },
  ];

  const [selectedFuelID, setSelectedFuelID] = useState<number>();

  const fuelToEdit = fuels?.find((f) => f.id === selectedFuelID);

  const handleFuelEdit = (fuelID: number) => {
    setAddEditFuelModal(true);
    setSelectedFuelID(fuelID);
  };

  const deleteFuelMutation = useMutation({
    mutationFn: deleteFuel,
    onSuccess: (data, variables) => {
      notify("Save Success", "Product deleted successfully", "success");
      refetchFuels();
    },
  });

  const handleDeleteFuel = async (fuelIDToDelete: number) => {
    try {
      await deleteFuelMutation.mutateAsync(fuelIDToDelete);
      refetchFuels();
    } catch (error: any) {
      notify("Login Error", error.message, "error");
    }
  };

  const handleCloseaddEditFuelModal = () => {
    setAddEditFuelModal(false);
    refetchFuels();
  };

  const fuel = getFuelFromFuels(fuels);
  const gasoil = getGasoilFromFuels(fuels);
  const petrol = getPetrolFromFuels(fuels);

  return (
    <Box sx={{ m: "1rem", pb: "0.5rem" }}>
      <Modal
        open={addEditFuelModal}
        onClose={handleCloseaddEditFuelModal}
        aria-labelledby="Worker Form"
        aria-describedby="Form used to add or edit worker"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60%",
          width: { xs: "100%", lg: "50%" },
          margin: "0 auto",
        }}
      >
        <>
          <FuelForm
            fuel={fuelToEdit}
            handleCloseModal={handleCloseaddEditFuelModal}
          />
        </>
      </Modal>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <TankGauge
          level={fuel?.quantity_theory || 0}
          capacity={fuel?.tank.capacity || 1}
          fuel={FuelCategories.FUEL}
          label="Fuel 40000L"
        />
        <TankGauge
          level={gasoil?.quantity_theory || 0}
          capacity={gasoil?.tank.capacity || 1}
          fuel={FuelCategories.GASOIL}
          label="Gasoline 15000L"
        />
        <TankGauge
          level={petrol?.quantity_theory || 0}
          capacity={petrol?.tank.capacity || 1}
          fuel={FuelCategories.PETROL}
          label="Petrol 15000L"
        />
      </Box>

      <Box
        sx={{
          m: "0.5rem 0",
          p: "0.5rem 1rem",
          boxShadow:
            "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
        }}
      >
        <Typography variant="h3">
          <FormattedMessage
            id="record_fuel_delivery"
            defaultMessage="Record Fuel Delivery"
          />
        </Typography>
        <Box m="1rem 0">
          {fuels && <RefillFuelForm fuels={fuels} fetchFuels={refetchFuels} />}
        </Box>
      </Box>

      <Box sx={{ height: "42vh" }}>
        {fuels && (
          <MyDataGrid
            disableSelectionOnClick={true}
            columns={fuelTableColumns}
            isLoading={isLoading}
            rows={fuels}
            searchInput
            checkboxSelection
          />
        )}
      </Box>
      <Box sx={{ my: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          endIcon={<AddIcon />}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.grey[50],

            "&:hover": {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
          onClick={() => {
            setSelectedFuelID(0);
            setAddEditFuelModal(true);
          }}
        >
          <FormattedMessage id="add_fuel" defaultMessage="Add Fuel" />
        </Button>
      </Box>
    </Box>
  );
};

export default withAuth(Fuels);
