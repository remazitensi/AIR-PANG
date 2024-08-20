export class CustomError extends Error {
    public statusCode: number;
    public validationErrors?: object[];
  
    constructor(message: string, statusCode: number, validationErrors?: object[]) {
      super(message);
      this.statusCode = statusCode;
      this.validationErrors = validationErrors;
    }
  
    static handleError(err: Error): { statusCode: number; message: string; validationErrors?: object[] } {
      if (err instanceof CustomError) {
        return {
          statusCode: err.statusCode,
          message: err.message,
          validationErrors: err.validationErrors,
        };
      }
      
      return {
        statusCode: 500,
        message: 'Internal Server Error',
      };
    }
  }
  
  export class AuthenticationError extends CustomError {
    constructor(message: string = 'Authentication failed') {
      super(message, 401);
    }
  }
  
  export class AuthorizationError extends CustomError {
    constructor(message: string = 'You do not have permission to perform this action') {
      super(message, 403);
    }
  }
  
  export class NotFoundError extends CustomError {
    constructor(entity: string, identifier: string) {
      super(`${entity} with identifier ${identifier} was not found`, 404);
    }
  }
  
  export class ValidationError extends CustomError {
    constructor(errors: object[]) {
      super('Validation failed', 400, errors);
    }
  }
  