import request from "supertest";
import app from "../app";
import { baseRoute } from "../routes/routes";
import { authAndGetToken } from "./test.utils";

describe("DELETE /employee", () => {
  describe("with correct accessToken", () => {
    let result: request.Response;
    let token: request.Response;
    beforeAll(async () => {
      token = await authAndGetToken();
    });
    describe("and with employee name", () => {
      beforeAll(async () => {
        result = await request(app)
          .delete(`${baseRoute}employee`)
          .send({ name: "Abhishek" })
          .set("Cookie", [`accessToken=${token}`]);
      });
      it("have success status", () => {
        expect(result.statusCode).toEqual(200);
      });
      it("have explanation text", () => {
        expect(result.text).toEqual("deleted successfully");
      });
    });
    describe("and with incorrect employee data", () => {
      beforeAll(async () => {
        result = await request(app)
          .delete(`${baseRoute}employee`)
          .set("Cookie", [`accessToken=${token}`]);
      });
      it("have failure status", () => {
        expect(result.statusCode).toEqual(400);
      });
      it("have object with errors", () => {
        expect(result.text).toEqual(
          JSON.stringify({ errors: [{ name: "Invalid value" }] })
        );
      });
    });
  });

  describe("with incorrect accessToken should", () => {
    let result: request.Response;
    beforeEach(async () => {
      result = await request(app)
        .delete(`${baseRoute}employee`)
        .send({ name: "Abhishek" });
    });
    it("have failure status", () => {
      expect(result.statusCode).toEqual(401);
    });
    it("have explanation text", () => {
      expect(result.text).toEqual("unauthorised");
    });
  });
});
