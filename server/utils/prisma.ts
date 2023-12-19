// prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  var _prismaClientInstance: PrismaClient | undefined;
}

if (!global._prismaClientInstance) {
    global._prismaClientInstance = new PrismaClient();
}


export const prismaClient = global._prismaClientInstance;

