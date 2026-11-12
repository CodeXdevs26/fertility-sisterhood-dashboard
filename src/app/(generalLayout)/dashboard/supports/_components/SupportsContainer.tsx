"use client";

import { useState } from "react";
import AContainer from "@/components/AContainer";
import PageTitle from "@/components/others/PageTitle";
import { APagination } from "@/components/ui/APagination";
import { Input } from "@/components/ui/input";
import ASpinner from "@/components/ui/ASpinner";
import AErrorMessage from "@/components/AErrorMessage";
import { useGetSupportsQuery } from "@/redux/api/supportApi";
import { useDebounce } from "@/hooks/useDebounce";
import { TSupport } from "@/interface/support.interface";
import { TMeta } from "@/interface/global.interface";
import { SupportCard } from "./SupportCard";

export default function SupportsContainer() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const searchTerm = useDebounce(search.trim(), 500);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetSupportsQuery({
    page: currentPage,
    limit,
    searchTerm,
  });
  const supports: TSupport[] = data?.data?.supports || [];
  const meta: TMeta | undefined = data?.data?.meta;

  return (
    <AContainer>
      <PageTitle
        title="Supports"
        subTitle="Review support messages, view sender details, and help users with their questions."
      />
      <div className="flex items-center gap-4 justify-end">
        <Input
          name="search"
          aria-label="Search support messages"
          placeholder="Search..."
          className="w-[250px] h-11"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <ASpinner size={120} className="py-32" />
      ) : isError ? (
        <AErrorMessage className="py-32" error={error} onRetry={refetch} />
      ) : (
        <div className={`space-y-3 mt-6 ${isFetching ? "opacity-60" : ""}`}>
          {supports.map((support) => <SupportCard key={support.id} support={support} />)}
          {supports.length === 0 && (
            <p className="py-8 text-center text-muted-foreground" role="status">No support messages found.</p>
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
