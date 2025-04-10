import { Box, Modal, Typography } from "@mui/material";
import { GridColDef, GridEventListener } from "@mui/x-data-grid";
import MyDataGrid from "components/MyDataGrid";
import SaleDetailsPage from "features/sales/components/SaleDetailsPage";
import { useSales } from "features/sales/hooks/useSale";
import withAuth from "hoc/withAuth";
import { useNotify } from "hooks/useNotify";
import moment from "moment";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Sale } from "types";

const Sales = () => {
	const { data, error, isLoading, refetch } = useSales();

	const [selectedSale, setSelectedSale] = React.useState<Sale>();

	const [viewSaleDetailModal, setviewSaleDetailModal] = useState(false);
	const handleCloseSaleDetailModal = () => {
		setviewSaleDetailModal(false);
		refetch();
	};

	const handleRowClick: GridEventListener<"rowClick"> = params => {
		setSelectedSale(params.row);
		setviewSaleDetailModal(true);
	};
	const notify = useNotify();

	if (error) {
		notify(error.name, error.message, "error");
	}

	const columns: GridColDef[] = [
		{
			field: "date",
			headerName: "Date",
			width: 200,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return moment(params.row.created_at).format("DD/MM/YYYY HH:mm");
			}
		},
		{
			field: "username",
			headerName: "Seller",
			width: 200,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return params.row.user.names;
			}
		},
		{
			field: "total_amount",
			headerName: "Total Amount(XAF)",
			width: 200,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return params.row.total;
			}
		},
		{
			field: "saleDetails",
			headerName: "No. of Items",
			headerAlign: "center",
			width: 200,
			align: "center",
			sortable: false,
			renderCell: params => {
				return params.row.sale_details.length;
			}
		}
	];

	return (
		<Box sx={{ p: 2, display: "flex", gap: "2rem" }}>
			
			<Box sx={{width: "55%"}}>
				<Typography fontSize="3rem">
					<FormattedMessage id="sales" defaultMessage="Sales" />
				</Typography>
				{data && (
					<MyDataGrid
						columns={columns}
						isLoading={isLoading}
						rows={data}
						checkboxSelection={false}
						handleRowClick={handleRowClick}
					/>
				)}
			</Box>
			<Box  sx={{width: "45%", display: "flex", alignItems: "center", justifyContent: "center", mt: "3rem"}}>
				{selectedSale ? (
					<SaleDetailsPage sale={selectedSale} />
				) : (
					<Typography fontSize="5rem">Select a Sale</Typography>
				)}
			</Box>
		</Box>
	);
};

export default withAuth(Sales);