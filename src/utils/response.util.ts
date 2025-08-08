// A generic success response wrapper
export const successResponse = <T>(
  data: T,
  message: string = "Success"
) => {
  return {
    success: true,
    message,
    data,
  };
};
