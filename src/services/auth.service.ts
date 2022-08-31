import jwt from "jsonwebtoken";
import usersMock from "./../mockUsers.json";

const users: { [x: string]: string } = usersMock;

interface IUserCredentials {
  username: string;
  password: string;
}

function getAccessToken(credentials: IUserCredentials): Promise<string> {
  return new Promise(async (resolve, reject) => {
    // passwords should be encrypted, but i simplified
    if (users[credentials.username] === credentials.password) {
      const token = await createToken(credentials).catch((e) => {
        return reject(e);
      });
      if (token) {
        resolve(token);
      }
    } else {
      reject("incorrect username or password");
    }
  });
}

function createToken(credentials: IUserCredentials): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!process.env.TOKEN_SECRET) {
      return reject("JWT secret is empty");
    }
    return resolve(
      jwt.sign(credentials, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES_IN ?? "3h",
      })
    );
  });
}

function getRefreshToken(token: string) {
  return new Promise((resolve, reject) => {
    if (!process.env.TOKEN_SECRET) {
      return reject("JWT secret is empty");
    }
    const verifiedData = jwt.verify(token, process.env.TOKEN_SECRET);
    if (typeof verifiedData !== "string") {
      if (
        verifiedData.exp &&
        verifiedData.exp < Math.round(new Date().getTime() / 1000)
      ) {
        reject("token expired");
      }
      const { username, password } = verifiedData;
      if (username && password && users[username] === password) {
        resolve(createToken({ username, password }));
      }
    }
    reject("incorrect token");
  });
}

const authService = {
  getAccessToken,
  getRefreshToken,
};
export default authService;
