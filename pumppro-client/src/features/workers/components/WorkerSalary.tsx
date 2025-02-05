import React, { forwardRef, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { TextField, Typography, useTheme, FormControl } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useDailySales } from "features/sales/hooks/useSale";
import { FormattedMessage } from "react-intl";
import { DailySale, User } from "types";
import { green, red } from "@mui/material/colors";

type WorkerSalaryProp = {
	worker?: User;
};

const WorkerSalary = forwardRef(({ worker }: WorkerSalaryProp, ref: any) => {
	const theme = useTheme();

	const [startDate, setStartDate] = useState(new Date());
	const [stopDate, setStopDate] = useState(new Date());

	const {
		data: dailySales,
		error: dailySaleError,
		isLoading: dailySaleIsLoading,
		refetch: dailySaleRefetch
	} = useDailySales(
		startDate.toISOString(),
		stopDate.toISOString(),
		worker?.id
	);

	const lacking = dailySales?.reduce((acc, curr) => acc + curr.difference, 0);

	const columns: GridColDef<DailySale>[] = [
		{
			field: "date_of_sale_start",
			headerName: "Date Debut",
			width: 170,
			renderCell: params => {
				const date = new Date(params.row.date_of_sale_start);
				return <Box>{date.toLocaleString()}</Box>;
			}
		},
		{
			field: "date_of_sale_stop",
			headerName: "Date fin",
			width: 170,
			renderCell: params => {
				const date = new Date(params.row.date_of_sale_stop);
				return <Box>{date.toLocaleString()}</Box>;
			}
		},
		{
			field: "amount_sold",
			headerName: "Somme Vendue",
			type: "number",
			align: "center",
			width: 150
		},
		{
			field: "amount_given",
			headerName: "Somme Remise",
			type: "number",
			align: "center",
			width: 150
		},
		{
			field: "difference",
			headerName: "Manquants",
			type: "number",
			align: "center",
			width: 150
		}
	];

	const rows = worker ? dailySales : [];

	return (
		<Box
			ref={ref}
			sx={{
				psition: "relative",
				backgroundColor: theme.palette.background.alt,
				m: "5rem 0",
				p: 2,
				width: "80%",
				border: `5px solid ${theme.palette.primary[500]}`,
				overflowY: "auto"
			}}
		>
			<Typography sx={{ textAlign: "center", fontSize: "2rem" }}>
				<FormattedMessage id="salary.title" defaultMessage="Worker Salary" />
			</Typography>

			<Box
				sx={{
					display: { xs: "block", md: "flex" },
					alignItems: "center",
					justifyContent: "space-between",
					width: { xs: "100%", sm: "60%", md: "100%" },
					mt: "0.75rem"
				}}
			>
				<Box>
					<Typography fontSize="1.5rem">{worker?.names}</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						gap: 2,
						alignItems: "center",
						mt: { xs: 2, md: 0 },
						width: { xs: "100%", md: "60%" }
					}}
				>
					<Box
						sx={{
							display: { xs: "block", md: "flex" },
							width: "50%",
							gap: 1,
							alignItems: "center"
						}}
					>
						<Typography>
							<FormattedMessage id="from" defaultMessage="From" />
						</Typography>
						<DateTimePicker
							value={startDate}
							onChange={(newValue: Date | null) => {
								if (newValue) {
									setStartDate(newValue);
								}
							}}
							renderInput={(props: any) => (
								<FormControl fullWidth>
									<TextField
										sx={{
											boxShadow: 2
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
							display: { xs: "block", md: "flex" },
							gap: 1,
							width: "50%",
							alignItems: "center"
						}}
					>
						<Typography>
							<FormattedMessage id="to" defaultMessage="To" />
						</Typography>
						<DateTimePicker
							value={stopDate}
							onChange={(newValue: Date | null) => {
								if (newValue) {
									setStopDate(newValue);
								}
							}}
							renderInput={(props: any) => (
								<FormControl fullWidth>
									<TextField
										sx={{
											boxShadow: 2
										}}
										size="small"
										{...props}
									/>
								</FormControl>
							)}
						/>
					</Box>
				</Box>
			</Box>

			<Box
				sx={{
					m: "0.5rem 0",
					display: "flex",
					gap: "1rem",
					fontSize: { xs: "1rem", md: "1.5rem" }
				}}
			>
				<Typography
					component="span"
					display="flex"
					gap="1rem"
					fontSize="inherit"
				>
					<FormattedMessage id="salary" defaultMessage="Salary" />:
					<Typography color={green[500]} fontSize="inherit">
						{worker?.salary}
					</Typography>
				</Typography>
				<Typography
					component="span"
					display="flex"
					gap="1rem"
					fontSize="inherit"
				>
					<FormattedMessage id="lacking" defaultMessage="Lacking" />:
					<Typography color={red[500]} fontSize="inherit">
						{lacking}
					</Typography>
				</Typography>
			</Box>

			<Box sx={{ height: "80%" }}>
				<DataGrid
					rows={rows || []}
					columns={columns}
					loading={dailySaleIsLoading}
					pageSize={5}
					rowsPerPageOptions={[5]}
					checkboxSelection
					disableSelectionOnClick
					experimentalFeatures={{ newEditingApi: true }}
				/>
			</Box>
		</Box>
	);
});

export default WorkerSalary;
