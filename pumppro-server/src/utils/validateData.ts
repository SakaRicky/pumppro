import { Fuel, Gender, Role } from "@prisma/client";
import { z } from "zod";
import {
	NewDailySale,
	NewFuel,
	NewProduct,
	NewProductCategory,
	NewUser,
	ProductCategory,
	ProductType,
	SaleItem
} from "../types";

const NewUserSchema = z.object({
	names: z.string().min(3),
	username: z.string().min(3),
	date_of_birth: z.date(),
	gender: z.enum([Gender.FEMALE, Gender.MALE]),
	phone: z.string().min(9),
	salary: z.number().positive(),
	godfather_phone: z.string(),
	localisation: z.string().optional(),
	CNI_number: z.string(),
	email: z.string().optional(),
	password: z.string().optional(),
	profile_picture: z.string().url().optional(),
	role: z.enum([Role.ADMIN, Role.PUMPIST, Role.SALE, Role.USER])
});

export const validateNewUser = (data: any): NewUser | undefined => {
	data.date_of_birth = new Date(data.date_of_birth);
	data.salary = Number.parseInt(data.salary);
	const parsedData = NewUserSchema.parse(data);

	return parsedData;
};

export const validateEditedUser = (data: any): NewUser | undefined => {
	const EditedUserSchema = NewUserSchema.extend({
		id: z.string()
	});
	data.date_of_birth = new Date(data.date_of_birth);
	data.salary = Number.parseInt(data.salary);
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
	quantity: z.number(),
	purchase_price: z.number(),
	selling_price: z.number(),
	low_stock_threshold: z.number()
});

export const validateNewProduct = (data: any): NewProduct | undefined => {
	data.quantity = Number.parseInt(data.quantity);
	data.purchase_price = Number.parseInt(data.purchase_price);
	data.selling_price = Number.parseInt(data.selling_price);
	data.low_stock_threshold = Number.parseInt(data.low_stock_threshold);
	const parsedData = NewProductSchema.parse(data);

	return parsedData;
};

export const validateEditedProduct = (data: any): ProductType | undefined => {
	// custom validate date that comes as string
	const EditedProductSchema = NewProductSchema.extend({
		id: z.string(),
		image: z.string(),
		created_at: z.string().refine(value => {
			const date = new Date(value);
			return !isNaN(date.getTime());
		}, "Expected valid date string"),
		updatedAt: z.string().refine(value => {
			const date = new Date(value);
			return !isNaN(date.getTime());
		}, "Expected valid date string")
	});
	data.quantity = Number.parseInt(data.quantity);
	data.purchase_price = Number.parseInt(data.purchase_price);
	data.selling_price = Number.parseInt(data.selling_price);
	data.low_stock_threshold = Number.parseInt(data.low_stock_threshold);
	const parsedData = EditedProductSchema.parse(data);

	return {
		...parsedData,
		created_at: new Date(data.created_at),
		updatedAt: new Date(data.updatedAt)
	};
};

export const validateNewProductCategory = (
	data: any
): NewProductCategory | undefined => {
	const parsedData = NewProductCategorySchema.parse(data);
	return parsedData;
};

export const validateEditedProductCategory = (
	data: any
): ProductCategory | undefined => {
	const parsedData = ProductCategorySchema.parse(data);

	return parsedData;
};

const NewSaleSchema = z.object({
	productID: z.string(),
	quantity: z.number()
});

export const validateNewSale = (data: any[]): SaleItem[] | undefined => {
	const formattedData = data.map(d => ({
		...d,
		quantity: Number.parseInt(d.quantity)
	}));
	const parsedData = formattedData.map(data => NewSaleSchema.parse(data));

	return parsedData;
};

