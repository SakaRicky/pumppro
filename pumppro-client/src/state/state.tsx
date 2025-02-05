import React, { createContext, useReducer, useContext } from "react";
import { Alert, CartItem, LogedUser } from "types";
import { Action, reducer } from "state/reducer";
import { PaletteMode } from "@mui/material";

export type State = {
	logedUser: LogedUser | null;
	alert: Alert | null;
	mode: PaletteMode;
	language: "en" | "fr";
	cartItems: CartItem[] | [];
};

const initialState: State = {
	logedUser: null,
	alert: null,
	mode: "dark",
	cartItems: [],
	language: navigator.language === "fr" ? "fr" : "en"
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
	initialState,
	() => initialState
]);

type StateProp = {
	children: React.ReactElement;
};

export const StateProvider: React.FC<StateProp> = ({ children }: StateProp) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<StateContext.Provider value={[state, dispatch]}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateValue = () => useContext(StateContext);
