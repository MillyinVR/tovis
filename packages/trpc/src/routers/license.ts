create: protectedProcedure
  .input(z.object({
    stateCode: z.string().length(2),
    licenseNumber: z.string(),
    issuedDate: z.string(),
    expiresDate: z.string(),
    frontImagePath: z.string(),
    backImagePath: z.string().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;
    const [row] = await db
      .insert(licenses)
      .values({
        ...input,
        professionalId: session.user.id
      })
      .returning();
    await db.insert(licenseEvents).values({
      licenseId: row.id,
      event: 'submitted'
    });
    return row;
  });
