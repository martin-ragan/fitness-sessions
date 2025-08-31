import { NextRequest, NextResponse } from "next/server";
import { validateSessionToken } from "@/lib/auth/get-session";

export async function middleware(request: NextRequest) {
	const sessionToken = request.cookies.get("session")?.value ?? null;
	const protectedPaths = ["/workouts"];
	const isProtected = protectedPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path)
	);

    console.log("middleware", sessionToken);
	if (!sessionToken) {
		if (isProtected) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		return NextResponse.next();
	}


	const session = await validateSessionToken(sessionToken);

	if (!session) {
		if (isProtected) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		const response = NextResponse.next();
		response.cookies.delete("session");

		return response;
	}

	if (
		request.nextUrl.pathname === "/" ||
		request.nextUrl.pathname === "/signup"
	) {
		return NextResponse.redirect(new URL("/workouts", request.url));
	}

	const response = NextResponse.next();
	return response;
}

export const config = {
	matcher: ["/", "/signup", "/workouts"]
};