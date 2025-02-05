export {
	reducer,
	toggleMode,
	setDefaultLanguage,
	setAlert,
	setLogedUser,
	addItemToCart,
	setCartItems,
	incrementItemInCart,
	decrementItemInCart,
	removeItemFromCart
} from "state/reducer";
export { StateProvider, useStateValue } from "state/state";
export type { State } from "state/state";
