import request from "supertest";
import app from "../app";
import { baseRoute } from "../routes/routes";

describe("POST /login", () => {
  describe("with correct credentials should", () => {
    let result: request.Response;
    beforeEach(async () => {
      result = await request(app).post(`${baseRoute}login`).send({
        username: "user1",
        password: "password1",
      });
    });
    it("have success status", () => {
      expect(result.statusCode).toEqual(200);
    });
    it("have explanation text", () => {
      expect(result.text).toEqual("login successful");
    });
    it("have accessToken cookie", () => {
      expect(result.header["set-cookie"]).toBeTruthy();
    });
  });

  describe("with incorrect credentials should", () => {
    let result: request.Response;
    beforeEach(async () => {
      result = await request(app).post(`${baseRoute}login`).send({
        username: "123",
        password: "password1",
      });
    });
    it("have failure status", () => {
      expect(result.statusCode).toEqual(500);
    });
    it("have explanation text", () => {
      expect(result.text).toEqual("incorrect username or password");
    });
  });
});
