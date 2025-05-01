import React from "react";
import {
  Box,
  Drawer,
  Typography,
  useTheme,
  IconButton,
  List,
} from "@mui/material";
import { LogedUser, Role } from "types";
import FlexBetween from "./FlexBetween";
import {
  ChevronLeft,
  Home,
  LocalGasStation,
  ReceiptLong,
  Today,
  TrendingUp,
} from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";
import SidebarNavItem from "./SidebarNavItem";
import { blue } from "@mui/material/colors";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import { useStateValue } from "state";

const allNavItems = [
  {
    text: "Dashboard",
    url: "dashboard",
    icon: Home,
    adminOnly: true,
    translationID: "dashboard",
    translationDefaultMessage: "Dashboard",
  },
  {
    text: "Products",
    url: "products",
    icon: InventoryIcon,
    adminOnly: false,
    translationID: "products",
    translationDefaultMessage: "Products",
  },

  {
    text: "Shop",
    url: "shop",
    icon: ShoppingBagIcon,
    adminOnly: false,
    translationID: "shop",
    translationDefaultMessage: "Shop",
  },

  {
    text: "Sales",
    url: "sales",
    icon: ReceiptLong,
    adminOnly: false,
    translationID: "sales",
    translationDefaultMessage: "Sales",
  },
  {
    text: "Sale Form",
    url: "salesform",
    icon: Today,
    adminOnly: true,
    translationID: "salesform",
    translationDefaultMessage: "Sale Form",
  },

  {
    text: "Fuels",
    url: "fuels",
    icon: InvertColorsIcon,
    adminOnly: true,
    translationID: "fuels",
    translationDefaultMessage: "Fuels",
  },
  {
    text: "Perfomance",
    url: "perfomances",
    icon: TrendingUp,
    adminOnly: true,
    translationID: "perfomance",
    translationDefaultMessage: "Perfomance",
  },
  {
    text: "Workers",
    url: "workers",
    icon: GroupsIcon,
    adminOnly: true,
    translationID: "workers",
    translationDefaultMessage: "Workers",
  },
];

export const isUserAdmin = (logedUser: LogedUser | null) => {
  return logedUser && logedUser.role === Role.ADMIN;
};

interface SidebarProp {
  isSidebarOpen: boolean;
  drawerWidth: string;
  isNonMobile: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
}
const Sidebar = ({
  isSidebarOpen,
  drawerWidth,
  isNonMobile,
  setIsSidebarOpen,
}: SidebarProp) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [state, dispatch] = useStateValue();
  const theme = useTheme();

  // hide admin nav items for non admin users
  const navItems = allNavItems.filter(
    (i) => !i.adminOnly || isUserAdmin(state.logedUser)
  );

  return (
    <Box component="nav" sx={{ boxShadow: 3 }}>
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            height: "100%",

            "& .MuiDrawer-paper": {
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box m="1.5rem 2rem 2rem 3rem">
            <FlexBetween>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="0.5rem"
              >
                <Box
                  sx={{
                    color: blue[500],
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography variant="h3" fontWeight="bold">
                    PrumPro
                  </Typography>
                  <LocalGasStation sx={{ width: "2rem", height: "2rem" }} />
                </Box>
              </Box>
              <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <ChevronLeft />
              </IconButton>
            </FlexBetween>
          </Box>
          <List
            sx={{ ml: 4, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {navItems.map(
              ({
                text,
                icon,
                translationID,
                translationDefaultMessage,
                url,
              }) => {
                return (
                  <SidebarNavItem
                    key={url}
                    url={url}
                    text={text}
                    icon={icon}
                    translationID={translationID}
                    translationDefaultMessage={translationDefaultMessage}
                  />
                );
              }
            )}
          </List>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
