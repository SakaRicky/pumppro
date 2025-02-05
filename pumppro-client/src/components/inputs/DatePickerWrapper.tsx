import { Box, TextField, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useFormikContext } from "formik";
import React from "react";
import { FormattedMessage } from "react-intl";

type DatePickerWrapperProps = {
	label?: string;
	name?: string;
	value?: Date;
};

const DatePickerWrapper = ({ label, name, value }: DatePickerWrapperProps) => {
	const { setFieldValue } = useFormikContext();

	const handleDateChange = (newValue: Date | null) => {
		setFieldValue("date_of_birth", newValue);
	};
	return (
		<DesktopDatePicker
			inputFormat="MM/DD/YYYY"
			value={value}
			onChange={handleDateChange}
			renderInput={params => {
				return (
					<Box>
						{label && (
							<Typography>
								<FormattedMessage
									id={`form.worker.${name}`}
									defaultMessage={label}
								/>
							</Typography>
						)}
						<TextField size="small" variant="filled" {...params} />
					</Box>
				);
			}}
		/>
	);
};

export default DatePickerWrapper;
