import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

export const db =
  process.env.NODE_ENV === 'production'
    ? new PrismaClient()
    : (globalThis.__prisma ??= new PrismaClient());
