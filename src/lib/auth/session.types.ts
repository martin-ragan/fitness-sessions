import { InsertSession } from "@/db/schema";

export interface SessionWithToken extends InsertSession {
    token: string;
}