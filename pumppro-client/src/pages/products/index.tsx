import {
	Avatar,
	Box,
	Button,
	Modal,
	Typography,
	useTheme
} from "@mui/material";
import { useProducts } from "features/products/hooks/useProducts";
import withAuth from "hoc/withAuth";
import { useNotify } from "hooks/useNotify";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import AddIcon from "@mui/icons-material/Add";
import { deleteProduct } from "services/products";
import ProductForm from "features/products/components/ProductForm";
import { GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MyDataGrid from "components/MyDataGrid";

const Products = () => {
	const { data, isLoading, error, refetch } = useProducts();

	const theme = useTheme();

	const [selectedProductsIDs, setSelectedProductsIDs] = useState<string[]>([]);
	const productToEdit =
		selectedProductsIDs.length === 1
			? data?.find(product => product.id === selectedProductsIDs[0])
			: undefined;

	const [addProductModal, setAddProductModal] = useState(false);
	const handleCloseAddProductModal = () => {
		setAddProductModal(false);
		refetch();
	};

	const notify = useNotify();

	if (error) {
		notify(error.name, error.message, "error");
	}

	const deleteProductMutation = useMutation({
		mutationFn: deleteProduct,
		onSuccess: (data, variables) => {
			notify("Save Success", "Product deleted successfully", "success");
			refetch();
		}
	});

	const handleDeleteProduct = async () => {
		try {
			await deleteProductMutation.mutateAsync(selectedProductsIDs);
			refetch();
		} catch (error: any) {
			notify("Login Error", error.message, "error");
		}
	};

	const handleSelectedProducts = (productsIDs: GridSelectionModel) => {
		setSelectedProductsIDs(productsIDs.map(id => id.toString()));
	};

	const columns: GridColDef[] = [
		{
			field: "image",
			headerName: "Image",
			renderCell: params => {
				return (
					<Box width="100%" height="3rem">
						{params.value ? (
							<img
								style={{
									padding: "2px",
									border: `1px solid ${theme.palette.grey[600]}`,
									objectFit: "cover",
									width: "100%",
									height: "100%"
								}}
								src={params.value}
								alt="profile"
							/>
						) : (
							<Avatar
								variant="rounded"
								sx={{
									bgcolor: theme.palette.grey[600],
									fontSize: "0.5rem",
									width: "100%",
									height: "100%",
									padding: "2px",
									border: `1px solid ${theme.palette.grey[600]}`
								}}
								aria-label="product avatar"
							>
								<Typography fontSize="3rem">
									{params.row.name.split(" ")[0].toUpperCase()}
								</Typography>
							</Avatar>
						)}
					</Box>
				);
			}
		},
		{
			field: "name",
			headerName: "Names",
			width: 200,
			headerAlign: "center",
			align: "center"
		},
		{
			field: "description",
			headerName: "Description",
			width: 200,
			headerAlign: "center",
			align: "center"
		},
		{
			field: "category",
			headerName: "Category",
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return params.value.name;
			}
		},
		{
			field: "quantity",
			headerName: "Quantity in Stock",
			headerAlign: "center",
			align: "center",
			renderCell: params => {
				return (
					<Box
						component="span"
						sx={{
							color:
								params.value <= params.row.low_stock_threshold ? `#ff0000` : ""
						}}
					>
						{params.value}
					</Box>
				);
			}
		},
		{
			field: "purchase_price",
			headerName: "Purchase Price",
			headerAlign: "center",
			align: "center"
		},
		{
			field: "selling_price",
			headerName: "Selling Price",
			headerAlign: "center",
			align: "center"
		},
		{
			field: "low_stock_threshold",
			headerName: "Threshold",
			headerAlign: "center",
			align: "center"
		}
	];

	return (
		<Box>
			<Box sx={{ p: { xs: "0.5rem", md: "1rem" } }}>
				<Modal
					open={addProductModal}
					onClose={handleCloseAddProductModal}
					aria-labelledby="Worker Form"
					aria-describedby="Form used to add or edit worker"
					sx={{
						display: "flex",
						justifyContent: "center"
					}}
				>
					<>
						<ProductForm
							product={productToEdit}
							handleCloseModal={handleCloseAddProductModal}
						/>
					</>
				</Modal>

				<Typography component="h1" fontSize="2rem">
					<FormattedMessage id="products" defaultMessage="Products" />
				</Typography>

				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Box sx={{ display: "flex", gap: 1 }}>
						{productToEdit ? (
							<Button
								endIcon={<EditIcon />}
								sx={{
									backgroundColor: theme.palette.secondary.main,
									color: theme.palette.grey[50],

									"&:hover": {
										backgroundColor: theme.palette.secondary.dark
									}
								}}
								onClick={() => setAddProductModal(true)}
							>
								<FormattedMessage
									id="edit_product"
									defaultMessage="Edit Product"
								/>
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
								onClick={() => setAddProductModal(true)}
							>
								<FormattedMessage
									id="add_product"
									defaultMessage="Add Product"
								/>
							</Button>
						)}
						{selectedProductsIDs?.length > 0 && (
							<LoadingButton
								onClick={handleDeleteProduct}
								loading={deleteProductMutation.isLoading}
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
									id="delete_product"
									defaultMessage="Delete Product"
								/>
							</LoadingButton>
						)}
					</Box>
				</Box>
				{data && (
					<MyDataGrid
						handleSelected={handleSelectedProducts}
						columns={columns}
						isLoading={isLoading}
						rows={data}
						searchInput
						checkboxSelection
					/>
				)}
			</Box>
		</Box>
	);
};

export default withAuth(Products);
