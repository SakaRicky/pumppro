import React from "react";
import { Box } from "@mui/material";
import TankGauge from "features/fuel/components/TankGauge";
import { FuelCategories } from "types";
import { useFuels } from "features/fuel/components/hooks/useFuels";
import {
  getFuelFromFuels,
  getGasoilFromFuels,
  getPetrolFromFuels,
} from "pages/fuel";

export const DashboardGauges = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { data, isLoading, error, refetch } = useFuels();

  const fuel = getFuelFromFuels(data);
  const gasoil = getGasoilFromFuels(data);
  const petrol = getPetrolFromFuels(data);

  return (
    <Box>
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
    </Box>
  );
};
