import { baseApi } from "./baseApi";

const subscriptionPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlan: builder.query({
      query: () => ({
        url: "/subscriptions/plan",
        method: "GET",
      }),
      providesTags: ["plans"]
    }),
    // creates the plan on first save, updates it afterwards
    updatePlan: builder.mutation({
      query: (data) => ({
        url: "/subscriptions/plan",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["plans"]
    }),
  }),
})

export const { useGetPlanQuery, useUpdatePlanMutation } = subscriptionPlanApi;
