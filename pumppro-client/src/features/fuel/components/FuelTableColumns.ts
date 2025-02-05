import { GridColDef } from "@mui/x-data-grid";

export const fuelTableColumns: GridColDef[] = [
	{
		field: "name",
		headerName: "Name",
		width: 200,
		headerAlign: "center",
		align: "center"
	},
	{
		field: "description",
		headerName: "Description",
		width: 200,
		headerAlign: "center",
		align: "center"
	},
	{
		field: "price",
		headerName: "Price",
		headerAlign: "center",
		align: "center"
	},
	{
		field: "quantity_actual",
		headerName: "Phisical Quantity",
		headerAlign: "center",
		align: "center"
	},
	{
		field: "quantity_theory",
		headerName: "Theory Quantity",
		headerAlign: "center",
		align: "center"
	},
	{
		field: "tank",
		headerName: "Tank",
		headerAlign: "center",
		align: "center",
		renderCell: params => {
			// Gaz don't have a value for tank
			if (params.value) {
				return params.value.name || "";
			} else {
				return "";
			}
		}
	}
];
