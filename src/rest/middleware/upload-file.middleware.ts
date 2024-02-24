import {Middleware} from '#src/rest/middleware/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import {extension} from 'mime-types';
import multer, {diskStorage} from 'multer';
import crypto from 'node:crypto';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private allowedMimeTypes: string[] = ['image/jpeg', 'image/png']
  ) {
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = crypto.randomUUID();
        return callback(null, `${filename}.${fileExtension}`);
      }
    });

    const fileFilter = (_req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
      if (this.allowedMimeTypes.includes(file.mimetype)) {
        return callback(null, true);
      } else {
        return callback(new Error('Invalid file type.'));
      }
    };


    const uploadSingleFileMiddleware = multer({storage, fileFilter})
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.status(500).send({message: err.message});
      } else if (err) {
        res.status(400).send({message: err.message});
      } else {
        return next();
      }
    });
  }
}
