import { ClientError } from './ClientError';

export class NotFoundError extends ClientError {
  readonly code = 'NOT_FOUND';
  readonly status = 404;

  constructor(message = 'Not found') {
    super(message);
  }
}
