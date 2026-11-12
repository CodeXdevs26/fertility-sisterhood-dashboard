"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import handleMutation from "@/utils/handleMutation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  newPasswordSchema,
  TNewPasswordFormValues,
} from "@/validations/auth.validation";

const NewPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  // null = not read yet (cookie is only available in the browser)
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    setResetToken(Cookies.get("resetToken") || "");
  }, []);

  const isSessionMissing = resetToken !== null && (!email || !resetToken);

  const onSubmit = async (data: TNewPasswordFormValues) => {
    if (!email || !resetToken) {
      return toast.error("Your reset session has expired. Please request a new code.");
    }
    // confirmPassword is checked on the frontend only
    const payload = {
      email,
      password: data.newPassword,
      resetToken,
    };
    const onSuccess = () => {
      Cookies.remove("resetToken");
      router.push("/auth/login");
    };
    handleMutation(payload, resetPassword, "Resetting password...", onSuccess);
  };

  return (
    <div className="w-full rounded-2xl p-6 sm:p-8 py-10 border border-border bg-white">
      <div className="mb-10 text-center">
        <h1 className="text-[32px] font-bold mb-2">Reset Password</h1>
        <p className="text-card-foreground text-sm mx-auto max-w-sm">
          Set your new password to regain access to your account.
        </p>
      </div>

      {isSessionMissing && (
        <p className="mb-6 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
          Your reset session has expired.{" "}
          <Link href="/auth/forgot-password" className="underline">
            Request a new code
          </Link>
        </p>
      )}

      <AForm
        schema={newPasswordSchema}
        defaultValues={{
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={onSubmit}
      >
        <AInput
          placeholder="Enter password"
          name="newPassword"
          label="New Password"
          type="password"
          required
        />
        <AInput
          placeholder="Enter password"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          required
        />
        <Button
          disabled={isLoading || isSessionMissing}
          type="submit"
          className="h-14 w-full"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </AForm>
    </div>
  );
};

export default NewPasswordForm;
