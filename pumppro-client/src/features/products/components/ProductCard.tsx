import {
	Avatar,
	Box,
	Button,
	TextField,
	Typography,
	useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { CartItem, Product } from "types";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { addItemToCart, useStateValue } from "state";
import { useMediaQuery } from "@mui/material";
import { red } from "@mui/material/colors";
import DoneIcon from '@mui/icons-material/Done';
import { Tooltip } from "@mui/material";
import { getItemAvatarName } from "features/sales/components/SoldItems";

type ProductCardProps = {
	product: Product;
};
const ProductCard = ({ product }: ProductCardProps) => {
	const theme = useTheme();
	const [state, dispatch] = useStateValue();

	const isItemInCart = state.cartItems.map(c => c.id).includes(product.id);

	const isMobile = useMediaQuery("(max-width: 768px)");

	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		if (!isItemInCart) {
			setQuantity(1);
		}
	}, [isItemInCart])

	const handleQuantityChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setQuantity(Number.parseInt(event.target.value));
	};

	const handleClickAddToCart = () => {
		const cartItem: CartItem = {
			id: product.id,
			image: product.image,
			name: product.name,
			quantity: quantity,
			unit_price: product.selling_price,
			quantity_in_stock: product.quantity
		};
		dispatch(addItemToCart(cartItem));
	};

	return (
		<Box
			sx={{
				boxShadow:
					"rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;",
				maxWidth: "17rem",
				cursor: "pointer",
				position: "relative",
				p: "5px",
				backgroundColor: theme.palette.background.default
			}}
		>
			<Box width="100%" height="7rem" mb="1.5rem">
				{product.image ? (
					<img
						style={{
							padding: "2px",
							border: `1px solid ${theme.palette.grey[600]}`,
							objectFit: "cover",
							width: "100%",
							height: "100%"
						}}
						src={product.image}
						alt="profile"
					/>
				) : (
					<Avatar
						variant="rounded"
						sx={{
							bgcolor: theme.palette.grey[600],
							width: "100%",
							height: "100%",
							padding: "2px",
							border: `1px solid ${theme.palette.grey[600]}`
						}}
						aria-label="product avatar"
					>
						<Typography fontSize="3rem">
							{getItemAvatarName(product.name)}
						</Typography>
					</Avatar>
				)}
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 1,
					textAlign: "center"
				}}
			>
				<Typography fontWeight="700" fontSize="1.2rem">
					{product.name}
				</Typography>
				<Tooltip title={product.description}>
					<Typography
						fontWeight="700"
						fontSize="0.8rem"
						style={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{product.description}
					</Typography>
				</Tooltip>

				<Typography
					fontWeight="700"
					fontSize="1.5rem"
					color={theme.palette.primary[500]}
				>
					XAF {product.selling_price}
				</Typography>
				<Typography>Stock: <span style={{ color: product.quantity <= product.low_stock_threshold ? "red" : "green" }}>{product.quantity}</span></Typography>
			</Box>

			<Box m="1rem 0" sx={{ display: "flex", gap: "5px", p: "16px" }}>
				<TextField
					type="number"
					size="small"
					value={quantity}
					disabled={isItemInCart}
					sx={{ width: "50%" }}
					onChange={handleQuantityChange}
				/>
				<Button
					onClick={handleClickAddToCart}
					disabled={isMobile || isItemInCart}
					fullWidth
					endIcon={isItemInCart ? <DoneIcon /> : <AddShoppingCartIcon />}
					sx={{
						backgroundColor: isItemInCart ? theme.palette.grey[600] : theme.palette.secondary.main,
						color: theme.palette.grey[50],

						"&:hover": {
							backgroundColor: theme.palette.secondary.dark
						}
					}}
				>
					{isItemInCart ? <FormattedMessage id="added_to_cart" defaultMessage="Added" /> : <FormattedMessage id="add_to_cart" defaultMessage="Add To Chart" />}
				</Button>
			</Box>
			<Box sx={{ display: "flex", justifyContent: "center" }}>
				{isMobile && (
					<Typography fontSize="0.7rem" color={red[500]}>
						Cannot add to card on mobile
					</Typography>
				)}
			</Box>
		</Box>
	);
};

export default ProductCard;
