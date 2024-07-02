import { ClientError } from './ClientError';

export class BadRequest extends ClientError {
  readonly code = 'BAD_REQUEST';
  readonly status = 400;

  constructor(message = 'Bad client request') {
    super(message);
  }
}
