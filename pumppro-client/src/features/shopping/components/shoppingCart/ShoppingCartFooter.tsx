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
	handleSaleClick: () => void;
};
const ShoppingCartFooter = ({
	totalPrice,
	setAmountGiven,
	amountGiven,
	isLoading,
	handleSaleClick
}: ShoppingCartFooterProps) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				border: `4px solid ${theme.palette.secondary[500]}`,
				mt: 2,
				p: 1
			}}
		>
			<Box>
				<Typography
					component="span"
					fontSize="1.5rem"
					display="flex"
					gap={2}
					alignItems="center"
				>
					Total:
					<Typography
						fontSize="2rem"
						color={theme.palette.secondary[500]}
						fontWeight={700}
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
					gap={2}
					alignItems="center"
				>
					<FormattedMessage id="amount_given" defaultMessage="Amount Given" />
					<TextField
						type="number"
						size="small"
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setAmountGiven(Number.parseInt(e.target.value))
						}
					/>
				</Typography>
			</Box>
			<Box>
				<Typography
					component="span"
					fontSize="1.5rem"
					display="flex"
					gap={2}
					alignItems="center"
				>
					<FormattedMessage id="shopping_change" defaultMessage="Change" />
					<Box
						sx={{
							backgroundColor: theme.palette.grey[500],
							color: "#fff",
							borderRadius: "5px",
							p: "0.25rem 1rem"
						}}
					>
						XAF {amountGiven !== 0 ? amountGiven - totalPrice : 0}
					</Box>
				</Typography>
			</Box>

			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<LoadingButton
					type="submit"
					loading={isLoading}
					loadingPosition="end"
					endIcon={<SaveIcon />}
					onClick={handleSaleClick}
					variant="contained"
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
