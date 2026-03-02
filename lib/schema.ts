import { pgTable, serial, text, integer, jsonb, varchar } from 'drizzle-orm/pg-core';

export const species = pgTable('species', {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    name: varchar('name', { length: 200 }).notNull(),
    localNames: text('local_names'),
    intro: text('intro'),
    morphology: jsonb('morphology'),
    taxonomy: jsonb('taxonomy'),
    habitat: text('habitat'),
    images: jsonb('images'),
    category: varchar('category', { length: 100 }),
});

export const quizQuestions = pgTable('quiz_questions', {
    id: serial('id').primaryKey(),
    question: text('question').notNull(),
    options: jsonb('options').notNull(),
    correct: integer('correct').notNull(),
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
    points: jsonb('points'),
});

export const monitoringData = pgTable('monitoring_data', {
    id: serial('id').primaryKey(),
    kabupaten: varchar('kabupaten', { length: 200 }).notNull(),
    provinsi: varchar('provinsi', { length: 200 }),
    luasTarget: integer('luas_target'),
    luasTanam: integer('luas_tanam'),
    tahun: integer('tahun'),
});

// Extended monitoring: bibit, tenaga kerja, HOK, pola tanam
export const monitoringExtended = pgTable('monitoring_extended', {
    id: serial('id').primaryKey(),
    kabupaten: varchar('kabupaten', { length: 200 }).notNull(),
    provinsi: varchar('provinsi', { length: 200 }),
    tahun: integer('tahun').notNull(),
    polaTanam: varchar('pola_tanam', { length: 100 }),
    jumlahBibit: integer('jumlah_bibit'),
    tenagaKerja: integer('tenaga_kerja'),
    hok: integer('hok'),
    luasTanam: integer('luas_tanam'),
});

// Field monitoring: survival rate, kerapatan, tinggi tanaman, foto, status
export const monitoringLapangan = pgTable('monitoring_lapangan', {
    id: serial('id').primaryKey(),
    lokasi: varchar('lokasi', { length: 300 }).notNull(),
    kabupaten: varchar('kabupaten', { length: 200 }),
    provinsi: varchar('provinsi', { length: 200 }),
    tahun: integer('tahun'),
    survivalRate: integer('survival_rate'),
    kerapatan: integer('kerapatan'),
    tinggiTanaman: integer('tinggi_tanaman'),
    fotoUrl: text('foto_url'),
    status: varchar('status', { length: 50 }),
    catatan: text('catatan'),
});

export type Species = typeof species.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type Regulation = typeof regulations.$inferSelect;
export type MonitoringData = typeof monitoringData.$inferSelect;
export type MonitoringExtended = typeof monitoringExtended.$inferSelect;
export type MonitoringLapangan = typeof monitoringLapangan.$inferSelect;
