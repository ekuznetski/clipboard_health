import request from "supertest";
import app from "../app";

export async function authAndGetToken() {
  return (
    await request(app).post("/api/v1/login").send({
      username: "user1",
      password: "password1",
    })
  ).header["set-cookie"][0].split("accessToken=")[1];
}
