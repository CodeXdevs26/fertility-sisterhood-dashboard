"use client";

import { useState } from "react";
import AContainer from "@/components/AContainer";
import PageTitle from "@/components/others/PageTitle";
import { APagination } from "@/components/ui/APagination";
import { Input } from "@/components/ui/input";
import ASpinner from "@/components/ui/ASpinner";
import AErrorMessage from "@/components/AErrorMessage";
import { AFilterSelect } from "@/components/form/AFilterSelect";
import UserAvatar from "@/components/others/UserAvatar";
import StatusBadge from "@/components/others/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPaymentsQuery } from "@/redux/api/paymentApi";
import { useDebounce } from "@/hooks/useDebounce";
import { TPayment } from "@/interface/payment.interface";
import { TMeta } from "@/interface/global.interface";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";

const paymentStatusOptions = [
  { value: "all", label: "All" },
  { value: "SUCCEEDED", label: "Succeeded" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

const storeLabels: Record<string, string> = {
  APP_STORE: "App Store",
  PLAY_STORE: "Google Play",
  TEST_API: "Test purchase",
  STRIPE: "Stripe",
};

export default function TransactionsContainer() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const searchTerm = useDebounce(search.trim(), 500);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetPaymentsQuery({
    page: currentPage,
    limit,
    searchTerm,
    status,
  });
  const payments: TPayment[] = data?.data?.payments || [];
  const meta: TMeta | undefined = data?.data?.meta;

  return (
    <AContainer>
      <PageTitle
        title="Transactions"
        subTitle="Every subscription payment made by your members, through the App Store or Google Play."
      />
      <div className="flex items-center gap-4 justify-end">
        <Input
          name="search"
          aria-label="Search transactions"
          placeholder="Search by name or email..."
          className="w-[250px] h-11"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />
        <AFilterSelect
          onChange={(value) => {
            setStatus(value);
            setCurrentPage(1);
          }}
          placeholder="Status"
          value={status}
          options={paymentStatusOptions}
          className="w-[130px]!"
        />
      </div>

      {isLoading ? (
        <ASpinner size={120} className="py-32" />
      ) : isError ? (
        <AErrorMessage className="py-32" error={error} onRetry={refetch} />
      ) : (
        <div className={`mt-6 rounded-lg border border-border ${isFetching ? "opacity-60" : ""}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right px-4">Store</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar name={payment.auth?.name} className="size-9" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{payment.auth?.name || "Deleted user"}</p>
                        <p className="text-xs text-muted-foreground truncate">{payment.auth?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {formatCurrency(payment.amount, payment.currency)}
                    {payment.status === "SUCCEEDED" && payment.amountRefunded > 0 && (
                      <p className="text-xs font-normal text-muted-foreground">
                        {formatCurrency(payment.amountRefunded, payment.currency)} refunded
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(payment.createdAt, true)}
                  </TableCell>
                  <TableCell className="text-right px-4">
                    {payment.store ? storeLabels[payment.store] ?? payment.store : "—"}
                    {payment.environment === "SANDBOX" && (
                      <p className="text-xs text-muted-foreground">Sandbox</p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {payments.length === 0 && (
            <p className="py-8 text-center text-muted-foreground" role="status">No transactions found.</p>
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
