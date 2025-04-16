import { JwtPayload } from "jwt-decode";

export interface ExtendedJwtPayload extends JwtPayload {
    email: string,
    role?: string
}