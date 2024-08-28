import { create } from 'domain';
import {pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

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
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    chatId: serial('chat_id').notNull(),
    userId: varchar('user_id', {length:256}).notNull(),
})