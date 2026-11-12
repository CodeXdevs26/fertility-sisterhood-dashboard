import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["auth"]
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      }),
      invalidatesTags: ["auth"]
    }),
    changePassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/change-password",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["auth"]
    }),
    // used for both "send" and "resend" OTP
    sendOtp: builder.mutation({
      query: (credentials) => ({
        url: "/otp/send",
        method: "POST",
        body: { ...credentials, purpose: "RESET_PASSWORD" },
      }),
    }),
    verifyOtp: builder.mutation({
      query: (credentials) => ({
        url: "/otp/verify",
        method: "POST",
        body: { ...credentials, purpose: "RESET_PASSWORD" },
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: credentials,
      }),
    })
  }),
})

export const { useLoginMutation, useLogoutMutation, useChangePasswordMutation, useSendOtpMutation, useVerifyOtpMutation, useResetPasswordMutation } = authApi;
