"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { otpSchema } from "@/validations/auth.validation";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";
import handleMutation from "@/utils/handleMutation";
import Cookies from "js-cookie";
import { toast } from "sonner";

// Infer the form data type from the schema
type TOtpVerificationFormValues = z.infer<typeof otpSchema>;

const OtpVerificationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<TOtpVerificationFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: TOtpVerificationFormValues) => {
    if (!email) {
      return toast.error("Email is missing. Please request a new code.");
    }
    const payload = { otp: data.otp, email };
    const onSuccess = (response: any) => {
      // resetToken is valid for 10 minutes, keep it for the reset step
      const resetToken = response?.data?.resetToken;
      if (resetToken) {
        Cookies.set("resetToken", resetToken, {
          expires: 1 / 144, // 10 minutes
          secure: true,
          sameSite: "strict",
        });
      }
      router.push(`/auth/set-new-password?email=${encodeURIComponent(email)}`);
    };
    handleMutation(payload, verifyOtp, "Verifying OTP...", onSuccess);
  };

  // Handle resend code
  const handleResendCode = () => {
    if (!email) {
      return toast.error("Email is missing. Please go back and enter your email.");
    }
    handleMutation({ email }, sendOtp, "Resending OTP...");
  };

  return (
    <div className="w-full rounded-2xl p-6 sm:p-8 py-10 border border-border bg-white">
      <div className="mb-10 text-center">
        <h1 className="text-[32px] font-bold mb-2">Recover Password</h1>
        <p className="text-card-foreground text-sm mx-auto max-w-sm">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-foreground">{email || "your email"}</span>.
          The code expires in 5 minutes.
        </p>
      </div>

      {/* Form */}
      <div className="text-center mx-auto w-full">
        {" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP Field */}
            <div className="text-center mx-auto">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        onChange={(value) => field.onChange(value)}
                        className="flex !justify-center"
                      >
                        <InputOTPGroup className="space-x-1 sm:space-x-2">
                          <InputOTPSlot
                            index={0}
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10 w-8 sm:h-15 sm:w-15 rounded-lg text-center"
                          />
                          <InputOTPSlot
                            index={1}
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10 w-8 sm:h-15 sm:w-15 rounded-lg text-center"
                          />
                          <InputOTPSlot
                            index={2}
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10 w-8 sm:h-15 sm:w-15 rounded-lg text-center"
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator className="text-muted-foreground" />
                        <InputOTPGroup className="space-x-1 sm:space-x-2">
                          <InputOTPSlot
                            index={3}
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10 w-8 sm:h-15 sm:w-15 rounded-lg text-center"
                          />
                          <InputOTPSlot
                            index={4}
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10 w-8 sm:h-15 sm:w-15 rounded-lg text-center"
                          />
                          <InputOTPSlot
                            index={5}
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10 w-8 sm:h-15 sm:w-15 rounded-lg text-center"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Resend Code */}
            <div>
              <p className="text-muted-foreground text-sm mb-2">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-primary hover:underline"
                  disabled={isResending}
                >
                  {isResending ? "Resending..." : "Resend Code"}
                </button>
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
