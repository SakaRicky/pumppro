import { Avatar, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import React, { forwardRef } from "react";
import { FormattedMessage } from "react-intl";
import { User } from "types";

type WorkerInfoPageProp = {
	worker?: User;
};

const WorkerInfoPage = forwardRef(
	({ worker }: WorkerInfoPageProp, ref: any) => {
		const theme = useTheme();

		return (
			<Box
				ref={ref}
				sx={{
					psition: "relative",
					display: "flex",
					backgroundColor: theme.palette.background.alt,
					m: "5rem 0",
					p: 2,
					width: "80%",
					border: `5px solid ${theme.palette.primary[500]}`,
					overflowY: "auto"
				}}
			>
				<Box width="30%">
					{worker?.profile_picture ? (
						<img
							style={{
								padding: "2px",
								border: `1px solid ${theme.palette.grey[600]}`,
								objectFit: "cover",
								width: "100%"
							}}
							src={worker?.profile_picture}
							alt="profile"
						/>
					) : (
						<Avatar
							sx={{
								bgcolor: theme.palette.grey[600],
								width: "15rem",
								height: "15rem",
								padding: "2px",
								border: `1px solid ${theme.palette.grey[600]}`
							}}
							aria-label="recipe"
						>
							<Typography fontSize="3rem">
								{worker?.names[0].toUpperCase()}
							</Typography>
						</Avatar>
					)}
				</Box>
				<Box sx={{ flex: 1, p: "0 2rem" }}>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
						<Typography
							component="h2"
							fontSize="1.2rem"
							fontWeight="700"
							sx={{ display: "flex", alignItems: "center" }}
						>
							<Typography component="span" width="20%">
								<FormattedMessage id="user.info.names" defaultMessage="Names" />
							</Typography>
							<Box>
								{worker?.names}
								<Typography
									component="span"
									sx={{
										color: theme.palette.primary[300],
										mt: -1,
										fontSize: "0.9rem"
									}}
								>
									<Typography component="span"></Typography>
									{worker?.username}
								</Typography>
							</Box>
						</Typography>

						<hr
							style={{
								backgroundColor: theme.palette.neutral[400],
								height: 2,
								width: "70%",
								marginLeft: "20%"
							}}
						/>

						<Typography
							sx={{
								fontSize: "0.9rem",
								display: "flex",
								alignItems: "center"
							}}
						>
							<Typography component="span" width="20%">
								<FormattedMessage
									id="user.info.date_of_birth"
									defaultMessage="Date of Birth"
								/>
							</Typography>
							<Typography fontSize="1.2rem">
								{moment(worker?.date_of_birth).format("Do MMMM YYYY")}
							</Typography>
						</Typography>
						<hr
							style={{
								backgroundColor: theme.palette.neutral[400],
								height: 2,
								width: "70%",
								marginLeft: "20%"
							}}
						/>
						<Typography
							component="h2"
							fontSize="1.2rem"
							fontWeight="700"
							sx={{ display: "flex", alignItems: "center" }}
						>
							<Typography component="span" width="20%">
								<FormattedMessage
									id="user.info.phone"
									defaultMessage="Phone Number"
								/>
							</Typography>
							{worker?.phone}
						</Typography>

						<hr
							style={{
								backgroundColor: theme.palette.neutral[400],
								height: 2,
								width: "70%",
								marginLeft: "20%"
							}}
						/>
						<Typography
							component="h2"
							fontSize="1.2rem"
							fontWeight="700"
							sx={{ display: "flex", alignItems: "center" }}
						>
							<Typography component="span" width="20%">
								<FormattedMessage id="user.info.role" defaultMessage="Role" />
							</Typography>
							{worker?.role}
						</Typography>

						<hr
							style={{
								backgroundColor: theme.palette.neutral[400],
								height: 2,
								width: "70%",
								marginLeft: "20%"
							}}
						/>

						<Typography
							sx={{
								fontSize: "0.9rem",
								display: "flex",
								alignItems: "center"
							}}
						>
							<Typography component="span" width="20%">
								<FormattedMessage
									id="user.info.gender"
									defaultMessage="Gender"
								/>
							</Typography>
							<Typography fontSize="1.2rem">{worker?.gender}</Typography>
						</Typography>
						<hr
							style={{
								backgroundColor: theme.palette.neutral[400],
								height: 2,
								width: "70%",
								marginLeft: "20%"
							}}
						/>
						<Typography
							component="h2"
							fontSize="1.2rem"
							fontWeight="700"
							sx={{ display: "flex", alignItems: "center" }}
						>
							<Typography component="span" width="20%">
								<FormattedMessage
									id="user.info.salary"
									defaultMessage="Salary"
								/>
							</Typography>
							{worker?.salary} XAF
						</Typography>

						<hr
							style={{
								backgroundColor: theme.palette.neutral[400],
								height: 2,
								width: "70%",
								marginLeft: "20%"
							}}
						/>

						<Typography
							sx={{
								fontSize: "0.9rem",
								display: "flex",
								alignItems: "center"
							}}
						>
							<Typography component="span" width="20%">
								<FormattedMessage
									id="user.info.cni_number"
									defaultMessage="CNI Number"
								/>
							</Typography>
							<Typography fontSize="1.2rem">{worker?.CNI_number}</Typography>
						</Typography>
						<hr
							style={{
								backgroundColor: theme.palette.neutral[400],
								height: 2,
								width: "70%",
								marginLeft: "20%"
							}}
						/>
						<Typography
							component="h2"
							fontSize="1.2rem"
							fontWeight="700"
							sx={{ display: "flex", alignItems: "center" }}
						>
							<Typography component="span" width="20%">
								<FormattedMessage
									id="user.info.godfather_phone"
									defaultMessage="Godfather Phone Number"
								/>
							</Typography>
							{worker?.godfather_phone}
						</Typography>

						<hr
							style={{
								backgroundColor: theme.palette.neutral[400],
								height: 2,
								width: "70%",
								marginLeft: "20%"
							}}
						/>

						<Typography
							sx={{
								fontSize: "0.9rem",
								display: "flex",
								alignItems: "center"
							}}
						>
							<Typography component="span" width="20%">
								<FormattedMessage
									id="user.info.localisation"
									defaultMessage="Localisation"
								/>
							</Typography>
							<Typography fontSize="1.2rem">{worker?.localisation}</Typography>
						</Typography>
					</Box>
				</Box>
			</Box>
		);
	}
);

export default WorkerInfoPage;
