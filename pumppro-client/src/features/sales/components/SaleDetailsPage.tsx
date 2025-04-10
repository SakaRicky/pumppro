import React, { forwardRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { Sale } from "types";

type SaleDetailsProps = {
	sale: Sale;
};
const SaleDetailsPage = forwardRef(({ sale }: SaleDetailsProps, ref: any) => {

	console.log("saledetail: ", sale.sale_details)
	const theme = useTheme();
	const columns: GridColDef[] = [
		{
			field: "product",
			headerName: "Item",
			width: 180,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return params.row.product.name;
			}
		},
		{
			field: "category",
			headerName: "Category",
			width: 180,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return params.row.product.category.name;
			}
		},
		{
			field: "selling_price",
			headerName: "Unit Price(XAF)",
			width: 120,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return params.row.product.selling_price;
			}
		},
		{
			field: "quantity",
			headerName: "Quantity",
			width: 100,
			headerAlign: "center",
			align: "center"
		}
	];
	return (
		<Box
			sx={{
				height: "70%",
				width: "100%",
				backgroundColor: theme.palette.background.alt,
			}}
		>
			<Typography
				component="span"
				fontSize="1.2rem"
				sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}
			>
				<Box sx={{display: "flex", alignItems: "center"}}>
				<FormattedMessage
					id="salesdetailpage.doneby"
					defaultMessage="By:"
				/>
				<Typography color={theme.palette.primary[500]} fontSize="inherit">
					{sale.user.names}
				</Typography>
				</Box>
				
				{moment(sale.created_at).format("DD/MM/YYYY")}{" "}
				<Typography color={theme.palette.primary[500]} fontSize="1.5rem" fontWeight={"Bold"}>
				<FormattedMessage id="salesdetailpage.total" defaultMessage="Total" />{" "}
					XAF {sale.total}
				</Typography>
			</Typography>

			<Box
				sx={{
					height: "80%",
					width: "100%",
					"& .MuiDataGrid-root": {
						border: `4px solid ${theme.palette.secondary.main}`
					},
					"& .MuiDataGrid-columnHeaders": {
						backgroundColor: theme.palette.background.alt,
						color: theme.palette.secondary[200],
						borderBottom: "none"
					},
					"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
						color: `${theme.palette.secondary[100]} !important`
					},
					'.MuiDataGrid-cell:focus': {
						outline: 'none'
					},
					".MuiDataGrid-footerContainer": {
						display: "none"
					}
				}}
			>
				<DataGrid
					rows={sale.sale_details}
					columns={columns}
				/>
			</Box>
		</Box>
	);
});

export default SaleDetailsPage;
