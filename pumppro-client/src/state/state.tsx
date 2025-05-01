import React, { createContext, useReducer, useContext } from "react";
import { Alert, CartItem, LogedUser } from "types";
import { Action, reducer } from "state/reducer";
import { PaletteMode } from "@mui/material";

export interface ConfirmationDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: (() => void) | null;
}

export type State = {
  logedUser: LogedUser | null;
  alert: Alert | null;
  mode: PaletteMode;
  language: "en" | "fr";
  cartItems: CartItem[] | [];
  confirmationDialog: ConfirmationDialogState;
};

const initialConfirmationDialogState: ConfirmationDialogState = {
  isOpen: false,
  title: "",
  message: "",
  cancelText: "Cancel",
  confirmText: "Confirm",
  onConfirm: null,
};

const initialState: State = {
  logedUser: null,
  alert: null,
  mode: "dark",
  cartItems: [],
  language: navigator.language === "fr" ? "fr" : "en",
  confirmationDialog: initialConfirmationDialogState,
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState,
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
