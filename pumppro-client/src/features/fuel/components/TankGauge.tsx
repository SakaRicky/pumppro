import React, { useState, useEffect } from "react";
// @ts-ignore
import LiquidFillGauge from "react-liquid-gauge";
import { green, purple, red, yellow } from "@mui/material/colors";
import { FuelCategories } from "types";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

interface TankGaugeProps {
  label: string;
  fuel: FuelCategories;
  level: number;
  capacity: number;
}

const TankGauge = ({ label, fuel, level, capacity }: TankGaugeProps) => {
  const [value, setValue] = useState((level / capacity) * 100);

  useEffect(() => {
    setValue((level / capacity) * 100);
  }, [level, capacity]);

  const theme = useTheme();

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:768px)");
  const radius = isSmallScreen ? 50 : isMediumScreen ? 75 : 100;

  const fillColor =
    fuel === FuelCategories.FUEL
      ? yellow
      : fuel === FuelCategories.GASOIL
        ? purple
        : green;

  const dynamicFillColor = value < 20 ? red : fillColor;

  const gradientStops = [
    {
      key: "0%",
      stopColor: dynamicFillColor[600],
      stopOpacity: 1,
      offset: "0%",
    },
    {
      key: "50%",
      stopColor: dynamicFillColor[400],
      stopOpacity: 0.65,
      offset: "50%",
    },
    {
      key: "100%",
      stopColor: dynamicFillColor[100],
      stopOpacity: 0.65,
      offset: "100%",
    },
  ];

  return (
    <Box
      className="position-relative"
      style={{
        maxWidth: "317px",
      }}
    >
      <LiquidFillGauge
        style={{ margin: "0 auto" }}
        width={radius * 2}
        height={radius * 2}
        value={value}
        percent="%"
        textSize={1}
        textOffsetX={0}
        textOffsetY={0}
        textRenderer={(props: any) => {
          const value = Math.round(props.value);
          const radius = Math.min(props.height / 2, props.width / 2);
          const textPixels = (props.textSize * radius) / 2;
          const valueStyle = {
            fontSize: textPixels,
          };
          const percentStyle = {
            fontSize: textPixels * 0.6,
          };

          return (
            <tspan>
              <tspan className="value" style={valueStyle}>
                {value}
              </tspan>
              <tspan style={percentStyle}>{props.percent}</tspan>
            </tspan>
          );
        }}
        riseAnimation
        waveAnimation
        waveFrequency={2}
        waveAmplitude={1}
        gradient
        gradientStops={gradientStops}
        circleStyle={{
          fill: dynamicFillColor[700],
        }}
        waveStyle={{
          fill: dynamicFillColor[700],
        }}
        textStyle={{
          fill: theme.palette.mode === "dark" ? "#919191" : "#444",
          fontFamily: "Arial",
        }}
        waveTextStyle={{
          fill: "#fff",
          fontFamily: "Arial",
        }}
      />
      <Typography textAlign="center" fontSize="0.8rem" fontWeight="700">
        {`${label} (${level}L)`}
      </Typography>
    </Box>
  );
};

export default TankGauge;
