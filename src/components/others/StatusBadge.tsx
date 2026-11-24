import { Badge } from "@/components/ui/badge";

const styles: Record<string, string> = {
  ACTIVE: "bg-green-600/20 text-green-600",
  RESOLVED: "bg-green-600/20 text-green-600",
  BLOCKED: "bg-destructive/15 text-destructive",
  PENDING: "bg-amber-500/20 text-amber-700",
  SUCCEEDED: "bg-green-600/20 text-green-600",
  FAILED: "bg-destructive/15 text-destructive",
  PAST_DUE: "bg-amber-500/20 text-amber-700",
};

// Renders an UPPERCASE backend enum as a readable badge, e.g. PAST_DUE -> "past due"
const StatusBadge = ({ status }: { status?: string | null }) => {
  if (!status) return null;
  return (
    <Badge
      variant="default"
      className={`capitalize ${styles[status] || "bg-secondary text-foreground"}`}
    >
      {status.replace(/_/g, " ").toLowerCase()}
    </Badge>
  );
};

export default StatusBadge;
