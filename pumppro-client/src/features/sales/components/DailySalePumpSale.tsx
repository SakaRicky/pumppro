import React from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { Fuel } from "types";
import { blue, green, purple, yellow } from "@mui/material/colors";
import TextInput from "components/inputs/TextInput";

interface DailySalePumpSaleProps {
  icon: React.ReactNode;
  fuel: Fuel;
  gasoil: Fuel;
  pump_number: string;
  start_count_fuel?: number;
  stop_count_fuel?: number;
  start_count_gasoil?: number;
  stop_count_gasoil?: number;
}

export const DailySalePumpSale = ({
  icon,
  fuel,
  gasoil,
  pump_number,
  start_count_fuel,
  stop_count_fuel,
  start_count_gasoil,
  stop_count_gasoil,
}: DailySalePumpSaleProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        gap: "1rem",
        // p: "0.25rem",
        boxShadow:
          "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;",
      }}
    >
      <Box>
        <Typography fontSize="0.7rem" fontWeight="700">
          Pump {pump_number}
        </Typography>
        {icon}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "0.25rem",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <Box>
            <Chip
              avatar={<Avatar>{fuel.name[0]}</Avatar>}
              label={fuel.name}
              size="small"
              sx={{ backgroundColor: yellow[800] }}
            />
          </Box>
          <Divider orientation="vertical" />
          <Box width="6rem">
            <TextInput
              name={"stop_count_fuel_" + pump_number}
              type="number"
              variant="outlined"
              size="small"
              label="Count Stop"
            />
          </Box>
          <Divider orientation="vertical" />
          <Box width="6rem">
            <TextInput
              name={"start_count_fuel_" + pump_number}
              type="number"
              variant="outlined"
              size="small"
              label="Count Start"
            />
          </Box>
          <Box
            sx={{
              border: `1px solid #f4f4f4`,
              borderRadius: "0.5rem",
              display: "flex",
              gap: "1rem",
              p: "0.25rem",
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.grey[300],
                color: "#000",
                p: "0.2rem",
              }}
            >
              {`${Number(stop_count_fuel) - Number(start_count_fuel)} L`}
            </Box>
            X
            <Chip
              label={`${fuel?.selling_price}FCFA/L`}
              size="small"
              sx={{ backgroundColor: blue[800], color: "#fff" }}
            />
          </Box>
          <Divider orientation="vertical" />
          <Box
            sx={{
              backgroundColor: theme.palette.grey[300],
              color: "#000",
              p: "0.2rem 0.8rem",
            }}
          >
            =
          </Box>
          <Chip
            label={`${
              (Number(stop_count_fuel) - Number(start_count_fuel)) *
              fuel?.selling_price
            }FCFA`}
            size="small"
            sx={{ backgroundColor: green[800], color: "#fff" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <Box>
            <Chip
              avatar={<Avatar>G</Avatar>}
              label="Gasoil"
              size="small"
              sx={{
                backgroundColor: purple[800],
                color: "#fff",
              }}
            />
          </Box>
          <Divider orientation="vertical" />
          <Box width="6rem">
            <TextInput
              name={"stop_count_gasoil_" + pump_number}
              type="number"
              variant="outlined"
              size="small"
              label="Count Stop"
            />
          </Box>
          <Divider orientation="vertical" />
          <Box width="6rem">
            <TextInput
              name={"start_count_gasoil_" + pump_number}
              type="number"
              variant="outlined"
              size="small"
              label="Count Start"
            />
          </Box>
          <Box
            sx={{
              border: `1px solid #f4f4f4`,
              borderRadius: "0.5rem",
              display: "flex",
              gap: "1rem",
              p: "0.25rem",
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.grey[300],
                color: "#000",
                p: "0.2rem",
              }}
            >
              {`${Number(stop_count_gasoil) - Number(start_count_gasoil)} L`}
            </Box>
            X
            <Chip
              label={`${gasoil?.selling_price}FCFA/L`}
              size="small"
              sx={{ backgroundColor: blue[800], color: "#fff" }}
            />
          </Box>
          <Divider orientation="vertical" />
          <Box
            sx={{
              backgroundColor: theme.palette.grey[300],
              color: "#000",
              p: "0.2rem 0.8rem",
            }}
          >
            =
          </Box>
          <Chip
            label={`${
              (Number(stop_count_gasoil) - Number(start_count_gasoil)) *
              gasoil?.selling_price
            }FCFA`}
            size="small"
            sx={{ backgroundColor: green[800], color: "#fff" }}
          />
        </Box>
      </Box>
    </Box>
  );
};
