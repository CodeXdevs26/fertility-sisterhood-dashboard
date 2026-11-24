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
    }),
    getAppSettings: builder.query({
      query: () => ({
        url: "/app-settings",
        method: "GET",
      }),
      providesTags: ["appSettings"]
    }),
    updateAppSettings: builder.mutation({
      query: (data) => ({
        url: "/app-settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["appSettings"]
    })
  }),
})

export const { useGetContentsQuery, useUpdateContentMutation, useGetAppSettingsQuery, useUpdateAppSettingsMutation } = contentApi;
