import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "./lib/get-current-session";

export async function middleware(request: NextRequest) {
	const session = await getCurrentSession();
	const protectedPaths = ["/workouts"];
	const isProtected = protectedPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path)
	);

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