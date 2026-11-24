"use client";

import { Calendar, Crown, KeyRound, Mail, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { TAuthProvider, TUserDetails } from "@/interface/user.interface";
import ASpinner from "@/components/ui/ASpinner";
import AErrorMessage from "@/components/AErrorMessage";
import UserAvatar from "@/components/others/UserAvatar";
import StatusBadge from "@/components/others/StatusBadge";
import UserStatusAction from "@/components/others/UserStatusAction";
import { formatDate } from "@/utils/formatDate";

const providerLabels: Record<TAuthProvider, string> = {
  EMAIL: "email & password",
  GOOGLE: "Google",
  FACEBOOK: "Facebook",
};

interface UserDetailsModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({ userId, open, onOpenChange }: UserDetailsModalProps) {
  // only fetch when the modal is open
  const { data, isLoading, isError, error, refetch } = useGetSingleUserQuery(userId, {
    skip: !open,
  });
  const user: TUserDetails | undefined = data?.data;
  const subscription = user?.subscription;
  // a user is premium only when the subscription status is ACTIVE
  const isPremium = subscription?.status === "ACTIVE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-border sm:max-w-lg p-6 rounded-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">User details</DialogTitle>
          <DialogDescription className="sr-only">
            Account and subscription details
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <ASpinner size={80} className="py-16" />
        ) : isError || !user ? (
          <AErrorMessage className="py-10" error={error} onRetry={refetch} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <UserAvatar name={user.name} className="size-16 text-lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold text-foreground break-words">
                      {user.name}
                    </h2>
                    <StatusBadge status={user.status} />
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="break-all">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <KeyRound className="h-4 w-4 shrink-0" />
                      <span>Signs in with {providerLabels[user.provider] ?? "email & password"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <UserStatusAction userId={user.id} name={user.name} status={user.status} />
            </div>

            {/* Consent (given in the app's "Your consent matters" screen) */}
            <div className="border-t border-border pt-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="size-5 text-primary" />
                <h3 className="font-semibold text-foreground">Consent</h3>
              </div>
              <dl className="grid grid-cols-3 gap-4 text-sm">
                {[
                  { label: "Health data", value: user.consent?.healthData },
                  { label: "Marketing", value: user.consent?.marketing },
                  { label: "Cookies", value: user.consent?.cookies },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd className={`mt-1 font-medium ${item.value ? "text-green-600" : "text-muted-foreground"}`}>
                      {item.value ? "Given" : "Not given"}
                    </dd>
                  </div>
                ))}
              </dl>
              {user.consent?.healthDataUpdatedAt && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Health data consent last changed {formatDate(user.consent.healthDataUpdatedAt)}
                </p>
              )}
            </div>

            {/* Subscription */}
            <div className="border-t border-border pt-5">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="size-5 text-primary" />
                <h3 className="font-semibold text-foreground">Subscription</h3>
                {subscription && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isPremium ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isPremium ? "Premium" : "Not premium"}
                  </span>
                )}
              </div>

              {subscription ? (
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="mt-1">
                      <StatusBadge status={subscription.status} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Auto-renew</dt>
                    <dd className="mt-1 text-foreground">
                      {subscription.cancelAtPeriodEnd ? "Off" : "On"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Started</dt>
                    <dd className="mt-1 text-foreground">{formatDate(subscription.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      {subscription.cancelAtPeriodEnd ? "Ends on" : "Renews on"}
                    </dt>
                    <dd className="mt-1 text-foreground">
                      {formatDate(subscription.currentPeriodEnd)}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This user has never subscribed.
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
