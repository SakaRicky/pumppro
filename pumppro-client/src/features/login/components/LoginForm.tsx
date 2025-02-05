import React, { useState } from "react";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Box,
	FormControl,
	IconButton,
	Input,
	InputAdornment,
	TextField,
	Typography,
	useTheme
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormattedMessage } from "react-intl";
import { loginUser } from "services/auth";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { AuthError } from "errors/authError";
import { useNotify } from "hooks/useNotify";
import storage from "utils/storage";

const LoginForm = () => {
	const theme = useTheme();

	const navigate = useNavigate();

	const notify = useNotify();

	const [loading, setLoading] = React.useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword(show => !show);

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};

	const loginFormValidationSchema = z.object({
		username: z.string().min(1, { message: "username is required" }),
		password: z
			.string()
			.min(5, { message: "password must be atleast 5 characters" })
	});

	// extracting the type
	type LoginForm = z.infer<typeof loginFormValidationSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginForm>({
		resolver: zodResolver(loginFormValidationSchema)
	});

	const onSubmit: SubmitHandler<LoginForm> = async data => {
		setLoading(true);
		try {
			const loggedUser = await loginUser(data);

			notify("Login Success", "You are authenticated", "success");
			if (!!loggedUser) {
				storage.setToken(loggedUser.token);
			}
			setLoading(false);
			if (loggedUser.role === "ADMIN") {
				navigate("/dashboard");
			} else {
				navigate("/products");
			}
		} catch (error) {
			if (error instanceof AuthError) {
				notify("Login Error", error.message, "error");
			}
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormControl
				variant="standard"
				sx={{
					width: "60%",
					m: "2rem auto",
					display: "flex",
					flexDirection: "column",
					gap: 4,
					justifyContent: "center",
					pb: "2rem"
				}}
			>
				<Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "flex-end"
						}}
					>
						<AccountCircle
							sx={{ color: "action.active", fontSize: 25, mr: 1, my: 0.5 }}
						/>
						<TextField
							id="input-with-sx"
							label="username"
							variant="standard"
							fullWidth
							{...register("username")}
						/>
					</Box>

					{errors.username && (
						<Typography color={theme.palette.error.main}>
							<FormattedMessage
								id="login.error.username"
								defaultMessage={errors.username.message}
							/>
						</Typography>
					)}
				</Box>
				<Box>
					<Box sx={{ display: "flex", gap: 1 }}>
						<LockOpenIcon sx={{ fontSize: 25 }} />
						<Input
							id="standard-adornment-password"
							type={showPassword ? "text" : "password"}
							placeholder="password"
							fullWidth
							{...register("password")}
							endAdornment={
								<InputAdornment position="start">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</Box>
					{errors.password && (
						<Typography color={theme.palette.error.main}>
							<FormattedMessage
								id="login.error.password"
								defaultMessage={errors.password.message}
							/>
						</Typography>
					)}
				</Box>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<LoadingButton
						type="submit"
						loading={loading}
						loadingPosition="end"
						endIcon={<SendIcon />}
						variant="contained"
						sx={{
							color: "#fff",
							background: theme.palette.primary.main,
							"&:hover": {
								background: theme.palette.primary.dark
							}
						}}
					>
						<span>Signin</span>
					</LoadingButton>
				</Box>
			</FormControl>
		</form>
	);
};

export default LoginForm;
