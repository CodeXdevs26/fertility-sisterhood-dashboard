import { baseApi } from "./baseApi";

const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: () => ({
        url: "/packages",
        method: "GET",
      }),
      providesTags: ["plans"]
    }),
    createPackage: builder.mutation({
      query: (data) => ({
        url: "/packages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["plans"]
    }),
    updatePackage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["plans"]
    }),
    // soft delete: hidden from users, existing subscribers keep it
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["plans"]
    }),
  }),
})

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
