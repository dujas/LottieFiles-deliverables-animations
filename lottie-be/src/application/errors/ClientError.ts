export abstract class ClientError extends Error {
  abstract readonly code: string;
  abstract readonly status: number;
}
