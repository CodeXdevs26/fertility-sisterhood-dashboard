"use client";

import { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Quote } from "lucide-react";
import AContainer from "@/components/AContainer";
import PageTitle from "@/components/others/PageTitle";
import DeleteAction from "@/components/others/DeleteAction";
import { Button } from "@/components/ui/button";
import { APagination } from "@/components/ui/APagination";
import ASpinner from "@/components/ui/ASpinner";
import AErrorMessage from "@/components/AErrorMessage";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteQuoteMutation, useGetQuotesQuery, useUpdateQuoteMutation } from "@/redux/api/quoteApi";
import { TQuote } from "@/interface/quote.interface";
import { TMeta } from "@/interface/global.interface";
import handleMutation from "@/utils/handleMutation";
import QuoteFormModal from "./QuoteFormModal";

function QuoteCard({ quote }: { quote: TQuote }) {
  const [updateQuote, { isLoading: isUpdating }] = useUpdateQuoteMutation();
  const [deleteQuote, { isLoading: isDeleting }] = useDeleteQuoteMutation();

  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-lg border border-border">
      <div className={`flex gap-3 min-w-0 ${quote.isActive ? "" : "opacity-60"}`}>
        <Quote className="size-5 shrink-0 text-primary mt-0.5" />
        <div className="min-w-0">
          <p className="break-words">&ldquo;{quote.text}&rdquo;</p>
          <p className="text-sm text-muted-foreground mt-1">
            {quote.author || "Unknown"}
            {!quote.isActive && " · Hidden from app"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="w-9"
              disabled={isUpdating}
              aria-label={quote.isActive ? "Hide quote" : "Show quote"}
              onClick={() =>
                handleMutation(
                  { id: quote.id, isActive: !quote.isActive },
                  updateQuote,
                  quote.isActive ? "Hiding quote..." : "Showing quote..."
                )
              }
            >
              {quote.isActive ? <EyeOff /> : <Eye />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{quote.isActive ? "Hide from app" : "Show in app"}</TooltipContent>
        </Tooltip>
        <QuoteFormModal quote={quote}>
          <Button className="w-9" aria-label="Edit quote"><Pencil /></Button>
        </QuoteFormModal>
        <DeleteAction
          label="Delete quote"
          description="This quote will no longer be shown in the app."
          disabled={isDeleting}
          onDelete={() => handleMutation(quote.id, deleteQuote, "Deleting quote...")}
        />
      </div>
    </div>
  );
}

export default function QuotesContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching, isError, error, refetch } = useGetQuotesQuery({ page: currentPage, limit });
  const quotes: TQuote[] = data?.data?.quotes || [];
  const meta: TMeta | undefined = data?.data?.meta;

  return (
    <AContainer>
      <div className="flex items-end justify-between gap-4">
        <PageTitle
          title="Daily Quotes"
          subTitle="Motivational quotes for the app's home screen. One active quote is shown each day."
        />
        <QuoteFormModal>
          <Button><Plus />Add quote</Button>
        </QuoteFormModal>
      </div>

      {isLoading ? (
        <ASpinner size={120} className="py-32" />
      ) : isError ? (
        <AErrorMessage className="py-32" error={error} onRetry={refetch} />
      ) : (
        <div className={`space-y-3 mt-6 ${isFetching ? "opacity-60" : ""}`}>
          {quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)}
          {quotes.length === 0 && (
            <p className="py-8 text-center text-muted-foreground" role="status">No quotes yet.</p>
          )}
        </div>
      )}

      {!!meta?.total && (
        <APagination
          totalItems={meta.total}
          itemsPerPage={limit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </AContainer>
  );
}
