import { baseApi } from "./baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => ({
        url: "/meta/stats",
        method: "GET",
      }),
      providesTags: ["meta"]
    }),
    getUserOverview: builder.query({
      query: (params) => ({
        url: "/meta/user-overview",
        method: "GET",
        params
      }),
      providesTags: ["meta"]
    }),
    getEarningOverview: builder.query({
      query: (params) => ({
        url: "/meta/earning-overview",
        method: "GET",
        params
      }),
      providesTags: ["meta"]
    }),
  }),
})

export const { useGetStatsQuery, useGetUserOverviewQuery, useGetEarningOverviewQuery } = dashboardApi;
