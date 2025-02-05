import { Radio, RadioGroup } from "@mui/material";
import { TextField } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import React, { ChangeEvent } from "react";
import { UseFormRegister } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { Gender, Role } from "types";

type Props = {
	label?: string;
	name: string;
	options: Gender[] | Role[];
};

const RadioGroupInput = ({ label, name, options }: Props) => {
	const [field, meta] = useField(name);
	const { setFieldValue } = useFormikContext();

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		setFieldValue(name, value);
	};

	const configRadioGroup: any = {
		...field,
		name,
		onChange: handleChange
	};

	if (meta && meta.touched && meta.error) {
		configRadioGroup.error = meta && meta.touched && meta.error;
		configRadioGroup.helpertext = meta.error;
	}

	return (
		<Box>
			{label && (
				<Typography>
					<FormattedMessage id={`form.worker.${name}`} defaultMessage={label} />
				</Typography>
			)}
			<RadioGroup row {...configRadioGroup}>
				{options.map(option => (
					<FormControlLabel
						key={option}
						value={option}
						control={<Radio />}
						label={option.toUpperCase()}
					/>
				))}
			</RadioGroup>
		</Box>
	);
};

export default RadioGroupInput;
