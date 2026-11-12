import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/getInitials";

// The backend has no profile photos, so we show initials everywhere
const UserAvatar = ({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) => {
  return (
    <Avatar className={cn("size-12", className)}>
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
