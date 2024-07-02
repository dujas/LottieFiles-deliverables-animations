export class InternalServerError extends Error {
  readonly code = 'INTERNAL_SERVER_ERROR';
  readonly status = 500;

  constructor(message = 'Internal server error') {
    super(message);
  }
}
