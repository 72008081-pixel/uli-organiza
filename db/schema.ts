import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const agendas = sqliteTable('agendas', {
 owner:text('owner').primaryKey(), data:text('data').notNull(), revision:integer('revision').notNull().default(0)
});