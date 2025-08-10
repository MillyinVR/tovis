import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, adminProcedure } from '../trpc';

interface License {
  id: string;
  professionalId: string;
  stateCode: string;
  licenseNumber: string;
  issuedDate: string;
  expiresDate: string;
  frontImagePath: string;
  backImagePath?: string;
  status: 'pending' | 'approved' | 'rejected';
}

const licenses: License[] = [];

export const licenseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        stateCode: z.string().length(2),
        licenseNumber: z.string(),
        issuedDate: z.string(),
        expiresDate: z.string(),
        frontImagePath: z.string(),
        backImagePath: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const license: License = {
        id: crypto.randomUUID(),
        professionalId: ctx.session.user.id,
        stateCode: input.stateCode,
        licenseNumber: input.licenseNumber,
        issuedDate: input.issuedDate,
        expiresDate: input.expiresDate,
        frontImagePath: input.frontImagePath,
        backImagePath: input.backImagePath,
        status: 'pending',
      };
      licenses.push(license);
      return license;
    }),

  adminListPending: adminProcedure.query(() => {
    return licenses.filter((l) => l.status === 'pending');
  }),

  adminUpdateStatus: adminProcedure
    .input(
      z.object({
        licenseId: z.string().uuid(),
        status: z.enum(['approved', 'rejected', 'pending']),
      }),
    )
    .mutation(({ input }) => {
      const license = licenses.find((l) => l.id === input.licenseId);
      if (!license) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      license.status = input.status;
      return license;
    }),
});

