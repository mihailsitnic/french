import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const getRequiredEnv = (primaryName: string, fallbackName?: string) => {
	const rawValue =
		process.env[primaryName] ??
		(fallbackName ? process.env[fallbackName] : undefined);
	const value = rawValue?.trim();

	if (!value) {
		const fallbackText = fallbackName ? ` (or ${fallbackName})` : "";
		throw new Error(
			`Missing required environment variable: ${primaryName}${fallbackText}`
		);
	}

	if (/^your_.*_here$/i.test(value)) {
		throw new Error(
			`Environment variable ${primaryName}${fallbackName ? `/${fallbackName}` : ""} is still a placeholder value.`
		);
	}

	return value;
};

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: getRequiredEnv("GOOGLE_CLIENT_ID", "AUTH_GOOGLE_ID"),
			clientSecret: getRequiredEnv(
				"GOOGLE_CLIENT_SECRET",
				"AUTH_GOOGLE_SECRET"
			),
		}),
	],
	pages: {
		signIn: "/sign-in",
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
