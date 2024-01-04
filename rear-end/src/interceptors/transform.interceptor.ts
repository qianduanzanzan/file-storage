import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const result = classToPlain(data)
        return {
          result: result && result.data,
          code: 200,
          isOk: result && result.ok,
          message: result && result.ok ? '请求成功' : result && result.msg,
        };
      }),
    );
  }
}
