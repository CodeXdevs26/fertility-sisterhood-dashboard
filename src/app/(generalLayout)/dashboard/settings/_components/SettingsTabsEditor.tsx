"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import JoditTextEditor from "@/components/form/ATextEditor";
import ASpinner from "@/components/ui/ASpinner";
import AErrorMessage from "@/components/AErrorMessage";
import { useGetContentsQuery, useUpdateContentMutation } from "@/redux/api/contentApi";
import handleMutation from "@/utils/handleMutation";
import { TLegal } from "@/interface/legal.interface";
import ContactSettingsForm from "./ContactSettingsForm";

type TContentKey = "aboutUs" | "termsCondition" | "privacyPolicy";
type TContents = Record<TContentKey, string>;

const sections: { id: TContentKey; title: string }[] = [
  { id: "aboutUs", title: "About Us" },
  { id: "termsCondition", title: "Terms & Conditions" },
  { id: "privacyPolicy", title: "Privacy Policy" },
];

const emptyContents: TContents = { aboutUs: "", termsCondition: "", privacyPolicy: "" };

// true when the editor has no visible text (e.g. "<p><br></p>")
const isEmptyHtml = (html: string) =>
  !/<img/i.test(html) &&
  html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";

const SettingsTabsEditor = () => {
  const [activeTab, setActiveTab] = useState<TContentKey | "contact">("aboutUs");
  const [contents, setContents] = useState<TContents>(emptyContents);
  const [savingTab, setSavingTab] = useState<TContentKey | null>(null);

  const { data, isLoading, isError, error, refetch } = useGetContentsQuery("");
  const [updateContent] = useUpdateContentMutation();
  // data is null until the contents are saved for the first time
  const savedContents: TLegal | null = data?.data ?? null;

  useEffect(() => {
    if (!savedContents) return;
    setContents({
      aboutUs: savedContents.aboutUs || "",
      termsCondition: savedContents.termsCondition || "",
      privacyPolicy: savedContents.privacyPolicy || "",
    });
  }, [savedContents]);

  const handleContentChange = (sectionId: TContentKey, content: string) => {
    setContents((prev) => ({ ...prev, [sectionId]: content }));
  };

  const handleSave = (sectionId: TContentKey) => {
    // backend requires all three on every save: the edited field + the other two from the last GET.
    // Before the first save there is nothing in the GET, so fall back to what is typed in the editor.
    const payload: TContents = {
      aboutUs: savedContents?.aboutUs || contents.aboutUs,
      termsCondition: savedContents?.termsCondition || contents.termsCondition,
      privacyPolicy: savedContents?.privacyPolicy || contents.privacyPolicy,
      [sectionId]: contents[sectionId],
    };

    const emptySections = sections.filter((section) => isEmptyHtml(payload[section.id]));
    if (emptySections.length) {
      const names = emptySections.map((section) => section.title).join(", ");
      return toast.error(
        emptySections.some((section) => section.id === sectionId)
          ? `${names} cannot be empty.`
          : `All three pages are required. Please write content for: ${names}.`
      );
    }

    // backend does not sanitize, so clean the HTML before sending
    const sanitizedPayload = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, DOMPurify.sanitize(value)])
    );

    setSavingTab(sectionId);
    handleMutation(
      sanitizedPayload,
      updateContent,
      "Saving changes...",
      () => setSavingTab(null),
      () => setSavingTab(null)
    );
  };

  if (isLoading) return <ASpinner size={150} className="py-56" />;

  if (isError)
    return <AErrorMessage className="py-56" error={error} onRetry={refetch} />;

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="flex-1">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TContentKey | "contact")}
          className="flex flex-col"
        >
          {/* Tabs Header */}
          <TabsList className="grid w-full grid-cols-4 bg-card mb-6 h-14">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-card"
              >
                {section.title}
              </TabsTrigger>
            ))}
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-primary data-[state=active]:text-card"
            >
              Contact & Community
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col">
            {sections.map((section) => (
              <TabsContent
                key={section.id}
                value={section.id}
                className="flex-1 flex flex-col mt-0"
              >
                <div className="flex-1 flex flex-col">
                  {/* Title */}
                  <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold text-foreground">
                      {section.title}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Edit and manage your {section.title.toLowerCase()} content
                    </p>
                  </div>

                  {/* Editor */}
                  <div className="flex-1 p-6">
                    <div className="h-fit bg-background border border-border rounded-lg overflow-hidden">
                      <JoditTextEditor
                        content={contents[section.id]}
                        onChange={(content) =>
                          handleContentChange(section.id, content)
                        }
                        placeholder={`Enter your ${section.title.toLowerCase()} content here...`}
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="p-6 border-t border-border">
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSave(section.id)}
                        disabled={savingTab !== null}
                        className="min-w-[140px] gap-2"
                        size="lg"
                      >
                        {savingTab === section.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
            <TabsContent value="contact" className="mt-0">
              <ContactSettingsForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsTabsEditor;
