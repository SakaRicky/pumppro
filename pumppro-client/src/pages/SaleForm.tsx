import React, { ChangeEvent, useEffect, useState } from "react";
import { MenuItem, Tab } from "@mui/material";
import { Box, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useProductCategories } from "features/products/hooks/useProductCategory";
import { useSalesSummary } from "features/sales/hooks/useSale";
import withAuth from "hoc/withAuth";
import { useNotify } from "hooks/useNotify";
import { FormattedMessage } from "react-intl";
import { getUsers } from "services/users";
import { ProductCategory, User } from "types";
import { FormControl } from "@mui/material";
import SoldItems from "features/sales/components/SoldItems";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import WorkersDailySales from "features/sales/components/WorkersDailySales";
import { useMediaQuery } from "@mui/material";

const SalesByForm = () => {
	const [selectedTab, setSelectedTab] = React.useState("1");

	const isMobile = useMediaQuery("(max-width: 900px)");

	const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
		setSelectedTab(newValue);
	};

	const { data: productCategories, error: productCategoriesError } =
		useProductCategories();

	const [selectedCategory, setSelectedCategoryID] = useState<ProductCategory>();

	const [userID, setUserID] = useState("");

	const [users, setUsers] = useState<User[]>([]);

	const [startDate, setStartDate] = useState(new Date());
	const [stopDate, setStopDate] = useState(new Date());

	const {
		data,
		error: salesSummaryError,
		isLoading,
		refetch
	} = useSalesSummary(
		startDate.toISOString(),
		stopDate.toISOString(),
		userID,
		selectedCategory?.id
	);

	const salesSummary = data?.salesSummary;
	const totalAmountSoldForThisPeriodInThisCategory =
		data?.totalAmountSoldForThisPeriodInThisCategory;
	const totalAmountSoldAllCategories = data?.totalAmountSoldAllCategories;
	const benefitsForThisPeriodInThisCategory =
		data?.benefitsForThisPeriodInThisCategory;

	const notify = useNotify();

	useEffect(() => {
		if (productCategoriesError) {
			notify(
				"Error getting All Categories",
				productCategoriesError.message,
				"error"
			);
		}
		if (salesSummaryError) {
			notify(
				"Error getting All Categories",
				salesSummaryError.message,
				"error"
			);
		}
	}, [productCategoriesError, salesSummaryError]);

	const fetchUser = async () => {
		const users = await getUsers();
		if (users) {
			setUsers(users);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<Box sx={{ p: 2 }}>
			<Typography fontSize="2rem">
				<FormattedMessage id="salesform" defaultMessage="Sales By Form" />
			</Typography>
			<Box sx={{ my: 2 }}>
				<Box
					sx={{
						display: isMobile ? "block" : "flex",
						alignItems: "center",
						justifyContent: "space-between",
						width: { xs: "100%", sm: "60%", md: "100%" }
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 2,
							width: isMobile ? "100%" : "40%"
						}}
					>
						<FormControl sx={{ width: "50%" }}>
							<TextField
								select
								value={selectedCategory?.id || ""}
								label="Choose Category"
								onChange={(
									event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
								) => {
									const found = productCategories.find(
										cat => cat.id === event.target.value
									);
									setSelectedCategoryID(found);
								}}
								size="small"
								sx={{
									boxShadow: 2
								}}
							>
								<MenuItem value="">All</MenuItem>
								{productCategories?.map(cat => (
									<MenuItem key={cat.id} value={cat.id}>
										{cat.name}
									</MenuItem>
								))}
							</TextField>
						</FormControl>
						<FormControl sx={{ width: "50%" }}>
							<TextField
								select
								value={userID}
								label="Select User"
								onChange={(
									event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
								) => {
									setUserID(event.target.value);
								}}
								size="small"
								sx={{
									boxShadow: 2
								}}
							>
								<MenuItem value="all">
									<em>All</em>
								</MenuItem>
								{users?.map(user => (
									<MenuItem key={user.id} value={user.id}>
										{user.names}
									</MenuItem>
								))}
							</TextField>
						</FormControl>
					</Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							gap: 2,
							alignItems: "center",
							mt: { xs: 2, md: 0 },
							width: isMobile ? "100%" : "40%"
						}}
					>
						<Box
							sx={{
								display: isMobile ? "block" : "flex",
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
								renderInput={props => (
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
								display: isMobile ? "block" : "flex",
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
								renderInput={props => (
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
						width: "100%",
						typography: "body1",
						mt: "1.5rem"
					}}
				>
					<TabContext value={selectedTab}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<TabList
								onChange={handleTabChange}
								aria-label="lab API tabs example"
							>
								<Tab label="Sold Item" sx={{ fontSize: "1.5rem" }} value="1" />
								<Tab
									label="Daily Sales"
									sx={{ fontSize: "1.5rem" }}
									value="2"
								/>
							</TabList>
						</Box>
						<TabPanel
							value="1"
							sx={{
								boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
								width: "100%",
								p: { xs: 0, md: 4 }
							}}
						>
							<SoldItems
								data={salesSummary || []}
								isLoading={isLoading}
								totalAmountSoldAllCategories={totalAmountSoldAllCategories}
								totalAmountSoldForThisPeriodInThisCategory={
									totalAmountSoldForThisPeriodInThisCategory
								}
								selectedCategory={selectedCategory}
								benefitsForThisPeriodInThisCategory={
									benefitsForThisPeriodInThisCategory
								}
							/>
						</TabPanel>
						<TabPanel
							value="2"
							sx={{
								boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
								width: "100%",
								mt: { xs: 2 },
								p: { xs: 0, md: 4 }
							}}
						>
							<WorkersDailySales
								startDate={startDate}
								stopDate={stopDate}
								users={users}
								userID={userID}
							/>
						</TabPanel>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAuth(SalesByForm);
