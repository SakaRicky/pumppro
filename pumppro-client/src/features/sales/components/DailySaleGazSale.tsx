import { useTheme } from "@mui/material";
import { Avatar, Box, Chip, Divider, Typography } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import TextInput from "components/inputs/TextInput";
import React from "react";
import { Fuel } from "types";

interface DailySaleGazSaleProps {
	icon: React.ReactNode;
	gaz: Fuel;
	start_count_gaz?: number;
	stop_count_gaz?: number;
}

export const DailySaleGazSale = ({
	icon,
	gaz,
	start_count_gaz,
	stop_count_gaz
}: DailySaleGazSaleProps) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				display: "flex",
				gap: "1rem",
				// p: "0.25rem",
				boxShadow:
					"rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;"
			}}
		>
			<Box>
				<Typography fontSize="0.7rem" fontWeight="700">
					Gaz Station
				</Typography>
				{icon}
			</Box>
			<Box
				sx={{
					display: "flex",
					gap: "0.25rem",
					flexDirection: "column",
					justifyContent: "center"
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						gap: "0.25rem"
					}}
				>
					<Box>
						<Chip
							avatar={<Avatar>{gaz.name[0]}</Avatar>}
							label={gaz.name}
							size="small"
							sx={{ backgroundColor: green[800], color: "#fff" }}
						/>
					</Box>
					<Divider orientation="vertical" />
					<Box width="6rem">
						<TextInput
							name="stop_count_gaz"
							type="number"
							variant="outlined"
							size="small"
							label="Count Stop"
						/>
					</Box>
					<Divider orientation="vertical" />
					<Box width="6rem">
						<TextInput
							name="start_count_gaz"
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
							p: "0.25rem"
						}}
					>
						<Box
							sx={{
								backgroundColor: theme.palette.grey[300],
								color: "#000",
								p: "0.2rem"
							}}
						>
							{`${Number(start_count_gaz) - Number(stop_count_gaz)} L`}
						</Box>
						X
						<Chip
							label={`${gaz?.selling_price}FCFA/L`}
							size="small"
							sx={{ backgroundColor: blue[800], color: "#fff" }}
						/>
					</Box>
					<Divider orientation="vertical" />
					<Box
						sx={{
							backgroundColor: theme.palette.grey[300],
							color: "#000",
							p: "0.2rem 0.8rem"
						}}
					>
						=
					</Box>
					<Chip
						label={`${
							(Number(start_count_gaz) - Number(stop_count_gaz)) *
							gaz?.selling_price
						}FCFA`}
						size="small"
						sx={{ backgroundColor: green[800], color: "#fff" }}
					/>
				</Box>
			</Box>
		</Box>
	);
};
