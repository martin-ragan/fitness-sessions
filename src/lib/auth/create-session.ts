import { insertSession } from "@/db/sessions.service";
import { generateSecureRandomString } from "./crypto";
import { SessionWithToken } from "./session.types";

export const createSession = async (userId: number): Promise<SessionWithToken> => {
    const id = generateSecureRandomString();
    const secret = generateSecureRandomString() as any;
    const token = `${id}.${secret}`;

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