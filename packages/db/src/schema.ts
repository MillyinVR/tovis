import { pgTable, uuid, text, char, date, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name'),
  role: text('role').default('client'),
  createdAt: timestamp('created_at').defaultNow()
});

export const professionals = pgTable('professionals', {
  userId: uuid('user_id').primaryKey().references(() => users.id),
  bio: text('bio'),
  businessName: text('business_name')
});

export const licenses = pgTable('licenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  professionalId: uuid('professional_id').references(() => professionals.userId),
  stateCode: char('state_code', { length: 2 }).notNull(),
  licenseNumber: text('license_number').notNull(),
  issuedDate: date('issued_date'),
  expiresDate: date('expires_date'),
  frontImageUrl: text('front_image_url'),
  backImageUrl: text('back_image_url'),
  status: text('status').default('pending'),
  replacesLicenseId: uuid('replaces_license_id'),
  reviewerId: uuid('reviewer_id'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow()
});
