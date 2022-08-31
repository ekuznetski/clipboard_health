import request from "supertest";
import app from "../app";
import { EFilter } from "../domain/enums/filterby.enum";
import { EGroup } from "../domain/enums/groupby.enum";
import { baseRoute } from "../routes/routes";

async function getRequest(
  query: {
    filterby?: string;
    groupby?: string;
  } = {}
) {
  return request(app).get(`${baseRoute}salaryStat`).query(query);
}

describe("GET /salaryStat", () => {
  describe("with correct params", () => {
    let result: request.Response;
    describe("for general salary statistics", () => {
      beforeAll(async () => {
        result = await getRequest();
      });
      it("have success status", async () => {
        expect(result.statusCode).toEqual(200);
      });
      it("have correct mean, min, max values", async () => {
        expect(result.body).toMatchObject({
          mean: 22295010,
          min: 30,
          max: 200000000,
        });
      });
    });
    describe("with filterby onContract", () => {
      beforeAll(async () => {
        result = await getRequest({ filterby: EFilter.onContract });
      });
      it("have success status", async () => {
        expect(result.statusCode).toEqual(200);
      });
      it("have correct mean, min, max values", async () => {
        expect(result.body).toMatchObject({
          mean: 100000,
          min: 90000,
          max: 110000,
        });
      });
    });
    describe("with groupby department", () => {
      beforeAll(async () => {
        result = await getRequest({ groupby: EGroup.department });
      });
      it("have success status", async () => {
        expect(result.statusCode).toEqual(200);
      });
      it("have correct mean, min, max values", async () => {
        expect(result.body).toMatchObject({
          Engineering: {
            mean: 40099006,
            min: 30,
            max: 200000000,
          },
          Banking: {
            mean: 90000,
            min: 90000,
            max: 90000,
          },
          Operations: {
            mean: 35015,
            min: 30,
            max: 70000,
          },
          Administration: {
            mean: 30,
            min: 30,
            max: 30,
          },
        });
      });
    });
    describe("with groupby subdepartment", () => {
      beforeAll(async () => {
        result = await getRequest({ groupby: EGroup.subdepartment });
      });
      it("have success status", async () => {
        expect(result.statusCode).toEqual(200);
      });
      it("have correct mean, min, max values", async () => {
        expect(result.body).toMatchObject({
          Engineering: {
            Platform: {
              mean: 40099006,
              min: 30,
              max: 200000000,
            },
          },
          Banking: {
            Loan: {
              mean: 90000,
              min: 90000,
              max: 90000,
            },
          },
          Operations: {
            CustomerOnboarding: {
              mean: 35015,
              min: 30,
              max: 70000,
            },
          },
          Administration: {
            Agriculture: {
              mean: 30,
              min: 30,
              max: 30,
            },
          },
        });
      });
    });
  });

  describe("with incorrect params", () => {
    beforeAll(async () => {
      result = await getRequest({ filterby: "test", groupby: "test" });
    });
    let result: request.Response;
    it("have failure status", () => {
      expect(result.statusCode).toEqual(400);
    });
    it("have object with errors", () => {
      expect(result.text).toEqual(
        JSON.stringify({
          errors: [{ filterby: "Invalid value" }, { groupby: "Invalid value" }],
        })
      );
    });
  });
});
