import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./index";
import path from "path";

console.log("Running migrations...");
migrate(db, { migrationsFolder: path.join(process.cwd(), "src/db/migrations") });
console.log("Migrations complete!");
