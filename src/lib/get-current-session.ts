import { SelectSession } from "@/db/schema";
import { cookies } from "next/headers";
import { cache } from "react";
import { validateSessionToken } from "./auth/get-session";

export const getCurrentSession = cache(async (): Promise<SelectSession | null> => {
    'use server';
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value ?? null;

	if (token === null) {
		return null;
	}

	const result = await validateSessionToken(token);
	return result;
});