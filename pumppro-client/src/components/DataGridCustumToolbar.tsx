import { Search } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
} from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import React from "react";
import FlexBetween from "./FlexBetween";

type DataGridCustomToolbarProp = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  disableSearch: boolean;
};

const DataGridCustomToolbar = ({
  search,
  setSearch,
  disableSearch,
}: DataGridCustomToolbarProp) => {
  const theme = useTheme();
  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        <FlexBetween>
          <GridToolbarColumnsButton
            sx={{
              "&:hover": {
                backgroundColor: alpha(theme.palette.secondary[600], 0.8),
              },
            }}
          />
          <GridToolbarDensitySelector
            sx={{
              "&:hover": {
                backgroundColor: alpha(theme.palette.secondary[600], 0.8),
              },
            }}
          />
          <GridToolbarExport
            sx={{
              "&:hover": {
                backgroundColor: alpha(theme.palette.secondary[600], 0.8),
              },
            }}
          />
        </FlexBetween>
        <TextField
          label="Search..."
          variant="standard"
          disabled={disableSearch}
          sx={{
            mb: "0.5rem",
            width: "15rem",
            display: disableSearch ? "none" : "block",
          }}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FlexBetween>
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;
