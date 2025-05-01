import React from "react";
import { ChevronRightOutlined } from "@mui/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
  useTheme,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { FormattedMessage } from "react-intl";

interface SidebarNavItemProps {
  text: string;
  url: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  translationID: string;
  translationDefaultMessage: string;
}
const SidebarNavItem = ({
  text,
  icon,
  translationID,
  translationDefaultMessage,
  url,
}: SidebarNavItemProps) => {
  const theme = useTheme();

  const { pathname } = useLocation();
  const presentRouteName = pathname.substring(1);

  const navLinkStyle = {
    backgroundColor: "transparent",
    color: theme.palette.text.secondary,
  };

  const activeNavLinkStyle = {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    borderRadius: "10px",
  };

  const lcText = text.toLowerCase();

  const Icon = icon;

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
                  : theme.palette.text.secondary,
            }}
          >
            <Icon />
          </ListItemIcon>
          <ListItemText sx={{ margin: "0.25rem 0" }}>
            <FormattedMessage
              id={translationID}
              defaultMessage={translationDefaultMessage}
            />
          </ListItemText>
          {pathname.substring(1) === lcText && (
            <ChevronRightOutlined sx={{ ml: "auto" }} />
          )}
        </ListItemButton>
      </NavLink>
    </ListItem>
  );
};

export default SidebarNavItem;
