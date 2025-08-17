import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'https://mandate-wizard-recent.vercel.app',
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    emailAndPassword: {
        enabled: true, 
    }, 
    plugins: [
       
    ]
});