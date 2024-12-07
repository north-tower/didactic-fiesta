
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

@Injectable()
export class StaticFileHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const extname = path.extname(req.url);  // Get file extension (e.g., .jpg, .png)
    if (extname) {
      res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    }
    next();
  }
}
