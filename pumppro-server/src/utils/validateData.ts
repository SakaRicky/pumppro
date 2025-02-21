import { Fuel, Gender, Role } from "@prisma/client";
import { z } from "zod";
import {
	DailySale,
	FuelType,
	NewDailySale,
	NewFuel,
	NewProduct,
	NewProductCategory,
	NewUser,
	ProductCategory,
	ProductType,
	SaleItem
} from "../types";
import { Decimal } from "@prisma/client/runtime/library";

const NewUserSchema = z.object({
	names: z.string().min(3),
	username: z.string().min(3),
	date_of_birth: z.date(),
	gender: z.enum([Gender.FEMALE, Gender.MALE]),
	phone: z.string().min(9),
	salary: z.number().positive(),
	godfather_phone: z.string(),
	localisation: z.string().optional(),
	cni_number: z.string(),
	email: z.string().optional(),
	password: z.string().optional(),
	profile_picture: z.union([z.string().url(), z.literal("")]).optional(),
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
	purchase_price: z.instanceof(Decimal),
	selling_price: z.instanceof(Decimal),
	low_stock_threshold: z.number()
});

export const validateNewProduct = (data: any): NewProduct | undefined => {
	data.quantity = Number.parseInt(data.quantity);
	data.purchase_price = new Decimal(data.purchase_price);
	data.selling_price = new Decimal(data.selling_price);
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
	data.purchase_price = new Decimal(data.purchase_price);
	data.selling_price = new Decimal(data.selling_price);
	data.low_stock_threshold = Number.parseInt(data.low_stock_threshold);
	const parsedData = EditedProductSchema.parse(data);

	return {
		...parsedData,
		created_at: new Date(data.created_at),
		updated_at: new Date(data.updated_at)
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

const NewFuelSchema = z.object({
	name: z.string().min(3),
	purchase_price: z.instanceof(Decimal),
	selling_price: z.instanceof(Decimal),
	quantity_theory: z.number(),
	quantity_actual: z.number(),
	fuel_type: z.enum([FuelType.FUEL, FuelType.GASOIL, FuelType.GAS_BOTTLE, FuelType.PETROL]),
	description: z.string().min(3),
	tank_id: z.number()
});

// const FuelSchema = NewFuelSchema.extend({
//     id: z.number(),
// });

export const validateNewFuel = (data: any): NewFuel | undefined => {
	data.quantity = Number.parseInt(data.quantity);
	data.purchase_price = new Decimal(data.purchase_price);
	data.selling_price = new Decimal(data.selling_price);
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
	data.purchase_price = new Decimal(data.purchase_price);
	data.selling_price = new Decimal(data.selling_price);
	data.quantity_theory = Number.parseInt(data.quantity_theory);
	data.quantity_actual = Number.parseInt(data.quantity_actual);
	data.tank_id = Number.parseInt(data.tank_id);
	const parsedData = EditedFuelSchema.parse(data);

	return {
		...parsedData,
		created_at: new Date(data.created_at),
		updated_at: new Date(data.updated_at)
	};
};

// Define the FuelCount schema
const FuelCountSchema = z.object({
  fuel_id: z.number(),
  start_count: z.number(),
  stop_count: z.number()
});

// Define the NewDailySale schema with FuelCounts
const NewDailySaleSchema = z.object({
  user_id: z.string(),
  amount_sold: z.instanceof(Decimal),
  amount_given: z.instanceof(Decimal),
  date_of_sale_start: z.date(),
  date_of_sale_stop: z.date(),
  fuel_counts: z.array(FuelCountSchema) // Adding FuelCounts array validation
});

const ExistingDailySaleSchema = NewDailySaleSchema.extend({
	id: z.number(),
	created_at: z.date(),
	updated_at: z.date(),
});

export const validateNewDailySale = (data: any): NewDailySale | undefined => {

	const transformedData = {
    ...data,
    amount_sold: new Decimal(data.amount_sold), // Use `Number()` to support decimals
    amount_given: new Decimal(data.amount_given),
    date_of_sale_start: new Date(data.date_of_sale_start),
    date_of_sale_stop: new Date(data.date_of_sale_stop),
    fuel_counts: data.fuel_counts?.map((fuel: any) => ({
      fuel_id: Number(fuel.fuel_id),
      start_count: Number(fuel.start_count),
      stop_count: Number(fuel.stop_count)
    })) ?? []
  };

  const parsedData = NewDailySaleSchema.parse(transformedData);

  return parsedData;
};

export const validateExistingDailySale = (data: any): DailySale | undefined => {

	const transformedData = {
    ...data,
	id: Number(data.id),
    amount_sold: new Decimal(data.amount_sold),
    amount_given: new Decimal(data.amount_given),
    date_of_sale_start: new Date(data.date_of_sale_start),
    date_of_sale_stop: new Date(data.date_of_sale_stop),
    fuel_counts: data.fuel_counts?.map((fuel: any) => ({
      fuel_id: Number(fuel.fuel_id),
      start_count: Number(fuel.start_count),
      stop_count: Number(fuel.stop_count)
    })) ?? [],
	created_at: new Date(data.created_at),
	updated_at: new Date(data.updated_at),
  };

  const parsedData = ExistingDailySaleSchema.parse(transformedData);

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

