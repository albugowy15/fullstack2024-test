export class AppError extends Error {
  constructor(
    readonly httpCode: number,
    message: string,
    readonly error: string,
  ) {
    super(message);
  }
}

export class BadRequestError extends AppError {
  constructor(error: string) {
    super(400, "Invalid Request", error);
  }
}

export class InternalServerError extends AppError {
  constructor(error: string) {
    super(500, "Internal Server Error", error);
  }
}

export class NotFoundError extends AppError {
  constructor(error: string) {
    super(404, "Not Found", error);
  }
}

export class UnauthorizedError extends AppError {
  constructor(error: string) {
    super(403, "Unauthorized", error);
  }
}
