import React, { useState } from "react";
import {
	alpha,
	Avatar,
	Box,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
	useTheme
} from "@mui/material";
import { User } from "types";
import { Delete, Edit } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FormattedMessage } from "react-intl";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface WorkerCardProp {
	worker: User;
	handleEditWorker: (worker: User) => void;
	handleDeleteWorker: (workerId: string) => void;
	handleViewWorkerInfo: (worker: User) => void;
	handleViewWorkerSalary: (worker: User) => void;
}

const WorkerCard = ({
	worker,
	handleEditWorker,
	handleDeleteWorker,
	handleViewWorkerInfo,
	handleViewWorkerSalary
}: WorkerCardProp) => {
	const theme = useTheme();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isOpen = Boolean(anchorEl);
	const handleDotsClick = (event: React.MouseEvent<HTMLButtonElement>) =>
		setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);

	const handleEdit = () => {
		handleEditWorker(worker);
	};

	const handleDelete = () => {
		handleDeleteWorker(worker.id);
	};

	return (
		<Box
			sx={{
				boxShadow:
					"rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;",
				backgroundColor: alpha(blue[500], 0.2),
				pt: 2,
				borderRadius: 2,
				maxWidth: "20rem",
				cursor: "pointer",
				"&:hover": {
					boxShadow:
						"rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;"
				},
				position: "relative"
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					gap: -2,
					mr: 2,
					mb: 2,
					position: "absolute",
					top: 4,
					right: 4
				}}
			>
				<IconButton onClick={handleDotsClick}>
					<MoreVertIcon />
				</IconButton>
			</Box>
			<Menu
				anchorEl={anchorEl}
				open={isOpen}
				onClose={handleClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<MenuItem onClick={() => handleViewWorkerSalary(worker)}>
					<ListItemIcon>
						<AttachMoneyIcon fontSize="medium" />
					</ListItemIcon>
					<FormattedMessage
						id="worker.card.menu.salary"
						defaultMessage="View Salary"
					/>
				</MenuItem>
				<MenuItem onClick={handleEdit}>
					<ListItemIcon>
						<Edit fontSize="medium" />
					</ListItemIcon>
					<FormattedMessage
						id="worker.card.menu.edit"
						defaultMessage="Edit Worker"
					/>
				</MenuItem>
				<MenuItem onClick={handleDelete}>
					<ListItemIcon>
						<Delete fontSize="medium" />
					</ListItemIcon>
					<FormattedMessage
						id="worker.card.menu.delete"
						defaultMessage="Delete Worker"
					/>
				</MenuItem>
			</Menu>
			<Box onClick={() => handleViewWorkerInfo(worker)} pt="1rem">
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Box width="7rem" height="7rem" mb="1.5rem">
						{worker.profile_picture ? (
							<img
								style={{
									borderRadius: "50%",
									marginTop: "1rem",
									padding: "2px",
									border: `1px solid ${theme.palette.grey[600]}`,
									objectFit: "cover",
									width: "100%",
									height: "100%"
								}}
								src={worker.profile_picture}
								alt="profile"
							/>
						) : (
							<Avatar
								sx={{
									bgcolor: theme.palette.grey[600],
									width: "100%",
									height: "100%",
									padding: "2px",
									border: `1px solid ${theme.palette.grey[600]}`
								}}
								aria-label="recipe"
							>
								<Typography fontSize="3rem">
									{worker.names[0].toUpperCase()}
								</Typography>
							</Avatar>
						)}
					</Box>
				</Box>
				<Box textAlign="center" display="flex" flexDirection="column">
					<Typography
						fontSize="1.2rem"
						fontWeight={700}
						color={theme.palette.secondary[200]}
					>
						{worker.names}
					</Typography>
					<Typography color={theme.palette.neutral[400]}>
						{worker.username}
					</Typography>
				</Box>
				<Box m="1rem 0" textAlign="center">
					<span>Salary: </span>
					<Typography
						display="inline"
						color={theme.palette.success.light}
						fontWeight={700}
					>
						{worker.salary.toString()} FCFA
					</Typography>
				</Box>
				<Box sx={{ borderTop: `1px solid ${theme.palette.grey[400]}`, p: 1 }}>
					<Typography textAlign="center">{worker.role}</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default WorkerCard;
