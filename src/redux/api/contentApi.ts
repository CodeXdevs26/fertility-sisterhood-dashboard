import { baseApi } from "./baseApi";

const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContents: builder.query({
      query: () => ({
        url: "/legal",
        method: "GET",
      }),
      providesTags: ["content"]
    }),
    updateContent: builder.mutation({
      query: (data) => ({
        url: "/legal",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["content"]
    })
  }),
})

export const { useGetContentsQuery, useUpdateContentMutation } = contentApi;