const NewDailySaleSchema = z.object({
	user_id: z.string(),
	amount_sold: z.number(),
	amount_given: z.number(),
	difference: z.number(),
	date_of_sale_start: z.date(),
	date_of_sale_stop: z.date(),
	start_count_fuel_1: z.number().nullable(),
	stop_count_fuel_1: z.number().nullable(),
	start_count_gasoil_1: z.number().nullable(),
	stop_count_gasoil_1: z.number().nullable(),
	start_count_fuel_2: z.number().nullable(),
	stop_count_fuel_2: z.number().nullable(),
	start_count_gasoil_2: z.number().nullable(),
	stop_count_gasoil_2: z.number().nullable(),
	start_count_fuel_3: z.number().nullable(),
	stop_count_fuel_3: z.number().nullable(),
	start_count_gasoil_3: z.number().nullable(),
	stop_count_gasoil_3: z.number().nullable(),
	start_count_gaz: z.number().nullable(),
	stop_count_gaz: z.number().nullable()
});

export const validateNewDailySale = (data: any): NewDailySale | undefined => {
	const transformedData = {
		...data,
		amount_sold: Number.parseInt(data.amount_sold),
		amount_given: Number.parseInt(data.amount_given),
		date_of_sale_start: new Date(data.date_of_sale_start),
		date_of_sale_stop: new Date(data.date_of_sale_stop),
		start_count_fuel_1: Number.parseInt(data.start_count_fuel_1),
		stop_count_fuel_1: Number.parseInt(data.stop_count_fuel_1),
		start_count_gasoil_1: Number.parseInt(data.start_count_gasoil_1),
		stop_count_gasoil_1: Number.parseInt(data.stop_count_gasoil_1),
		start_count_fuel_2: Number.parseInt(data.start_count_fuel_2),
		stop_count_fuel_2: Number.parseInt(data.stop_count_fuel_2),
		start_count_gasoil_2: Number.parseInt(data.start_count_gasoil_2),
		stop_count_gasoil_2: Number.parseInt(data.stop_count_gasoil_2),
		start_count_fuel_3: Number.parseInt(data.start_count_fuel_3),
		stop_count_fuel_3: Number.parseInt(data.stop_count_fuel_3),
		start_count_gasoil_3: Number.parseInt(data.start_count_gasoil_3),
		stop_count_gasoil_3: Number.parseInt(data.stop_count_gasoil_3),
		start_count_gaz: Number.parseInt(data.start_count_gaz),
		stop_count_gaz: Number.parseInt(data.stop_count_gaz)
	};
	const parsedData = NewDailySaleSchema.parse(transformedData);

	return parsedData;
};

const FuelTankUpdateSchema = z.object({
	id: z.number(),
	quantity: z.number()
});

export const validateFuelTankUpdate = (
	data: any
): { id: number; quantity: number } | undefined => {
	const transformedData = {
		id: Number.parseInt(data.id),
		quantity: Number.parseInt(data.quantity)
	};
	const parsedData = FuelTankUpdateSchema.parse(transformedData);

	return parsedData;
};

const NewFuelSchema = z.object({
	name: z.string().min(3),
	purchase_price: z.number(),
	selling_price: z.number(),
	quantity_theory: z.number(),
	quantity_actual: z.number(),
	description: z.string().min(3),
	tank_id: z.number()
});

export const validateNewFuel = (data: any): NewFuel | undefined => {
	data.quantity = Number.parseInt(data.quantity);
	data.purchase_price = Number.parseInt(data.purchase_price);
	data.selling_price = Number.parseInt(data.selling_price);
	data.quantity_theory = Number.parseInt(data.quantity_theory);
	data.quantity_actual = Number.parseInt(data.quantity_actual);
	data.tank_id = Number.parseInt(data.tank_id);
	const parsedData = NewFuelSchema.parse(data);

	return parsedData;
};

export const validateEditedFuel = (data: any): Fuel | undefined => {
	const EditedFuelSchema = NewFuelSchema.extend({
		id: z.number()
	});

	data.id = Number.parseInt(data.id);
	data.quantity = Number.parseInt(data.quantity);
	data.purchase_price = Number.parseInt(data.purchase_price);
	data.selling_price = Number.parseInt(data.selling_price);
	data.quantity_theory = Number.parseInt(data.quantity_theory);
	data.quantity_actual = Number.parseInt(data.quantity_actual);
	data.tank_id = Number.parseInt(data.tank_id);
	const parsedData = EditedFuelSchema.parse(data);

	return {
		...parsedData,
		created_at: new Date(data.created_at),
		updatedAt: new Date(data.updatedAt)
	};
};
