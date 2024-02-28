import {HttpError} from '#src/rest/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';

export function validateAndResolveLimit(maxLimit: number, serviceName: string, requestedLimit?: number): number {
  if (requestedLimit && requestedLimit > maxLimit) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `The 'limit' parameter cannot exceed ${maxLimit}.`,
      serviceName
    );
  }

  return Math.min(requestedLimit ?? Number.MAX_VALUE, maxLimit);
}
