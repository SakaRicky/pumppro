import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import TankGauge from "features/fuel/components/TankGauge";
import { Fuel, FuelCategories } from "types";
import { RefillFuelForm } from "features/dashboard/components/RefillFuelForm";
import MyDataGrid from "components/MyDataGrid";
import { fuelTableColumns } from "features/fuel/components/FuelTableColumns";
import { GridSelectionModel } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useMutation } from "@tanstack/react-query";
import { deleteFuel } from "services/fuel";
import { useNotify } from "hooks/useNotify";
import FuelForm from "features/fuel/components/FuelForm";
import withAuth from "hoc/withAuth";
import { useFuels } from "features/fuel/components/hooks/useFuels";

export const getFuelFromFuels = (
	fuels: Fuel[] | undefined
): Fuel | undefined => {
	const fuel = fuels?.find(f => f.name === "Fuel");
	return fuel;
};

export const getGasoilFromFuels = (
	fuels: Fuel[] | undefined
): Fuel | undefined => {
	const gasoil = fuels?.find(f => f.name === "Gasoil");
	return gasoil;
};

export const getPetrolFromFuels = (
	fuels: Fuel[] | undefined
): Fuel | undefined => {
	const petrol = fuels?.find(f => f.name === "Petrol");
	return petrol;
};

export const getGazFromFuels = (
	fuels: Fuel[] | undefined
): Fuel | undefined => {
	const gaz = fuels?.find(f => f.name === "Gaz Bottle");
	return gaz;
};

const Fuels = () => {
	const theme = useTheme();
	// const { fuels, fetchFuels, fuel, gasoil, petrol, gaz, isLoading } =
	// 	useFuels();

	const {
		data: fuels,
		isLoading: isLoading,
		error: fuelsError,
		refetch: refetchFuels
	} = useFuels();

	const [selectedFuelIDs, setSelectedFuelIDs] = useState<number[]>([]);

	const fuelToEdit =
		selectedFuelIDs.length === 1
			? fuels?.find(fuel => fuel.id === selectedFuelIDs[0])
			: undefined;

	const [addFuelModal, setAddFuelModal] = useState(false);

	const notify = useNotify();

	const handleSelectedFuel = (fuelIDs: GridSelectionModel) => {
		setSelectedFuelIDs(fuelIDs.map(id => Number(id)));
	};

	const deleteFuelMutation = useMutation({
		mutationFn: deleteFuel,
		onSuccess: (data, variables) => {
			notify("Save Success", "Product deleted successfully", "success");
			refetchFuels();
		}
	});

	const handleDeleteFuel = async () => {
		try {
			await deleteFuelMutation.mutateAsync(selectedFuelIDs);
			refetchFuels();
		} catch (error: any) {
			notify("Login Error", error.message, "error");
		}
	};

	const handleCloseAddFuelModal = () => {
		setAddFuelModal(false);
		refetchFuels();
	};

	const fuel = getFuelFromFuels(fuels);
	const gasoil = getGasoilFromFuels(fuels);
	const petrol = getPetrolFromFuels(fuels);

	return (
		<Box sx={{ m: "1rem" }}>
			<Modal
				open={addFuelModal}
				onClose={handleCloseAddFuelModal}
				aria-labelledby="Worker Form"
				aria-describedby="Form used to add or edit worker"
				sx={{
					display: "flex",
					justifyContent: "center"
				}}
			>
				<>
					<FuelForm
						fuel={fuelToEdit}
						handleCloseModal={handleCloseAddFuelModal}
					/>
				</>
			</Modal>
			<Box sx={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
				<TankGauge
					level={fuel?.quantity_theory || 0}
					capacity={fuel?.tank.capacity || 1}
					fuel={FuelCategories.FUEL}
					label="Fuel 40000L"
				/>
				<TankGauge
					level={gasoil?.quantity_theory || 0}
					capacity={gasoil?.tank.capacity || 1}
					fuel={FuelCategories.GASOIL}
					label="Gasoline 15000L"
				/>
				<TankGauge
					level={petrol?.quantity_theory || 0}
					capacity={petrol?.tank.capacity || 1}
					fuel={FuelCategories.PETROL}
					label="Petrol 15000L"
				/>
			</Box>
			<Box
				sx={{
					m: "1rem 0",
					p: "1rem",
					boxShadow:
						"rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset"
				}}
			>
				<Typography variant="h2" p={1} textAlign="center">
					<FormattedMessage
						id="fuel_state"
						defaultMessage="Update Fuel States"
					/>
				</Typography>
				<Typography>
					<FormattedMessage
						id="amount_deleivered"
						defaultMessage="Amount delivered"
					/>
				</Typography>
				<Box m="1rem 0">
					{fuels && <RefillFuelForm fuels={fuels} fetchFuels={refetchFuels} />}
				</Box>
			</Box>

			<Box>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Box sx={{ display: "flex", gap: 1 }}>
						{fuelToEdit ? (
							<Button
								endIcon={<EditIcon />}
								sx={{
									backgroundColor: theme.palette.secondary.main,
									color: theme.palette.grey[50],

									"&:hover": {
										backgroundColor: theme.palette.secondary.dark
									}
								}}
								onClick={() => setAddFuelModal(true)}
							>
								<FormattedMessage id="edit_fuel" defaultMessage="Edit Fuel" />
							</Button>
						) : (
							<Button
								endIcon={<AddIcon />}
								sx={{
									backgroundColor: theme.palette.secondary.main,
									color: theme.palette.grey[50],

									"&:hover": {
										backgroundColor: theme.palette.secondary.dark
									}
								}}
								onClick={() => setAddFuelModal(true)}
							>
								<FormattedMessage id="add_fuel" defaultMessage="Add Fuel" />
							</Button>
						)}
						{selectedFuelIDs?.length > 0 && (
							<LoadingButton
								onClick={handleDeleteFuel}
								loading={deleteFuelMutation.isLoading}
								endIcon={<DeleteIcon />}
								loadingPosition="end"
								sx={{
									backgroundColor: theme.palette.error.main,
									color: theme.palette.grey[50],

									"&:hover": {
										backgroundColor: theme.palette.error.dark
									}
								}}
							>
								<FormattedMessage
									id="delete_fuel"
									defaultMessage="Delete Fuel"
								/>
							</LoadingButton>
						)}
					</Box>
				</Box>
				{fuels && (
					<MyDataGrid
						handleSelected={handleSelectedFuel}
						columns={fuelTableColumns}
						isLoading={isLoading}
						rows={fuels}
						searchInput
						checkboxSelection
					/>
				)}
			</Box>
		</Box>
	);
};

export default withAuth(Fuels);
