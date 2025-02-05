import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { MessageNotification } from "types";
import { timeAgo } from "utils/dateTimeUtils";

interface MessageCardProps {
	message: MessageNotification;
}
export const MessageCard = ({ message }: MessageCardProps) => {
	const theme = useTheme();
	return (
		<Box
			sx={{
				cursor: "pointer",
				height: "100%",
				boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				position: "relative",
				p: "1rem",

				":hover": {
					backgroundColor: "rgba(166, 166, 166, 0.2)"
				}
			}}
		>
			<Typography fontSize="1.2rem" fontWeight={message.read ? "100" : "900"}>
				{message.title}
			</Typography>
			<Box sx={{ position: "absolute", bottom: "0.5rem", left: "1rem" }}>
				<Typography>{timeAgo(new Date(message.created_at))}</Typography>
			</Box>
		</Box>
	);
};
