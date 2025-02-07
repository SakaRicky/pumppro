const info = (messages: string, data?: string) => {
	console.log(messages, data ? data : "");
};

const error = (error: string, data?: string) => {
	console.error(error, data ? data : "");
};

export default { info, error };
