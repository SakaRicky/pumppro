import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import TextInput from "components/inputs/TextInput";
import { PreviewImage } from "components/PrevieImage";
import { AuthError } from "errors/authError";
import { UserError } from "errors/userError";
import { Form, Formik } from "formik";
import { useNotify } from "hooks/useNotify";
import React, { forwardRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { saveProduct, updateProduct } from "services/products";
import { NewProduct, Product } from "types";
import * as yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import { useProductCategories } from "../hooks/useProductCategory";
import CreatableSelectInput from "components/inputs/CreatableSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import { useMediaQuery } from "@mui/material";

type ProductFormProps = {
	product?: Product;
	handleCloseModal: () => void;
};

const ProductForm = forwardRef(
	({ product, handleCloseModal }: ProductFormProps, ref: any) => {
		const theme = useTheme();

		const queryClient = useQueryClient();

		const isMobile = useMediaQuery("(max-width: 900px)");

		const { data, isLoading, error, refetch } = useProductCategories();

		const notify = useNotify();

		if (error) {
			notify("Category Error", error.message, "error");
		}

		const isEditMode = !!product;
		// console.log("product in ProductForm: ", product);

		const navigate = useNavigate();

		const [picture, setPicture] = useState<File | null>(null);

		const initialValues: NewProduct = {
			name: isEditMode ? product.name : "",
			category_id: isEditMode ? product.category.id : "",
			description: isEditMode ? product.description : "",
			quantity: isEditMode ? product.quantity : 0,
			purchase_price: isEditMode ? product.purchase_price : 0,
			selling_price: isEditMode ? product.selling_price : 0,
			low_stock_threshold: isEditMode ? product.low_stock_threshold : 0
		};

		const createProductValidationSchema = yup.object({
			name: yup.string().required("Names is required"),
			category_id: yup.string().required("Categoryes is required"),
			description: yup.string(),
			quantity: yup.number().min(1, "Atleast 1"),
			purchase_price: yup.number().min(1, "Atleast 1"),
			selling_price: yup.number().min(1, "Atleast 1"),
			low_stock_threshold: yup.number().min(1, "Atleast 1")
		});

		const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files?.length) {
				e.target.value = "";
				return;
			}

			const uploadedPicture = e.target.files[0];
			setPicture(uploadedPicture);
			e.target.files = null;
			e.target.value = "";
		};

		const createProductMutation = useMutation({
			mutationFn: saveProduct,
			onSuccess: (data, variables, context: any) => {
				notify("Save Success", context.successMessage, "success");
				handleCloseModal();
				queryClient.invalidateQueries(["products"], { exact: true });
			},
			onMutate: variables => {
				return { successMessage: "Created Product Successfully" };
			}
		});

		const updateProductMutation = useMutation({
			mutationFn: updateProduct,
			onSuccess: (data, variables, context: any) => {
				notify("Update Success", context.successMessage, "success");
				queryClient.invalidateQueries(["products"], { exact: true });
				handleCloseModal();
			},
			onMutate: variables => {
				return { successMessage: "Updated Product Successfully" };
			}
		});

		const onNewProductSubmit = async (data: NewProduct) => {
			const formData = new FormData();

			for (const [key, value] of Object.entries(data)) {
				if (typeof value === "number") {
					formData.append(key, value.toString());
				} else {
					formData.append(key, value);
				}
			}
			if (picture) {
				formData.append("file", picture, picture?.name);
			}

			try {
				if (isEditMode) {
					formData.append("id", product.id);
					formData.append("created_at", product.created_at);
					formData.append("updatedAt", product.updatedAt);
					formData.append("image", product.image || "");
					updateProductMutation.mutateAsync(formData);
				} else {
					await createProductMutation.mutateAsync(formData);
				}
			} catch (error) {
				if (error instanceof UserError) {
					notify("Login Error", error.message, "error");
				}
				if (error instanceof Error) {
					notify("Login Error", error.message, "error");
				}
				if (error instanceof AuthError) {
					notify("Login Error", error.message, "error");
					navigate("/login");
				}
			}
		};

		return (
			<Box
				ref={ref}
				p={4}
				sx={{
					boxShadow:
						"rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(4, 110, 174) 0px 0px 0px 3px",
					backgroundColor: theme.palette.background.alt,
					width: isMobile ? "90%" : "60%",
					height: "80%",
					mt: "5rem",
					overflowY: "auto"
				}}
			>
				<Typography variant="h2" fontSize="2rem" mb="2rem" textAlign="center">
					<FormattedMessage
						id="form.worker.heading"
						defaultMessage={isEditMode ? "Edit Product" : "Add New Product"}
					/>
				</Typography>
				<Formik
					initialValues={initialValues}
					validationSchema={createProductValidationSchema}
					validate={() => ({})}
					onSubmit={values => {
						onNewProductSubmit(values);
					}}
				>
					<Form>
						<Grid
							container
							spacing={{ xs: 0, sm: 2, md: 3 }}
							rowSpacing={2}
							columns={12}
							columnSpacing={2}
						>
							<Grid item xs={12} sm={6}>
								<TextInput type="text" label="Name" name="name" />
							</Grid>

							<Grid item xs={12} sm={6} zIndex={100}>
								<CreatableSelectInput
									label="Category"
									name="category_id"
									refetch={refetch}
									options={data}
									isLoading={isLoading}
								/>
							</Grid>
							<Grid item xs={6} md={3}>
								<TextInput type="number" label="Quantity" name="quantity" />
							</Grid>
							<Grid item xs={6} md={3}>
								<TextInput
									type="number"
									label="Purchase Price"
									name="purchase_price"
								/>
							</Grid>
							<Grid item xs={6} md={3}>
								<TextInput
									type="number"
									label="Selling Price"
									name="selling_price"
								/>
							</Grid>
							<Grid item xs={6} md={3}>
								<TextInput
									type="number"
									label="Reorder Point"
									name="low_stock_threshold"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextInput
									type="text"
									label="Description"
									name="description"
									multiline
								/>
							</Grid>
						</Grid>

						<FlexBetween sx={{ mt: 4 }}>
							<Button
								variant="contained"
								component="label"
								sx={{ textTransform: "uppercase", fontWeight: 700 }}
							>
								<FormattedMessage
									id="upload.upload"
									defaultMessage="Upload Picture"
								/>
								<input type="file" hidden onChange={handleFileInputChange} />
							</Button>
							{!isMobile && (
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										gap: "1rem"
									}}
								>
									{picture && (
										<Box
											sx={{
												width: "10rem",
												height: "10rem"
											}}
										>
											<PreviewImage
												imageFile={picture}
												handleDeleteImage={() => setPicture(null)}
											/>
										</Box>
									)}
									{isEditMode && Boolean(product.image) && (
										<img
											style={{
												borderRadius: "50%",
												marginTop: "1rem",
												padding: "2px",
												border: `1px solid ${theme.palette.grey[600]}`,
												objectFit: "cover",
												width: "10rem",
												height: "10rem"
											}}
											src={product.image}
											alt="profile"
										/>
									)}
								</Box>
							)}
							<LoadingButton
								type="submit"
								loading={
									createProductMutation.isLoading ||
									updateProductMutation.isLoading
								}
								endIcon={isEditMode ? <EditIcon /> : <AddIcon />}
								loadingPosition="end"
								sx={{
									backgroundColor: theme.palette.secondary.main,
									color: theme.palette.grey[50],

									"&:hover": {
										backgroundColor: theme.palette.secondary.dark
									}
								}}
							>
								{isEditMode ? "Save" : "Add Product"}
							</LoadingButton>
						</FlexBetween>
						{isMobile && (
							<Box
								sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}
							>
								{picture && (
									<Box
										sx={{
											width: "10rem",
											height: "10rem"
										}}
									>
										<PreviewImage
											imageFile={picture}
											handleDeleteImage={() => setPicture(null)}
										/>
									</Box>
								)}
								{isEditMode && Boolean(product.image) && (
									<img
										style={{
											borderRadius: "50%",
											marginTop: "1rem",
											padding: "2px",
											border: `1px solid ${theme.palette.grey[600]}`,
											objectFit: "cover",
											width: "10rem",
											height: "10rem"
										}}
										src={product.image}
										alt="profile"
									/>
								)}
							</Box>
						)}
					</Form>
				</Formik>
			</Box>
		);
	}
);

export default ProductForm;
