// import { GridColDef } from "@mui/x-data-grid";

// export const fuelTableColumns: GridColDef[] = [
//   {
//     field: "name",
//     headerName: "Name",
//     width: 200,
//     headerAlign: "center",
//     align: "center",
//   },
//   {
//     field: "description",
//     headerName: "Description",
//     width: 200,
//     headerAlign: "center",
//     align: "center",
//   },
//   {
//     field: "price",
//     headerName: "Price",
//     headerAlign: "center",
//     align: "center",
//   },
//   {
//     field: "quantity_actual",
//     headerName: "Phisical Quantity",
//     headerAlign: "center",
//     align: "center",
//     width: 200,
//   },
//   {
//     field: "quantity_theory",
//     headerName: "Theory Quantity",
//     headerAlign: "center",
//     align: "center",
//     width: 200,
//   },
//   {
//     field: "tank",
//     headerName: "Tank",
//     headerAlign: "center",
//     align: "center",
//     renderCell: (params) => {
//       // Gaz don't have a value for tank
//       if (params.value) {
//         return params.value.name || "";
//       } else {
//         return "";
//       }
//     },
//   },
//   {
//     field: "id",
//     headerName: "Action",
//     headerAlign: "center",
//     align: "center",
//     renderCell: (params) => {
//       return <Box sx={{ display: "flex", justifyContent: "flex-end", p: "1rem 0.5rem" }}>
//           <Box sx={{ display: "flex", gap: 1 }}>
//             {fuelToEdit ? (
//               <Button
//                 endIcon={<EditIcon />}
//                 sx={{
//                   backgroundColor: theme.palette.secondary.main,
//                   color: theme.palette.grey[50],

//                   "&:hover": {
//                     backgroundColor: theme.palette.secondary.dark,
//                   },
//                 }}
//                 onClick={() => setAddFuelModal(true)}
//               >
//                 <FormattedMessage id="edit_fuel" defaultMessage="Edit Fuel" />
//               </Button>
//             ) : (
//               <Button
//                 endIcon={<AddIcon />}
//                 sx={{
//                   backgroundColor: theme.palette.secondary.main,
//                   color: theme.palette.grey[50],

//                   "&:hover": {
//                     backgroundColor: theme.palette.secondary.dark,
//                   },
//                 }}
//                 onClick={() => setAddFuelModal(true)}
//               >
//                 <FormattedMessage id="add_fuel" defaultMessage="Add Fuel" />
//               </Button>
//             )}
//             {selectedFuelIDs?.length > 0 && (
//               <LoadingButton
//                 onClick={handleDeleteFuel}
//                 loading={deleteFuelMutation.isLoading}
//                 endIcon={<DeleteIcon />}
//                 loadingPosition="end"
//                 sx={{
//                   backgroundColor: theme.palette.error.main,
//                   color: theme.palette.grey[50],

//                   "&:hover": {
//                     backgroundColor: theme.palette.error.dark,
//                   },
//                 }}
//               >
//                 <FormattedMessage
//                   id="delete_fuel"
//                   defaultMessage="Delete Fuel"
//                 />
//               </LoadingButton>
//             )}
//           </Box>
//         </Box>
//     },
//   },
// ];
