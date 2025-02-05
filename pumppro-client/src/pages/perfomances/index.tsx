import React, { ChangeEvent, useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
	FormControl,
	MenuItem,
	TextField,
	Typography,
	useTheme
} from "@mui/material";
import { Box } from "@mui/system";
import { useDailySales } from "features/sales/hooks/useSale";
import { FormattedMessage } from "react-intl";
import { getUsers } from "services/users";
import { DailySale, User } from "types";

const getQuantityOfSuperSold = (dailySale: DailySale) => {
	const pumpOneStopIndex = dailySale.stop_count_fuel_1 || 0;
	const pumpOneStartIndex = dailySale.start_count_fuel_1 || 0;

	const pumpTwoStopIndex = dailySale.stop_count_fuel_2 || 0;
	const pumpTwoStartIndex = dailySale.start_count_fuel_2 || 0;

	const pumpThreeStopIndex = dailySale.stop_count_fuel_3 || 0;
	const pumpThreeStartIndex = dailySale.start_count_fuel_3 || 0;

	const pumpOneFuelQuantity = pumpOneStopIndex - pumpOneStartIndex;
	const pumpTwoFuelQuantity = pumpTwoStopIndex - pumpTwoStartIndex;
	const pumpThreeFuelQuantity = pumpThreeStopIndex - pumpThreeStartIndex;

	return pumpOneFuelQuantity + pumpTwoFuelQuantity + pumpThreeFuelQuantity;
};

const getQuantityOfGasoilSold = (dailySale: DailySale) => {
	const pumpOneStopIndex = dailySale.stop_count_gasoil_1 || 0;
	const pumpOneStartIndex = dailySale.start_count_gasoil_1 || 0;

	const pumpTwoStopIndex = dailySale.stop_count_gasoil_2 || 0;
	const pumpTwoStartIndex = dailySale.stop_count_gasoil_2 || 0;

	const pumpThreeStopIndex = dailySale.stop_count_gasoil_3 || 0;
	const pumpThreeStartIndex = dailySale.start_count_gasoil_3 || 0;

	const pumpOneGasoilQuantity = pumpOneStopIndex - pumpOneStartIndex;
	const pumpTwoGasoilQuantity = pumpTwoStopIndex - pumpTwoStartIndex;
	const pumpThreeGasoilQuantity = pumpThreeStopIndex - pumpThreeStartIndex;

	return (
		pumpOneGasoilQuantity + pumpTwoGasoilQuantity + pumpThreeGasoilQuantity
	);
};

const getQuantityOfGasBottleSold = (dailySale: DailySale) => {
	const pumpOneStopIndex = dailySale.stop_count_gaz || 0;
	const pumpOneStartIndex = dailySale.start_count_gaz || 0;

	return pumpOneStopIndex - pumpOneStartIndex;
};

type WorkerSalaryProp = {};

