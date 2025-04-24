import { PlaylistAddOutlined } from "@mui/icons-material";
import { State } from "state/state";
import { Alert, LogedUser, CartItem } from "types";

export type Action =
	| { type: "SET_MODE" }
	| { type: "SET_ALERT"; payload: Alert | null }
	| { type: "SET_LANGUAGE"; payload: "en" | "fr" }
	| { type: "SET_LOGGED_USER"; payload: LogedUser | null }
	| { type: "SET_CART_ITEMS"; payload: CartItem[] }
	| { type: "SET_ADD_ITEM_TO_CART"; payload: CartItem }
	| { type: "INCREMENT_ITEM_IN_CART"; payload: string }
	| { type: "DECREMENT_ITEM_IN_CART"; payload: string }
	| { type: "CLEAR_CART"; payload: null }
	| { type: "REMOVE_ITEM_FROM_CART"; payload: string }
	| { type: "SHOW_DIALOG"; payload: {isOpen: boolean, title: string, message: string, onConfirm?: () => void, cancelText?: string,
		confirmText?: string} };

export const toggleMode = (): Action => {
	return { type: "SET_MODE" };
};

export const setLogedUser = (loggedUser: LogedUser | null): Action => {
	return { type: "SET_LOGGED_USER", payload: loggedUser };
};

export const setAlert = (alert: Alert | null): Action => {
	return { type: "SET_ALERT", payload: alert };
};

export const setDefaultLanguage = (lang: "en" | "fr"): Action => {
	return { type: "SET_LANGUAGE", payload: lang };
};

export const setCartItems = (cartItem: CartItem[]): Action => {
	return { type: "SET_CART_ITEMS", payload: cartItem };
};

export const addItemToCart = (cartItem: CartItem): Action => {
	return { type: "SET_ADD_ITEM_TO_CART", payload: cartItem };
};

export const incrementItemInCart = (cartItemID: string): Action => {
	return { type: "INCREMENT_ITEM_IN_CART", payload: cartItemID };
};

export const decrementItemInCart = (cartItemID: string): Action => {
	return { type: "DECREMENT_ITEM_IN_CART", payload: cartItemID };
};

export const removeItemFromCart = (id: string): Action => {
	return { type: "REMOVE_ITEM_FROM_CART", payload: id };
};

export const clearCart = (): Action => {
	return { type: "CLEAR_CART", payload: null };
};

export const showDialog = (isOpen: boolean, title: string, message: string, onConfirm?: () => void, cancelText?: string, confirmText?: string): Action => {
	return { type: "SHOW_DIALOG", payload: {isOpen: isOpen,title: title, message: message, onConfirm: onConfirm, cancelText: cancelText, confirmText: confirmText} };
};

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SET_MODE":
			return { ...state, mode: state.mode === "dark" ? "light" : "dark" };

		case "SET_ALERT":
			return { ...state, alert: action.payload };

		case "SET_LANGUAGE":
			return { ...state, language: action.payload };

		case "SET_LOGGED_USER":
			return { ...state, logedUser: action.payload };

		case "SET_CART_ITEMS":
			return { ...state, cartItems: action.payload };

		case "SET_ADD_ITEM_TO_CART":
			const itemInCart = state.cartItems.find(i => i.id === action.payload.id);

			if (itemInCart) {
				const newCartItems = state.cartItems.map(cartItem => {
					if (cartItem.id === itemInCart.id) {
						return {
							...itemInCart,
							quantity: itemInCart.quantity + action.payload.quantity
						};
					}
					return cartItem;
				});

				return { ...state, cartItems: newCartItems };
			} else {
				// else add it to cart since it's not yet in the cart
				return {
					...state,
					cartItems: [...state.cartItems, action.payload]
				};
			}

		case "INCREMENT_ITEM_IN_CART": {
			const newCartItems = state.cartItems.map(item => {
				if (item.id === action.payload) {
					if (item.quantity_in_stock === item.quantity) {
						return item;
					}
					return { ...item, quantity: item.quantity + 1 };
				}
				return item;
			});
			return {
				...state,
				cartItems: newCartItems
			};
		}

		case "DECREMENT_ITEM_IN_CART": {
			const newCartItems = state.cartItems.map(item => {
				if (item.id === action.payload) {
					if (item.quantity === 1) {
						return item;
					}
					return { ...item, quantity: item.quantity - 1 };
				}
				return item;
			});
			return {
				...state,
				cartItems: newCartItems
			};
		}

		case "REMOVE_ITEM_FROM_CART": {
			const newCartItems = state.cartItems.filter(
				item => item.id !== action.payload
			);
			return {
				...state,
				cartItems: newCartItems
			};
		}

		case "CLEAR_CART": {
			
			return {
				...state,
				cartItems: []
			};
		}

		case "SHOW_DIALOG": {

			return {
				...state,
				confirmationDialog: {isOpen: action.payload.isOpen,
					title: action.payload.title,
					message: action.payload.message, 
					onConfirm: action.payload.onConfirm,
					cancelText: action.payload.cancelText,
					confirmText: action.payload.confirmText
				}
			};
		}

		default:
			return state;
	}
};
