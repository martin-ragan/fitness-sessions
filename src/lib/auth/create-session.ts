import { insertSession } from "@/db/sessions.service";
import { generateSecureRandomString } from "./crypto";
import { SessionWithToken } from "./session.types";

export const createSession = async (userId: number): Promise<SessionWithToken> => {
    const id = generateSecureRandomString();
    const secretString = generateSecureRandomString();
    const secret = Buffer.from(secretString, 'utf-8');
    const token = `${id}.${secretString}`;

    const value = await insertSession({
        id,
        secret,
        userId
    });

    return {
        ...value,
        token
  };
};