"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
  setCategoryActiveAction,
} from "@/lib/actions/admin";
import { AliasManager } from "./AliasManager";
import { cn } from "@/lib/utils";

interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  approvedTechnicianCount: number;
  createdAt: Date;
  aliases: { id: string; alias: string }[];
}

interface ActionResult {
  ok: boolean;
  error?: { message: string; fieldErrors?: Record<string, string[]> };
}

export function CategoryTable({ categories }: { categories: AdminCategory[] }) {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-ink">Categories</h2>
        <AddCategoryForm />
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-muted-strong">
          No categories yet. Add one to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-subtle">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider hidden sm:table-cell">
                  Tagline
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                  Technicians
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                  Aliases
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-strong uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <CategoryRow key={cat.id} cat={cat} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddCategoryForm() {
  const [state, createAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData: FormData) => {
      return createCategoryAction({
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        tagline: formData.get("tagline") as string,
        description: formData.get("description") as string,
        icon: formData.get("icon") as string,
        isActive: formData.get("isActive") === "on",
      });
    },
    { ok: false },
  );

  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-end gap-4">
      <Button
        type="button"
        size="sm"
        onClick={() => setOpen(true)}
        className="bg-[#414A2F] text-[#f2f0e8] hover:bg-[#414A2F]/90"
      >
        <Plus className="size-4 mr-2" aria-hidden="true" />
        Add category
      </Button>

      {open && (
        <div className="surface border border-border rounded-[4px] p-4 mt-4 w-full max-w-md">
          <form action={createAction} className="space-y-3">
            {state.error && (
              <div className="p-3 border border-[#B7443D] text-[#B7443D] text-sm rounded-[2px]" role="alert">
                {state.error.message}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new-cat-name">Name</Label>
                <Input
                  id="new-cat-name"
                  name="name"
                  required
                  className="w-full"
                  placeholder="e.g. Electrician"
                />
                {state.error?.fieldErrors?.name && (
                  <p className="text-[#B7443D] text-xs mt-1" role="alert">
                    {state.error.fieldErrors.name[0]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-cat-slug">Slug</Label>
                <Input
                  id="new-cat-slug"
                  name="slug"
                  required
                  className="w-full"
                  placeholder="e.g. electrician"
                />
                {state.error?.fieldErrors?.slug && (
                  <p className="text-[#B7443D] text-xs mt-1" role="alert">
                    {state.error.fieldErrors.slug[0]}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="new-cat-tagline">Tagline</Label>
              <Input
                id="new-cat-tagline"
                name="tagline"
                className="w-full"
                placeholder="Optional short description"
              />
              {state.error?.fieldErrors?.tagline && (
                <p className="text-[#B7443D] text-xs mt-1" role="alert">
                  {state.error.fieldErrors.tagline[0]}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                id="new-cat-active"
                name="isActive"
                type="checkbox"
                defaultChecked
                className="rounded border-[#3a3b33] bg-[#1a1b16] text-[#B77A35] focus:ring-[#B77A35]"
              />
              <Label htmlFor="new-cat-active" className="text-sm text-[#f2f0e8]">
                Active
              </Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={state.ok}
                className="bg-[#414A2F] text-[#f2f0e8] hover:bg-[#414A2F]/90"
              >
                {state.ok ? (
                  <>
                    <CheckCircle2 className="size-3 mr-1" aria-hidden="true" />
                    Created
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function CategoryRow({ cat }: { cat: AdminCategory }) {
  const [state, updateAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData: FormData) => {
      return updateCategoryAction(cat.id, {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        tagline: formData.get("tagline") as string,
        description: formData.get("description") as string,
        icon: formData.get("icon") as string,
        isActive: formData.get("isActive") === "on",
      });
    },
    { ok: false },
  );

  const [activeState, activeAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData: FormData) => {
      return setCategoryActiveAction(
        cat.id,
        formData.get("isActive") === "on",
      );
    },
    { ok: false },
  );

  const [editOpen, setEditOpen] = useState(false);

  return (
    <tr key={cat.id} className="hover:bg-bg/50 transition-colors">
      <td className="px-4 py-3">
        {editOpen ? (
          <form action={updateAction} className="space-y-1">
            <Input
              name="name"
              defaultValue={cat.name}
              required
              className="w-full text-sm text-ink border-[#3a3b33] bg-[#1a1b16] p-1"
            />
            {state.error?.fieldErrors?.name && (
              <p className="text-[#B7443D] text-xs" role="alert">
                {state.error.fieldErrors.name[0]}
              </p>
            )}
            <div className="flex gap-2 mt-1">
              <Button
                type="submit"
                size="xs"
                disabled={state.ok}
                className="bg-[#414A2F] text-[#f2f0e8] px-3"
              >
                {state.ok ? "Saved" : "Save"}
              </Button>
              <Button
                type="button"
                size="xs"
                variant="ghost"
                onClick={() => setEditOpen(false)}
                className="px-3 text-[#a9a99f] hover:text-[#f2f0e8]"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-sm font-medium text-ink">{cat.name}</div>
        )}
      </td>
      <td className="px-4 py-3">
        {editOpen ? (
          <Input
            name="slug"
            defaultValue={cat.slug}
            required
            className="w-full text-sm text-ink border-[#3a3b33] bg-[#1a1b16] p-1"
          />
        ) : (
          <div className="text-sm text-ink">{cat.slug}</div>
        )}
      </td>
      <td className="px-4 py-3 text-muted-strong hidden sm:table-cell">
        {editOpen ? (
          <Input
            name="tagline"
            defaultValue={cat.tagline ?? ""}
            className="w-full text-sm text-ink border-[#3a3b33] bg-[#1a1b16] p-1"
          />
        ) : (
          cat.tagline ?? "—"
        )}
      </td>
      <td className="px-4 py-3 text-sm text-ink">
        {cat.approvedTechnicianCount}
      </td>
      <td className="px-4 py-3">
        <AliasManager categoryId={cat.id} aliases={cat.aliases} />
      </td>
      <td className="px-4 py-3">
        <form action={activeAction} className="inline">
          <input type="hidden" name="isActive" value={String(!cat.isActive)} />
          <Button
            type="submit"
            size="xs"
            disabled={activeState.ok}
            className={cn(
              "text-xs px-3 py-1.5 rounded-md border-transparent font-medium transition-colors",
              cat.isActive
                ? "bg-[#B7443D]/10 text-[#B7443D] hover:bg-[#B7443D]/20"
                : "bg-[#287A50]/10 text-[#287A50] hover:bg-[#287A50]/20",
            )}
          >
            {cat.isActive ? "Deactivate" : "Activate"}
          </Button>
        </form>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="text-xs font-medium text-primary underline hover:no-underline"
        >
          <Edit2 className="size-3.5 mr-1" aria-hidden="true" />
          Edit
        </button>
      </td>
    </tr>
  );
}
