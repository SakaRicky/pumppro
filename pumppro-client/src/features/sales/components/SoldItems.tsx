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
			field: "image",
			headerName: "Image",
			renderCell: params => {
				return (
					<Box width="100%" height="3rem">
						{params.value ? (
							<img
								style={{
									padding: "2px",
									border: `1px solid ${theme.palette.grey[600]}`,
									objectFit: "cover",
									width: "100%",
									height: "100%"
								}}
								src={params.value}
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
									border: `1px solid ${theme.palette.grey[600]}`
								}}
								aria-label="product avatar"
							>
								<Typography fontSize="3rem">
									{params.row.name.split(" ")[0].substring(0, 3).toUpperCase()}
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
			width: 200,
			headerAlign: "center",
			align: "center"
		},
		{
			field: "quantity_in_stock",
			headerName: "Quantity in Stock",
			headerAlign: "center",
			align: "center"
		},
		{
			field: "number_sold",
			headerName: "Sold",
			headerAlign: "center",
			align: "center"
		},
		{
			field: "amount",
			headerName: "Amount",
			headerAlign: "center",
			align: "center"
		},
		{
			field: "purchase_price",
			headerName: "Purchase Price",
			headerAlign: "center",
			align: "center"
		},
		{
			field: "selling_price",
			headerName: "Selling Price",
			headerAlign: "center",
			align: "center"
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
							fontSize: { xs: mobileFontSize, md: "1.5rem" }
						}}
					>
						<FormattedMessage id="total_sold" defaultMessage="Total Sold " />

						<Typography
							sx={{ fontSize: { xs: mobileFontSize, md: "1.5rem" } }}
							fontWeight="900"
							color={theme.palette.secondary[200]}
						>
							{`${selectedCategory ? selectedCategory.name : " All"}: `}
						</Typography>
						<Typography
							component="span"
							sx={{ fontSize: { xs: mobileFontSize, md: "1.5rem" } }}
							fontWeight="900"
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
							fontSize: { xs: mobileFontSize, md: "1.5rem" }
						}}
					>
						<FormattedMessage id="profits" defaultMessage="Profit " />
						<Typography
							sx={{ fontSize: { xs: mobileFontSize, md: "1.5rem" } }}
							fontWeight="900"
							color={theme.palette.secondary[200]}
						>
							{`${selectedCategory ? selectedCategory.name : " All"}: `}
						</Typography>
						<Typography
							component="span"
							sx={{ fontSize: { xs: mobileFontSize, md: "1.5rem" } }}
							fontWeight="900"
							color={theme.palette.secondary[100]}
						>
							XAF {benefitsForThisPeriodInThisCategory}
						</Typography>
					</Typography>
				</Box>
				<Typography
					component="span"
					fontSize="1.5rem"
					sx={{ display: "flex", gap: 2, mt: { xs: 2, md: 0 } }}
				>
					<FormattedMessage id="total_sold" defaultMessage="Total Sold" />
					{": "}
					<Typography
						component="span"
						fontSize="1.5rem"
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
