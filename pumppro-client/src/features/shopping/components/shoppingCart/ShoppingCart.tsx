import React, { useEffect, useState } from "react";
import {
	Box,
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

const ShoppingCart = () => {
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

	const handleSaleClick = () => {
		const salesItem = state.cartItems.map(item => ({
			productID: item.id,
			quantity: item.quantity
		}));

		createSaleMutation.mutateAsync(salesItem);
	};

	return (
		<Box
			sx={{
				position: "relative",
				boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
				border: `4px solid ${theme.palette.primary[600]}`,
				backgroundColor: theme.palette.background.alt,
				p: 2
			}}
		>
			<Typography component="h1" textAlign="center" fontSize="2rem" m={2}>
				<FormattedMessage id="shopping_cart" defaultMessage="Shopping Cart" />
			</Typography>
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

			<ShoppingCartFooter
				totalPrice={totalPrice}
				setAmountGiven={setAmountGiven}
				amountGiven={amountGiven}
				isLoading={createSaleMutation.isLoading}
				handleSaleClick={handleSaleClick}
			/>
		</Box>
	);
};

export default ShoppingCart;
