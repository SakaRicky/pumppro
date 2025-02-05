import React, { ChangeEvent } from "react";
import { FormControl, TextField } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { FormattedMessage } from "react-intl";

type Props = {
	label: string;
	type: React.HTMLInputTypeAttribute;
	name: string;
	multiline?: boolean;
	size?: "small" | "medium" | undefined;
	variant?: "filled" | "outlined";
};

interface configTextField {
	placeholder: string;
	size: "small" | "medium" | undefined;
	multiline?: boolean;
	type: React.HTMLInputTypeAttribute;
	error?: boolean;
	helperText?: string;
	label: string;
	fullWidth: boolean;
	variant: "filled" | "outlined";
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TextInput = ({ label, name, type, multiline, size, variant }: Props) => {
	const [field, meta] = useField(name);
	const { setFieldValue } = useFormikContext();

	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFieldValue(name, event.target.value);
	};

	const configTextField: configTextField = {
		...field,
		type: type,
		multiline: multiline,
		placeholder: `Enter ${name}`,
		size: size || "small",
		fullWidth: true,
		label: label,
		variant: variant || "filled",
		onChange: handleChange
	};

	if (meta && meta.touched && meta.error) {
		configTextField.error = Boolean(meta && meta.touched && meta.error);
		configTextField.helperText = meta.error;
	}
	return (
		<Box>
			<FormControl fullWidth>
				<TextField
					{...configTextField}
					InputProps={{
						inputProps: {
							min: 0
						}
					}}
				/>
			</FormControl>
		</Box>
	);
};

export default TextInput;
