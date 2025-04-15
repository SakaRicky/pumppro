import { LoadingButton } from "@mui/lab";
import { useTheme } from "@mui/material";
import { Box, TextField, Typography } from "@mui/material";
import React, { ChangeEvent } from "react";
import { FormattedMessage } from "react-intl";
import SaveIcon from "@mui/icons-material/Save";

type ShoppingCartFooterProps = {
	totalPrice: number;
	setAmountGiven: React.Dispatch<React.SetStateAction<number>>;
	amountGiven: number; // Amount given by the client. Used to calculate the change
	isLoading: boolean;
	handleSaveSaleClick: () => void;
};
const ShoppingCartFooter = ({
	totalPrice,
	setAmountGiven,
	amountGiven,
	isLoading,
	handleSaveSaleClick
}: ShoppingCartFooterProps) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				border: `4px solid ${theme.palette.secondary[500]}`,
				px: 1
			}}
		>
			<Box>
				<Typography
					component="span"
					fontSize="1.5rem"
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					Total:
					<Typography
						fontSize="1.5rem"
						color={theme.palette.secondary[500]}
						fontWeight={700}
						sx={{ width: "35%" }}
					>
						XAF {totalPrice}
					</Typography>
				</Typography>
			</Box>
			<Box my={1}>
				<Typography
					component="span"
					fontSize="1.5rem"
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<FormattedMessage id="amount_given" defaultMessage="Amount Given" />
					<Box display="flex" gap={1} sx={{ width: "35%" }}>
						<Typography fontSize="1.5rem"
						>
							XAF

						</Typography>
						<TextField
							type="number"
							size="small"
							
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setAmountGiven(Number.parseInt(e.target.value))
							}
						/>
					</Box>
				</Typography>
			</Box>
			<Box>
				<Typography
					component="span"
					fontSize="1.5rem"
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<FormattedMessage id="shopping_change" defaultMessage="Change" />
					<Box
						sx={{
							backgroundColor: theme.palette.grey[500],
							color: "#fff",
							borderRadius: "5px",
							px: "1rem",
							width: "25%"
						}}
					>
						XAF {amountGiven !== 0 ? amountGiven - totalPrice : 0}
					</Box>
				</Typography>
			</Box>

			<Box sx={{mt: 2}}>
				<LoadingButton
					type="submit"
					loading={isLoading}
					loadingPosition="end"
					endIcon={<SaveIcon />}
					onClick={handleSaveSaleClick}
					variant="contained"
					fullWidth
					sx={{
						color: "#fff",
						my: 2,
						mx: "auto",
						backgroundColor: theme.palette.secondary.main,
						"&:hover": {
							backgroundColor: theme.palette.secondary.dark
						}
					}}
				>
					<FormattedMessage id="save" defaultMessage="Save Sale" />
				</LoadingButton>
			</Box>
		</Box>
	);
};

export default ShoppingCartFooter;
