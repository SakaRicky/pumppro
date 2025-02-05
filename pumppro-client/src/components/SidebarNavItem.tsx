import React from "react";
import { ChevronRightOutlined } from "@mui/icons-material";
import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	useTheme
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarNavItemProps {
	text: string;
	url: string;
	icon: JSX.Element;
	translate: JSX.Element;
}
const SidebarNavItem = ({
	text,
	icon,
	translate,
	url
}: SidebarNavItemProps) => {
	const theme = useTheme();

	const { pathname } = useLocation();
	const presentRouteName = pathname.substring(1);

	const navLinkStyle = {
		backgroundColor: "transparent",
		color: theme.palette.text.secondary
	};

	const activeNavLinkStyle = {
		backgroundColor: theme.palette.background.default,
		color: theme.palette.primary.main,
		borderRadius: "10px"
	};

	const lcText = text.toLowerCase();

	return (
		<ListItem disablePadding>
			<NavLink
				to={`/${url}`}
				style={({ isActive }) => (isActive ? activeNavLinkStyle : navLinkStyle)}
			>
				<ListItemButton>
					<ListItemIcon
						sx={{
							mr: "-1.5rem",
							color:
								presentRouteName === lcText
									? theme.palette.primary.main
									: theme.palette.text.secondary
						}}
					>
						{icon}
					</ListItemIcon>
					<ListItemText sx={{ margin: "0.25rem 0" }}>{translate}</ListItemText>
					{pathname.substring(1) === lcText && (
						<ChevronRightOutlined sx={{ ml: "auto" }} />
					)}
				</ListItemButton>
			</NavLink>
		</ListItem>
	);
};

export default SidebarNavItem;
