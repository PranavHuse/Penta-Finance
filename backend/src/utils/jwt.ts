import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  sub: string; // user id
  email: string;
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  return jwt.verify(token, secret) as JwtPayload;
}