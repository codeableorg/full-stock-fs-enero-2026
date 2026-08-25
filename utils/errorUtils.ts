export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // Llama al constructor padre (Error)
    this.statusCode = statusCode;
  }
}
