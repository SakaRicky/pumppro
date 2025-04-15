import React from "react";
import { Avatar, Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { CartItem as CartItemType } from "types";
import { FormattedMessage } from "react-intl";
import {
	decrementItemInCart,
	incrementItemInCart,
	removeItemFromCart,
	useStateValue
} from "state";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

type CartItemProps = {
	cartItem: CartItemType;
};

const CartItem = ({ cartItem }: CartItemProps) => {
	const theme = useTheme();
	const [state, dispatch] = useStateValue();

	return (
		<Box
			sx={{
				display: "flex",
				gap: 2,
				p: 1,
				height: "11rem",
				width: "100%",
				border: `2px solid ${theme.palette.secondary[100]}`
			}}
		>
			<Box sx={{ width: "20%", height: "100%" }}>
				{cartItem.image ? (
					<img
						style={{
							padding: "2px",
							border: `1px solid ${theme.palette.grey[600]}`,
							objectFit: "cover",
							width: "100%",
							height: "100%"
						}}
						src={cartItem.image}
						alt="profile"
					/>
				) : (
					<Avatar
						variant="rounded"
						sx={{
							bgcolor: theme.palette.grey[600],
							width: "80%",
							height: "100%",
							padding: "2px",
							border: `1px solid ${theme.palette.grey[600]}`
						}}
						aria-label="cartItem avatar"
					>
						<Typography fontSize="3rem">
							{cartItem.name.split(" ")[0].toUpperCase()}
						</Typography>
					</Avatar>
				)}
			</Box>
			<Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
				<Typography
					sx={{
						display: "flex",
						gap: 1,
						fontSize: "1.2rem",
						fontWeight: "700"
					}}
				>
					{cartItem.name}
				</Typography>
				<Typography sx={{ display: "flex", gap: 1 }}>
					XAF {cartItem.unit_price}
				</Typography>
				<Typography
					component="span"
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					<Box
						sx={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Box sx={{
							display: "flex",
							gap: 1,
							alignItems: "center"

						}}>
							<IconButton sx={{
								color: "#fff",
								backgroundColor: theme.palette.primary.main,
								"&:hover": {
									backgroundColor: theme.palette.primary[400]
								},
								cursor: "pointer",
								p: 0,
								height: "1.4rem",
								width: "1.4rem",
								fontSize: "1.5rem",
								fontWeight: "700",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "50%"
							}} aria-label="delete" onClick={() => dispatch(incrementItemInCart(cartItem.id))}>
								<AddIcon />
							</IconButton>

							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "3rem",
									height: "2rem",
									backgroundColor: theme.palette.grey[600],
									color: "#fff",
									borderRadius: "5px",
									fontSize: "1.5rem"
								}}
							>
								{cartItem.quantity}
							</Box>
							<IconButton sx={{
								color: "#fff",
								backgroundColor: theme.palette.primary.main,
								"&:hover": {
									backgroundColor: theme.palette.primary[400]
								},
								cursor: "pointer",
								p: 0,
								height: "1.4rem",
								width: "1.4rem",
								fontSize: "1.5rem",
								fontWeight: "700",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "50%"
							}} aria-label="delete" onClick={() => dispatch(decrementItemInCart(cartItem.id))}>
								<RemoveIcon />
							</IconButton>
						</Box>
						<Typography
							component="span"
							sx={{ display: "flex", gap: 1, alignItems: "center" }}
						>
							<Typography fontSize="2.5rem" fontWeight="700">
								XAF {cartItem.unit_price * cartItem.quantity}
							</Typography>
						</Typography>
					</Box>
				</Typography>

				<Box>
					<Button
						onClick={() => dispatch(removeItemFromCart(cartItem.id))}
						sx={{
							backgroundColor: theme.palette.error.main,
							color: "#fff",
							"&:hover": {
								backgroundColor: theme.palette.error.dark
							}
						}}
					>
						<FormattedMessage id="cartitem.delete" defaultMessage="Delete" />
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default CartItem;
