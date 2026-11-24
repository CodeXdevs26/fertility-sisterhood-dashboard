import { cleanParams } from "@/utils/cleanParams";
import { baseApi } from "./baseApi";
import { TNotification, TNotificationResponse } from "@/interface/notification.interface";

// the backend keeps the mobile app's field names; map them to the dashboard's
export const toNotification = (item: TNotificationResponse): TNotification => ({
  id: item.id,
  type: item.modelType,
  title: item.message,
  message: item.description,
  referenceId: item.referenceId,
  isRead: item.read,
  createdAt: item.createdAt,
});

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({
        url: "/notifications",
        method: "GET",
        params: cleanParams(params)
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (res: any) =>
        res?.data?.notifications
          ? { ...res, data: { ...res.data, notifications: res.data.notifications.map(toNotification) } }
          : res,
      providesTags: ["notification"]
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"]
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["notification"]
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notification"]
    }),
    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: "/notifications",
        method: "DELETE",
      }),
      invalidatesTags: ["notification"]
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationApi;
