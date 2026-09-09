import {PrismaClient} from "@prisma/client";
const globalForPrisma=globalThis as unknown as {borderbooksPrisma?:PrismaClient};
export const db=globalForPrisma.borderbooksPrisma??new PrismaClient();
if(process.env.NODE_ENV!=="production")globalForPrisma.borderbooksPrisma=db;
