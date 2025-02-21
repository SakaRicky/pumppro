import { test, describe, beforeEach } from "node:test";
import prisma from "../../client";
import { testApi, authToken } from "./helper/setupTestDB";
import { AuthenticatedUSer, NewUser, User } from "../types";
import { createdUsers } from "../../prisma/seed";
import assert from "assert";

const userToSave: NewUser = {
    names: "New John Doe Test",
    username: "newjohndoetest",
    gender: "MALE",
    phone: "123456789",
    godfather_phone: "253142542",
    date_of_birth: new Date(2000, 0o2, 15),
    salary: 80000,
    email: "newjohndoe@gmail.com",
    cni_number: "0024585",
    password: "12345678",
    role: "ADMIN",
    localisation: "",
    profile_picture: "",
}

describe("Test the users route", () => {

    describe("CRUD operation by ADMIN", () => {

        
        test("should create a new user when posted by admin", async () => {

            const res = await testApi
                .post("/users")
                .send(userToSave)
                .set({
                    authorization: `bearer ${authToken}`
                });
            
            const savedUser = res.body as User;            

            assert.strictEqual(res.status, 200);
            const users = await prisma.user.findMany();
            assert.strictEqual(users.length, createdUsers.length + 1);
            
            // deleting this user so it doesn't mess up the DB
            await prisma.user.delete({where: {id: savedUser.id}})
        });

        test("should return users when authToken is given", async () => {
            const res = await testApi.get("/users").set({
                authorization: `bearer ${authToken}`
            });
            const users = res.body as User[];

            assert.strictEqual(res.status, 200);
            assert.strictEqual(users.length, createdUsers.length);
        });

        test("should update existing user", async () => {

            const userToEdit = await prisma.user.findUnique({
                where: { username: "newjohndoetest" }
            });

            if (userToEdit) {
                const res = await testApi
                    .put("/users")
                    .send({ ...userToEdit, names: userToEdit.names + " EDITED" })
                    .set({
                        authorization: `bearer ${authToken}`
                    });

                assert.strictEqual(res.status, 200);

                const updatedUser = await prisma.user.findUnique({where: {id: userToEdit.id}});
                assert.ok(updatedUser && updatedUser.names.includes("EDITED"), "User was not updated");

                const users = await prisma.user.findMany();
                assert.strictEqual(users.length, createdUsers.length)

                const editedUser = prisma.user.findUnique({
                    where: { username: userToEdit.username + "EDITED" }
                });
                // check if object is defined
                assert.ok(editedUser, 'editedUser is not defined')
            }
        });

        test("should delete existing user", async () => {
            const userToDelete = await prisma.user.findUnique({
                where: { username: "neymartest" }
            });
            if (userToDelete) {
                const res = await testApi
                    .delete("/users")
                    .send({ id: userToDelete.id })
                    .set({
                        authorization: `bearer ${authToken}`
                    });

                assert.strictEqual(res.status, 200);
                const users = await prisma.user.findMany();
                assert.strictEqual(users.length, createdUsers.length - 1);
            }
        });
    });

    describe("CRUD from non admin", () => {
        let nonAdminAuthUser: AuthenticatedUSer;

        beforeEach(async () => {
            const res = await testApi.post("/auth").send({
                username: "neymarjunior",
                password: "12345678"
            });

            nonAdminAuthUser = res.body as AuthenticatedUSer
        })

        test("shouldn't create a new user when posted by non ADMIN", async () => {

            const res = await testApi
                .post("/users")
                .send(userToSave)
                .set({
                    authorization: `bearer ${nonAdminAuthUser.token}`
                });

            assert.strictEqual(res.status, 401);
            const users = await prisma.user.findMany();

            // This test isn't working because the test "should create a new user when posted by admin"
            // added a new user to the DB and for 
            assert.strictEqual(users.length, createdUsers.length);
        });

        test("should return users when authToken is given", async () => {
            const res = await testApi.get("/users").set({
                authorization: `bearer ${authToken}`
            });

            const users = res.body as User[];

            assert.strictEqual(res.status, 200);
            assert.strictEqual(users.length, createdUsers.length);
        });

        test("shouldn't update existing user", async () => {
            const user = await prisma.user.findUnique({
                where: { username: "johndoetest" }
            });
            if (user) {
                const res = await testApi
                    .put("/users")
                    .send({ ...user, names: user.names + "EDITED" })
                    .set({
                        authorization: `bearer ${authToken}`
                    });

                assert.strictEqual(res.status, 401);
                const users = await prisma.user.findMany();
                assert.strictEqual(users.length, createdUsers.length);
                const editedUser = await prisma.user.findUnique({
                    where: { username: user.username + "EDITED" }
                });
                // check if editedUser is null
                assert.strictEqual(editedUser, null, 'editedUser is not null');
            }
        });

        test("shouldn't delete existing user", async () => {
            const user = await prisma.user.findUnique({
                where: { username: "neymartest" }
            });
            if (user) {
                const res = await testApi
                    .delete("/users")
                    .send({ id: user.id })
                    .set({
                        authorization: `bearer ${authToken}`
                    });

                assert.strictEqual(res.status, 401);
                const users = await prisma.user.findMany();
                assert.strictEqual(users.length, 2);
            }
        });
    });

    describe("When no authToken is given", () => {
        test("shouldn't return users if no authToken is given", async () => {
            const res = await testApi.get("/users");

            assert.strictEqual(res.status, 401);
            // Check if text contains the substring
            assert.ok(res.text.includes("token missing or invalid"), `"${res.text}" does not contain "${"token missing or invalid"}"`);
        });
    });
});
