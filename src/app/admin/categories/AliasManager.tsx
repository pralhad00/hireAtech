"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  createCategoryAliasAction,
  deleteCategoryAliasAction,
} from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

interface ActionResult {
  ok: boolean;
  error?: { message: string; fieldErrors?: Record<string, string[]> };
}

interface Props {
  categoryId: string;
  aliases: { id: string; alias: string }[];
}

/**
 * Manages search aliases for one category.
 * Receives existing aliases as props (fetched by the parent Server Component).
 * Handles adding/removing aliases via Server Actions.
 */
export function AliasManager({ categoryId, aliases }: Props) {
  const [addState, addAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData: FormData) => {
      return createCategoryAliasAction({
        categoryId,
        alias: formData.get("alias") as string,
      });
    },
    { ok: false },
  );
  const [deleteState, deleteAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData: FormData) => {
      return deleteCategoryAliasAction(formData.get("aliasId") as string);
    },
    { ok: false },
  );
  const [newAlias, setNewAlias] = useState("");

  return (
    <div className="space-y-2">
      {/* Existing aliases */}
      {aliases.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {aliases.map((a) => (
            <span
              key={a.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E9E7DE] text-ink text-xs"
            >
              {a.alias}
              <form action={deleteAction} className="inline">
                <input type="hidden" name="aliasId" value={a.id} />
                <Button
                  type="submit"
                  size="icon-xs"
                  variant="ghost"
                  disabled={deleteState.ok}
                  className="p-0.5 text-muted-strong hover:text-[#B7443D] hover:bg-transparent"
                >
                  <Trash2 className="size-3" aria-hidden="true" />
                </Button>
              </form>
            </span>
          ))}
        </div>
      ) : (
        <span className="text-muted-strong text-xs">—</span>
      )}

      {/* Add new alias */}
      <form action={addAction} className="flex items-end gap-2">
        <input
          name="alias"
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          placeholder="+ alias"
          className="h-8 w-32 border border-[#3a3b33] rounded-md bg-[#1a1b16] text-[#f2f0e8] px-2 text-sm focus:border-[#B77A35] focus:outline-none"
        />
        <Button
          type="submit"
          size="xs"
          disabled={addState.ok || !newAlias.trim()}
          className={cn(
            "text-xs px-3 py-1.5",
            addState.ok ? "bg-[#287A50] text-[#f2f0e8]" : "bg-[#414A2F] text-[#f2f0e8]",
          )}
        >
          {addState.ok ? "Added" : "Add"}
        </Button>
        {addState.error?.message && (
          <span className="text-[#B7443D] text-xs ml-1" role="alert">
            {addState.error.message}
          </span>
        )}
      </form>
    </div>
  );
}