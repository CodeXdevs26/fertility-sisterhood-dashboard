"use client";
import { UserCard } from "../../user-management/_components/UserCard";
import { useGetUsersQuery } from "@/redux/api/userApi";
import { TUser } from "@/interface/user.interface";
import { Skeleton } from "@/components/ui/skeleton";

const NewUsers = () => {
  // list is sorted newest first by default
  const { data, isLoading } = useGetUsersQuery({ limit: 6 });
  const users: TUser[] = data?.data?.auths || [];

  return (
    <div className="overflow-x-auto">
      <h3 className="font-bold text-2xl">New Users</h3>
      <div className="space-y-3 mt-4">
        {isLoading &&
          [0, 1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="h-[82px] rounded-lg" />
          ))}
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
        {!isLoading && users.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No users yet.</p>
        )}
      </div>
    </div>
  );
};

export default NewUsers;
