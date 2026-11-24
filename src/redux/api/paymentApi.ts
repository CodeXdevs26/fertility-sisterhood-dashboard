import { cleanParams } from "@/utils/cleanParams";
import { baseApi } from "./baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: (params) => ({
        url: "/payments",
        method: "GET",
        params: cleanParams(params)
      }),
      providesTags: ["payment"]
    }),
  }),
})

export const { useGetPaymentsQuery } = paymentApi;
