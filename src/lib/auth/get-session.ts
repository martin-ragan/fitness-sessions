import { getSession } from "@/db/sessions.service";
import { InsertSession } from "@/db/schema";

export async function validateSessionToken(token: string): Promise<InsertSession | null> {
	const tokenParts = token.split(".");

	if (tokenParts.length !== 2) {
		return null;
	}

	const [sessionId] = tokenParts;

	const session = await getSession(sessionId);

	if (!session) {
		return null;
	}

	return session;
}