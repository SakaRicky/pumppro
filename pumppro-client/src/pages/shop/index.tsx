import React, { useState } from "react";
import { useStateValue } from "state";
import {
	Box,
	CircularProgress,
	Grid,
	IconButton,
	InputAdornment,
	TextField,
	useMediaQuery
} from "@mui/material";
import ShoppingCart from "features/shopping/components/shoppingCart/ShoppingCart";
import ProductCard from "features/products/components/ProductCard";
import { useProducts } from "features/products/hooks/useProducts";
import withAuth from "hoc/withAuth";
import { useNotify } from "hooks/useNotify";
import { Cancel } from "@mui/icons-material";

const Shop = () => {
	const [state, dispatch] = useStateValue();
	const { data, isLoading, error, refetch } = useProducts();
	console.log("🚀 ~ Shop ~ data:", data)

	const isNonMobileTablet = useMediaQuery("(min-width: 600px)");

	const [searchedProduct, setSearchedProduct] = useState("");

	const notify = useNotify();

	if (error) {
		notify("Error Fetching Products", error.message, "error");
	}

	const filteredProducts =
		searchedProduct.length > 0
			? data?.filter(product =>
					product.name
						.toLocaleLowerCase()
						.includes(searchedProduct.toLocaleLowerCase())
			  )
			: data;

	return (
		<Box
			sx={{
				p: { xs: "1rem", md: "2rem" },
				// border: "2px solid red",
				mr: state.cartItems.length > 0 ? "30%" : 0
			}}
		>
			<Box
				sx={{ display: "flex", justifyContent: { xs: "center", md: "start" } }}
			>
				<TextField
					label="Search..."
					variant="standard"
					sx={{
						mb: "0.5rem",
						width: isNonMobileTablet ? "30%" : "80%"
					}}
					onChange={e => setSearchedProduct(e.target.value)}
					value={searchedProduct}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={() => setSearchedProduct("")}>
									<Cancel />
								</IconButton>
							</InputAdornment>
						)
					}}
				/>
			</Box>
			{isLoading ? (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<CircularProgress size={50} />
				</Box>
			) : (
				<Grid
					container
					rowSpacing={4}
					columns={12}
					sx={{
						mt: "1rem"
					}}
				>
					{filteredProducts?.map(product => (
						<Grid item xs={12} sm={6} md={4} key={product.id}>
							<Box
								sx={{
									display: "flex",
									justifyContent: { xs: "center", md: "start" },
									width: "100%",
									height: "100%"
								}}
							>
								<ProductCard product={product} />
							</Box>
						</Grid>
					))}
				</Grid>
			)}
			{state.cartItems.length > 0 ? (
				<Box
					sx={{
						width: "25%",
						maxHeight: "90vh",
						position: "fixed",
						top: "15%",
						right: "6%",
						overflowY: "auto",
						border: "1px solid green"
					}}
				>
					<ShoppingCart refetch={refetch} />
				</Box>
			) : null}
		</Box>
	);
};

export default withAuth(Shop);
