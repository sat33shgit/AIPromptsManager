"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { CategoryBadge } from "@/components/common/CategoryBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Category, Prompt } from "@/types";

export function SidebarCategories({ categories, prompts }: { categories: Category[]; prompts: Prompt[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const categoriesWithCount = useMemo(() => {
    return categories.map(category => {
      const count = prompts.filter((prompt) => prompt.category === category.name).length;
      return { ...category, count };
    });
  }, [categories, prompts]);

  const toggleSelection = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleDelete = () => {
    if (!selectedIds.length) return;
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        setSelectedIds([]);
        setIsEditMode(false);
        setShowConfirm(false);
        router.refresh();
      } else {
        alert("Failed to delete categories");
      }
    } catch {
      alert("Error deleting categories");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
        <p className="text-sm font-semibold m-0">Categories</p>
        <div className="flex items-center gap-1">
          {isEditMode ? (
            <>
              {selectedIds.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDelete} 
                  disabled={isDeleting} 
                  className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 m-0"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  ({selectedIds.length})
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedIds([]);
                }}
                className="h-6 px-2 m-0 text-xs"
              >
                Done
              </Button>
            </>
          ) : (
            categoriesWithCount.some(c => c.count === 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditMode(true)}
                className="h-6 px-2 m-0 text-xs text-[var(--text-secondary)]"
              >
                Edit
              </Button>
            )
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {categoriesWithCount.map((category) => (
          <div key={category.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              {isEditMode && category.count === 0 && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(category.id)}
                  onChange={(e) => toggleSelection(category.id, e.target.checked)}
                  className="w-4 h-4 rounded appearance-none border border-[var(--border)] checked:bg-[var(--accent)] checked:border-[var(--accent)] focus:ring-[var(--accent-subtle)] cursor-pointer
                    relative after:content-[''] after:hidden checked:after:block after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:absolute after:top-[1px] after:left-[5px] after:rotate-45"
                  title="Select for deletion"
                />
              )}
              <Link href={`/prompts?category=${encodeURIComponent(category.name)}`} className="flex-1 truncate block hover:opacity-80 transition-opacity">
                <CategoryBadge name={category.name} color={category.color} />
              </Link>
            </div>
            <span className="text-xs text-[var(--text-muted)] shrink-0 ml-2">
              {category.count}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-sm shadow-lg">
            <CardHeader>
              <p className="text-lg font-semibold">Confirm Deletion</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Are you sure you want to delete {selectedIds.length} categor{selectedIds.length === 1 ? "y" : "ies"}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowConfirm(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
