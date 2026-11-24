import { cleanParams } from "@/utils/cleanParams";
import { baseApi } from "./baseApi";

const quoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuotes: builder.query({
      query: (params) => ({
        url: "/quotes",
        method: "GET",
        params: cleanParams(params)
      }),
      providesTags: ["quote"]
    }),
    createQuote: builder.mutation({
      query: (data) => ({
        url: "/quotes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["quote"]
    }),
    updateQuote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/quotes/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["quote"]
    }),
    deleteQuote: builder.mutation({
      query: (id) => ({
        url: `/quotes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["quote"]
    }),
  }),
})

export const {
  useGetQuotesQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
} = quoteApi;