const Perfomances = ({}: WorkerSalaryProp) => {
	const theme = useTheme();

	const [startDate, setStartDate] = useState(new Date());
	const [stopDate, setStopDate] = useState(new Date());

	const [users, setUsers] = useState<User[]>([]);

	const [selectedUser, setSelectedUser] = useState<User>();

	const {
		data: dailySales,
		error: dailySaleError,
		isLoading: dailySaleIsLoading,
		refetch: dailySaleRefetch
	} = useDailySales(
		startDate.toISOString(),
		stopDate.toISOString(),
		selectedUser?.id
	);
	console.log(
		"🚀 ~ file: index.tsx:35 ~ Perfomances ~ dailySales:",
		dailySales
	);

	let fuelMoneySold = 0;

	let quantityOfSuperSold = 0;

	let quantityOfGasoilSold = 0;
	let gasBottle = 0;

	if (dailySales) {
		for (let i = 0; i < dailySales.length; i++) {
			fuelMoneySold += dailySales[i].amount_sold;
			quantityOfSuperSold += getQuantityOfSuperSold(dailySales[i]);
			quantityOfGasoilSold += getQuantityOfGasoilSold(dailySales[i]);
			gasBottle += getQuantityOfGasBottleSold(dailySales[i]);
		}
	}

	console.log(
		"🚀 ~ file: index.tsx:89 ~ Perfomances ~ fuelMoneySold:",
		fuelMoneySold
	);
	console.log(
		"🚀 ~ file: index.tsx:91 ~ Perfomances ~ quantityOfSuperSold:",
		quantityOfSuperSold
	);
	console.log(
		"🚀 ~ file: index.tsx:91 ~ Perfomances ~ quantityOfGasoilSold:",
		quantityOfGasoilSold
	);
	console.log("🚀 ~ file: index.tsx:91 ~ Perfomances ~ gasBottle:", gasBottle);

	const fetchUser = async () => {
		const users = await getUsers();
		if (users) {
			setUsers(users);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<Box
			sx={{
				psition: "relative",
				backgroundColor: theme.palette.background.alt,
				m: "2rem",
				p: 2
			}}
		>
			<Typography sx={{ textAlign: "center", fontSize: "2.5rem" }}>
				<FormattedMessage id="performances" defaultMessage="Performances" />
			</Typography>

			<Box
				sx={{
					display: { xs: "block", md: "flex" },
					alignItems: "center",
					justifyContent: "space-between",
					width: { xs: "100%", sm: "60%", md: "100%" },
					mt: "1rem"
				}}
			>
				<Box sx={{ width: { xs: "100%", md: "40%" } }}>
					<FormControl sx={{ width: "50%" }}>
						<TextField
							select
							value={selectedUser ? selectedUser.id : ""}
							label="Select User"
							onChange={(
								event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
							) => {
								const userFound = users.find(u => u.id === event.target.value);
								setSelectedUser(userFound);
							}}
							size="small"
							sx={{
								boxShadow: 2
							}}
						>
							{users?.map(user => (
								<MenuItem key={user.id} value={user.id}>
									{user.names}
								</MenuItem>
							))}
						</TextField>
					</FormControl>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						gap: 2,
						alignItems: "center",
						mt: { xs: 2, md: 0 },
						width: { xs: "100%", md: "60%" }
					}}
				>
					<Box
						sx={{
							display: { xs: "block", md: "flex" },
							width: "50%",
							gap: 1,
							alignItems: "center"
						}}
					>
						<Typography>
							<FormattedMessage id="from" defaultMessage="From" />
						</Typography>
						<DateTimePicker
							value={startDate}
							onChange={(newValue: Date | null) => {
								if (newValue) {
									setStartDate(newValue);
								}
							}}
							renderInput={(props: any) => (
								<FormControl fullWidth>
									<TextField
										sx={{
											boxShadow: 2
										}}
										size="small"
										{...props}
									/>
								</FormControl>
							)}
						/>
					</Box>

					<Box
						sx={{
							display: { xs: "block", md: "flex" },
							gap: 1,
							width: "50%",
							alignItems: "center"
						}}
					>
						<Typography>
							<FormattedMessage id="to" defaultMessage="To" />
						</Typography>
						<DateTimePicker
							value={stopDate}
							onChange={(newValue: Date | null) => {
								if (newValue) {
									setStopDate(newValue);
								}
							}}
							renderInput={(props: any) => (
								<FormControl fullWidth>
									<TextField
										sx={{
											boxShadow: 2
										}}
										size="small"
										{...props}
									/>
								</FormControl>
							)}
						/>
					</Box>
				</Box>
			</Box>

			<Box
				sx={{
					m: "1rem 0",

					fontSize: { xs: "1rem", md: "1.5rem" }
				}}
			>
				<Typography fontSize="inherit">
					Fuel Sale: {fuelMoneySold} FCFA
				</Typography>
				<Typography fontSize="inherit">
					Super Quantity: {quantityOfSuperSold}
				</Typography>
				<Typography fontSize="inherit">
					Gasoil Quantity: {quantityOfGasoilSold}
				</Typography>
				<Typography fontSize="inherit">
					Gaz Bottle Quantity: {gasBottle}
				</Typography>
			</Box>
		</Box>
	);
};

export default Perfomances;
