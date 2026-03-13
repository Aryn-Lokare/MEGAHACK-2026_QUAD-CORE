-- Run this in your Supabase SQL Editor BEFORE running the app

-- Create the tables needed for AI Campus Assistant

CREATE TABLE IF NOT EXISTS "Student" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  attendance INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "Timetable" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject TEXT NOT NULL,
  room TEXT NOT NULL,
  time TEXT NOT NULL,
  day TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Assignment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject TEXT NOT NULL,
  deadline TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "CampusLocation" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floor INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "CampusKnowledge" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL
);
