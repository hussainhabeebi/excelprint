"use client";

import { useActionState, useState } from "react";
import { FileUp, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { DesignActionState } from "@/app/orders/[orderNumber]/design/[orderItemId]/actions";
import { ALLOWED_ARTWORK_EXTENSIONS } from "@/lib/r2/validate";

type Method = "UPLOAD" | "REQUEST_DESIGN" | "AI";

interface DesignMethodPickerProps {
  uploadAction: (state: DesignActionState, formData: FormData) => Promise<DesignActionState>;
  requestAction: (state: DesignActionState, formData: FormData) => Promise<DesignActionState>;
}

const STYLE_OPTIONS = ["CORPORATE", "MINIMAL", "LUXURY", "MODERN", "BOLD", "ELEGANT", "CREATIVE"] as const;

export function DesignMethodPicker({ uploadAction, requestAction }: DesignMethodPickerProps) {
  const [method, setMethod] = useState<Method | null>(null);
  const [uploadState, uploadFormAction, uploadPending] = useActionState<DesignActionState, FormData>(uploadAction, {
    error: null,
  });
  const [requestState, requestFormAction, requestPending] = useActionState<DesignActionState, FormData>(
    requestAction,
    { error: null },
  );

  if (method === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <MethodCard
          icon={FileUp}
          title="Upload My Design"
          description="Send us your print-ready file."
          onClick={() => setMethod("UPLOAD")}
        />
        <MethodCard
          icon={Wand2}
          title="Excel Printing Will Design It"
          description="Tell us what you need — our designers take it from there."
          onClick={() => setMethod("REQUEST_DESIGN")}
        />
        <MethodCard
          icon={Sparkles}
          title="Create Design With AI"
          description="Coming soon."
          onClick={() => setMethod("AI")}
          disabled
        />
      </div>
    );
  }

  if (method === "AI") {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <Sparkles className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">AI design generation is coming soon.</p>
        <Button variant="outline" className="mt-4" onClick={() => setMethod(null)}>
          Choose a different option
        </Button>
      </div>
    );
  }

  if (method === "UPLOAD") {
    return (
      <form action={uploadFormAction} className="max-w-xl space-y-4">
        <button type="button" onClick={() => setMethod(null)} className="text-sm text-brand hover:underline">
          ← Choose a different option
        </button>
        <div className="space-y-2">
          <Label htmlFor="file">Artwork file</Label>
          <Input id="file" name="file" type="file" accept={ALLOWED_ARTWORK_EXTENSIONS.map((e) => `.${e}`).join(",")} required />
          <p className="text-xs text-muted-foreground">
            Allowed formats: {ALLOWED_ARTWORK_EXTENSIONS.join(", ").toUpperCase()}. Max 100 MB.
          </p>
        </div>
        {uploadState.error && <p className="text-sm text-destructive">{uploadState.error}</p>}
        <Button type="submit" variant="brand" disabled={uploadPending}>
          {uploadPending ? "Uploading…" : "Upload Artwork"}
        </Button>
      </form>
    );
  }

  return (
    <form action={requestFormAction} className="max-w-xl space-y-4">
      <button type="button" onClick={() => setMethod(null)} className="text-sm text-brand hover:underline">
        ← Choose a different option
      </button>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>
        <Input id="companyName" name="companyName" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contentText">Text / content to include</Label>
        <Textarea id="contentText" name="contentText" rows={4} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactInfo">Contact info to display (phone, email, etc.)</Label>
        <Input id="contactInfo" name="contactInfo" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferredColors">Preferred colors</Label>
        <Input id="preferredColors" name="preferredColors" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stylePreference">Style preference</Label>
        <select
          id="stylePreference"
          name="stylePreference"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue=""
        >
          <option value="">No preference</option>
          {STYLE_OPTIONS.map((style) => (
            <option key={style} value={style}>
              {style.charAt(0) + style.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="designNotes">Anything else our designer should know?</Label>
        <Textarea id="designNotes" name="designNotes" rows={3} />
      </div>

      {requestState.error && <p className="text-sm text-destructive">{requestState.error}</p>}
      <Button type="submit" variant="brand" disabled={requestPending}>
        {requestPending ? "Submitting…" : "Submit Design Request"}
      </Button>
    </form>
  );
}

function MethodCard({
  icon: Icon,
  title,
  description,
  onClick,
  disabled,
}: {
  icon: typeof FileUp;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border border-border p-5 text-left transition-colors",
        disabled ? "cursor-not-allowed opacity-60" : "hover:border-brand/50 hover:bg-accent/40",
      )}
    >
      <Icon className="size-6 text-brand" strokeWidth={1.75} />
      <span className="font-semibold">{title}</span>
      <span className="text-sm text-muted-foreground">{description}</span>
    </button>
  );
}
