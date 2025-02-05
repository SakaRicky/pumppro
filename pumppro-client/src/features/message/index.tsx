import React from "react";
import { Box, Typography } from "@mui/material";
import { MessageCard } from "./components/MessageCard";
import { MessageNotification } from "types";

interface NotificationMessagesProps {
	messages: MessageNotification[] | undefined;
	handleMessageClick: (m: MessageNotification) => void;
}

export const NotificationMessages = ({
	messages,
	handleMessageClick
}: NotificationMessagesProps) => {
	if (!messages || messages.length === 0) {
		return <Box>No message</Box>;
	}

	const unreadMessages = messages?.filter(m => m.read === false);
	const readMessages = messages?.filter(m => m.read === true);

	return (
		<Box
			sx={{
				height: "20%"
			}}
		>
			<Typography fontSize="1.5rem" textAlign="center">
				Messages
			</Typography>
			{unreadMessages?.map(m => {
				return (
					<Box
						key={m.id}
						sx={{ height: "100%", m: "1rem 0", border: "1rem" }}
						onClick={() => handleMessageClick(m)}
					>
						<MessageCard message={m} />
					</Box>
				);
			})}
			{readMessages?.map(m => {
				return (
					<Box
						key={m.id}
						sx={{ height: "100%", m: "1rem 0", border: "1rem" }}
						onClick={() => handleMessageClick(m)}
					>
						<MessageCard message={m} />
					</Box>
				);
			})}
		</Box>
	);
};
