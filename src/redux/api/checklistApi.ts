import { cleanParams } from "@/utils/cleanParams";
import { baseApi } from "./baseApi";

const checklistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChecklistTemplates: builder.query({
      query: (params) => ({
        url: "/checklist-templates",
        method: "GET",
        params: cleanParams(params)
      }),
      providesTags: ["checklist"]
    }),
    createChecklistTemplate: builder.mutation({
      query: (data) => ({
        url: "/checklist-templates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["checklist"]
    }),
    updateChecklistTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/checklist-templates/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["checklist"]
    }),
    deleteChecklistTemplate: builder.mutation({
      query: (id) => ({
        url: `/checklist-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["checklist"]
    }),
  }),
})

export const {
  useGetChecklistTemplatesQuery,
  useCreateChecklistTemplateMutation,
  useUpdateChecklistTemplateMutation,
  useDeleteChecklistTemplateMutation,
} = checklistApi;
