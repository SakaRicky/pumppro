import React from "react";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { Avatar, Box, Chip, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import TextInput from "components/inputs/TextInput";

export const DailySaleStore = () => {
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
					Store
				</Typography>
				<StoreMallDirectoryIcon sx={{ width: "6rem", height: "6rem" }} />
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
							avatar={<Avatar>S</Avatar>}
							label="Store"
							size="small"
							sx={{ backgroundColor: blue[800] }}
						/>
					</Box>
					<Divider orientation="vertical" />
					<Box width="8rem">
						<TextInput
							name={"amount_sold"}
							type="number"
							variant="outlined"
							size="small"
							label="Sold"
						/>
					</Box>
					<Divider orientation="vertical" />
				</Box>
			</Box>
		</Box>
	);
};
