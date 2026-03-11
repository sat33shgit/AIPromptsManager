import { db } from "@/lib/db";
import { categories, prompts } from "@/lib/db/schema";
import { sampleCategories, samplePrompts } from "@/lib/data/sample-data";

async function seed() {
  if (!db) {
    console.error("Database connection not configured. Skipping seeding.");
    process.exit(0);
  }

  console.log("Seeding database...");

  for (const category of sampleCategories) {
    await db.insert(categories).values({
      name: category.name,
      color: category.color,
      icon: category.icon
    }).onConflictDoNothing();
  }
  console.log(`Inserted ${sampleCategories.length} categories.`);

  for (const prompt of samplePrompts) {
    await db.insert(prompts).values({
      title: prompt.title,
      description: prompt.description ?? "",
      content: prompt.content,
      category: prompt.category ?? "",
      tags: prompt.tags,
      model: prompt.model ?? "",
      variables: prompt.variables,
      attachments: prompt.attachments,
      isPublic: prompt.isPublic,
      shareToken: prompt.shareToken
    }).onConflictDoNothing();
  }
  console.log(`Inserted ${samplePrompts.length} prompts.`);

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
