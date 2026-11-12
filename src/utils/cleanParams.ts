// Remove empty values so they are not sent as query params
export const cleanParams = (params: Record<string, unknown> = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "" && value !== "all"
    )
  );
