import { Fuel, FuelSale, Gender, Role } from "@prisma/client";
import { z, ZodTypeDef } from "zod";
import {
	DailySaleSummary,
	FuelType,
	NewDailySaleSummary,
	NewFuel,
	NewFuelSale,
	NewProduct,
	NewProductCategory,
	NewUser,
	ProductCategory,
	ProductType
} from "../types";
import { Decimal } from "@prisma/client/runtime/library";

const NewUserSchema = z.object({
	names: z.string().min(3),
	username: z.string().min(3),
	date_of_birth: z.coerce.date(),
	gender: z.enum([Gender.FEMALE, Gender.MALE]),
	phone: z.string().min(9),
	salary: z.coerce.number().positive(),
	godfather_phone: z.string(),
	localisation: z.string().optional(),
	cni_number: z.string(),
	email: z.string().optional(),
	password: z.string().optional(),
	profile_picture: z.union([z.string().url(), z.literal("")]).optional(),
	role: z.enum([Role.ADMIN, Role.PUMPIST, Role.SALE, Role.USER])
});

export const validateNewUser = (data: unknown): NewUser | undefined => {
	const parsedData = NewUserSchema.parse(data);

	return parsedData;
};

export const validateEditedUser = (data: unknown): NewUser | undefined => {
	const EditedUserSchema = NewUserSchema.extend({
		id: z.string()
	});

	const parsedData = EditedUserSchema.parse(data);

	return parsedData;
};

const NewProductCategorySchema = z.object({
	name: z.string(),
	description: z.string().optional()
});

const ProductCategorySchema = NewProductCategorySchema.extend({
	id: z.string()
});

const NewProductSchema = z.object({
	name: z.string().min(3),
	category_id: z.string(),
	description: z.string().optional().nullable(),
	image: z.string().optional().nullable(),
	quantity: z.coerce.number(),
	purchase_price: createDecimalSchema(),
	selling_price: createDecimalSchema(),
	low_stock_threshold: z.coerce.number()
});

export const validateNewProduct = (data: unknown): NewProduct | undefined => {
	const parsedData = NewProductSchema.parse(data);

	return parsedData;
};

export const validateEditedProduct = (
	data: unknown
): ProductType | undefined => {
	// custom validate date that comes as string
	const EditedProductSchema = NewProductSchema.extend({
		id: z.string(),
		image: z.string(),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date()
	});

	const parsedData = EditedProductSchema.parse(data);

	return parsedData;
};

export const validateNewProductCategory = (
	data: unknown
): NewProductCategory | undefined => {
	const parsedData = NewProductCategorySchema.parse(data);
	return parsedData;
};

export const validateEditedProductCategory = (
	data: unknown
): ProductCategory | undefined => {
	const parsedData = ProductCategorySchema.parse(data);

	return parsedData;
};

const NewSaleDetailSchema = z.object({
	product_id: z.string(),
	quantity: z.coerce.number().int().positive()
});

const NewSaleSchema = z.object({
	user_id: z.string(),
	sale_details: z.array(NewSaleDetailSchema).min(1)
});

interface NewSaleValidation {
	user_id: string;
	sale_details: { quantity: number; product_id: string }[];
}

export const validateNewSale = (
	data: unknown
): NewSaleValidation | undefined => {
	const parsedData = NewSaleSchema.parse(data);

	return parsedData;
};

const NewFuelSaleSchema = z.object({
	fuel_id: z.coerce.number(),
	user_id: z.string(),
	start_reading: createDecimalSchema(),
	end_reading: createDecimalSchema()
});

export const validateNewFuelSale = (data: unknown): NewFuelSale | undefined => {
	const parsedData = NewFuelSaleSchema.parse(data);

	return parsedData;
};

const NewTankSchema = z.object({
	name: z.string(),
	capacity: z.coerce.number()
});

export const validateNewTank = (
	data: unknown
): { name: string; capacity: number } | undefined => {
	const parsedData = NewTankSchema.parse(data);

	return parsedData;
};

const ExistingTankSchema = z.object({
	id: z.coerce.number(),
	name: z.string(),
	capacity: z.coerce.number()
});

export const validateExistingTank = (
	data: unknown
): { id: number; name: string; capacity: number } | undefined => {
	const parsedData = ExistingTankSchema.parse(data);

	return parsedData;
};

const FuelRefillSchema = z.object({
	id: z.coerce.number(),
	quantity: z.coerce.number()
});

export const validateExistingFuelRefill = (
	data: unknown
): { id: number; quantity: number } | undefined => {
	const parsedData = FuelRefillSchema.parse(data);

	return parsedData;
};

const NewFuelSchema = z.object({
	name: z.string().min(3),
	purchase_price: createDecimalSchema(),
	selling_price: createDecimalSchema(),
	quantity_theory: z.coerce.number(),
	quantity_actual: z.coerce.number(),
	fuel_type: z.enum([
		FuelType.FUEL,
		FuelType.GASOIL,
		FuelType.GAS_BOTTLE,
		FuelType.PETROL
	]),
	description: z.string().min(3),
	tank_id: z.coerce.number()
});

export const validateNewFuel = (data: unknown): NewFuel | undefined => {
	const parsedData = NewFuelSchema.parse(data);

	return parsedData;
};

export const validateExistingFuel = (data: unknown): Fuel | undefined => {
	const ExistingFuelSchema = NewFuelSchema.extend({
		id: z.coerce.number(),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date()
	});

	const parsedData = ExistingFuelSchema.parse(data);

	return parsedData;
};

const FuelSaleSchema = z.object({
	id: z.coerce.number(),
	fuel_id: z.coerce.number(),
	user_id: z.string(),
	start_reading: createDecimalSchema(),
	end_reading: createDecimalSchema(),
	quantity_sold: createDecimalSchema(),
	total_amount: createDecimalSchema(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date()
});

export const validateExistingFuelSale = (
	data: unknown
): FuelSale | undefined => {
	const parsedData = FuelSaleSchema.parse(data);

	return parsedData;
};

// Define the NewDailySaleSummary schema with FuelCounts
const NewDailySaleSummarySchema = z.object({
	user_id: z.string(),
	amount_sold: createDecimalSchema(),
	amount_given: createDecimalSchema(),
	date_of_sale_start: z.coerce.date(),
	date_of_sale_stop: z.coerce.date()
});

const ExistingDailySaleSchema = NewDailySaleSummarySchema.extend({
	id: z.coerce.number(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date()
});

export const validateNewDailySaleSummary = (
	data: unknown
): NewDailySaleSummary | undefined => {

	const parsedData = NewDailySaleSummarySchema.parse(data);

	return parsedData;
};

export const validateExistingDailySale = (
	data: unknown
): DailySaleSummary | undefined => {
	const parsedData = ExistingDailySaleSchema.parse(data);

	return parsedData;
};

function createDecimalSchema(): z.ZodType<Decimal, ZodTypeDef, unknown> {
	return z.preprocess(
		(arg: unknown) => {

			if (typeof arg === "string" || typeof arg === "number") {
				try {
					return new Decimal(arg);
				} catch (error) {
					console.log("🚀 ~ createDecimalSchema ~ error:", error);
					return null;
				}
			}
			return arg;
		},
		// After preprocessing, validate that the result is actually a Decimal instance.
		z.instanceof(Decimal, {
			// Add a custom error message for clarity when validation fails
			message:
				"Invalid Decimal value. Must be a number or string convertible to a Decimal."
		})
	);
}
