import type { Category, Prompt } from "@/types";

const now = new Date();

export const sampleCategories: Category[] = [
  { id: crypto.randomUUID(), name: "Marketing", color: "#2563EB", icon: "Megaphone", createdAt: now.toISOString() },
  { id: crypto.randomUUID(), name: "Coding", color: "#16A34A", icon: "Code2", createdAt: now.toISOString() },
  { id: crypto.randomUUID(), name: "Research", color: "#D97706", icon: "Search", createdAt: now.toISOString() },
  { id: crypto.randomUUID(), name: "Writing", color: "#DC2626", icon: "Feather", createdAt: now.toISOString() }
];

export const samplePrompts: Prompt[] = [
  {
    id: crypto.randomUUID(),
    title: "Launch campaign brief generator",
    description: "Turns a product update into a complete GTM brief with hooks, segments, and launch assets.",
    content: "You are a senior product marketer. Build a launch brief for {{product_name}} targeted at {{audience}}. Include positioning, value props, objections, a 3-email sequence, and ad copy variations.",
    category: "Marketing",
    tags: ["launch", "email", "ads"],
    model: "GPT-4o",
    variables: [
      { name: "product_name", description: "Name of the product", defaultValue: "PromptVault Pro" },
      { name: "audience", description: "Primary customer segment", defaultValue: "AI consultants" }
    ],
    attachments: [],
    isPublic: true,
    shareToken: crypto.randomUUID(),
    useCount: 47,
    createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    starred: true
  },
  {
    id: crypto.randomUUID(),
    title: "Bug triage assistant",
    description: "Summarizes issue reports, proposes likely root causes, and writes reproduction steps.",
    content: "Given this issue report: {{issue_report}}, identify likely root causes, impacted modules, and produce a crisp triage summary with severity and next action.",
    category: "Coding",
    tags: ["bugs", "triage", "engineering"],
    model: "Claude 3.5 Sonnet",
    variables: [{ name: "issue_report", description: "The raw issue text" }],
    attachments: [],
    isPublic: false,
    shareToken: crypto.randomUUID(),
    useCount: 31,
    createdAt: new Date(now.getTime() - 12 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 3 * 86400000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Customer research synthesis",
    description: "Clusters interview notes into themes, tensions, and opportunity areas.",
    content: "Synthesize the following interviews for {{company_name}}. Provide themes, quotes, unmet needs, JTBD statements, and a prioritization matrix.",
    category: "Research",
    tags: ["research", "interviews", "strategy"],
    model: "Gemini 1.5 Pro",
    variables: [{ name: "company_name", description: "Client or product name" }],
    attachments: [],
    isPublic: true,
    shareToken: crypto.randomUUID(),
    useCount: 19,
    createdAt: new Date(now.getTime() - 8 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 1 * 86400000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Long-form article outline",
    description: "Generates a structured article outline with narrative arc and supporting evidence prompts.",
    content: "Create a 2,000-word article outline about {{topic}} for {{audience}}. Add a strong thesis, section-by-section talking points, counterarguments, and suggested expert citations.",
    category: "Writing",
    tags: ["seo", "content", "outline"],
    model: "GPT-4-turbo",
    variables: [
      { name: "topic", description: "Main article topic" },
      { name: "audience", description: "Intended readers" }
    ],
    attachments: [],
    isPublic: false,
    shareToken: crypto.randomUUID(),
    useCount: 54,
    createdAt: new Date(now.getTime() - 15 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
    starred: true
  },
  {
    id: crypto.randomUUID(),
    title: "Sales objection handling matrix",
    description: "Builds a response matrix for pricing, timing, and competitive objections.",
    content: "Using the product details below, generate an objection handling matrix for {{persona}}. Cover pricing, migration risk, internal buy-in, and competitive comparisons.",
    category: "Marketing",
    tags: ["sales", "objections", "enablement"],
    model: "Llama 3",
    variables: [{ name: "persona", description: "Target buyer persona" }],
    attachments: [],
    isPublic: true,
    shareToken: crypto.randomUUID(),
    useCount: 22,
    createdAt: new Date(now.getTime() - 20 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 6 * 86400000).toISOString()
  }
];
