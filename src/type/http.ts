import { Request } from "express";

export interface UserType {
  id: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: UserType;
}
