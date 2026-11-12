"use client";
import UserAvatar from "@/components/others/UserAvatar";

interface ProfileHeaderProps {
  name: string;
  role: string;
}

const ProfileHeader = ({ name, role }: ProfileHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Profile Avatar and Info */}
      <div className="flex flex-col items-center space-y-4">
        <UserAvatar name={name} className="size-[120px] text-3xl" />

        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">{name}</h2>
          <p className="text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
