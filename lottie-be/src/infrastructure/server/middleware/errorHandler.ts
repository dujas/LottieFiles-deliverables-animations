import { ErrorRequestHandler } from 'express';
import { logger } from '@/infrastructure/logger';
import { ClientError } from '@/application/errors/ClientError';
import { InternalServerError } from '@/application/errors/InternalServerError';

export const errorHandlerMiddleware = (): ErrorRequestHandler => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err, _req, res, _next) => {
    logger.error(_stringifyError(err));

    const publicError = _getPublicError(err);
    return res.status(publicError.status).json({
      code: publicError.code,
      message: publicError.message,
    });
  };
};

const _getPublicError = (error: unknown): { status: number; message: string; code: string } => {
  if (error instanceof ClientError) {
    return error;
  }

  return new InternalServerError();
};

const _stringifyError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.stack || err.message;
  }
  return String(err);
};
