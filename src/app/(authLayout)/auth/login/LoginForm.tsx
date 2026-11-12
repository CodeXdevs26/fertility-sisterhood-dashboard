"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import * as z from "zod";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/validations/auth.validation";
import { useLoginMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/slice/authSlice";
import handleMutation from "@/utils/handleMutation";
import { ACheckbox } from "@/components/form/ACheckbox";
import Link from "next/link";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { TDecodedUser } from "@/interface/global.interface";
import { getSafeRedirect } from "@/utils/getSafeRedirect";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const searchParams = useSearchParams();
  // page the user tried to visit before login (internal dashboard pages only)
  const redirectUrl = getSafeRedirect(searchParams.get("redirect"));

  const onSuccess = (res: any) => {
    const decodedUser = jwtDecode(res.data.accessToken) as TDecodedUser;
    // login is shared with the mobile app, so only let admins in
    if (decodedUser?.role !== "ADMIN") {
      toast.dismiss();
      return toast.error("Only admins can access the dashboard", {
        duration: 7000,
      });
    }
    dispatch(setUser({ user: decodedUser, token: res.data.accessToken }));
    // replace so the back button doesn't return to the login page
    router.replace(redirectUrl);
  };

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const { email, password } = data;
    await handleMutation(
      { email, password },
      login,
      "Logging in...",
      onSuccess
    );
  };

  return (
    <div className="w-full rounded-2xl p-6 sm:p-8 py-10 border border-border bg-white">
      <div className="mb-10 text-center">
        <h1 className="text-[32px] font-bold mb-2">Login To Your Account</h1>
        <p className="text-card-foreground text-sm mx-auto max-w-sm">
          Please log in to manage your dashboard and access all your
          administrative tools
        </p>
      </div>

      <AForm
        schema={loginSchema}
        defaultValues={{
          email: "admin@gmail.com",
          password: "Admin@123",
          rememberPassword: false,
        }}
        onSubmit={onSubmit}
      >
        <AInput name="email" label="Email address" type="email" required />
        <AInput name="password" label="Password" type="password" required />
        <div className="flex items-center justify-between">
          <ACheckbox label="Remember password" name="rememberPassword" />
          <div className="text-right">
            <Link href={"/auth/forgot-password"}>
              <Button
                type="button"
                variant="link"
                className="text-primary p-0 h-auto font-normal"
              >
                Forgot Password
              </Button>
            </Link>
          </div>
        </div>
        <Button disabled={isLoading} type="submit" className="h-14 w-full">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </AForm>
    </div>
  );
};

export default LoginForm;
