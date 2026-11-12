import { cleanParams } from "@/utils/cleanParams";
import { baseApi } from "./baseApi";

const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupports: builder.query({
      query: (params) => ({
        url: "/support",
        method: "GET",
        params: cleanParams(params)
      }),
      providesTags: ["support"]
    }),
    getSingleSupport: builder.query({
      query: (id) => ({
        url: `/support/${id}`,
        method: "GET",
      }),
      providesTags: ["support"]
    }),
    changeSupportStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/support/${id}/status`,
        method: "PATCH",
        body: { status }
      }),
      invalidatesTags: ["support"]
    }),
  }),
})

export const { useGetSupportsQuery, useGetSingleSupportQuery, useChangeSupportStatusMutation } = supportApi;
