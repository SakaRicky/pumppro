import React from "react";
import { Box, useTheme } from "@mui/material";
import withAuth from "hoc/withAuth";
import { FormattedMessage } from "react-intl";
import { DashboardGauges } from "features/dashboard/gauges";

const Dashboard = () => {
	const theme = useTheme();

	return (
		<Box sx={{ p: "2rem", border: "2px solid red" }}>
			<FormattedMessage
				id="dashboard"
				defaultMessage="Dashboard"
				description="Main title for the Dashboard page"
			/>
			<DashboardGauges />
		</Box>
	);
};

export default withAuth(Dashboard);
