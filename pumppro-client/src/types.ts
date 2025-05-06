export type User = {
  id: string;
  names: string;
  username: string;
  date_of_birth: Date;
  gender: Gender;
  phone: string;
  salary: number;
  CNI_number: string;
  godfather_phone?: string;
  localisation?: string;
  email?: string;
  profile_picture?: string;
  role: Role;
  messages: MessageNotification[];
};

export type NewUser = Omit<User, "id" | "password_hash" | "messages"> & {
  password?: string;
  passwordConfirmation?: string;
};

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface LogedUser {
  id: string;
  role: Role;
  username: string;
  token: string;
  profilePicture: string;
}

export enum Role {
  ADMIN = "ADMIN",
  SALE = "SALE",
  PUMPIST = "PUMPIST",
  USER = "USER",
}

export type Alert = {
  show: boolean;
  title: string;
  message: string;
  type: AlertType;
};

export type AlertType = "success" | "error" | "info" | "warning" | undefined;

// export type Notification = "success" | "info" | "warning" | "error" | undefined;

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description?: string;
  image?: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
};

export type NewProduct = Omit<
  Product,
  "id" | "category" | "created_at" | "updated_at"
> & {
  category_id: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  description?: string;
};

export type NewProductCategory = Omit<ProductCategory, "id">;

export type CartItem = {
  id: string;
  name: string;
  image: string | undefined;
  quantity: number;
  quantity_in_stock: number;
  unit_price: number;
};

export type Sale = {
  id: string;
  total: number;
  user: User;
  sale_details: SaleDetails[];
  created_at: Date;
};

export type SaleDetails = {
  id: string;
  product: Product;
  unit_price: number;
  quantity: number;
  total_amount: number;
};

export type SalesSummary = {
  product_id: string;
  name: string;
  image: string;
  amount: number;
  quantity_in_stock: number;
  selling_price: number;
  number_sold: number;
};

export type DailySale = {
  id: string;
  amount_sold: number;
  amount_given: number;
  difference: number;
  date_of_sale_start: Date;
  date_of_sale_stop: Date;
  start_count_gasoil_1?: number;
  stop_count_gasoil_1?: number;
  start_count_fuel_1?: number;
  stop_count_fuel_1?: number;
  start_count_gasoil_2?: number;
  stop_count_gasoil_2?: number;
  start_count_fuel_2?: number;
  stop_count_fuel_2?: number;
  start_count_gasoil_3?: number;
  stop_count_gasoil_3?: number;
  start_count_fuel_3?: number;
  stop_count_fuel_3?: number;
  start_count_gaz?: number;
  stop_count_gaz?: number;
  created_at: Date;
};

export type NewDailySale = Omit<DailySale, "id" | "created_at"> & {
  user_id: string;
};

export enum FuelCategories {
  FUEL = "FUEL",
  GASOIL = "GASOIL",
  PETROL = "PETROL",
  GAZ = "GAZ",
}

export type Tank = {
  id: number;
  capacity: number;
  name: string;
  created_at: Date;
  updated_at: Date;
};

export type NewTank = Omit<Tank, "id" | "created_at" | "updated_at">;

export type Fuel = {
  id: number;
  purchase_price: number;
  selling_price: number;
  quantity_theory: number;
  quantity_actual: number;
  name: string;
  description: string;
  fuel_type: FuelCategories;
  tank: Tank;
  tank_id: number;
  created_at: Date;
  updated_at: Date;
};

export type NewFuel = Omit<
  Fuel,
  "id" | "created_at" | "updated_at" | "tank"
> & {
  tank_id: number;
};

export type MessageNotification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
};

export type ConfirmationDialog = {
  message: string;
};
