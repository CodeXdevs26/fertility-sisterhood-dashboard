import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { useLogoutMutation } from "@/redux/api/authApi";
import { logOut } from "@/redux/slice/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import handleMutation from "@/utils/handleMutation";

// Calls the logout API, clears the local session and goes to the login page.
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  // clear the local session even if the logout request fails
  const clearSession = () => {
    dispatch(logOut());
    dispatch(baseApi.util.resetApiState());
    router.replace("/auth/login");
  };

  const handleLogout = async () => {
    await handleMutation({}, logout, "Logging out...", clearSession, clearSession);
  };

  return { handleLogout, isLoading };
};
