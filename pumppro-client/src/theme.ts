import { createTheme, PaletteMode, ThemeOptions } from "@mui/material";
import { blue, red } from "@mui/material/colors";

declare module "@mui/material" {
	export interface TypeBackground {
		main: string;
		alt: string;
	}
}

declare module "@mui/material/styles" {
	interface Palette {
		neutral: Palette["grey"];
	}

	interface PaletteOptions {
		neutral: PaletteOptions["grey"];
	}

	interface PaletteColor {
		darker?: string;
		lighter?: string;
		50: string;
		100: string;
		200: string;
		300: string;
		400: string;
		500: string;
		600: string;
		700: string;
		800: string;
		900: string;
	}

	interface SimplePaletteColorOptions {
		darker?: string;
		lighter?: string;
		50: string;
		100: string;
		200: string;
		300: string;
		400: string;
		500: string;
		600: string;
		700: string;
		800: string;
		900: string;
	}
}

// color design tokens export
export const tokensDark = {
	grey: {
		50: "#fff",
		100: "#f2f2f2",
		200: "#d9d9d9",
		300: "#bfbfbf",
		400: "#a6a6a6",
		500: "#8c8c8c",
		600: "#737373",
		700: "#595959",
		800: "#404040",
		900: "#262626",
		1000: "#0d0d0d"
	},
	primary: {
		// blue
		50: "#f6f9ff",
		100: "#e6f5fe",
		200: "#b4e2fd",
		300: "#51bbfb",
		400: "#1fa7fa",
		500: "#058ee0",
		600: "#046eae",
		700: "#046eae",
		800: "#2f3045",
		900: "#262736"
	},
	secondary: {
		50: blue[50],
		100: blue[100],
		200: blue[200],
		300: blue[300],
		400: blue[400],
		500: blue[500],
		600: blue[600],
		700: blue[700],
		800: blue[800],
		900: blue[900]
	}
};

// color design tokens export
export const tokensLight = {
	grey: {
		50: "#000000",
		100: "#141414",
		200: "#292929",
		300: "#3d3d3d",
		400: "#525252",
		500: "#666666",
		600: "#858585",
		700: "#a3a3a3",
		800: "#c2c2c2",
		900: "#e0e0e0",
		1000: "#fff"
	},
	primary: {
		// blue
		50: "#d3d4de",
		100: "#d3d4de",
		200: "#a6a9be",
		300: "#7a7f9d",
		400: "#4d547d",
		500: "#21295c",
		600: "#191F45",
		700: "#141937",
		800: "#0d1025",
		900: "#070812"
	},
	secondary: {
		50: blue[900],
		100: blue[800],
		200: blue[700],
		300: blue[600],
		400: blue[500],
		500: blue[400],
		600: blue[300],
		700: blue[200],
		800: blue[100],
		900: blue[50]
	}
};

const { palette } = createTheme();
const { augmentColor } = palette;

// mui theme settings
export const themeSettings = (mode: PaletteMode): ThemeOptions => {
	return {
		palette: {
			mode: mode,
			...(mode === "dark"
				? {
						// palette values for dark mode
						primary: {
							...tokensDark.primary,
							main: tokensDark.primary[500],
							light: tokensDark.primary[200],
							lighter: tokensDark.primary[50],
							dark: tokensDark.primary[800],
							darker: tokensDark.primary[900]
						},
						secondary: {
							...tokensDark.secondary,
							main: tokensDark.secondary[500],
							light: tokensDark.secondary[300],
							lighter: tokensDark.secondary[300]
						},
						neutral: {
							...tokensDark.grey
						},
						background: {
							default: tokensDark.primary[900],
							alt: tokensDark.primary[800]
						},
						text: {
							primary: tokensDark.grey[100],
							secondary: tokensDark.grey[300]
						},
						cat1: augmentColor({ color: red })
				  }
				: {
						// palette values for light mode
						primary: {
							...tokensLight.primary,
							main: tokensDark.primary[500],
							light: tokensDark.primary[300],
							lighter: tokensDark.primary[300]
						},
						secondary: {
							...tokensLight.secondary,
							main: tokensLight.secondary[500],
							light: tokensLight.secondary[300],
							lighter: tokensLight.secondary[300]
						},
						neutral: {
							...tokensLight.grey
						},
						background: {
							default: tokensDark.primary[50],
							alt: tokensDark.grey[50]
						},
						text: {
							primary: tokensDark.grey[800],
							secondary: tokensDark.grey[700]
						}
				  })
		},
		typography: {
			fontFamily: ["Inter", "sans-serif"].join(","),
			fontSize: 12,
			h1: {
				fontFamily: ["Inter", "sans-serif"].join(","),
				fontSize: 40
			},
			h2: {
				fontFamily: ["Inter", "sans-serif"].join(","),
				fontSize: 32
			},
			h3: {
				fontFamily: ["Inter", "sans-serif"].join(","),
				fontSize: 24
			},
			h4: {
				fontFamily: ["Inter", "sans-serif"].join(","),
				fontSize: 20
			},
			h5: {
				fontFamily: ["Inter", "sans-serif"].join(","),
				fontSize: 16
			},
			h6: {
				fontFamily: ["Inter", "sans-serif"].join(","),
				fontSize: 14
			},
			button: {
				textTransform: "none"
			}
		}
	};
};
