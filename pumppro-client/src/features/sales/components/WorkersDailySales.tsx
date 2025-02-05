import React, { useState } from "react";
import {
	Avatar,
	Box,
	Button,
	Modal,
	Typography,
	useMediaQuery,
	useTheme
} from "@mui/material";
import { DailySale, User } from "types";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import MyDataGrid from "components/MyDataGrid";
import DailySaleSaveForm from "./DailySaleSaveForm";
import { useDailySales } from "../hooks/useSale";

type WorkersDailySalesProps = {
	startDate: Date;
	stopDate: Date;
	userID: string;
	users: User[];
};

const WorkersDailySales = ({
	startDate,
	stopDate,
	userID,
	users
}: WorkersDailySalesProps) => {
	const theme = useTheme();
	const {
		data: dailySales,
		error: dailySaleError,
		isLoading: dailySaleIsLoading,
		refetch: dailySaleRefetch
	} = useDailySales(startDate.toISOString(), stopDate.toISOString(), userID);

	const isMobile = useMediaQuery("(max-width: 800px)");

	const [viewDailySaleModal, setViewDailySaleModal] = useState(false);

	const handleModalClose = () => {
		setViewDailySaleModal(false);
		dailySaleRefetch();
	};

	const columns: GridColDef[] = [
		{
			field: "image",
			headerName: "Image",
			renderCell: (params: GridRenderCellParams<DailySale, any, any>) => {
				return (
					<Box width="3rem" height="3rem">
						{params.row.user.profile_picture ? (
							<img
								style={{
									padding: "2px",
									border: `1px solid ${theme.palette.grey[600]}`,
									objectFit: "cover",
									width: "100%",
									height: "100%",
									borderRadius: "50%"
								}}
								src={params.row.user.profile_picture}
								alt="profile"
							/>
						) : (
							<Avatar
								variant="rounded"
								sx={{
									bgcolor: theme.palette.grey[600],
									fontSize: "0.5rem",
									width: "100%",
									height: "100%",
									padding: "2px",
									border: `1px solid ${theme.palette.grey[600]}`,
									borderRadius: "50%"
								}}
								aria-label="product avatar"
							>
								<Typography fontSize="3rem">
									{params.row.user.names.split(" ")[0].toUpperCase()}
								</Typography>
							</Avatar>
						)}
					</Box>
				);
			}
		},
		{
			field: "name",
			headerName: "Names",
			width: 250,
			headerAlign: "center",
			align: "center",
			renderCell: (params: GridRenderCellParams<DailySale, any, any>) => {
				return params.row.user.names;
			}
		},

		{
			field: "amount_sold",
			width: 150,
			headerName: "Amount Sold",
			headerAlign: "center",
			align: "center"
		},
		{
			field: "amount_given",
			width: 150,
			headerName: "Amount Given",
			headerAlign: "center",
			align: "center"
		},
		{
			field: "difference",
			headerName: "Missing",
			headerAlign: "center",
			align: "center"
		},
		{
			field: "date_of_sale_start",
			headerName: "Day Start",
			headerAlign: "center",
			align: "center",
			width: 200,
			renderCell: (params: GridRenderCellParams<DailySale, any, any>) => {
				const date = new Date(params.row.date_of_sale_start);
				return date.toLocaleString();
			}
		},
		{
			field: "date_of_sale_stop",
			headerName: "Day Stop",
			headerAlign: "center",
			align: "center",
			width: 200,
			renderCell: (params: GridRenderCellParams<DailySale, any, any>) => {
				const date = new Date(params.row.date_of_sale_stop);
				return date.toLocaleString();
			}
		}
	];

	return (
		<Box>
			<Modal
				open={viewDailySaleModal}
				onClose={handleModalClose}
				aria-labelledby="Worker Form"
				aria-describedby="Form used to add or edit worker"
				sx={{
					display: "flex",
					justifyContent: "center"
				}}
			>
				<Box
					sx={{
						width: { xs: "85%", md: "70%" },
						height: "95%",
						mt: "1rem",
						background: theme.palette.background.default
					}}
				>
					<DailySaleSaveForm
						users={users}
						handleModalClose={handleModalClose}
					/>
				</Box>
			</Modal>
			<Box>
				<Button
					disabled={isMobile ? true : false}
					sx={{
						backgroundColor: theme.palette.secondary[400],
						color: "#fff",

						":hover": {
							backgroundColor: theme.palette.secondary[600]
						}
					}}
					onClick={() => setViewDailySaleModal(true)}
				>
					Create Daily Sale
				</Button>
			</Box>
			<MyDataGrid
				isLoading={dailySaleIsLoading}
				rows={dailySales || []}
				columns={columns}
			/>
		</Box>
	);
};

export default WorkersDailySales;
