
import {integer, pgEnum, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user'])

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: varchar('user_id', {length:256}).notNull(),
    fileKey: text('file_key').notNull(),

})

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(()=> chats.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnum('role').notNull(),
})

export type DrizzleChat = typeof chats.$inferSelect;

export const userSubscriptions = pgTable('user_subscriptions', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', {length:256}).notNull(),
    stripeCustomerId: varchar('stripe_customer_id', {length:256}).notNull().unique(),
    stripeSubscriptionId: varchar('stripe_subscription_id', {length:256}).unique(),
    stripePriceId: varchar('stripe_price_id', {length:256}),
    stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
})

export const summary = pgTable('summary', {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(()=> chats.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const messageRecords = pgTable('message_records', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 }).notNull(),
    numberOfMessages: integer('number_of_messages').notNull(),
  });

// drizzle-orm
// drizzle-kits
