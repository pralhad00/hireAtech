"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertTechnicianServiceAction, deleteTechnicianServiceAction } from "@/lib/actions/technician";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  price_type: string;
  is_active: boolean;
}

const PRICE_TYPE_LABELS: Record<string, string> = {
  per_visit: "Per visit",
  per_hour: "Per hour",
  fixed: "Fixed price",
  quote: "Quote (custom)",
};

function ServiceForm({
  service,
  onSave,
  onDelete,
  saving,
}: {
  service: Service;
  onSave: (data: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [local] = useState({
    title: service.title,
    description: service.description ?? "",
    price: service.price ?? undefined,
    priceType: service.price_type,
    isActive: service.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.append("id", service.id);
    await onSave(formData);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this service?")) {
      await onDelete(service.id);
    }
  };

  return (
    <article className="rounded-lg border border-border bg-surface p-5">
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label
              htmlFor={`title-${service.id}`}
              className="block text-sm font-medium text-ink mb-1"
            >
              Title
            </Label>
            <Input
              id={`title-${service.id}`}
              name="title"
              defaultValue={local.title}
              required
              className="w-full"
            />
          </div>
          <div>
            <Label
              htmlFor={`desc-${service.id}`}
              className="block text-sm font-medium text-ink mb-1"
            >
              Description
            </Label>
            <Input
              id={`desc-${service.id}`}
              name="description"
              defaultValue={local.description}
              className="w-full"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label
                htmlFor={`price-${service.id}`}
                className="block text-sm font-medium text-ink mb-1"
              >
                Price (NPR)
              </Label>
              <Input
                id={`price-${service.id}`}
                name="price"
                type="number"
                min="0"
                defaultValue={local.price}
                className="w-full"
              />
            </div>
            <div>
              <Label
                htmlFor={`priceType-${service.id}`}
                className="block text-sm font-medium text-ink mb-1"
              >
                Price type
              </Label>
              <select
                id={`priceType-${service.id}`}
                name="priceType"
                defaultValue={local.priceType}
                className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-1 text-base"
              >
                <option value="per_visit">Per visit</option>
                <option value="per_hour">Per hour</option>
                <option value="fixed">Fixed price</option>
                <option value="quote">Quote (custom)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id={`active-${service.id}`}
              name="isActive"
              type="checkbox"
              defaultChecked={local.isActive}
              className="rounded border-input text-primary focus-visible:ring-ring focus-visible:ring-3"
            />
            <Label htmlFor={`active-${service.id}`} className="text-sm text-ink ml-1 cursor-pointer">
              Active
            </Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink">{service.title}</h3>
            {service.description && (
              <p className="text-sm text-muted-strong">{service.description}</p>
            )}
            <p className="text-xs font-mono text-muted-strong mt-1">
              {service.price ? `NPR ${service.price}` : "Quote"}
              &middot; {PRICE_TYPE_LABELS[service.price_type] || service.price_type}
              &middot; {service.is_active ? "Active" : "Inactive"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}

interface ServicesFormProps {
  initialServices: Service[];
}

export function ServicesForm({ initialServices }: ServicesFormProps) {
  const router = useRouter();
  const [services] = useState<Service[]>(initialServices);
  const [newService, setNewService] = useState<{
    title: string;
    description: string;
    price: number | undefined;
    priceType: string;
    isActive: boolean;
  } | null>(null);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleSaveService = async (formData: FormData) => {
    const id = formData.get("id") as string | null;
    setSavingIds((prev) => new Set([...prev, id || "new"]));
    try {
      if (id) {
        await upsertTechnicianServiceAction({
          id,
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          price: formData.get("price") as number | "" | undefined,
          priceType: formData.get("priceType") as
            | "per_visit"
            | "per_hour"
            | "fixed"
            | "quote",
          isActive: formData.get("isActive") === "on",
        });
      } else {
        await upsertTechnicianServiceAction({
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          price: formData.get("price") as number | "" | undefined,
          priceType: formData.get("priceType") as
            | "per_visit"
            | "per_hour"
            | "fixed"
            | "quote",
          isActive: formData.get("isActive") === "on",
        });
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service.");
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id || "new");
        return next;
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm("Delete this service?")) return;
    setSavingIds((prev) => new Set([...prev, id]));
    try {
      await deleteTechnicianServiceAction(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service.");
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    setSavingIds((prev) => new Set([...prev, "new"]));
    try {
      await upsertTechnicianServiceAction({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: formData.get("price") as number | "" | undefined,
        priceType: formData.get("priceType") as
          | "per_visit"
          | "per_hour"
          | "fixed"
          | "quote",
        isActive: formData.get("isActive") === "on",
      });
      setNewService(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service.");
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete("new");
        return next;
      });
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">My services</h1>
          <p className="text-muted-strong">
            Add and manage the services you offer.
          </p>
        </div>
        <Button
          onClick={() =>
            setNewService((s) =>
              s
                ? null
                : {
                    title: "",
                    description: "",
                    price: undefined,
                    priceType: "per_visit",
                    isActive: true,
                  }
            )
          }
        >
          {newService ? "Cancel" : "Add service"}
        </Button>
      </header>

      {error && (
        <div className="mb-6 p-3 border border-error text-error text-sm rounded-[2px]" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {services.map((s) => (
          <ServiceForm
            key={s.id}
            service={s}
            onSave={handleSaveService}
            onDelete={handleDeleteService}
            saving={savingIds.has(s.id)}
          />
        ))}
        {services.length === 0 && (
          <p className="text-muted-strong text-center py-8">
            No services yet. Add your first service below.
          </p>
        )}
      </div>

      {newService && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-muted-strong uppercase tracking-wider mb-4">
            Add new service
          </h2>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newTitle" className="block text-sm font-medium text-ink mb-1">
                Title
              </Label>
              <Input
                id="newTitle"
                name="title"
                required
                className="w-full"
                placeholder="e.g. House wiring"
              />
            </div>
            <div>
              <Label htmlFor="newDesc" className="block text-sm font-medium text-ink mb-1">
                Description
              </Label>
              <Input
                id="newDesc"
                name="description"
                className="w-full"
                placeholder="What does this service include?"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="newPrice" className="block text-sm font-medium text-ink mb-1">
                  Price (NPR)
                </Label>
                <Input id="newPrice" name="price" type="number" min="0" className="w-full" />
              </div>
              <div>
                <Label htmlFor="newPriceType" className="block text-sm font-medium text-ink mb-1">
                  Price type
                </Label>
                <select
                  id="newPriceType"
                  name="priceType"
                  defaultValue="per_visit"
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-1 text-base"
                >
                  <option value="per_visit">Per visit</option>
                  <option value="per_hour">Per hour</option>
                  <option value="fixed">Fixed price</option>
                  <option value="quote">Quote (custom)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={savingIds.has("new")}
              >
                {savingIds.has("new") ? "Adding…" : "Add service"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setNewService(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-muted-strong">
        <Link href="/technician" className="text-primary underline hover:no-underline">
          &larr; Back to dashboard
        </Link>
      </p>
    </main>
  );
}
