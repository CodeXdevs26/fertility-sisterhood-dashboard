"use client";

import { ReactNode, useState } from "react";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { ATextarea } from "@/components/form/ATextarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { quoteSchema, QuoteFormValues } from "@/validations/content.validation";
import { TQuote } from "@/interface/quote.interface";
import { useCreateQuoteMutation, useUpdateQuoteMutation } from "@/redux/api/quoteApi";
import handleMutation from "@/utils/handleMutation";

export default function QuoteFormModal({ children, quote }: { children: ReactNode; quote?: TQuote }) {
  const [open, setOpen] = useState(false);
  const [createQuote, { isLoading: isCreating }] = useCreateQuoteMutation();
  const [updateQuote, { isLoading: isUpdating }] = useUpdateQuoteMutation();
  const isSaving = isCreating || isUpdating;

  const onSubmit = (values: QuoteFormValues) => {
    const payload = { text: values.text, author: values.author || null };
    if (quote) {
      handleMutation({ id: quote.id, ...payload }, updateQuote, "Updating quote...", () => setOpen(false));
    } else {
      handleMutation(payload, createQuote, "Adding quote...", () => setOpen(false));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{quote ? "Edit quote" : "Add quote"}</DialogTitle>
          <DialogDescription>Shown on the app&apos;s home screen. Active quotes rotate daily.</DialogDescription>
        </DialogHeader>
        {open && (
          <AForm<QuoteFormValues>
            schema={quoteSchema}
            defaultValues={{ text: quote?.text ?? "", author: quote?.author ?? "" }}
            onSubmit={onSubmit}
            className="mt-2"
          >
            <ATextarea name="text" label="Quote" placeholder="Believe in the power of your body..." required />
            <AInput name="author" label="Author (optional)" placeholder="e.g. Unknown" />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : quote ? "Save changes" : "Add quote"}
              </Button>
            </div>
          </AForm>
        )}
      </DialogContent>
    </Dialog>
  );
}
