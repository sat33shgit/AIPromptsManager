import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { db } from "@/lib/db";
import { prompts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  if (!db) {
    console.error("Database connection not configured.");
    process.exit(1);
  }

  console.log("Fixing attachment URLs...");

  const allPrompts = await db.select().from(prompts);
  let updatedCount = 0;

  for (const prompt of allPrompts) {
    if (prompt.attachments && prompt.attachments.length > 0) {
      let changed = false;
      const newAttachments = prompt.attachments.map((att: any) => {
        if (att.url && typeof att.url === 'string' && att.url.includes("http://localhost:3000/api/upload/serve")) {
          changed = true;
          return { ...att, url: att.url.replace("http://localhost:3000", "") };
        }
        return att;
      });

      if (changed) {
        await db
          .update(prompts)
          .set({ attachments: newAttachments })
          .where(eq(prompts.id, prompt.id));
        updatedCount++;
        console.log(`Updated prompt ${prompt.id}`);
      }
    }
  }

  console.log(`Fixed URLs in ${updatedCount} prompts.`);
  process.exit(0);
}

run().catch((error) => {
  console.error("Failed to fix attachments:", error);
  process.exit(1);
});
