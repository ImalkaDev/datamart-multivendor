import { db } from "@/db";
import { settings } from "@/db/schema";
import { updateSeoSettings } from "../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SeoSettingsPage() {
  const metaTitleSetting = await db.query.settings.findFirst({
    where: (settings, { eq }) => eq(settings.key, "meta_title"),
  });
  const metaDescriptionSetting = await db.query.settings.findFirst({
    where: (settings, { eq }) => eq(settings.key, "meta_description"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure the global meta tags for the marketplace.
        </p>
      </div>

      <div className="rounded-md border bg-white shadow p-6">
        <form action={updateSeoSettings} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Global Meta Title</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              defaultValue={metaTitleSetting?.value || ""}
              placeholder="DataMart - Premium Multivendor Dataset Marketplace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Global Meta Description</Label>
            <Input
              id="metaDescription"
              name="metaDescription"
              defaultValue={metaDescriptionSetting?.value || ""}
              placeholder="Discover, buy, and sell high-quality datasets..."
            />
          </div>
          <Button type="submit">Save Settings</Button>
        </form>
      </div>
    </div>
  );
}
