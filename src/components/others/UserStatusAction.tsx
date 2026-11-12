"use client";
import { Lock, LockOpen } from "lucide-react";
import { AAlertDialog } from "@/components/modal/AAlertDialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useChangeUserStatusMutation } from "@/redux/api/userApi";
import handleMutation from "@/utils/handleMutation";
import { TUserStatus } from "@/interface/user.interface";

// Block / unblock button with confirmation, used on user and support cards
const UserStatusAction = ({
  userId,
  name,
  status,
}: {
  userId: string;
  name: string;
  status: TUserStatus;
}) => {
  const [changeUserStatus, { isLoading }] = useChangeUserStatusMutation();
  const isBlocked = status === "BLOCKED";
  const label = isBlocked ? "Unblock user" : "Block user";

  const handleChangeStatus = () => {
    handleMutation(
      { userId, status: isBlocked ? "ACTIVE" : "BLOCKED" },
      changeUserStatus,
      isBlocked ? "Activating account..." : "Blocking account..."
    );
  };

  return (
    <Tooltip>
      <AAlertDialog
        title={isBlocked ? "Unblock this user?" : "Block this user?"}
        description={
          isBlocked
            ? `${name} will be able to use the app again.`
            : `${name} will no longer be able to log in to the app.`
        }
        actionText={isBlocked ? "Unblock" : "Block"}
        onAction={handleChangeStatus}
      >
        <TooltipTrigger asChild>
          <Button
            disabled={isLoading}
            className={
              isBlocked
                ? "w-9 bg-green-600 hover:bg-green-700"
                : "w-9 bg-destructive hover:bg-destructive"
            }
            aria-label={`${label} ${name}`}
          >
            {isBlocked ? <LockOpen /> : <Lock />}
          </Button>
        </TooltipTrigger>
      </AAlertDialog>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default UserStatusAction;
