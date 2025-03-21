import {
	Gender,
	Prisma,
	Role,
	Product,
	SaleDetail,
	Tank,
	Fuel,
	FuelSale,
	MessageNotification,
	DailySalesSummary as PrismaDailySaleSummary,
	Sale
} from "@prisma/client";

export type User = {
	id: string;
	names: string;
	username: string;
	date_of_birth: Date;
	gender: Gender;
	phone: string;
	salary: number;
	godfather_phone: string;
	localisation?: string;
	cni_number: string;
	email?: string;
	password_hash?: string;
	profile_picture?: string;
	role: Role;
};

export type NewUser = Omit<User, "id" | "password_hash"> & {
	password?: string;
};

export type UserToAuth = {
	username: string;
	password: string;
};

export type AuthenticatedUSer = {
	id: string;
	username: string;
	role: string;
	profilePicture?: string | null;
	token: string;
	messages: MessageNotification[];
};

export type ProductType = Omit<Product, "description" | "image"> & {
	description?: string | null;
	image?: string | null;
};

export type NewProduct = Omit<ProductType, "id" | "created_at" | "updated_at">;

export type ProductCategory = {
	id: string;
	name: string;
	description?: string;
};

export type NewProductCategory = Omit<ProductCategory, "id">;

// export type SaleItem = {
// 	productID: string;
// 	quantity: number;
// };

export type NewSale = Omit<Sale, "total" | "id" | "created_at" | "updated_at"> & {sale_details: NewSaleDetail[]};

export type NewSaleDetail = Omit<SaleDetail, "id" | "sale_id" | "created_at" | "updated_at">;
export type NewSaleDetail2 = Prisma.SaleDetailCreateInput;

export type SaleWithDetails = Prisma.SaleGetPayload<{
	include: {
	  sale_details: true
	}
  }>

// 1: Define a type that includes the relation to `Post`
const saleDetailsWithWithPosts = Prisma.validator<Prisma.SaleDetailArgs>()({
	include: { product: true }
});

// 3: This type will include a user and all their posts
export type SaleDetailWithProduct = Prisma.SaleDetailGetPayload<
	typeof saleDetailsWithWithPosts
>;

export type SaleDetailType = SaleDetail;

export type NewSaleDetails = Omit<
	SaleDetailType,
	"id" | "sale_id" | "created_at" | "updated_at"
>;

export type NewFuelSale = Omit<
FuelSale,
	"id" | "daily_sale_id" | "created_at" | "updated_at" | "quantity_sold" | "total_amount"
>

export type NewDailySaleSummary = Omit<
DailySaleSummary,
	"id" | "created_at" | "updated_at"
> 

export type DailySaleSummary = PrismaDailySaleSummary & {
	fuel_sales?: NewFuelSale[]; 
}

export enum FuelType {
	FUEL = "FUEL",
	GASOIL = "GASOIL",
	PETROL = "PETROL",
	GAS_BOTTLE = "GAS_BOTTLE"
}

export type NewTank = Omit<Tank, "id" | "created_at" | "updated_at">;

export type NewFuel = Omit<Fuel, "id" | "created_at" | "updated_at">;

export type NewMessage = Omit<MessageNotification, "id" | "created_at" | "updated_at">;
