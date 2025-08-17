import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'https://mandate-wizard-recent-amber.vercel.app',
    secret: process.env.BETTER_AUTH_SECRET!,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectURI: `${process.env.BETTER_AUTH_URL || 'https://mandate-wizard-recent-amber.vercel.app'}/api/auth/callback/google`,
        }, 
    },
    emailAndPassword: {
        enabled: true, 
    }, 
    plugins: [
       
    ]
});