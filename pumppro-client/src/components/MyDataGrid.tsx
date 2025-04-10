import { alpha, Box, useTheme } from "@mui/material";
import {
	DataGrid,
	GridColDef,
	GridEventListener,
	GridSelectionModel
} from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustumToolbar";
import React, { useState } from "react";
import { DailySale, Fuel, Product, Sale, SalesSummary } from "types";

type DataGridProps = {
	isLoading: boolean;
	checkboxSelection?: boolean;
	rows: (Product | Sale | SalesSummary | DailySale | Fuel)[];
	searchInput?: boolean; // used to enable seach functionality
	columns: GridColDef<any, any, any>[];
	handleSelected?: (ids: GridSelectionModel) => void;
	handleRowClick?: GridEventListener<"rowClick">;
};

const MyDataGrid = ({
	isLoading,
	rows,
	checkboxSelection,
	columns,
	searchInput,
	handleSelected,
	handleRowClick
}: DataGridProps) => {
	const theme = useTheme();

	const [search, setSearch] = useState("");

	const filteredRows =
		search.length > 0
			? (rows as Product[]).filter(
				product =>
					product.name
						.toLocaleLowerCase()
						.includes(search.toLocaleLowerCase()) ||
					product.description
						?.toLocaleLowerCase()
						.includes(search.toLocaleLowerCase())
			)
			: rows;

	return (
		<Box
			mt="1rem"
			height="75vh"
			width="100%"
			sx={{
				"& .MuiDataGrid-root": {
					border: `4px solid ${theme.palette.secondary.main}`
				},
				"& .MuiDataGrid-columnHeaders": {
					backgroundColor: alpha(theme.palette.secondary[600], 0.4),
					color: theme.palette.secondary[100],
					borderBottom: "none",
					fontSize: "1rem",
					borderRadius: 0,
					borderTop: 1,
					mb: 1
				},
				"& .MuiDataGrid-footerContainer": {
					// backgroundColor: theme.palette.background.alt,
					// color: theme.palette.secondary[200],
					borderBottom: "none",
					backgroundColor: alpha(theme.palette.secondary[600], 0.4),
					color: theme.palette.secondary[100]
				},
				"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
					color: `${theme.palette.secondary[100]} !important`
				},
				"& .MuiDataGrid-row": {
					backgroundColor: alpha(theme.palette.secondary[100], 0.2),
					"&:hover": {
						backgroundColor: alpha(theme.palette.secondary[600], 0.2),
						cursor: 'pointer'
					},
					"&.Mui-selected": {
						border: `1px solid ${theme.palette.secondary[100]}`,
						backgroundColor: theme.palette.secondary[900],
					}
				},
				'.MuiDataGrid-cell:focus': {
					outline: 'none'
				},
			}}
		>
			<DataGrid
				loading={isLoading}
				rows={filteredRows || []}
				columns={columns}
				onRowClick={handleRowClick}
				checkboxSelection={checkboxSelection || false}
				rowCount={(filteredRows && filteredRows.length) || 0}
				pagination
				rowsPerPageOptions={[20, 50, 100]}
				components={{ Toolbar: DataGridCustomToolbar }}
				componentsProps={{
					toolbar: {
						search,
						setSearch,
						disableSearch: !searchInput
					}
				}}
				onSelectionModelChange={ids => {
					handleSelected && handleSelected(ids);
				}}
			/>
		</Box>
	);
};

export default MyDataGrid;
