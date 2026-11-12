"use client";
import { useState } from "react";
import { AFilterSelect } from "@/components/form/AFilterSelect";
import { userTypeOptions } from "@/data/global.data";
import { Input } from "@/components/ui/input";
import { APagination } from "@/components/ui/APagination";
import { UserCard } from "./UserCard";
import { useGetUsersQuery } from "@/redux/api/userApi";
import { useDebounce } from "@/hooks/useDebounce";
import { TUser } from "@/interface/user.interface";
import { TMeta } from "@/interface/global.interface";
import ASpinner from "@/components/ui/ASpinner";
import AErrorMessage from "@/components/AErrorMessage";

const Users = () => {
  const [userType, setUserType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;
  const searchTerm = useDebounce(search.trim(), 500);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetUsersQuery({
    page: currentPage,
    limit,
    searchTerm,
    status: userType,
  });
  const users: TUser[] = data?.data?.auths || [];
  const meta: TMeta | undefined = data?.data?.meta;

  return (
    <div>
      <div className="flex items-center gap-4 justify-end">
        <Input
          name="search"
          aria-label="Search users"
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
            setUserType(value);
            setCurrentPage(1);
          }}
          placeholder={"user type"}
          value={userType}
          options={userTypeOptions}
          className="w-[110px]!"
        />
      </div>

      {isLoading ? (
        <ASpinner size={120} className="py-32" />
      ) : isError ? (
        <AErrorMessage className="py-32" error={error} onRetry={refetch} />
      ) : (
        <div className={`space-y-3 mt-6 ${isFetching ? "opacity-60" : ""}`}>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
          {users.length === 0 && (
            <p className="py-8 text-center text-muted-foreground" role="status">
              No users found.
            </p>
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
    </div>
  );
};

export default Users;
