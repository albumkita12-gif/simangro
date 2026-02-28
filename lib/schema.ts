import { pgTable, serial, text, integer, jsonb, varchar } from 'drizzle-orm/pg-core';

export const species = pgTable('species', {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    name: varchar('name', { length: 200 }).notNull(),
    localNames: text('local_names'),
    intro: text('intro'),
    morphology: jsonb('morphology'), // { daun, bunga, buah, akar? }
    taxonomy: jsonb('taxonomy'),     // { kingdom, phylum, class, order, family, genus, species }
    habitat: text('habitat'),
    images: jsonb('images'),         // { daun: string, bunga: string, buah: string, credits: {...} }
    category: varchar('category', { length: 100 }),
});

export const quizQuestions = pgTable('quiz_questions', {
    id: serial('id').primaryKey(),
    question: text('question').notNull(),
    options: jsonb('options').notNull(), // string[]
    correct: integer('correct').notNull(), // index of correct option
    explanation: text('explanation'),
    imageUrl: text('image_url'),
});

export const galleryItems = pgTable('gallery_items', {
    id: serial('id').primaryKey(),
    category: varchar('category', { length: 50 }).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
});

export const regulations = pgTable('regulations', {
    id: serial('id').primaryKey(),
    year: integer('year').notNull(),
    title: varchar('title', { length: 300 }).notNull(),
    description: text('description'),
    points: jsonb('points'), // string[]
});

export const monitoringData = pgTable('monitoring_data', {
    id: serial('id').primaryKey(),
    kabupaten: varchar('kabupaten', { length: 200 }).notNull(),
    provinsi: varchar('provinsi', { length: 200 }),
    luasTarget: integer('luas_target'),
    luasTanam: integer('luas_tanam'),
    tahun: integer('tahun'),
});

export type Species = typeof species.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type Regulation = typeof regulations.$inferSelect;
export type MonitoringData = typeof monitoringData.$inferSelect;
