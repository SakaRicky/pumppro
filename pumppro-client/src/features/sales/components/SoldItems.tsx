import React from "react";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import MyDataGrid from "components/MyDataGrid";
import { ProductCategory, SalesSummary } from "types";
import { FormattedMessage } from "react-intl";

type SoldItemsProps = {
	isLoading: boolean;
	data: SalesSummary[] | undefined;
	totalAmountSoldAllCategories: number | undefined;
	totalAmountSoldForThisPeriodInThisCategory: number | undefined;
	benefitsForThisPeriodInThisCategory: number | undefined;
	selectedCategory: ProductCategory | undefined;
};

export const getItemAvatarName = (name: string): string => {
	const nameParts = name.split(" ");

	return nameParts.length > 1 ? nameParts[0][0] + nameParts[1][0] : nameParts[0]+nameParts[1]
}

const SoldItems = ({
	isLoading,
	data,
	totalAmountSoldAllCategories,
	totalAmountSoldForThisPeriodInThisCategory,
	benefitsForThisPeriodInThisCategory,
	selectedCategory
}: SoldItemsProps) => {
	const theme = useTheme();

	const columns: GridColDef[] = [
		{
			field: "name",
			headerName: "Names",
			width: 200,
			headerAlign: "center",
			align: "left"
		},
		{
			field: "number_sold",
			headerName: "Sold Qty",
			width: 150,
			headerAlign: "center",
			align: "center"
		},
		{
			field: "amount",
			headerName: "Amount (XAF)",
			width: 150,
			headerAlign: "center",
			align: "center"
		},
		{
			field: "purchase_price",
			headerName: "Purchase Price (XAF)",
			width: 200,
			headerAlign: "center",
			align: "center"
		},
		{
			field: "selling_price",
			headerName: "Selling Price (XAF)",
			width: 200,
			headerAlign: "center",
			align: "center"
		},
		{
			field: "profit",
			headerName: "Profit (XAF)",
			width: 150,
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return (params.row.selling_price * params.row.number_sold) - (params.row.purchase_price * params.row.number_sold);
			}
		}
	];

	const mobileFontSize = "1.2rem";

	return (
		<Box>
			<Box
				sx={{
					display: { md: "flex" },
					justifyContent: "space-between",
					alignItems: "center",
					my: 1
				}}
			>
				<Box>
					<Typography
						component="span"
						sx={{
							display: "flex",
							gap: 2,
							fontSize: { xs: mobileFontSize, md: "2rem" }
						}}
					>
						<FormattedMessage id="revenue" defaultMessage="Revenue " />

						<Typography
							sx={{ fontSize: "inherit" }}
							fontWeight="900"
							color={theme.palette.secondary[200]}
						>
							{`${selectedCategory ? selectedCategory.name : " All"}: `}
						</Typography>
						<Typography
							component="span"
							fontWeight="900"
							sx={{ fontSize: "inherit" }}
							color={theme.palette.secondary[100]}
						>
							XAF {totalAmountSoldForThisPeriodInThisCategory}
						</Typography>
					</Typography>
					<Typography
						component="span"
						sx={{
							display: "flex",
							gap: 2,
							fontSize: { xs: mobileFontSize, md: "2rem" }
						}}
					>
						<FormattedMessage id="profits" defaultMessage="Profit " />
						<Typography
							sx={{ fontSize: "inherit" }}
							fontWeight="900"
							color={theme.palette.secondary[200]}
						>
							{`${selectedCategory ? selectedCategory.name : " All"}: `}
						</Typography>
						<Typography
							component="span"
							sx={{ fontSize: "inherit" }}
							fontWeight="900"
							color={theme.palette.secondary[100]}
						>
							XAF {benefitsForThisPeriodInThisCategory}
						</Typography>
					</Typography>
				</Box>
				<Typography
					component="span"
					sx={{ display: "flex", gap: 2, mt: { xs: 2, md: 0 }, fontSize: { xs: mobileFontSize, md: "2rem" } }}
				>
					<FormattedMessage id="all_cat_revenue" defaultMessage="All Category Revenue" />
					{": "}
					<Typography
						component="span"
						fontSize="inherit"
						fontWeight="900"
						color={theme.palette.secondary[100]}
					>
						XAF {totalAmountSoldAllCategories}
					</Typography>
				</Typography>
			</Box>
			<MyDataGrid
				columns={columns}
				isLoading={isLoading}
				rows={data || []}
				checkboxSelection={false}
			/>
		</Box>
	);
};

export default SoldItems;
