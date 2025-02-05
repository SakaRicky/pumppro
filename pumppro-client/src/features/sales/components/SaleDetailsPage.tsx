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
	const theme = useTheme();
	const columns: GridColDef[] = [
		{
			field: "product",
			headerName: "Article",
			width: 150,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return params.row.product.name;
			}
		},
		{
			field: "category",
			headerName: "Category",
			width: 150,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return params.row.product.category.name;
			}
		},
		{
			field: "selling_price",
			headerName: "Unit Price",
			width: 100,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return <span>XAF {params.row.product.selling_price}</span>;
			}
		},
		{
			field: "quantity",
			headerName: "Quantity",
			width: 100,
			headerAlign: "center",
			align: "center"
		},
		{
			field: "total_amount",
			headerName: "Total Amount",
			width: 150,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return <span>XAF {params.row.total_amount}</span>;
			}
		}
	];
	return (
		<Box
			sx={{
				p: 2,
				height: "80%",
				width: "70%",
				backgroundColor: theme.palette.background.alt
			}}
		>
			<Typography fontSize="2rem">SaleDetails</Typography>
			<Typography
				component="span"
				fontSize="1.2rem"
				sx={{ display: "flex", alignItems: "center", gap: 1 }}
			>
				<FormattedMessage
					id="salesdetailpage.doneby"
					defaultMessage="Done by"
				/>
				<Typography color={theme.palette.primary[500]} fontSize="1.5rem">
					{sale.user.names}
				</Typography>
				<FormattedMessage id="salesdetailpage.on" defaultMessage="On the" />{" "}
				{moment(sale.created_at).format("DD/MM/YYYY")}{" "}
				<FormattedMessage
					id="salesdetailpage.total"
					defaultMessage="For a total of"
				/>{" "}
				<Typography color={theme.palette.primary[500]} fontSize="1.5rem">
					XAF {sale.total_amount}
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
					"& .MuiDataGrid-footerContainer": {
						backgroundColor: theme.palette.background.alt,
						color: theme.palette.secondary[200],
						borderBottom: "none"
					},
					"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
						color: `${theme.palette.secondary[100]} !important`
					}
				}}
			>
				<DataGrid
					rows={sale.saleDetails}
					columns={columns}
					rowCount={(sale.saleDetails && sale.saleDetails.length) || 0}
					pagination
					rowsPerPageOptions={[20, 50, 100]}
				/>
			</Box>
		</Box>
	);
});

export default SaleDetailsPage;
