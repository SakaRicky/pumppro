const info = (messages: string, data?: string) => {
	if (process.env.NODE_ENV !== "test") {
		console.log(messages, data ? data : "");
	}
};

const error = (error: string, data?: string) => {
	if (process.env.NODE_ENV !== "test") {
		console.error(error, data ? data : "");
	}
};

export default { info, error };
