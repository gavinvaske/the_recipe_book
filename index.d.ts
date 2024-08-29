import { TokenPayload } from "./application/api/middleware/authorize.ts"

export {}

declare global {
  namespace Express {
    export interface Request {
      user: TokenPayload
    }
  }
}