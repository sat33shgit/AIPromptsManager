export type PromptVariable = {
  name: string;
  description?: string;
  defaultValue?: string;
};

export type PromptAttachment = {
  key: string;
  name: string;
  url: string;
  size: number;
  type: string;
};

export type Category = {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: string;
};

export type Prompt = {
  id: string;
  title: string;
  description?: string;
  content: string;
  category?: string;
  tags: string[];
  model?: string;
  variables: PromptVariable[];
  attachments: PromptAttachment[];
  isPublic: boolean;
  shareToken: string;
  useCount: number;
  createdAt: string;
  updatedAt: string;
  starred?: boolean;
};

export type PromptFilters = {
  q?: string;
  category?: string;
  model?: string;
  tags?: string[];
  sort?: "created_at" | "updated_at" | "use_count" | "title";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type PaginatedPrompts = {
  data: Prompt[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
