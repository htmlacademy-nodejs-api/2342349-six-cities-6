import {HttpError} from '#src/rest/errors/http-error.js';
import {Middleware} from '#src/rest/middleware/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import mongoose from 'mongoose';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private param: string) {
  }

  public execute({params}: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (mongoose.Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `'${objectId}' is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
