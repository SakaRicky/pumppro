import app from "./app"; // the actual Express application
import http from "http";
import config from "./utils/config";

const server = http.createServer(app);

const PORT = config.PORT;

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
