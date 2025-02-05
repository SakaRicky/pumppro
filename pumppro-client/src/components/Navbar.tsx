import React, { useState } from "react";
import {
	LightModeOutlined,
	DarkModeOutlined,
	Menu as MenuIcon,
	ArrowDropDownOutlined
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import {
	setDefaultLanguage,
	setLogedUser,
	toggleMode,
	useStateValue
} from "state";
import {
	AppBar,
	Badge,
	Box,
	Button,
	FormControl,
	IconButton,
	Menu,
	MenuItem,
	Popover,
	Select,
	SelectChangeEvent,
	Toolbar,
	Typography,
	useTheme
} from "@mui/material";
import profilePicture from "assets/images/default_image.png";
import { useNavigate } from "react-router-dom";
import storage from "utils/storage";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationMessages } from "features/message";
import { MessageNotification } from "types";
import { MessageContent } from "./MessageContent";
import { updateMessage } from "services/messages";
import { useMessages } from "features/message/hook/useMessages";

interface NavbarProps {
	isSidebarOpen: boolean;
	isNonMobile: boolean;
	setIsSidebarOpen: (isSidebarOpen: boolean) => void;
}

const Navbar = ({
	isSidebarOpen,
	setIsSidebarOpen,
	isNonMobile
}: NavbarProps) => {
	const theme = useTheme();
	const [state, dispatch] = useStateValue();

	const {
		data: messages,
		isLoading,
		error,
		refetch
	} = useMessages(state.logedUser?.id);

	const [selectedMessage, setSelectedMessage] =
		useState<MessageNotification | null>(null);

	const navigate = useNavigate();

	const [userMenuAnchorEl, setUserMenuAnchorEl] =
		React.useState<null | HTMLElement>(null);
	const isOpen = Boolean(userMenuAnchorEl);
	const openUserMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
		setUserMenuAnchorEl(event.currentTarget);
	const handleClose = () => setUserMenuAnchorEl(null);

	const handleLogout = () => {
		dispatch(setLogedUser(null));
		storage.clearToken();
		setUserMenuAnchorEl(null);
		navigate("/login");
	};

	const [messageAnchorEl, setMessageAnchorEl] =
		React.useState<null | HTMLElement>(null);
	const isMessagesOpen = Boolean(messageAnchorEl);
	const openMessagesMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
		setMessageAnchorEl(event.currentTarget);
	const handleCloseMessages = () => {
		setMessageAnchorEl(null);
		setSelectedMessage(null);
	};

	const numberOfUnreadMessages = messages?.filter(m => !m.read).length;

	// Function to handle click on a message
	function handleMessageClick(message: MessageNotification) {
		setSelectedMessage(message);
		markMessageAsRead(message.id);
	}

	// Function to handle click on a message
	function closeOpenedMessage() {
		setSelectedMessage(null);
	}

	// Function to mark a message as read
	const markMessageAsRead = async (messageId: number) => {
		// Make API request to mark message as read
		// Update state to mark message as read
		await updateMessage(messageId);
		refetch();
	};

	return (
		<AppBar
			sx={{
				position: "fixed",
				top: 0,
				background: theme.palette.background.default,
				boxShadow: 2
			}}
		>
			{state.logedUser && (
				<Toolbar sx={{ justifyContent: "space-between" }}>
					{/* LEFT SIDE */}
					<FlexBetween>
						<IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
							<MenuIcon />
						</IconButton>
					</FlexBetween>

					{/* RIGHT SIDE */}
					<FlexBetween gap="1.5rem">
						<IconButton onClick={() => dispatch(toggleMode())}>
							{theme.palette.mode === "dark" ? (
								<DarkModeOutlined sx={{ fontSize: "25px" }} />
							) : (
								<LightModeOutlined sx={{ fontSize: "25px" }} />
							)}
						</IconButton>
						<IconButton
							onClick={openMessagesMenu}
							size="large"
							aria-label="show some new notifications"
							color="inherit"
						>
							<Badge badgeContent={numberOfUnreadMessages} color="error">
								<NotificationsIcon
									sx={{
										color:
											theme.palette.mode === "dark"
												? theme.palette.grey[100]
												: theme.palette.grey[500]
									}}
								/>
							</Badge>
						</IconButton>

						<Popover
							open={isMessagesOpen}
							anchorEl={messageAnchorEl}
							onClose={handleCloseMessages}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right"
							}}
							sx={{
								mt: "1rem",
								padding: "1.5rem",
								overflowY: "auto",

								".css-1h03rsv-MuiPaper-root-MuiPopover-paper": {
									borderRadius: "1rem"
								}
							}}
						>
							<Box
								sx={{
									width: { xs: "80vw", md: "30vw" },
									height: { xs: "80vh", md: "50vh" },
									margin: "0.75rem"
								}}
							>
								{selectedMessage ? (
									<MessageContent
										message={selectedMessage}
										closeOpenedMessage={closeOpenedMessage}
									/>
								) : (
									<NotificationMessages
										messages={messages}
										handleMessageClick={handleMessageClick}
									/>
								)}
							</Box>
						</Popover>

						<FlexBetween>
							<Button
								onClick={openUserMenu}
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									textTransform: "none",
									gap: "1rem"
								}}
							>
								<Box
									component="img"
									alt="profile"
									src={
										state.logedUser?.profilePicture
											? state.logedUser.profilePicture
											: profilePicture
									}
									height="32px"
									width="32px"
									borderRadius="50%"
									sx={{
										objectFit: "cover"
									}}
								/>
								<Box textAlign="left">
									<Typography
										fontWeight="bold"
										fontSize="0.85rem"
										sx={{ color: theme.palette.primary.main }}
									>
										{state.logedUser.username}
									</Typography>
								</Box>

								<ArrowDropDownOutlined
									sx={{ color: theme.palette.primary.main, fontSize: "25px" }}
								/>
							</Button>
							<Menu
								anchorEl={userMenuAnchorEl}
								open={isOpen}
								onClose={handleClose}
								anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
							>
								<MenuItem onClick={handleLogout}>Logout</MenuItem>
							</Menu>
							<FormControl
								sx={{
									m: 1,
									minWidth: 120,
									display: { xs: "none", md: "block" }
								}}
								size="small"
							>
								<Select
									labelId="demo-select-small"
									value={state.language}
									sx={{
										borderRadius: 0
									}}
									onChange={(event: SelectChangeEvent) => {
										dispatch(
											setDefaultLanguage(event.target.value as "en" | "fr")
										);
									}}
								>
									<MenuItem value="en">English</MenuItem>
									<MenuItem value="fr">Francais</MenuItem>
								</Select>
							</FormControl>
						</FlexBetween>
					</FlexBetween>
				</Toolbar>
			)}
		</AppBar>
	);
};

export default Navbar;
