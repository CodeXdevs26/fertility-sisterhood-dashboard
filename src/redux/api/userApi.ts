import { cleanParams } from "@/utils/cleanParams";
import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: "/auth",
        method: "GET",
        params: cleanParams(params)
      }),
      providesTags: ["user"]
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "GET",
      }),
      providesTags: ["user"]
    }),
    changeUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/auth/change-account-status/${userId}`,
        method: "PATCH",
        body: { status }
      }),
      invalidatesTags: ["user", "meta", "support"]
    }),
  }),
})

export const { useGetUsersQuery, useGetSingleUserQuery, useChangeUserStatusMutation } = userApi;
