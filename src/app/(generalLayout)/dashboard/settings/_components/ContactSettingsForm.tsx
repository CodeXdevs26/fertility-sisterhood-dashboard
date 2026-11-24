"use client";

import { Loader2, Save } from "lucide-react";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { Button } from "@/components/ui/button";
import ASpinner from "@/components/ui/ASpinner";
import AErrorMessage from "@/components/AErrorMessage";
import { useGetAppSettingsQuery, useUpdateAppSettingsMutation } from "@/redux/api/contentApi";
import { appSettingsSchema, AppSettingsFormValues } from "@/validations/appSettings.validation";
import { TAppSettings } from "@/interface/legal.interface";
import handleMutation from "@/utils/handleMutation";

// Contact details and community link shown in the app's Profile screen
const ContactSettingsForm = () => {
  const { data, isLoading, isError, error, refetch } = useGetAppSettingsQuery("");
  const [updateAppSettings, { isLoading: isSaving }] = useUpdateAppSettingsMutation();
  // data is null until the settings are saved for the first time
  const settings: TAppSettings | null = data?.data ?? null;

  if (isLoading) return <ASpinner size={100} className="py-32" />;
  if (isError) return <AErrorMessage className="py-32" error={error} onRetry={refetch} />;

  return (
    <div>
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Contact & Community</h1>
        <p className="text-muted-foreground mt-1">
          Shown to members in the app under &quot;Contact Support&quot; and &quot;Join Our Community&quot;
        </p>
      </div>
      <AForm<AppSettingsFormValues>
        key={settings ? JSON.stringify(settings) : "empty"}
        schema={appSettingsSchema}
        defaultValues={{
          supportEmail: settings?.supportEmail ?? "",
          supportPhone: settings?.supportPhone ?? "",
          communityLink: settings?.communityLink ?? "",
        }}
        onSubmit={(values) => handleMutation(values, updateAppSettings, "Saving changes...")}
        className="p-6 max-w-xl"
      >
        <AInput name="supportEmail" label="Support email" type="email" placeholder="support@example.com" required />
        <AInput name="supportPhone" label="Support phone" placeholder="+44 20 1234 5678" required />
        <AInput name="communityLink" label="Community link (e.g. WhatsApp group)" placeholder="https://chat.whatsapp.com/..." required />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} size="lg" className="min-w-[140px] gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </AForm>
    </div>
  );
};

export default ContactSettingsForm;
