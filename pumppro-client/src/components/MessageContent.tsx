import { Box, Typography } from "@mui/material";
import React from "react";
import { MessageNotification } from "types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface MessageContentProps {
	message: MessageNotification;
	closeOpenedMessage: () => void;
}

export const MessageContent = ({
	message,
	closeOpenedMessage
}: MessageContentProps) => {
	return (
		<Box sx={{ p: "2rem", position: "relative", transition: "1s ease-in" }}>
			<Box sx={{ position: "absolute", top: "0.5rem", left: "1rem" }}>
				<ArrowBackIcon
					onClick={closeOpenedMessage}
					sx={{
						cursor: "pointer",
						fontSize: "2rem",
						p: "0.3rem",
						borderRadius: "50%",
						":hover": {
							backgroundColor: "rgba(166, 166, 166, 0.2)"
						}
					}}
				/>
			</Box>
			<Box sx={{ mt: "1.5rem" }}>
				<Typography
					fontSize="1.5rem"
					sx={{
						textAlign: "center",
						textDecoration: "underline",
						fontWeight: "700"
					}}
				>
					{message.title}
				</Typography>
			</Box>
			<Box sx={{ mt: "1rem" }}>
				<Typography fontSize="1rem">{message.message}</Typography>
			</Box>
		</Box>
	);
};
