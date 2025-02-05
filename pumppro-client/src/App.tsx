import React, { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "pages/layout";
import Login from "pages/login";
import Dashboard from "pages/dashboard";
import Products from "pages/products";
import { useStateValue } from "state";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { themeSettings } from "theme";
import { IntlProvider } from "react-intl";
import messages_fr from "./translations/fr.json";
import Workers from "pages/workers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import Shop from "pages/shop";
import Sales from "pages/sales";
import SalesByForm from "pages/SaleForm";
import Fuels from "pages/fuel";
import Perfomances from "pages/perfomances";

function App() {
	const [state] = useStateValue();
	const mode = state.mode;
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const message = state.language === "fr" ? messages_fr : undefined;

	return (
		<div className="app">
			<IntlProvider locale={state.language} messages={message}>
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<BrowserRouter>
						<ThemeProvider theme={theme}>
							<CssBaseline />

							<Routes>
								<Route element={<Layout />}>
									<Route
										path="/"
										element={
											!state.logedUser ? (
												<Navigate to="/login" />
											) : (
												<Navigate to="/dashboard" />
											)
										}
									/>

									<Route path="/dashboard" element={<Dashboard />} />
									<Route path="/products" element={<Products />} />
									<Route path="/workers" element={<Workers />} />
									<Route path="/shop" element={<Shop />} />
									<Route path="/sales" element={<Sales />} />
									<Route path="/salesform" element={<SalesByForm />} />
									<Route path="/fuels" element={<Fuels />} />
									<Route path="/perfomances" element={<Perfomances />} />
								</Route>
								<Route path="/login" element={<Login />} />
							</Routes>
						</ThemeProvider>
					</BrowserRouter>
				</LocalizationProvider>
			</IntlProvider>
		</div>
	);
}

export default App;
