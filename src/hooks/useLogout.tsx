import { useAppDispatch } from "@/redux/hooks/hooks";
import { useLogoutMutation } from "@/redux/api/authApi";
import { logOut } from "@/redux/slice/authSlice";
import { persistor } from "@/redux/store";
import handleMutation from "@/utils/handleMutation";

// Calls the logout API, clears the local session and goes to the login page.
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  // clear the local session even if the logout request fails
  const clearSession = async () => {
    dispatch(logOut());
    await persistor.flush();
    // a full page load drops the cached API data; resetApiState would refetch
    // the mounted queries without a token first and get 401s
    window.location.replace("/auth/login");
  };

  const handleLogout = async () => {
    await handleMutation({}, logout, "Logging out...", clearSession, clearSession);
  };

  return { handleLogout, isLoading };
};
