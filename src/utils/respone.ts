import { ZodError } from "zod";

export function sendSuccessResponse<T>(data?: T | T[]) {
  return {
    success: true,
    message: "Success",
    data: data,
  };
}

export function sendValidationResponse(validationErrors: ZodError) {
  return {
    success: false,
    message: "Invalid Request",
    validation_errors: validationErrors.flatten().fieldErrors,
  };
}

export function sendInvalidResponse(error?: string) {
  return {
    success: false,
    message: "Invalid Request",
    error: error,
  };
}
