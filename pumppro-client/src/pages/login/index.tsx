import React from "react";
import {
	Alert,
	AlertTitle,
	Box,
	Snackbar,
	Typography,
	useTheme
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import LoginForm from "features/login/components/LoginForm";
import { useStateValue } from "state";
import { LocalGasStation } from "@mui/icons-material";

const Login = () => {
	const theme = useTheme();
	const [state, dispatch] = useStateValue();

	return (
		<Box
			sx={{
				psotion: "relative",
				height: "100%"
			}}
		>
			<Snackbar
				open={state.alert?.show}
				autoHideDuration={6000}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert severity={state.alert?.type}>
					<AlertTitle>{state.alert?.title}</AlertTitle>
					{state.alert?.message}
				</Alert>
			</Snackbar>
			<Box
				sx={{
					position: "absolute",
					top: "40%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center"
				}}
			>
				<Typography component="h1" sx={{ mb: "2rem", textAlign: "center" }}>
					<Box sx={{ display: "flex", alignItems: "flex-end" }}>
						<Typography sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
							<FormattedMessage
								id="login.welcome"
								defaultMessage="Welcome to PumpPro"
							/>
						</Typography>
						<LocalGasStation
							sx={{
								width: { xs: "3rem", md: "5rem" },
								height: { xs: "3rem", md: "5rem" }
							}}
						/>
					</Box>
				</Typography>
				<Box
					width={{ xs: "90%", sm: "60%", md: "40%" }}
					sx={{
						borderRadius: 4,
						border: `1px solid ${theme.palette.primary.main}`,
						pt: "2rem"
					}}
				>
					<Typography component="h2" fontSize="50px" textAlign="center">
						<FormattedMessage id="login" defaultMessage="Login" />
					</Typography>

					<LoginForm />
				</Box>
			</Box>
		</Box>
	);
};

export default Login;
