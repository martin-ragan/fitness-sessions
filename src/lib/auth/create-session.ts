import { insertSession } from "@/db/sessions.service";
import { generateSecureRandomString } from "./crypto";
import { SessionWithToken } from "./session.types";

export const createSession = async (): Promise<SessionWithToken> => {
    const id = generateSecureRandomString();
    const secret = generateSecureRandomString() as any;
    const token = `${id}.${secret}`;

    console.log(token);

    const value = await insertSession({
        id,
        secret,
    });

    return {
        ...value,
        token
  };
};