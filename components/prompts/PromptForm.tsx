"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, LoaderCircle, Plus, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import { estimateTokens } from "@/lib/utils/format";
import { promptSchema } from "@/lib/validations/prompt";
import type { Category, Prompt } from "@/types";

type FormValues = Omit<Prompt, "id" | "createdAt" | "updatedAt" | "useCount">;

const models = [
  "GPT-4o",
  "GPT-4-turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Llama 3",
  "Mistral Large",
  "Custom"
];

function extractVariables(content: string) {
  return [...new Set(Array.from(content.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g)).map((match) => match[1]))];
}

export function PromptForm({ prompt, categories }: { prompt?: Prompt | null; categories: Category[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dragging, setDragging] = useState(false);
  const storageKey = prompt ? `prompts-manager-edit-${prompt.id}` : "prompts-manager-draft-new";

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: prompt?.title ?? "",
      description: prompt?.description ?? "",
      content: prompt?.content ?? "",
      category: prompt?.category ?? "",
      tags: prompt?.tags ?? [],
      model: prompt?.model ?? models[0],
      variables: prompt?.variables ?? [],
      attachments: prompt?.attachments ?? [],
      isPublic: prompt?.isPublic ?? false,
      shareToken: prompt?.shareToken ?? crypto.randomUUID(),
      starred: prompt?.starred ?? false
    }),
    [prompt]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(promptSchema as never),
    defaultValues
  });
  const variables = useFieldArray({ control: form.control, name: "variables" });
  const attachments = form.watch("attachments");
  const content = form.watch("content");
  const selectedCategory = form.watch("category");
  const knownCategories = useMemo(
    () => [...new Set(categories.map((category) => category.name).filter(Boolean))].sort((left, right) => left.localeCompare(right)),
    [categories]
  );

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved && !prompt) {
      form.reset(JSON.parse(saved));
    }
  }, [form, prompt, storageKey]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      setDirty(true);
      localStorage.setItem(storageKey, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [form, storageKey]);

  useEffect(() => {
    const timeout = window.setInterval(() => {
      localStorage.setItem(storageKey, JSON.stringify(form.getValues()));
    }, 30_000);
    return () => window.clearInterval(timeout);
  }, [form, storageKey]);

  useEffect(() => {
    const detected = extractVariables(content);
    const existing = form.getValues("variables");
    detected.forEach((name) => {
      if (!existing.some((entry) => entry.name === name)) {
        variables.append({ name, description: "", defaultValue: "" });
      }
    });
  }, [content, form, variables]);

  const onSubmit = useCallback(async (values: FormValues) => {
    setSaving(true);
    try {
      const response = await fetch(prompt ? `/api/prompts/${prompt.id}` : "/api/prompts", {
        method: prompt ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        toast.error("Failed to save prompt");
        return;
      }

      const saved = await response.json();
      localStorage.removeItem(storageKey);
      setDirty(false);
      toast.success(prompt ? "Prompt updated" : "Prompt created");
      router.push(`/prompts/${saved.id}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }, [prompt, router, storageKey]);

  const submitForm = useCallback(() => {
    void form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        submitForm();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [submitForm]);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    if (attachments.length + files.length > 5) {
      toast.error("Maximum 5 attachments per prompt");
      return;
    }

    setUploading(true);
    try {
      const next = [...attachments];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("promptId", prompt?.id ?? "draft");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          const error = await response.json();
          toast.error(error.message ?? "Failed to upload file");
          continue;
        }

        const payload = await response.json();
        next.push({
          key: payload.key,
          name: payload.name,
          url: payload.url,
          size: payload.size,
          type: payload.type
        });
        toast.success(`Uploaded ${file.name}`);
      }
      form.setValue("attachments", next, { shouldDirty: true });
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">{prompt ? "Edit prompt" : "Create prompt"}</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {saving ? "Saving prompt..." : dirty ? "Unsaved changes" : "All changes saved"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Basic info</h2>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" maxLength={255} {...form.register("title")} />
            <p className="text-xs text-[var(--text-muted)]">{form.watch("title").length}/255</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" maxLength={500} {...form.register("description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className={cn(
                "focus-ring h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              )}
              {...form.register("category")}
            >
              <option value="">Select a category</option>
              {knownCategories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
              {selectedCategory && !knownCategories.includes(selectedCategory) ? (
                <option value={selectedCategory}>{selectedCategory}</option>
              ) : null}
            </select>
            <Input
              value={selectedCategory ?? ""}
              placeholder="Or type a new category"
              onChange={(event) => form.setValue("category", event.target.value, { shouldDirty: true })}
            />
            <p className="text-xs text-[var(--text-muted)]">Select an existing category above or type a new one here.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" list="models" {...form.register("model")} />
            <datalist id="models">
              {models.map((model) => (
                <option key={model} value={model} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              defaultValue={form.getValues("tags").join(", ")}
              onBlur={(event) =>
                form.setValue(
                  "tags",
                  event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean),
                  { shouldDirty: true }
                )
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Prompt content</h2>
            <p className="text-xs text-[var(--text-muted)]">
              {content.length} chars / {estimateTokens(content)} tokens est.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea rows={14} className="font-mono" {...form.register("content")} />
          <p className="text-xs text-[var(--text-secondary)]">
            Use <code>{"{{variable_name}}"}</code> placeholders to auto-generate variables.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="font-semibold">Variables</h2>
          <Button type="button" variant="outline" size="sm" onClick={() => variables.append({ name: "", description: "", defaultValue: "" })}>
            <Plus className="h-4 w-4" />
            Add variable
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {variables.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-[var(--border)] p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
              <Input placeholder="name" {...form.register(`variables.${index}.name`)} />
              <Input placeholder="description" {...form.register(`variables.${index}.description`)} />
              <Input placeholder="default value" {...form.register(`variables.${index}.defaultValue`)} />
              <Button type="button" variant="ghost" onClick={() => variables.remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Attachments</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragging(false);
              void uploadFiles(e.dataTransfer.files);
            }}
          >
            <label className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
              dragging
                ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                : "border-[var(--border)] bg-[var(--surface-elevated)]"
            }`}>
              {uploading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
              <div>
                <p className="font-medium">{dragging ? "Drop files to upload" : "Drag files here or click to browse"}</p>
                <p className="text-xs text-[var(--text-secondary)]">PNG, JPG, WEBP, TXT, MD, JSON, PDF up to 10MB.</p>
              </div>
              <input className="hidden" type="file" multiple accept=".png,.jpg,.jpeg,.webp,.txt,.md,.json,.pdf" onChange={(event) => void uploadFiles(event.target.files)} />
            </label>
          </div>
          <div className="space-y-2">
            {attachments.map((attachment, index) => (
              <div key={attachment.key} className="flex items-center justify-between rounded-xl bg-[var(--surface-elevated)] px-3 py-2 text-sm">
                <a href={`/api/upload/serve?key=${encodeURIComponent(attachment.key)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 truncate text-[var(--accent)]">
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  {attachment.name}
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await fetch(`/api/upload/${encodeURIComponent(attachment.key)}`, { method: "DELETE" });
                    form.setValue(
                      "attachments",
                      attachments.filter((_, itemIndex) => itemIndex !== index),
                      { shouldDirty: true }
                    );
                    toast.success(`Removed ${attachment.name}`);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Settings</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium">Public prompt</p>
            <p className="text-sm text-[var(--text-secondary)]">Allow a read-only share page with the current share token.</p>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="h-4 w-4" {...form.register("isPublic")} />
            Public
          </label>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button type="submit" disabled={saving} size="lg" className="shadow-lg">
          {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save prompt"}
        </Button>
      </div>
    </form>
  );
}
