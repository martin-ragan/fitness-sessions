import { getSession } from "@/db/sessions.service";
import { SelectSession } from "@/db/schema";

export async function validateSessionToken(token: string): Promise<SelectSession | null> {
	const tokenParts = token.split(".");

	if (tokenParts.length !== 2) {
		return null;
	}

	const [sessionId, sessionSecret] = tokenParts;

	const session = await getSession(sessionId);

    console.log('get-session', session.secret.toString(), sessionSecret)
	if (!session || session.secret.toString() !== sessionSecret) {
		return null;
	}

	return session;
}