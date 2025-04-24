import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Divider,
	List,
	ListItem,
	Typography,
	useTheme
} from "@mui/material";
import CartItem from "features/shopping/components/CartItem";
import { setCartItems, useStateValue } from "state";

import { useMutation } from "@tanstack/react-query";
import { saveSale } from "services/sales";
import { useNotify } from "hooks/useNotify";
import ShoppingCartFooter from "./ShoppingCartFooter";
import { BadRequestError } from "errors/badRequestError";
import { FormattedMessage } from "react-intl";
import { clearCart, showDialog } from "state/reducer";

type ShoppingCartProps = {
	refetch: () => void;
};

const ShoppingCart = ({ refetch }: ShoppingCartProps) => {
	const [state, dispatch] = useStateValue();
	const [totalPrice, setTotalPrice] = useState(0);
	const [amountGiven, setAmountGiven] = useState(0);

	const notify = useNotify();

	useEffect(() => {
		const total = state.cartItems
			.map(i => i.quantity * i.unit_price)
			.reduce((acc, current) => acc + current, 0);
		setTotalPrice(total);
	}, [state.cartItems]);

	const theme = useTheme();

	const createSaleMutation = useMutation({
		mutationFn: saveSale,
		onSuccess: (data, variables, context: any) => {
			notify("Save Success", context.successMessage, "success");
			dispatch(setCartItems([]));
			refetch()
		},
		onError: error => {
			if (error instanceof BadRequestError) {
				notify("Error", error.message, "error");
			}
		},
		onMutate: variables => {
			return { successMessage: "Created Product Successfully" };
		}
	});

	const handleSaveSaleClick = () => {
		const salesItem = state.cartItems.map(item => ({
			product_id: item.id,
			quantity: item.quantity
		}));

		const saleToSave = {
			user_id: state.logedUser?.id,
			sale_details: salesItem
		}

		createSaleMutation.mutateAsync(saleToSave);
	};



	const handleClearCart = () => {
		dispatch(showDialog(true,"Are you Sure?", "You will lose all data in the cart. Do you want to continue?",() => dispatch(clearCart()), "Cancel", "Clear Cart"))
	}

	return (
		<Box
			sx={{
				position: "relative",
				boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
				border: `4px solid ${theme.palette.primary[600]}`,
				backgroundColor: theme.palette.background.alt,
				p: 1,
			}}
		>
			<Typography component="h1" textAlign="center" fontSize="2rem">
				<FormattedMessage id="shopping_cart" defaultMessage="Shopping Cart" />
			</Typography>
			<Box sx={{ maxHeight: "45vh", overflowY: "scroll" }}>
				<List>
					{state.cartItems.map(item => {
						return (
							<Box key={item.id}>
								<ListItem sx={{ p: 0, m: "0.8rem 0" }}>
									<CartItem cartItem={item} />
								</ListItem>
								<Divider />
							</Box>
						);
					})}
				</List>
			</Box>

			<Box sx={{ my: 1, display: "flex", justifyContent: "center" }}>
				<Button
					onClick={handleClearCart}
					sx={{
						backgroundColor: theme.palette.error.main,
						color: "#fff",
						"&:hover": {
							backgroundColor: theme.palette.error.dark
						}
					}}
				>
					<FormattedMessage id="cartitem.delete" defaultMessage="Clear Cart" />
				</Button>
			</Box>

			<ShoppingCartFooter
				totalPrice={totalPrice}
				setAmountGiven={setAmountGiven}
				amountGiven={amountGiven}
				isLoading={createSaleMutation.isLoading}
				handleSaveSaleClick={handleSaveSaleClick}
			/>
		</Box>
	);
};

export default ShoppingCart;
