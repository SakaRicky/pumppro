import supertest from "supertest";
import app from "../app";

const api = supertest(app);

describe("POST /login", () => {
	it("should fail and return 401 when given wrong username and password", async () => {
		const res = await api
			.post("/auth")
			.send({ username: "validusername", password: "validpassword" });

		expect(res.status).toBe(401);
		expect(res.text).toContain("invalid username or password");
	});

	it("should fail and return 401 when given either wrong username or password", async () => {
		const res = await api
			.post("/auth")
			.send({ username: "johndoe", password: "validpassword" });

		expect(res.status).toBe(401);
		expect(res.text).toContain("invalid username or password");
	});

	it("should return a JWT token when providing valid credentials", async () => {
		const res = await api
			.post("/auth")
			.send({ username: "johndoetest", password: "12345678" });

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("token");
	});
});
