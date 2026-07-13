import { useState } from "react";
import { toast } from "sonner";

type AddLeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated: () => Promise<void>;
};

export function AddLeadModal({
  isOpen,
  onClose,
  onLeadCreated,
}: AddLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Add New Lead
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter the buyer inquiry details below.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
        </div>

        <form
          className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!event.currentTarget.reportValidity()) {
                return;
              }
            if (isSubmitting) return;

            setIsSubmitting(true);

            const form = event.currentTarget;
            const formData = new FormData(form);

            const payload = {
              name: String(formData.get("name") || ""),
              phone: String(formData.get("phone") || ""),
              email: String(formData.get("email") || ""),
              property_interest: String(
                formData.get("property_interest") || "",
              ),
              property_type: String(
                formData.get("property_type") || "Apartment",
              ),
              budget: Number(formData.get("budget") || 0),
              source: String(formData.get("source") || "Manual Entry"),
              assigned_agent: String(
                formData.get("assigned_agent") || "",
              ),
              notes: String(formData.get("notes") || ""),
            };

            try {
              const response = await fetch(
                import.meta.env.VITE_N8N_LEAD_INTAKE_URL,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                },
              );

              const result = await response.json();

              if (!response.ok || !result.success) {
                throw new Error(
                  result.message || "Failed to create lead",
                );
              }

              form.reset();
              await onLeadCreated();
              onClose();

              toast.success("Lead created successfully!", {
                description: `${payload.name} has been added to the CRM.`,
              });
            } catch (error) {
              console.error("Lead submission error:", error);

              toast.error("Lead creation failed", {
                description: "Please try again.",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <label className="space-y-1">
            <span className="text-sm font-medium text-foreground">
              Name
            </span>
            <input
              name="name"
              required
              placeholder="Ahmed Al Mansouri"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm invalid:border-destructive invalid:ring-1 invalid:ring-destructive/30"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-foreground">
              Phone
            </span>
            <input
              name="phone"
              minLength={7}
              required
              placeholder="+971 50 123 4567"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-foreground">
              Email
            </span>
            <input
              name="email"
              type="email"
              placeholder="ahmed@example.com"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-foreground">
              Property Type
            </span>
            <select
              name="property_type"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Apartment</option>
              <option>Villa</option>
              <option>Townhouse</option>
              <option>Penthouse</option>
              <option>Office</option>
            </select>
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium text-foreground">
              Property Interest
            </span>
            <input
              name="property_interest"
              placeholder="Dubai Hills Villa"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-foreground">
              Budget (AED)
            </span>
            <input
              name="budget"
              type="number"
              min="0"
              required
              placeholder="4500000"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-foreground">
              Source
            </span>
            <select
              name="source"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Manual Entry</option>
              <option>Website</option>
              <option>WhatsApp</option>
              <option>Property Finder</option>
              <option>Bayut</option>
              <option>Referral</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-foreground">
                Assign Agent
            </span>

            <select
                name="assigned_agent"
                defaultValue=""
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
                <option value="">Auto Assign</option>
                <option value="Ahmed Khan">Ahmed Khan</option>
                <option value="Sarah Malik">Sarah Malik</option>
                <option value="Omar Hassan">Omar Hassan</option>
                <option value="Fatima Al Nuaimi">Fatima Al Nuaimi</option>
            </select>
            </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium text-foreground">
              Notes
            </span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Looking for a three-bedroom villa with a flexible payment plan."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>

          <div className="flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="h-10 rounded-md border border-border px-4 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}