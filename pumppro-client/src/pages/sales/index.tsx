import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { useStateValue } from "state";


const Sales = () => {
	const [state, dispatch] = useStateValue();
	const { data, error, isLoading, refetch } = useSales(true, state.logedUser?.id);

	const [selectedSale, setSelectedSale] = React.useState<Sale>();

	const isMobile = useMediaQuery("(max-width: 768px)");

	const theme = useTheme();

	const navigate = useNavigate();

	const handleRowClick: GridEventListener<"rowClick"> = params => {
		setSelectedSale(params.row);
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

	const MobileSaleCard = ({ sale }: { sale: Sale }) => {

		return <Box sx={{ boxShadow: 2, my: 2, p: 2, borderRadius: "0.25rem" }} onClick={() =>  navigate(`${sale.id}`)}>
			<Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid gray", pb: 2, mb: 2 }}>
				<Typography>Sale item</Typography>
				<ArrowForwardIosIcon />
			</Box>
			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
				<Box>
					<Typography>{sale.user.names}</Typography>
					<Box>
						{moment(sale.created_at).format("DD/MM/YYYY")}{" "}
					</Box>
				</Box>
				<Box>
					<Typography color={theme.palette.primary[500]} fontSize="1.5rem" fontWeight={"Bold"}>XAF {sale.total}</Typography>
					<Typography>{sale.sale_details.length} items</Typography>
				</Box>
			</Box>
		</Box>
	}

	return (
		isMobile ? (
		  isLoading ? (
			<CircularProgress />
		  ) : (
			<Box sx={{p: 2, height: "100%"}}>
			  {data && data.length > 0 ? (
				data.map(d => <MobileSaleCard key={d.id} sale={d} />)
			  ) : (
				<Typography>No sales found.</Typography>
			  )}
			</Box>
		  )
		) : (
		  // Desktop view - This part was already correct as it returns a single <Box>
		  <Box sx={{ p: 2, display: "flex", gap: "2rem" }}>
			<Box sx={{ width: "55%" }}>
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
			   {isLoading && <CircularProgress />}
			   {!isLoading && !data && <Typography>Loading data failed or data is unavailable.</Typography>}
			   {!isLoading && data && data.length === 0 && <Typography>No sales data available.</Typography>}
	  
			</Box>
			<Box sx={{ width: "45%", display: "flex", alignItems: "center", justifyContent: "center", mt: "3rem" }}>
			  {selectedSale ? (
				<SaleDetailsPage sale={selectedSale} />
			  ) : (
				<Typography fontSize="5rem">Select a Sale</Typography>
			  )}
			</Box>
		  </Box>
		)
	)
};

export default withAuth(Sales);