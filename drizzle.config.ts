import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config({ path: ".env" });

// Log the DATABASE_URL to check if it's being accessed correctly
console.log("DATABASE_URL:", process.env.DATABASE_URL);

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  }
});

// npx ts-node drizzle.config.ts
